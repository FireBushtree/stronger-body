import React, { useState } from 'react';
import { XMarkIcon, BeakerIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { NutritionTrendDB, UserBodyInfoDB } from '../utils/db';
import { generateQuestion } from '../utils/questionTemplates';
import client from '../utils/mastraClient';

interface FoodIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface NutritionCalculationResult {
  foods: Array<{
    name: string;
    amount: string;
    calories: string;
    nutrients: {
      protein: string;
      carbs: string;
      fat: string;
    };
  }>;
  totalNutrition: {
    calories: string | number;
    protein: string | number;
    carbs: string | number;
    fat: string | number;
  };
  analysis: string;
}

const FoodIntakeModal: React.FC<FoodIntakeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [foodInput, setFoodInput] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<NutritionCalculationResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculateNutrition = async () => {
    if (!foodInput.trim()) {
      setError('请输入食物信息');
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      const userInfo = UserBodyInfoDB.get();
      if (!userInfo) {
        throw new Error('请先完善个人信息');
      }

      const questionPrompt = generateQuestion('nutrition-calculation', userInfo, foodInput.trim());
      if (!questionPrompt) {
        throw new Error('生成问题失败');
      }

      const agent = client.getAgent("bodyAgent");
      const response = await agent.generate({
        messages: [{ role: "user", content: questionPrompt }],
      });

      if (response && response.text) {
        // 解析AI返回的JSON数据
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const nutritionData = JSON.parse(jsonMatch[0]);
          setCalculationResult(nutritionData);
        } else {
          throw new Error('解析AI响应失败');
        }
      } else {
        throw new Error('AI响应为空');
      }
    } catch (error) {
      console.error('计算营养成分失败:', error);
      setError('计算失败，请重试');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveRecord = () => {
    if (!calculationResult) {
      setError('请先计算营养成分');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const { totalNutrition } = calculationResult;

      // 处理AI可能返回number类型的情况
      const normalizedNutrition = {
        calories: typeof totalNutrition.calories === 'number' ? totalNutrition.calories.toString() : totalNutrition.calories,
        protein: typeof totalNutrition.protein === 'number' ? totalNutrition.protein.toString() : totalNutrition.protein,
        fat: typeof totalNutrition.fat === 'number' ? totalNutrition.fat.toString() : totalNutrition.fat,
        carbs: typeof totalNutrition.carbs === 'number' ? totalNutrition.carbs.toString() : totalNutrition.carbs,
      };

      const success = NutritionTrendDB.addRecord({
        date: today,
        calories: parseInt(normalizedNutrition.calories.toString().replace(/[^\d]/g, '')) || 0,
        protein: parseFloat(normalizedNutrition.protein.toString().replace(/[^\d.]/g, '')) || 0,
        fat: parseFloat(normalizedNutrition.fat.toString().replace(/[^\d.]/g, '')) || 0,
        carbohydrates: parseFloat(normalizedNutrition.carbs.toString().replace(/[^\d.]/g, '')) || 0,
        foods: calculationResult.foods,
        originalInput: foodInput,
        analysis: calculationResult.analysis,
      });

      if (success) {
        onSave();
        handleClose();
      } else {
        setError('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存营养记录失败:', error);
      setError('保存失败，请重试');
    }
  };

  const handleClose = () => {
    setFoodInput('');
    setCalculationResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 border border-gray-700 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <BeakerIcon className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">记录饮食摄入</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 可滚动内容区域 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
          <div className="space-y-4">
          {/* 食物输入区域 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              请输入您今天吃的食物 *
            </label>
            <textarea
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              placeholder="例如：白米饭 2碗，鸡胸肉 200g，西兰花 150g，苹果 1个"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none h-24"
              disabled={isCalculating}
            />
            <p className="text-gray-400 text-xs mt-1">
              请尽可能详细地描述食物种类和分量，这样AI能更准确地计算营养成分
            </p>
          </div>

          {/* 计算按钮 */}
          <div className="flex justify-end">
            <button
              onClick={handleCalculateNutrition}
              disabled={isCalculating || !foodInput.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isCalculating ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>计算中...</span>
                </>
              ) : (
                <>
                  <BeakerIcon className="w-4 h-4" />
                  <span>计算营养成分</span>
                </>
              )}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 计算结果显示 */}
          {calculationResult && (
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-white font-semibold mb-3">营养成分计算结果</h3>
              
              {/* 营养汇总 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="text-orange-400 text-sm">总卡路里</div>
                  <div className="text-white text-xl font-bold">
                    {typeof calculationResult.totalNutrition.calories === 'number' 
                      ? calculationResult.totalNutrition.calories 
                      : calculationResult.totalNutrition.calories}
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-400 text-sm">蛋白质</div>
                  <div className="text-white text-xl font-bold">
                    {typeof calculationResult.totalNutrition.protein === 'number' 
                      ? calculationResult.totalNutrition.protein 
                      : calculationResult.totalNutrition.protein}
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="text-yellow-400 text-sm">脂肪</div>
                  <div className="text-white text-xl font-bold">
                    {typeof calculationResult.totalNutrition.fat === 'number' 
                      ? calculationResult.totalNutrition.fat 
                      : calculationResult.totalNutrition.fat}
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-green-400 text-sm">碳水化合物</div>
                  <div className="text-white text-xl font-bold">
                    {typeof calculationResult.totalNutrition.carbs === 'number' 
                      ? calculationResult.totalNutrition.carbs 
                      : calculationResult.totalNutrition.carbs}
                  </div>
                </div>
              </div>

              {/* 食物详情 */}
              {calculationResult.foods && calculationResult.foods.length > 0 && (
                <div>
                  <h4 className="text-gray-300 text-sm font-medium mb-2">食物详情</h4>
                  <div className="space-y-2">
                    {calculationResult.foods.map((food, index) => (
                      <div key={index} className="bg-gray-600 rounded p-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{food.name}</span>
                          <span className="text-gray-300">{food.amount}</span>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {food.calories} | 蛋白质: {food.nutrients.protein} | 脂肪: {food.nutrients.fat} | 碳水: {food.nutrients.carbs}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI分析 */}
              {calculationResult.analysis && (
                <div>
                  <h4 className="text-gray-300 text-sm font-medium mb-2">营养分析</h4>
                  <p className="text-gray-300 text-sm bg-gray-600 rounded p-2">{calculationResult.analysis}</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* 底部固定区域 */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-700">
          {/* 操作按钮 */}
          <div className="flex space-x-3 mb-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSaveRecord}
              disabled={!calculationResult}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
            >
              保存记录
            </button>
          </div>

          {/* 提示信息 */}
          <p className="text-gray-400 text-xs text-center">
            * AI会根据您的描述估算营养成分，实际值可能有所偏差
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodIntakeModal;
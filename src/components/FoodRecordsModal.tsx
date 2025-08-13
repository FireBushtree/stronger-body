import React from 'react';
import { XMarkIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { NutritionTrendDB, type NutritionRecord } from '../utils/db';

interface FoodRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FoodRecordsModal: React.FC<FoodRecordsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 获取今天的营养记录
  const todayRecord = NutritionTrendDB.getTodayRecord();
  
  // 获取最近7天的记录
  const getRecentRecords = (): NutritionRecord[] => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return NutritionTrendDB.getDateRange(startDate, endDate);
  };

  const recentRecords = getRecentRecords();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (dateString === today) {
      return '今天';
    } else if (dateString === yesterday) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 border border-gray-700 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">饮食记录</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          {todayRecord ? (
            <div className="space-y-4">
              {/* 今日记录 */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  今天吃的食物
                </h3>
                
                {/* 显示具体食物列表 */}
                {todayRecord.foods && todayRecord.foods.length > 0 ? (
                  <div className="space-y-2">
                    {todayRecord.foods.map((food, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{food.name}</h4>
                            <p className="text-gray-400 text-sm">{food.amount}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-400 font-semibold">{food.calories}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <span className="text-blue-400">{food.nutrients.protein}</span>
                            <span className="text-gray-500 ml-1">蛋白质</span>
                          </div>
                          <div className="text-center">
                            <span className="text-yellow-400">{food.nutrients.fat}</span>
                            <span className="text-gray-500 ml-1">脂肪</span>
                          </div>
                          <div className="text-center">
                            <span className="text-green-400">{food.nutrients.carbs}</span>
                            <span className="text-gray-500 ml-1">碳水</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todayRecord.originalInput ? (
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <DocumentTextIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-300 text-sm">原始输入</span>
                    </div>
                    <p className="text-white">{todayRecord.originalInput}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <div className="text-sm">没有详细的食物记录</div>
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      <div className="text-center">
                        <div className="text-white text-lg font-bold">{todayRecord.calories}</div>
                        <div className="text-gray-400 text-xs">卡路里</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-lg font-bold">{Math.round(todayRecord.protein)}g</div>
                        <div className="text-gray-400 text-xs">蛋白质</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-lg font-bold">{Math.round(todayRecord.fat)}g</div>
                        <div className="text-gray-400 text-xs">脂肪</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-lg font-bold">{Math.round(todayRecord.carbohydrates)}g</div>
                        <div className="text-gray-400 text-xs">碳水</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 营养分析 */}
                {todayRecord.analysis && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-gray-300 text-sm">
                      <span className="text-green-400 font-medium">AI分析：</span>
                      {todayRecord.analysis}
                    </div>
                  </div>
                )}
              </div>

              {/* 历史记录 */}
              {recentRecords.length > 1 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">最近记录</h3>
                  <div className="space-y-3">
                    {recentRecords
                      .filter(record => record.date !== todayRecord.date)
                      .map((record) => (
                        <div key={record.date} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-medium">{formatDate(record.date)}</span>
                            <span className="text-gray-400 text-sm">{record.date}</span>
                          </div>
                          
                          {/* 显示具体食物或原始输入 */}
                          {record.foods && record.foods.length > 0 ? (
                            <div className="space-y-2 mb-3">
                              {record.foods.map((food, index) => (
                                <div key={index} className="text-sm">
                                  <span className="text-white">{food.name}</span>
                                  <span className="text-gray-400 ml-2">{food.amount}</span>
                                  <span className="text-orange-400 ml-2">{food.calories}</span>
                                </div>
                              ))}
                            </div>
                          ) : record.originalInput ? (
                            <div className="mb-3">
                              <p className="text-gray-300 text-sm">{record.originalInput}</p>
                            </div>
                          ) : null}
                          
                          {/* 营养汇总 */}
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div className="text-center">
                              <div className="text-white">{record.calories}</div>
                              <div className="text-gray-400 text-xs">卡路里</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white">{Math.round(record.protein)}g</div>
                              <div className="text-gray-400 text-xs">蛋白质</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white">{Math.round(record.fat)}g</div>
                              <div className="text-gray-400 text-xs">脂肪</div>
                            </div>
                            <div className="text-center">
                              <div className="text-white">{Math.round(record.carbohydrates)}g</div>
                              <div className="text-gray-400 text-xs">碳水</div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg mb-2">暂无饮食记录</div>
                <div className="text-sm">点击添加按钮记录您的饮食摄入</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodRecordsModal;
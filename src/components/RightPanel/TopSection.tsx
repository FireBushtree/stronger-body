import React, { useState, useEffect } from "react";
import {
  FireIcon,
  CubeIcon,
  BeakerIcon,
  CakeIcon,
  PlusIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import ReactECharts from "echarts-for-react";
import { getNutritionTrendChartOption } from "./helper";
import { UserBodyInfoDB, NutritionTrendDB } from "../../utils/db";
import type { NutritionRecord } from "../../utils/db";
import FoodIntakeModal from "../FoodIntakeModal";
import FoodRecordsModal from "../FoodRecordsModal";

interface NutritionCard {
  title: string;
  value: number;
  unit: string;
  target: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
}

const TopSection: React.FC = () => {
  const [actualIntake, setActualIntake] = useState<NutritionRecord | null>(
    null
  );
  const [showFoodIntakeModal, setShowFoodIntakeModal] = useState(false);
  const [showFoodRecordsModal, setShowFoodRecordsModal] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  // 加载数据的函数
  const loadNutritionData = () => {
    // 加载用户实际摄入数据
    const todayIntake = NutritionTrendDB.getTodayRecord();
    setActualIntake(todayIntake);
  };

  useEffect(() => {
    loadNutritionData();
  }, []);

  // 处理保存饮食记录后的刷新
  const handleFoodIntakeSave = () => {
    // 重新加载营养数据以显示最新的用户输入
    loadNutritionData();
    // 强制图表重新渲染
    setChartKey((prev) => prev + 1);
  };

  // 计算目标营养值 (基于用户身体信息的简单估算)
  const calculateTargetNutrition = () => {
    const userInfo = UserBodyInfoDB.get();
    if (!userInfo) {
      return { calories: 2000, protein: 120, fat: 65, carbs: 250 };
    }

    // 简单的基础代谢计算和营养目标
    const { currentWeight, height, age, gender, weeklyWorkIntensity } =
      userInfo;

    // 基础代谢率 (BMR) 计算
    let bmr = 0;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * currentWeight + 3.098 * height - 4.33 * age;
    }

    // 活动系数
    const activityFactors = {
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      "very-heavy": 1.9,
    };

    const totalCalories = Math.round(
      bmr * activityFactors[weeklyWorkIntensity]
    );

    return {
      calories: totalCalories,
      protein: Math.round(currentWeight * 1.8), // 1.8g/kg 体重
      fat: Math.round((totalCalories * 0.25) / 9), // 25% 总热量
      carbs: Math.round((totalCalories * 0.5) / 4), // 50% 总热量
    };
  };

  const targetNutrition = calculateTargetNutrition();

  // 获取当前营养数据（仅显示用户实际摄入）
  const getCurrentNutrition = () => {
    // 只使用用户实际摄入的数据
    if (actualIntake) {
      return {
        calories: actualIntake.calories,
        protein: actualIntake.protein,
        fat: actualIntake.fat,
        carbs: actualIntake.carbohydrates,
        source: "actual", // 标记数据来源
      };
    }

    // 如果没有用户数据，返回空数据
    return {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      source: "none",
    };
  };

  const currentNutrition = getCurrentNutrition();

  const nutritionData: NutritionCard[] = [
    {
      title: "总卡路里",
      value: currentNutrition.calories,
      unit: "kcal",
      target: targetNutrition.calories,
      icon: FireIcon,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "蛋白质",
      value: Math.round(currentNutrition.protein),
      unit: "g",
      target: targetNutrition.protein,
      icon: CubeIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "脂肪",
      value: Math.round(currentNutrition.fat),
      unit: "g",
      target: targetNutrition.fat,
      icon: BeakerIcon,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      title: "碳水",
      value: Math.round(currentNutrition.carbs),
      unit: "g",
      target: targetNutrition.carbs,
      icon: CakeIcon,
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
    },
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const trendChartOption = getNutritionTrendChartOption();

  return (
    <div className="flex-1 h-0 flex flex-col">
      {/* 营养卡片区域 */}
      <div className="flex-1 h-0 p-4">
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-white text-lg font-semibold">今日营养摄入</h2>
            {currentNutrition.source === "actual" && (
              <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded">
                实际摄入
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFoodRecordsModal(true)}
              className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center justify-center"
              title="查看饮食记录"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFoodIntakeModal(true)}
              className="p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center justify-center"
              title="记录饮食摄入"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 flex-1">
          {nutritionData.map((item, index) => {
            const IconComponent = item.icon;
            const progress = calculateProgress(item.value, item.target);

            return (
              <div
                key={index}
                className={`${item.bgColor} border rounded-lg p-4 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`w-6 h-6 ${item.color}`} />
                  <span className="text-gray-400 text-xs">{item.title}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end space-x-1">
                    <span className="text-white text-2xl font-bold">
                      {item.value}
                    </span>
                    <span className="text-gray-400 text-sm">{item.unit}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{progress.toFixed(0)}%</span>
                      <span>
                        目标: {item.target}
                        {item.unit}
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.color.includes("orange")
                            ? "bg-orange-400"
                            : item.color.includes("blue")
                            ? "bg-blue-400"
                            : item.color.includes("yellow")
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 营养摄入趋势图 */}
      <div className="h-0 flex-1 bg-gray-900 rounded-lg flex flex-col">
        <ReactECharts
          key={chartKey}
          option={trendChartOption}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>

      {/* 饮食摄入弹窗 */}
      <FoodIntakeModal
        isOpen={showFoodIntakeModal}
        onClose={() => setShowFoodIntakeModal(false)}
        onSave={handleFoodIntakeSave}
      />

      {/* 饮食记录弹窗 */}
      <FoodRecordsModal
        isOpen={showFoodRecordsModal}
        onClose={() => setShowFoodRecordsModal(false)}
      />
    </div>
  );
};

export default TopSection;

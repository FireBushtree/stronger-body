import React from 'react';
import EmptyState from './EmptyState';

interface DietPlan {
  meal: string;
  items: string[];
  calories: number;
}

interface WorkoutPlan {
  exercise: string;
  sets: number;
  reps: string;
  weight?: string;
}

const LeftSidebar: React.FC = () => {
  const dailyDietPlan: DietPlan[] = [
    {
      meal: '早餐',
      items: ['燕麦粥', '水煮蛋', '香蕉'],
      calories: 350
    },
    {
      meal: '午餐',
      items: ['鸡胸肉沙拉', '糙米饭', '西兰花'],
      calories: 480
    },
    {
      meal: '晚餐',
      items: ['三文鱼', '蒸蛋', '蔬菜汤'],
      calories: 420
    }
  ];

  const dailyWorkoutPlan: WorkoutPlan[] = [
    {
      exercise: '深蹲',
      sets: 3,
      reps: '12-15',
      weight: '体重'
    },
    {
      exercise: '俯卧撑',
      sets: 3,
      reps: '8-12'
    },
    {
      exercise: '平板支撑',
      sets: 3,
      reps: '30秒'
    },
    {
      exercise: '卷腹',
      sets: 3,
      reps: '15-20'
    }
  ];

  return (
    <aside className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* 今日饮食计划 */}
      <div className="flex-1 h-0 p-4 border-b border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">今日饮食计划</h2>
          <span className="text-blue-400 font-semibold">
            {dailyDietPlan.reduce((total, meal) => total + meal.calories, 0)}卡
          </span>
        </div>
        <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <EmptyState type='list' title='暂无数据' description='AI正在创意中'/>
          {/* {dailyDietPlan.map((meal, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">{meal.meal}</h3>
                <span className="text-green-400 text-sm">{meal.calories}卡</span>
              </div>
              <ul className="space-y-1">
                {meal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-400 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>
      </div>

      {/* 今日训练计划 */}
      <div className="flex-1 h-0 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">今日训练计划</h2>
          <span className="text-purple-400 font-semibold">45分钟</span>
        </div>
        <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {dailyWorkoutPlan.map((workout, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-medium">{workout.exercise}</h3>
                <span className="text-orange-400 text-sm">{workout.sets}组</span>
              </div>
              <div className="text-gray-400 text-sm">
                <div className="flex justify-between">
                  <span>次数: {workout.reps}</span>
                  {workout.weight && <span>重量: {workout.weight}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
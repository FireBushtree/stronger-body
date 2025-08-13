import React from 'react';
import EmptyState from './EmptyState';
import type { DietPlanData } from '../utils/db';


interface WorkoutPlan {
  exercise: string;
  sets: number;
  reps: string;
  weight?: string;
}

interface LeftSidebarProps {
  dietPlan: DietPlanData | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ dietPlan }) => {

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
            {dietPlan ? dietPlan.summary.totalDailyCalories : '0卡'}
          </span>
        </div>
        <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {!dietPlan ? (
            <EmptyState type='list' title='暂无数据' description='完善个人信息后AI将生成饮食计划'/>
          ) : (
            <>
              {/* 早餐 */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">早餐</h3>
                  <span className="text-green-400 text-sm">{dietPlan.breakfast.totalCalories}</span>
                </div>
                <div className="text-gray-400 text-xs mb-2">{dietPlan.breakfast.time}</div>
                <ul className="space-y-1">
                  {dietPlan.breakfast.foods.map((food, index) => (
                    <li key={index} className="text-gray-400 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                      {food.name} ({food.amount})
                    </li>
                  ))}
                </ul>
                {dietPlan.breakfast.notes && (
                  <div className="text-gray-500 text-xs mt-2 italic">{dietPlan.breakfast.notes}</div>
                )}
              </div>

              {/* 午餐 */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">午餐</h3>
                  <span className="text-green-400 text-sm">{dietPlan.lunch.totalCalories}</span>
                </div>
                <div className="text-gray-400 text-xs mb-2">{dietPlan.lunch.time}</div>
                <ul className="space-y-1">
                  {dietPlan.lunch.foods.map((food, index) => (
                    <li key={index} className="text-gray-400 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                      {food.name} ({food.amount})
                    </li>
                  ))}
                </ul>
                {dietPlan.lunch.notes && (
                  <div className="text-gray-500 text-xs mt-2 italic">{dietPlan.lunch.notes}</div>
                )}
              </div>

              {/* 晚餐 */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-medium">晚餐</h3>
                  <span className="text-green-400 text-sm">{dietPlan.dinner.totalCalories}</span>
                </div>
                <div className="text-gray-400 text-xs mb-2">{dietPlan.dinner.time}</div>
                <ul className="space-y-1">
                  {dietPlan.dinner.foods.map((food, index) => (
                    <li key={index} className="text-gray-400 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                      {food.name} ({food.amount})
                    </li>
                  ))}
                </ul>
                {dietPlan.dinner.notes && (
                  <div className="text-gray-500 text-xs mt-2 italic">{dietPlan.dinner.notes}</div>
                )}
              </div>
            </>
          )}
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
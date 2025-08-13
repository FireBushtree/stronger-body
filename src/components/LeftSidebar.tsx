import React from 'react';
import EmptyState from './EmptyState';
import { DietPlanSkeleton, WorkoutPlanSkeleton } from './SkeletonLoaders';
import type { DietPlanData, WorkoutPlanData } from '../utils/db';


interface LeftSidebarProps {
  dietPlan: DietPlanData | null;
  workoutPlan: WorkoutPlanData | null;
  isLoadingDietPlan?: boolean;
  isLoadingWorkoutPlan?: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  dietPlan, 
  workoutPlan, 
  isLoadingDietPlan = false, 
  isLoadingWorkoutPlan = false 
}) => {

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
          {isLoadingDietPlan ? (
            <DietPlanSkeleton />
          ) : !dietPlan ? (
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
          <span className="text-purple-400 font-semibold">
            {workoutPlan ? workoutPlan.summary.totalDuration : '45分钟'}
          </span>
        </div>
        <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {isLoadingWorkoutPlan ? (
            <WorkoutPlanSkeleton />
          ) : !workoutPlan ? (
            <EmptyState type='list' title='暂无数据' description='完善个人信息后AI将生成训练计划'/>
          ) : (
            <>
              {/* 热身 */}
              {workoutPlan.warmup.exercises.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-400 font-medium">热身</h3>
                    <span className="text-blue-400 text-sm">{workoutPlan.warmup.duration}</span>
                  </div>
                  <div className="space-y-2">
                    {workoutPlan.warmup.exercises.map((exercise, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          <span>{exercise.name}</span>
                          {exercise.duration && <span className="ml-auto text-xs">{exercise.duration}</span>}
                        </div>
                        {exercise.description && (
                          <div className="text-gray-500 text-xs ml-4 mt-1">{exercise.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 主要训练 */}
              {workoutPlan.mainWorkout.exercises.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-orange-400 font-medium">主要训练</h3>
                    <span className="text-orange-400 text-sm">{workoutPlan.mainWorkout.duration}</span>
                  </div>
                  <div className="space-y-3">
                    {workoutPlan.mainWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium">{exercise.name}</span>
                          {exercise.sets && <span className="text-orange-400 text-xs">{exercise.sets}组</span>}
                        </div>
                        <div className="flex justify-between text-xs">
                          {exercise.reps && <span>次数: {exercise.reps}</span>}
                          {exercise.restTime && <span>休息: {exercise.restTime}</span>}
                        </div>
                        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                          <div className="text-gray-500 text-xs mt-1">
                            目标: {exercise.targetMuscles.join(', ')}
                          </div>
                        )}
                        {exercise.description && (
                          <div className="text-gray-500 text-xs mt-1">{exercise.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 放松 */}
              {workoutPlan.cooldown.exercises.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-400 font-medium">放松</h3>
                    <span className="text-green-400 text-sm">{workoutPlan.cooldown.duration}</span>
                  </div>
                  <div className="space-y-2">
                    {workoutPlan.cooldown.exercises.map((exercise, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        <div className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                          <span>{exercise.name}</span>
                          {exercise.duration && <span className="ml-auto text-xs">{exercise.duration}</span>}
                        </div>
                        {exercise.description && (
                          <div className="text-gray-500 text-xs ml-4 mt-1">{exercise.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 训练总结 */}
              {workoutPlan.summary.recommendations.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-purple-400 font-medium">训练建议</h3>
                    <span className="text-purple-400 text-xs">消耗: {workoutPlan.summary.estimatedCaloriesBurned}</span>
                  </div>
                  <div className="space-y-1">
                    {workoutPlan.summary.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-gray-400 text-xs flex items-start">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2 mt-1.5"></span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
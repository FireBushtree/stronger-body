import React from 'react';

// 饮食计划骨架屏
export const DietPlanSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 早餐骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-28"></div>
          </div>
        </div>
      </div>

      {/* 午餐骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-36"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-30"></div>
          </div>
        </div>
      </div>

      {/* 晚餐骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 训练计划骨架屏
export const WorkoutPlanSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* 热身骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="ml-auto h-3 bg-gray-700 rounded w-12"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-28"></div>
            <div className="ml-auto h-3 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* 主要训练骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-3">
          <div className="text-gray-400 text-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-8"></div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-32 mt-1"></div>
          </div>
          <div className="text-gray-400 text-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-8"></div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="h-3 bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-28 mt-1"></div>
          </div>
        </div>
      </div>

      {/* 放松骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="ml-auto h-3 bg-gray-700 rounded w-12"></div>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="ml-auto h-3 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* 训练建议骨架屏 */}
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-start">
            <div className="w-1 h-1 bg-gray-700 rounded-full mr-2 mt-1.5"></div>
            <div className="h-3 bg-gray-700 rounded w-40"></div>
          </div>
          <div className="flex items-start">
            <div className="w-1 h-1 bg-gray-700 rounded-full mr-2 mt-1.5"></div>
            <div className="h-3 bg-gray-700 rounded w-36"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 营养数据骨架屏
export const NutritionCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 flex-1">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex flex-col justify-between animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-12"></div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end space-x-1">
              <div className="h-8 bg-gray-700 rounded w-12"></div>
              <div className="h-4 bg-gray-700 rounded w-8"></div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="h-3 bg-gray-700 rounded w-8"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-2 bg-gray-600 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
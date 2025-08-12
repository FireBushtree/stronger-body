import React from 'react';
import { FireIcon, CubeIcon, BeakerIcon, CakeIcon } from '@heroicons/react/24/outline';
import ReactECharts from 'echarts-for-react';
import { getNutritionTrendChartOption } from './helper';

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
  const nutritionData: NutritionCard[] = [
    {
      title: '总卡路里',
      value: 1250,
      unit: 'kcal',
      target: 1800,
      icon: FireIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      title: '蛋白质',
      value: 85,
      unit: 'g',
      target: 120,
      icon: CubeIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: '脂肪',
      value: 42,
      unit: 'g',
      target: 60,
      icon: BeakerIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
      title: '碳水',
      value: 180,
      unit: 'g',
      target: 225,
      icon: CakeIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20'
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const trendChartOption = getNutritionTrendChartOption();

  return (
    <div className="flex-1 h-0 flex flex-col">
      {/* 营养卡片区域 */}
      <div className="flex-1 h-0 bg-gray-800 border-b border-gray-700  p-6 ">
        <div className="grid grid-cols-4 gap-4 h-full">
          {nutritionData.map((item, index) => {
            const IconComponent = item.icon;
            const progress = calculateProgress(item.value, item.target);

            return (
              <div key={index} className={`${item.bgColor} border rounded-lg p-4 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`w-6 h-6 ${item.color}`} />
                  <span className="text-gray-400 text-xs">{item.title}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end space-x-1">
                    <span className="text-white text-2xl font-bold">{item.value}</span>
                    <span className="text-gray-400 text-sm">{item.unit}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{progress.toFixed(0)}%</span>
                      <span>目标: {item.target}{item.unit}</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.color.includes('orange') ? 'bg-orange-400' :
                          item.color.includes('blue') ? 'bg-blue-400' :
                          item.color.includes('yellow') ? 'bg-yellow-400' :
                          'bg-green-400'
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
      <div className="h-0 flex-1 mt-6 bg-gray-900 rounded-lg flex flex-col">
        <div className="flex-1">
          <ReactECharts
            option={trendChartOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopSection;
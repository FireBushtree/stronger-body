import React from 'react';
import ReactECharts from 'echarts-for-react';
import { generateWeightData, getWeightChartOption } from './helper';

const WeightChart: React.FC = () => {
  const { dates, weights } = generateWeightData();
  const option = getWeightChartOption(dates, weights);

  // 获取最新体重
  const latestWeight = weights[weights.length - 1];

  return (
    <div className="flex-1 h-0">
      <div className="h-full bg-gray-800 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">空腹体重趋势</h2>
          <span className="text-blue-400 font-semibold">{latestWeight}kg</span>
        </div>
        <div className="flex-1">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeightChart;
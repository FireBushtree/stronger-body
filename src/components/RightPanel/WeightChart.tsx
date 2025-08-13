import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { generateWeightData, getWeightChartOption } from './helper';
import WeightRecordModal from '../WeightRecordModal';

const WeightChart: React.FC = () => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [chartData, setChartData] = useState(() => generateWeightData());
  
  const { dates, weights } = chartData;
  const option = getWeightChartOption(dates, weights);

  // 获取最新体重
  const latestWeight = weights.length > 0 ? weights[weights.length - 1] : null;

  // 刷新图表数据
  const refreshChartData = () => {
    setChartData(generateWeightData());
  };

  // 处理保存体重记录
  const handleWeightSave = () => {
    refreshChartData();
  };

  return (
    <div className="flex-1 h-0">
      <div className="h-full bg-gray-800 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">空腹体重趋势</h2>
          <div className="flex items-center space-x-3">
            <span className="text-blue-400 font-semibold">
              {latestWeight ? `${latestWeight}kg` : '暂无数据'}
            </span>
            <button
              onClick={() => setShowWeightModal(true)}
              className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center justify-center"
              title="添加体重记录"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1">
          {weights.length > 0 ? (
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-lg mb-2">暂无体重记录</div>
                <div className="text-sm">点击右上角的"+"按钮开始记录您的体重变化</div>
              </div>
            </div>
          )}
        </div>

        {/* 体重记录弹窗 */}
        <WeightRecordModal
          isOpen={showWeightModal}
          onClose={() => setShowWeightModal(false)}
          onSave={handleWeightSave}
        />
      </div>
    </div>
  );
};

export default WeightChart;
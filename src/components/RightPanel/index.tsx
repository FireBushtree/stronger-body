import React from 'react';
import TopSection from './TopSection';
import WeightChart from './WeightChart';

const RightPanel: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-900 flex flex-col h-full">
      <TopSection />
      <WeightChart />
    </div>
  );
};

export default RightPanel;
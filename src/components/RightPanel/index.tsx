import React from 'react';
import TopSection from './TopSection';
import WeightChart from './WeightChart';

interface RightPanelProps {
  isLoadingNutrition?: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoadingNutrition = false }) => {
  return (
    <div className="flex-1 bg-gray-900 flex flex-col h-full">
      <TopSection isLoadingNutrition={isLoadingNutrition} />
      <WeightChart />
    </div>
  );
};

export default RightPanel;
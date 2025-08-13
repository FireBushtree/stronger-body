import React from 'react';
import { useLoading } from '../contexts/LoadingContext';

const GlobalLoading: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 flex flex-col items-center space-y-6 shadow-2xl border border-gray-700">
        {/* 文字动画 */}
        <div className="text-center space-y-4">
          <div className="text-white text-xl font-semibold animate-pulse">
            AI正在分析您的身体数据
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
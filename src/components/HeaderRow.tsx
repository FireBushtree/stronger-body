import React from 'react';
import { UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface HeaderRowProps {
  onUserInfoClick?: () => void;
}

const HeaderRow: React.FC<HeaderRowProps> = ({ onUserInfoClick }) => {
  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return today.toLocaleDateString('zh-CN', options);
  };

  const getTodayAdvice = () => {
    const advices = [
      "今日建议：多喝水，保持身体水分平衡",
      "今日建议：适量运动，保持身体活力", 
      "今日建议：注意饮食搭配，营养均衡",
      "今日建议：充足睡眠，让身体得到休息",
      "今日建议：保持良好心态，身心健康"
    ];
    const randomIndex = Math.floor(Math.random() * advices.length);
    return advices[randomIndex];
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-lg font-medium">
            {formatDate()}
          </h1>
          <span className="text-gray-500">|</span>
          <p className="text-gray-400 text-sm">
            {getTodayAdvice()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onUserInfoClick}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            title="修改用户信息"
          >
            <UserIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            title="AI助手聊天"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderRow;
import React from 'react';

interface EmptyStateProps {
  type?: 'chart' | 'list' | 'data' | 'workout' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'chart':
        return {
          icon: (
            <div className="relative">
              <div className="w-16 h-16 border-2 border-gray-600 border-dashed rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 border-l-2 border-blue-500 rounded-full animate-spin opacity-50"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ),
          defaultTitle: '暂无图表数据',
          defaultDescription: '开始记录您的身体数据，我们将为您生成专业的分析图表'
        };
      
      case 'list':
        return {
          icon: (
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex flex-col items-center justify-center space-y-1">
              <div className="w-8 h-1 bg-gray-600 rounded"></div>
              <div className="w-6 h-1 bg-gray-600 rounded"></div>
              <div className="w-10 h-1 bg-gray-600 rounded"></div>
            </div>
          ),
          defaultTitle: '列表为空',
          defaultDescription: '还没有相关记录，快来添加第一条数据吧'
        };
      
      case 'workout':
        return {
          icon: (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          ),
          defaultTitle: '尚未开始锻炼',
          defaultDescription: '制定您的第一个健身计划，开启健康生活之旅'
        };
      
      case 'data':
        return {
          icon: (
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          ),
          defaultTitle: '暂无数据',
          defaultDescription: 'AI正在等待您的身体数据进行分析'
        };
      
      default:
        return {
          icon: (
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          ),
          defaultTitle: '内容为空',
          defaultDescription: '这里还没有任何内容'
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="mb-6">
        {config.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-200 mb-3">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
        {description || config.defaultDescription}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { UserBodyInfoDB } from '../utils/db';
import client from '../utils/mastraClient';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好，我是您的私人教练，您可以跟我聊聊您的健身规划',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 创建一个空的助手消息用于流式更新
    const assistantMessageId = (Date.now() + 1).toString();
    setStreamingMessageId(assistantMessageId);
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // 获取用户信息用于上下文
      const userInfo = UserBodyInfoDB.get();
      let contextMessage = inputMessage.trim();

      if (userInfo) {
        contextMessage = `用户信息：身高${userInfo.height}cm，体重${userInfo.currentWeight}kg，年龄${userInfo.age}岁，性别${userInfo.gender === 'male' ? '男' : '女'}，工作强度${userInfo.weeklyWorkIntensity}${userInfo.targetWeight ? `，目标体重${userInfo.targetWeight}kg` : ''}。\n\n用户问题：${contextMessage}`;
      }

      // 使用 mastraClient 的 stream API
      const agent = client.getAgent("bodyAgent");
      const stream = await agent.stream({
        messages: [{ role: "user", content: contextMessage }],
      });

      let accumulatedText = '';

      // 使用 mastraClient 的 processDataStream 方法
      await stream.processDataStream({
        onTextPart: (text) => {
          accumulatedText += text;

          // 实时更新消息内容
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedText }
              : msg
          ));
        },
      });

      // 如果没有收到任何内容，显示错误信息
      if (!accumulatedText) {
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: '收到了空的响应，请重试。' }
            : msg
        ));
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: '抱歉，我现在无法回复您的消息，请稍后再试。' }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl h-[700px] mx-4 border border-gray-700 flex flex-col">
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">AI私人教练</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white prose-code:text-blue-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-table:text-gray-100 prose-table:border-collapse prose-table:border prose-table:border-gray-600 prose-thead:border-gray-600 prose-tbody:border-gray-600 prose-th:border prose-th:border-gray-600 prose-th:bg-gray-700 prose-th:text-white prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {streamingMessageId === message.id && (
                    <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1 align-bottom"></span>
                  )}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 h-[44px]"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors h-[44px] w-[44px] flex items-center justify-center"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            按 Enter 发送消息
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { UserBodyInfoDB } from '../utils/db';
import type { UserBodyInfo } from '../utils/db';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userInfo: Partial<UserBodyInfo>) => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    height: '',
    gender: 'male' as 'male' | 'female',
    age: '',
    currentWeight: '',
    weeklyWorkIntensity: 'moderate' as 'light' | 'moderate' | 'heavy' | 'very-heavy',
    targetWeight: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 当弹框打开时，加载现有用户信息
  useEffect(() => {
    if (isOpen) {
      const userInfo = UserBodyInfoDB.get();
      if (userInfo) {
        setFormData({
          height: userInfo.height?.toString() || '',
          gender: userInfo.gender || 'male',
          age: userInfo.age?.toString() || '',
          currentWeight: userInfo.currentWeight?.toString() || '',
          weeklyWorkIntensity: userInfo.weeklyWorkIntensity || 'moderate',
          targetWeight: userInfo.targetWeight?.toString() || ''
        });
      }
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.height || parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      newErrors.height = '身高必须在100-250cm之间';
    }

    if (!formData.age || parseInt(formData.age) < 10 || parseInt(formData.age) > 100) {
      newErrors.age = '年龄必须在10-100岁之间';
    }

    if (!formData.currentWeight || parseFloat(formData.currentWeight) < 30 || parseFloat(formData.currentWeight) > 300) {
      newErrors.currentWeight = '体重必须在30-300kg之间';
    }

    if (!formData.targetWeight || parseFloat(formData.targetWeight) < 30 || parseFloat(formData.targetWeight) > 300) {
      newErrors.targetWeight = '目标体重必须在30-300kg之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userInfo: Partial<UserBodyInfo> = {
      height: parseFloat(formData.height),
      gender: formData.gender,
      age: parseInt(formData.age),
      currentWeight: parseFloat(formData.currentWeight),
      weeklyWorkIntensity: formData.weeklyWorkIntensity,
      targetWeight: parseFloat(formData.targetWeight)
    };

    onSave(userInfo);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">完善个人信息</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 身高 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              身高 (cm) *
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="170"
              min="100"
              max="250"
            />
            {errors.height && (
              <p className="text-red-400 text-xs mt-1">{errors.height}</p>
            )}
          </div>

          {/* 性别 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              性别 *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="text-blue-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-300">男性</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="text-blue-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-300">女性</span>
              </label>
            </div>
          </div>

          {/* 年龄 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              年龄 *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="25"
              min="10"
              max="100"
            />
            {errors.age && (
              <p className="text-red-400 text-xs mt-1">{errors.age}</p>
            )}
          </div>

          {/* 当前体重 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              当前体重 (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.currentWeight}
              onChange={(e) => handleInputChange('currentWeight', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="70.0"
              min="30"
              max="300"
            />
            {errors.currentWeight && (
              <p className="text-red-400 text-xs mt-1">{errors.currentWeight}</p>
            )}
          </div>

          {/* 目标体重 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              目标体重 (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.targetWeight}
              onChange={(e) => handleInputChange('targetWeight', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="65.0"
              min="30"
              max="300"
            />
            {errors.targetWeight && (
              <p className="text-red-400 text-xs mt-1">{errors.targetWeight}</p>
            )}
          </div>

          {/* 工作强度 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              每周工作强度 *
            </label>
            <select
              value={formData.weeklyWorkIntensity}
              onChange={(e) => handleInputChange('weeklyWorkIntensity', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="light">轻度 (办公室工作，很少运动)</option>
              <option value="moderate">中度 (偶尔运动，轻量体力活)</option>
              <option value="heavy">重度 (经常运动，体力劳动)</option>
              <option value="very-heavy">极重 (高强度训练，重体力劳动)</option>
            </select>
          </div>

          {/* 按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
            >
              保存
            </button>
          </div>
        </form>

        {/* 提示 */}
        <p className="text-gray-400 text-xs text-center mt-4">
          * 为必填项，信息将用于计算个性化的营养和运动建议
        </p>
      </div>
    </div>
  );
};

export default UserInfoModal;
import React, { useState } from 'react';
import { XMarkIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { WeightTrendDB } from '../utils/db';

interface WeightRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const WeightRecordModal: React.FC<WeightRecordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // 默认今日
    weight: '',
    isFasting: true,
    note: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = '请选择日期';
    }

    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      newErrors.weight = '体重必须在30-300kg之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = WeightTrendDB.addRecord({
      date: formData.date,
      weight: parseFloat(formData.weight),
      isFasting: formData.isFasting,
      note: formData.note || undefined
    });

    if (success) {
      onSave();
      handleClose();
    } else {
      setErrors({ submit: '保存失败，请重试' });
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      isFasting: true,
      note: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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
            <ScaleIcon className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">记录体重</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              测量日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* 体重 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              体重 (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
              placeholder="70.5"
              min="30"
              max="300"
            />
            {errors.weight && (
              <p className="text-red-400 text-xs mt-1">{errors.weight}</p>
            )}
          </div>

          {/* 是否空腹 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              测量状态
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFasting"
                  checked={formData.isFasting}
                  onChange={() => handleInputChange('isFasting', true)}
                  className="text-green-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-300">空腹测量</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFasting"
                  checked={!formData.isFasting}
                  onChange={() => handleInputChange('isFasting', false)}
                  className="text-green-500 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-300">非空腹测量</span>
              </label>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              备注 (可选)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
              rows={2}
              placeholder="记录当天的状态或其他备注信息..."
              maxLength={100}
            />
          </div>

          {/* 错误提示 */}
          {errors.submit && (
            <div className="text-red-400 text-sm text-center">
              {errors.submit}
            </div>
          )}

          {/* 按钮 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium"
            >
              保存记录
            </button>
          </div>
        </form>

        {/* 提示 */}
        <p className="text-gray-400 text-xs text-center mt-4">
          * 为必填项，建议选择固定时间测量体重以获得准确趋势
        </p>
      </div>
    </div>
  );
};

export default WeightRecordModal;
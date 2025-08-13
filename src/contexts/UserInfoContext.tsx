import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { UserBodyInfoDB } from '../utils/db';
import type { UserBodyInfo } from '../utils/db';

interface UserInfoContextType {
  userInfo: UserBodyInfo | null;
  updateUserInfo: (newUserInfo: Partial<UserBodyInfo>) => boolean;
  refreshUserInfo: () => void;
  isUserInfoComplete: (info: UserBodyInfo | null) => boolean;
}

// 创建初始上下文值
const createInitialContextValue = (): UserInfoContextType => {
  const initialUserInfo = UserBodyInfoDB.get();
  
  return {
    userInfo: initialUserInfo,
    updateUserInfo: () => false, // 占位符，在Provider中会被替换
    refreshUserInfo: () => {}, // 占位符，在Provider中会被替换
    isUserInfoComplete: () => false, // 占位符，在Provider中会被替换
  };
};

const UserInfoContext = createContext<UserInfoContextType>(createInitialContextValue());

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

interface UserInfoProviderProps {
  children: ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserBodyInfo | null>(() => UserBodyInfoDB.get());

  // 检查用户信息是否完整
  const isUserInfoComplete = (info: UserBodyInfo | null): boolean => {
    if (!info) {
      console.log('用户信息不存在');
      return false;
    }
    
    // 检查是否为默认值 - 如果所有值都是默认值，说明用户还没有真正填写
    const isDefaultValues = (
      info.height === 170 &&
      info.gender === 'male' &&
      info.age === 25 &&
      info.currentWeight === 70 &&
      info.weeklyWorkIntensity === 'moderate'
    );
    
    if (isDefaultValues) {
      console.log('检测到默认值，认为信息不完整');
      return false;
    }
    
    const complete = !!(
      info.height &&
      info.gender &&
      info.age &&
      info.currentWeight &&
      info.weeklyWorkIntensity &&
      info.height > 0 &&
      info.age > 0 &&
      info.currentWeight > 0
    );
    console.log('用户信息完整性检查:', {
      info,
      complete,
      isDefaultValues,
      height: info.height,
      gender: info.gender,
      age: info.age,
      currentWeight: info.currentWeight,
      weeklyWorkIntensity: info.weeklyWorkIntensity
    });
    return complete;
  };

  // 刷新用户信息
  const refreshUserInfo = () => {
    const info = UserBodyInfoDB.get();
    console.log('刷新用户信息:', info);
    setUserInfo(info);
  };

  // 更新用户信息
  const updateUserInfo = (newUserInfo: Partial<UserBodyInfo>) => {
    const success = UserBodyInfoDB.set(newUserInfo);
    if (success) {
      refreshUserInfo();
    }
    return success;
  };


  const value: UserInfoContextType = {
    userInfo,
    updateUserInfo,
    refreshUserInfo,
    isUserInfoComplete,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};
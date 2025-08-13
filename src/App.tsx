import { useState, useEffect } from 'react';
import HeaderRow from './components/HeaderRow'
import LeftSidebar from './components/LeftSidebar'
import RightPanel from './components/RightPanel'
import UserInfoModal from './components/UserInfoModal'
import GlobalLoading from './components/GlobalLoading'
import { useLoading } from './contexts/LoadingContext'
import { UserBodyInfoDB, WeightTrendDB } from './utils/db'
import type { UserBodyInfo } from './utils/db'

function App() {
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const { showLoading, hideLoading } = useLoading()
  useEffect(() => {
    showLoading()

    setTimeout(() => {
      hideLoading()
    }, 5000)
  }, [])

  useEffect(() => {
    // 检查用户是否已完善信息
    const userInfo = UserBodyInfoDB.get();

    // 如果没有用户信息，或者用户信息不完整，显示弹框
    if (!userInfo || !isUserInfoComplete(userInfo)) {
      setShowUserInfoModal(true);
    }
  }, []);

  // 检查用户信息是否完整
  const isUserInfoComplete = (userInfo: UserBodyInfo): boolean => {
    return !!(
      userInfo.height &&
      userInfo.gender &&
      userInfo.age &&
      userInfo.currentWeight &&
      userInfo.weeklyWorkIntensity &&
      userInfo.height > 0 &&
      userInfo.age > 0 &&
      userInfo.currentWeight > 0
    );
  };

  // 处理用户信息保存
  const handleUserInfoSave = (userInfo: Partial<UserBodyInfo>) => {
    const success = UserBodyInfoDB.set(userInfo);

    if (success && userInfo.currentWeight) {
      // 首次提交时，将当前体重保存到体重趋势中
      const today = new Date().toISOString().split('T')[0];
      WeightTrendDB.addRecord({
        date: today,
        weight: userInfo.currentWeight,
        isFasting: true, // 默认认为是空腹体重
        note: '初始体重记录'
      });

      setShowUserInfoModal(false);
    } else {
      // 可以添加错误提示
      console.error('保存用户信息失败');
    }
  };

  // 处理弹框关闭
  const handleModalClose = () => {
    const userInfo = UserBodyInfoDB.get();
    // 如果是首次使用（没有完整信息），则不允许关闭
    // 如果是修改信息（已有完整信息），则允许关闭
    if (userInfo && isUserInfoComplete(userInfo)) {
      setShowUserInfoModal(false);
    } else {
      // 信息不完整时不允许关闭，可以添加提示
      console.log('请完善基本信息后再继续使用系统');
    }
  };

  return (
    <div className="h-screen overflow-y-hidden bg-black text-white flex flex-col">
      <HeaderRow onUserInfoClick={() => setShowUserInfoModal(true)} />
      <div className="flex flex-1 overflow-y-hidden h-0">
        <LeftSidebar />
        <RightPanel />
      </div>

      {/* 用户信息弹框 */}
      <UserInfoModal
        isOpen={showUserInfoModal}
        onClose={handleModalClose}
        onSave={handleUserInfoSave}
      />

      {/* 全局Loading组件 */}
      <GlobalLoading />
    </div>
  )
}

export default App

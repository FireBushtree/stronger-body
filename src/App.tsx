import { useState, useEffect } from "react";
import HeaderRow from "./components/HeaderRow";
import LeftSidebar from "./components/LeftSidebar";
import RightPanel from "./components/RightPanel";
import UserInfoModal from "./components/UserInfoModal";
import GlobalLoading from "./components/GlobalLoading";
import { useLoading } from "./contexts/LoadingContext";
import { UserInfoProvider, useUserInfo } from "./contexts/UserInfoContext";
import { WeightTrendDB, DietPlanDB, WorkoutPlanDB } from "./utils/db";
import type { UserBodyInfo, DietPlanData, WorkoutPlanData } from "./utils/db";
import { callDietPlanAgent, callWorkoutPlanAgent } from "./utils/mastraClient";

// 应用主要内容组件
const AppContent: React.FC = () => {
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlanData | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanData | null>(null);
  const { showLoading, hideLoading } = useLoading();
  const { userInfo, updateUserInfo, isUserInfoComplete } = useUserInfo();
  const [rightPanelKey, setRightPanelKey] = useState(0);
  const [isLoadingDietPlan, setIsLoadingDietPlan] = useState(false);
  const [isLoadingWorkoutPlan, setIsLoadingWorkoutPlan] = useState(false);

  useEffect(() => {
    // 如果没有用户信息，或者用户信息不完整，显示弹框
    if (!userInfo || !isUserInfoComplete(userInfo)) {
      setShowUserInfoModal(true);
    }

    // 加载今日饮食计划
    const todayDietPlan = DietPlanDB.getTodayPlan();
    setDietPlan(todayDietPlan);

    // 加载今日训练计划
    const todayWorkoutPlan = WorkoutPlanDB.getTodayPlan();
    setWorkoutPlan(todayWorkoutPlan);
  }, [userInfo, isUserInfoComplete]);

  // 处理用户信息保存
  const handleUserInfoSave = async (newUserInfo: UserBodyInfo) => {
    const success = updateUserInfo(newUserInfo);

    if (success) {
      // 首次提交时，将当前体重保存到体重趋势中
      const today = new Date().toISOString().split("T")[0];
      WeightTrendDB.addRecord({
        date: today,
        weight: newUserInfo.currentWeight,
        isFasting: true, // 默认认为是空腹体重
        note: "初始体重记录",
      });

      // 调用Body Agent处理用户身体信息
      // 独立调用饮食计划agent
      const callDietPlan = async () => {
        try {
          setIsLoadingDietPlan(true);
          const dietResponse = await callDietPlanAgent(newUserInfo);
          
          if (dietResponse && dietResponse.text) {
            try {
              const jsonMatch = dietResponse.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const planData = JSON.parse(jsonMatch[0]);
                const saved = DietPlanDB.setTodayPlan(planData);
                if (saved) {
                  setDietPlan(DietPlanDB.getTodayPlan());
                  console.log("饮食计划生成并保存成功");
                }
              }
            } catch (parseError) {
              console.error("解析饮食计划失败:", parseError);
            }
          }
        } catch (error) {
          console.error("Failed to call Diet Plan Agent:", error);
        } finally {
          setIsLoadingDietPlan(false);
        }
      };

      // 独立调用训练计划agent
      const callWorkoutPlan = async () => {
        try {
          setIsLoadingWorkoutPlan(true);
          const workoutResponse = await callWorkoutPlanAgent(newUserInfo);
          
          if (workoutResponse && workoutResponse.text) {
            try {
              const jsonMatch = workoutResponse.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const planData = JSON.parse(jsonMatch[0]);
                const saved = WorkoutPlanDB.setTodayPlan(planData);
                if (saved) {
                  setWorkoutPlan(WorkoutPlanDB.getTodayPlan());
                  console.log("训练计划生成并保存成功");
                }
              }
            } catch (parseError) {
              console.error("解析训练计划失败:", parseError);
            }
          }
        } catch (error) {
          console.error("Failed to call Workout Plan Agent:", error);
        } finally {
          setIsLoadingWorkoutPlan(false);
        }
      };

      // 并发执行但不等待
      callDietPlan();
      callWorkoutPlan();
      
      setRightPanelKey((prev) => prev + 1);

      setShowUserInfoModal(false);
    } else {
      // 可以添加错误提示
      console.error("保存用户信息失败");
    }
  };

  // 处理弹框关闭
  const handleModalClose = () => {
    // 如果是首次使用（没有完整信息），则不允许关闭
    // 如果是修改信息（已有完整信息），则允许关闭
    if (userInfo && isUserInfoComplete(userInfo)) {
      setShowUserInfoModal(false);
    } else {
      // 信息不完整时不允许关闭，可以添加提示
      console.log("请完善基本信息后再继续使用系统");
    }
  };

  return (
    <div className="h-screen overflow-y-hidden bg-black text-white flex flex-col">
      <HeaderRow onUserInfoClick={() => setShowUserInfoModal(true)} />
      <div className="flex flex-1 overflow-y-hidden h-0">
        <LeftSidebar 
          dietPlan={dietPlan} 
          workoutPlan={workoutPlan} 
          isLoadingDietPlan={isLoadingDietPlan}
          isLoadingWorkoutPlan={isLoadingWorkoutPlan}
        />
        <RightPanel 
          key={rightPanelKey} 
          isLoadingNutrition={isLoadingDietPlan}
        />
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
  );
};

// 主App组件，包装Context Provider
function App() {
  return (
    <UserInfoProvider>
      <AppContent />
    </UserInfoProvider>
  );
}

export default App;

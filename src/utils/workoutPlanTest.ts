import { WorkoutPlanDB } from './db';

// 测试训练计划数据
const mockWorkoutPlan = {
  warmup: {
    duration: "10分钟",
    exercises: [
      {
        name: "动态拉伸",
        duration: "5分钟",
        description: "全身关节活动，为主要训练做准备"
      },
      {
        name: "轻量有氧",
        duration: "5分钟",
        description: "慢跑或快走，提高心率"
      }
    ]
  },
  mainWorkout: {
    duration: "25分钟",
    exercises: [
      {
        name: "深蹲",
        sets: "3组",
        reps: "12-15次",
        restTime: "60秒",
        targetMuscles: ["股四头肌", "臀大肌"],
        description: "保持背部挺直，蹲至大腿与地面平行"
      },
      {
        name: "俯卧撑",
        sets: "3组",
        reps: "8-12次",
        restTime: "60秒",
        targetMuscles: ["胸肌", "肱三头肌", "前三角肌"],
        description: "身体保持一条直线，胸部接近地面"
      },
      {
        name: "平板支撑",
        sets: "3组",
        reps: "30-45秒",
        restTime: "45秒",
        targetMuscles: ["核心肌群"],
        description: "身体保持一条直线，腹部收紧"
      },
      {
        name: "卷腹",
        sets: "3组",
        reps: "15-20次",
        restTime: "45秒",
        targetMuscles: ["腹直肌"],
        description: "缓慢起身，感受腹部肌肉收缩"
      }
    ]
  },
  cooldown: {
    duration: "10分钟",
    exercises: [
      {
        name: "静态拉伸",
        duration: "8分钟",
        description: "拉伸训练过的肌肉群，保持15-30秒"
      },
      {
        name: "深呼吸放松",
        duration: "2分钟",
        description: "调整呼吸，让心率逐渐恢复正常"
      }
    ]
  },
  summary: {
    totalDuration: "45分钟",
    estimatedCaloriesBurned: "280卡",
    difficulty: "中等",
    recommendations: [
      "训练前充分热身，避免受伤",
      "保持正确的动作姿势，质量优于数量",
      "训练后及时补充水分和蛋白质",
      "每周进行3-4次此类训练"
    ]
  }
};

// 测试保存和获取训练计划
export const testWorkoutPlanStorage = () => {
  console.log('=== 测试训练计划存储功能 ===');
  
  // 清除现有数据
  WorkoutPlanDB.clearTodayPlan();
  console.log('1. 清除现有数据');
  
  // 获取空数据
  const emptyPlan = WorkoutPlanDB.getTodayPlan();
  console.log('2. 获取空数据:', emptyPlan);
  
  // 保存测试数据
  const saved = WorkoutPlanDB.setTodayPlan(mockWorkoutPlan);
  console.log('3. 保存测试数据:', saved ? '成功' : '失败');
  
  // 获取保存的数据
  const retrievedPlan = WorkoutPlanDB.getTodayPlan();
  console.log('4. 获取保存的数据:', retrievedPlan);
  
  console.log('=== 测试完成 ===');
  return retrievedPlan;
};

// 模拟AI返回的训练计划JSON
export const mockAIWorkoutResponse = `{
  "warmup": {
    "duration": "8分钟",
    "exercises": [
      {
        "name": "关节活动",
        "duration": "3分钟",
        "description": "颈部、肩部、腰部、膝关节的环绕运动"
      },
      {
        "name": "动态热身",
        "duration": "5分钟",
        "description": "高抬腿、踢臀跑、开合跳等动态动作"
      }
    ]
  },
  "mainWorkout": {
    "duration": "30分钟",
    "exercises": [
      {
        "name": "深蹲",
        "sets": "4组",
        "reps": "15次",
        "restTime": "90秒",
        "targetMuscles": ["股四头肌", "臀大肌", "小腿肌"],
        "description": "双脚与肩同宽，臀部向后坐，膝盖不超过脚尖"
      },
      {
        "name": "俯卧撑",
        "sets": "3组",
        "reps": "10-12次",
        "restTime": "75秒",
        "targetMuscles": ["胸大肌", "肱三头肌", "三角肌前束"],
        "description": "手臂与肩同宽，身体下降至胸部接近地面"
      },
      {
        "name": "单腿硬拉",
        "sets": "3组",
        "reps": "每侧8次",
        "restTime": "60秒",
        "targetMuscles": ["腘绳肌", "臀大肌", "核心"],
        "description": "单腿站立，另一腿向后抬起，身体前倾保持平衡"
      },
      {
        "name": "平板支撑",
        "sets": "3组",
        "reps": "45秒",
        "restTime": "60秒",
        "targetMuscles": ["核心肌群", "肩部稳定肌"],
        "description": "前臂支撑，身体呈一条直线，避免塌腰"
      },
      {
        "name": "登山跑",
        "sets": "3组",
        "reps": "30秒",
        "restTime": "45秒",
        "targetMuscles": ["核心", "腿部", "心肺"],
        "description": "平板支撑姿势，双腿交替快速向胸部收膝"
      }
    ]
  },
  "cooldown": {
    "duration": "7分钟",
    "exercises": [
      {
        "name": "腿部拉伸",
        "duration": "3分钟",
        "description": "拉伸股四头肌、腘绳肌和小腿肌，每个动作保持20秒"
      },
      {
        "name": "上身拉伸",
        "duration": "2分钟",
        "description": "拉伸胸部、肩部和背部肌肉"
      },
      {
        "name": "呼吸调整",
        "duration": "2分钟",
        "description": "深呼吸放松，让心率逐渐回到正常水平"
      }
    ]
  },
  "summary": {
    "totalDuration": "45分钟",
    "estimatedCaloriesBurned": "320卡",
    "difficulty": "中等偏上",
    "recommendations": [
      "训练前务必充分热身，防止运动损伤",
      "保持动作标准，宁可减少次数也要确保质量",
      "训练过程中适量补水，避免脱水",
      "训练后进行充分拉伸，有助于肌肉恢复",
      "建议每周进行3-4次此类力量训练",
      "配合有氧运动效果更佳"
    ]
  }
}`;

export default { testWorkoutPlanStorage, mockAIWorkoutResponse };
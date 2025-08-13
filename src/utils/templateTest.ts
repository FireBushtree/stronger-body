import { generateQuestion } from './questionTemplates';
import type { UserBodyInfo } from './db';

// 测试用户信息 - 基于你提供的示例
const testUserInfo: UserBodyInfo = {
  height: 182,
  gender: 'male',
  age: 30,
  currentWeight: 82,
  weeklyWorkIntensity: 'moderate', // 3-5次运动
  targetWeight: 70,
  bmi: 24.8, // 自动计算的BMI
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 测试饮食计划模板
export const testDietPlanTemplate = () => {
  const question = generateQuestion('diet-plan', testUserInfo);
  console.log('=== 饮食计划问题模板 ===');
  console.log(question);
  return question;
};

// 测试运动计划模板
export const testWorkoutPlanTemplate = () => {
  const question = generateQuestion('workout-plan', testUserInfo);
  console.log('=== 运动计划问题模板 ===');
  console.log(question);
  return question;
};

// 测试健康评估模板
export const testHealthAssessmentTemplate = () => {
  const question = generateQuestion('health-assessment', testUserInfo);
  console.log('=== 健康评估问题模板 ===');
  console.log(question);
  return question;
};

// 运行所有测试
export const runAllTemplateTests = () => {
  console.log('开始测试所有问题模板...\n');
  
  testDietPlanTemplate();
  console.log('\n');
  
  testWorkoutPlanTemplate();
  console.log('\n');
  
  testHealthAssessmentTemplate();
  console.log('\n');
  
  console.log('所有模板测试完成！');
};
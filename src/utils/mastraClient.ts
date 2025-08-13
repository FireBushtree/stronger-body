import { MastraClient } from "@mastra/client-js";
import { generateQuestion } from './questionTemplates';
import type { UserBodyInfo } from './db';

const client = new MastraClient({
  // baseUrl: import.meta.env.VITE_MASTRA_BACKEND_URL || 'http://localhost:4111',
  baseUrl: 'http://localhost:4111'
});

export const callBodyAgent = async (userInfo: UserBodyInfo, templateId: string = 'diet-plan') => {
  try {
    const questionPrompt = generateQuestion(templateId, userInfo);

    if (!questionPrompt) {
      throw new Error(`Failed to generate question with template: ${templateId}`);
    }

    const agent = client.getAgent("bodyAgent");
    const response = await agent.generate({
      messages: [{ role: "user", content: questionPrompt }],
    });

    return response;
  } catch (error) {
    console.error("Error calling Body Agent:", error);
    throw error;
  }
};

// 专门的饮食计划调用方法
export const callDietPlanAgent = async (userInfo: UserBodyInfo) => {
  return callBodyAgent(userInfo, 'diet-plan');
};

// 专门的运动计划调用方法
export const callWorkoutPlanAgent = async (userInfo: UserBodyInfo) => {
  return callBodyAgent(userInfo, 'workout-plan');
};

// 专门的健康评估调用方法
export const callHealthAssessmentAgent = async (userInfo: UserBodyInfo) => {
  return callBodyAgent(userInfo, 'health-assessment');
};

export default client;

import type { UserBodyInfo } from './db';

export interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  generatePrompt: (userInfo: UserBodyInfo, extraParams?: any) => string;
}

// 饮食计划问题模板
export const dietPlanTemplate: QuestionTemplate = {
  id: 'diet-plan',
  name: '饮食计划',
  description: '根据用户身体信息制定个性化饮食计划',
  generatePrompt: (userInfo: UserBodyInfo, extraParams?: any) => {
    const workoutIntensityMap = {
      'light': '1-2次',
      'moderate': '3-5次',
      'heavy': '5-7次',
      'very-heavy': '7次以上'
    };

    const workoutDescription = workoutIntensityMap[userInfo.weeklyWorkIntensity] || '适中';

    return `我的体重是${userInfo.currentWeight}kg，身高${userInfo.height}cm，性别${userInfo.gender === 'male' ? '男' : '女'}，年龄${userInfo.age}岁，每周运动${workoutDescription}${userInfo.targetWeight ? `，目标体重是${userInfo.targetWeight}kg` : ''}。请根据我的个人信息帮我制定一个今日的饮食计划，要求分为早中晚三餐。只需要返回一个JSON字符串，不需要其他额外的话语。

返回格式要求:
{
  "breakfast": {
    "time": "7:00-8:00",
    "foods": [
      {
        "name": "食物名称",
        "amount": "分量",
        "calories": "卡路里",
        "nutrients": {
          "protein": "蛋白质含量(g)",
          "carbs": "碳水化合物含量(g)",
          "fat": "脂肪含量(g)"
        }
      }
    ],
    "totalCalories": "总卡路里",
    "notes": "建议说明"
  },
  "lunch": {
    "time": "12:00-13:00",
    "foods": [...],
    "totalCalories": "总卡路里",
    "notes": "建议说明"
  },
  "dinner": {
    "time": "18:00-19:00",
    "foods": [...],
    "totalCalories": "总卡路里",
    "notes": "建议说明"
  },
  "summary": {
    "totalDailyCalories": "全天总卡路里",
    "dailyNutrients": {
      "protein": "总蛋白质(g)",
      "carbs": "总碳水化合物(g)",
      "fat": "总脂肪(g)"
    },
    "recommendations": ["建议1", "建议2", "建议3"]
  }
}`;
  }
};

// 运动计划问题模板
export const workoutPlanTemplate: QuestionTemplate = {
  id: 'workout-plan',
  name: '运动计划',
  description: '根据用户身体信息制定个性化运动计划',
  generatePrompt: (userInfo: UserBodyInfo, extraParams?: any) => {
    const workoutIntensityMap = {
      'light': '轻度运动',
      'moderate': '中等强度运动',
      'heavy': '高强度运动',
      'very-heavy': '极高强度运动'
    };

    const currentIntensity = workoutIntensityMap[userInfo.weeklyWorkIntensity] || '中等强度运动';

    return `我的体重是${userInfo.currentWeight}kg，身高${userInfo.height}cm，性别${userInfo.gender === 'male' ? '男' : '女'}，年龄${userInfo.age}岁，目前运动强度为${currentIntensity}${userInfo.targetWeight ? `，目标体重是${userInfo.targetWeight}kg` : ''}。请根据我的个人信息帮我制定一个今日的运动计划，并以json的格式返回给我。

返回格式要求:
{
  "warmup": {
    "duration": "热身时长",
    "exercises": [
      {
        "name": "运动名称",
        "duration": "持续时间",
        "description": "动作说明"
      }
    ]
  },
  "mainWorkout": {
    "duration": "主要训练时长",
    "exercises": [
      {
        "name": "运动名称",
        "sets": "组数",
        "reps": "次数或时长",
        "restTime": "休息时间",
        "targetMuscles": ["目标肌群"],
        "description": "动作说明"
      }
    ]
  },
  "cooldown": {
    "duration": "放松时长",
    "exercises": [
      {
        "name": "拉伸动作",
        "duration": "持续时间",
        "description": "动作说明"
      }
    ]
  },
  "summary": {
    "totalDuration": "总训练时间",
    "estimatedCaloriesBurned": "预估消耗卡路里",
    "difficulty": "难度级别",
    "recommendations": ["建议1", "建议2", "建议3"]
  }
}`;
  }
};

// 营养成分计算问题模板
export const nutritionCalculationTemplate: QuestionTemplate = {
  id: 'nutrition-calculation',
  name: '营养成分计算',
  description: '根据用户输入的食物计算营养成分',
  generatePrompt: (userInfo: UserBodyInfo, foodInput?: string) => {
    return `请帮我计算以下食物的营养成分信息：
${foodInput || ''}

请根据这些食物的品种和分量，计算总的营养成分，并以JSON格式返回结果。

返回格式要求:
{
  "foods": [
    {
      "name": "食物名称",
      "amount": "分量/重量",
      "calories": "卡路里",
      "nutrients": {
        "protein": "蛋白质含量(g)",
        "carbs": "碳水化合物含量(g)",
        "fat": "脂肪含量(g)"
      }
    }
  ],
  "totalNutrition": {
    "calories": "总卡路里",
    "protein": "总蛋白质(g)",
    "carbs": "总碳水化合物(g)",
    "fat": "总脂肪(g)"
  },
  "analysis": "营养分析和建议"
}

注意：请尽可能准确地计算营养成分，如果某些食物信息不够明确，请给出合理的估算值。`;
  }
};

// 健康评估问题模板
export const healthAssessmentTemplate: QuestionTemplate = {
  id: 'health-assessment',
  name: '健康评估',
  description: '根据用户身体信息进行健康状况评估',
  generatePrompt: (userInfo: UserBodyInfo, extraParams?: any) => {
    return `我的体重是${userInfo.currentWeight}kg，身高${userInfo.height}cm，性别${userInfo.gender === 'male' ? '男' : '女'}，年龄${userInfo.age}岁，BMI指数为${userInfo.bmi}${userInfo.targetWeight ? `，目标体重是${userInfo.targetWeight}kg` : ''}。请根据我的个人信息对我的健康状况进行评估，并以json的格式返回给我。

返回格式要求:
{
  "bmiAnalysis": {
    "value": ${userInfo.bmi},
    "category": "BMI分类(偏瘦/正常/超重/肥胖)",
    "assessment": "BMI评估说明"
  },
  "healthRisks": [
    {
      "risk": "风险项目",
      "level": "风险等级(低/中/高)",
      "description": "风险说明"
    }
  ],
  "recommendations": {
    "diet": ["饮食建议1", "饮食建议2"],
    "exercise": ["运动建议1", "运动建议2"],
    "lifestyle": ["生活方式建议1", "生活方式建议2"]
  },
  "goals": {
    "weightGoal": "${userInfo.targetWeight ? `减重${userInfo.currentWeight - userInfo.targetWeight}kg` : '维持当前体重'}",
    "timeline": "建议达成时间",
    "milestones": ["阶段目标1", "阶段目标2"]
  },
  "summary": {
    "overallHealth": "整体健康状况评价",
    "priority": "优先改善项目",
    "nextSteps": ["下一步行动建议"]
  }
}`;
  }
};

// 模板注册表
export const questionTemplates: QuestionTemplate[] = [
  dietPlanTemplate,
  workoutPlanTemplate,
  healthAssessmentTemplate,
  nutritionCalculationTemplate
];

// 根据模板ID获取模板
export const getTemplateById = (id: string): QuestionTemplate | undefined => {
  return questionTemplates.find(template => template.id === id);
};

// 生成问题文本
export const generateQuestion = (templateId: string, userInfo: UserBodyInfo, extraParams?: any): string | null => {
  const template = getTemplateById(templateId);
  if (!template) {
    console.error(`Template with id "${templateId}" not found`);
    return null;
  }

  return template.generatePrompt(userInfo, extraParams);
};
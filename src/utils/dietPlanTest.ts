import { DietPlanDB } from './db';

// 测试饮食计划数据
const mockDietPlan = {
  breakfast: {
    time: "7:00-8:00",
    foods: [
      {
        name: "燕麦粥",
        amount: "1碗",
        calories: "150卡",
        nutrients: {
          protein: "5g",
          carbs: "27g",
          fat: "3g"
        }
      },
      {
        name: "水煮蛋",
        amount: "1个",
        calories: "70卡",
        nutrients: {
          protein: "6g",
          carbs: "1g",
          fat: "5g"
        }
      }
    ],
    totalCalories: "220卡",
    notes: "早餐应在起床后1小时内食用"
  },
  lunch: {
    time: "12:00-13:00",
    foods: [
      {
        name: "鸡胸肉",
        amount: "100g",
        calories: "165卡",
        nutrients: {
          protein: "31g",
          carbs: "0g",
          fat: "3.6g"
        }
      },
      {
        name: "糙米饭",
        amount: "1碗",
        calories: "220卡",
        nutrients: {
          protein: "5g",
          carbs: "45g",
          fat: "2g"
        }
      }
    ],
    totalCalories: "385卡",
    notes: "午餐注重蛋白质摄入"
  },
  dinner: {
    time: "18:00-19:00",
    foods: [
      {
        name: "三文鱼",
        amount: "80g",
        calories: "180卡",
        nutrients: {
          protein: "22g",
          carbs: "0g",
          fat: "11g"
        }
      },
      {
        name: "蔬菜沙拉",
        amount: "1份",
        calories: "80卡",
        nutrients: {
          protein: "3g",
          carbs: "12g",
          fat: "3g"
        }
      }
    ],
    totalCalories: "260卡",
    notes: "晚餐应清淡，避免过量碳水"
  },
  summary: {
    totalDailyCalories: "865卡",
    dailyNutrients: {
      protein: "72g",
      carbs: "85g",
      fat: "27.6g"
    },
    recommendations: [
      "多喝水，每日至少2升",
      "餐后30分钟再进行运动",
      "建议搭配适量水果作为加餐"
    ]
  }
};

// 测试保存和获取饮食计划
export const testDietPlanStorage = () => {
  console.log('=== 测试饮食计划存储功能 ===');
  
  // 清除现有数据
  DietPlanDB.clearTodayPlan();
  console.log('1. 清除现有数据');
  
  // 获取空数据
  const emptyPlan = DietPlanDB.getTodayPlan();
  console.log('2. 获取空数据:', emptyPlan);
  
  // 保存测试数据
  const saved = DietPlanDB.setTodayPlan(mockDietPlan);
  console.log('3. 保存测试数据:', saved ? '成功' : '失败');
  
  // 获取保存的数据
  const retrievedPlan = DietPlanDB.getTodayPlan();
  console.log('4. 获取保存的数据:', retrievedPlan);
  
  console.log('=== 测试完成 ===');
  return retrievedPlan;
};

// 模拟AI返回的饮食计划JSON
export const mockAIResponse = `{
  "breakfast": {
    "time": "7:00-8:00",
    "foods": [
      {
        "name": "燕麦粥",
        "amount": "1碗(200g)",
        "calories": "150卡",
        "nutrients": {
          "protein": "5g",
          "carbs": "27g",
          "fat": "3g"
        }
      },
      {
        "name": "水煮蛋",
        "amount": "1个",
        "calories": "70卡",
        "nutrients": {
          "protein": "6g",
          "carbs": "1g",
          "fat": "5g"
        }
      },
      {
        "name": "香蕉",
        "amount": "1根",
        "calories": "89卡",
        "nutrients": {
          "protein": "1g",
          "carbs": "23g",
          "fat": "0.3g"
        }
      }
    ],
    "totalCalories": "309卡",
    "notes": "早餐应在起床后1小时内食用，提供充足能量"
  },
  "lunch": {
    "time": "12:00-13:00",
    "foods": [
      {
        "name": "鸡胸肉",
        "amount": "120g",
        "calories": "198卡",
        "nutrients": {
          "protein": "37g",
          "carbs": "0g",
          "fat": "4.3g"
        }
      },
      {
        "name": "糙米饭",
        "amount": "1碗(150g)",
        "calories": "330卡",
        "nutrients": {
          "protein": "7.5g",
          "carbs": "67g",
          "fat": "3g"
        }
      },
      {
        "name": "西兰花",
        "amount": "100g",
        "calories": "34卡",
        "nutrients": {
          "protein": "3g",
          "carbs": "7g",
          "fat": "0.4g"
        }
      }
    ],
    "totalCalories": "562卡",
    "notes": "午餐注重蛋白质摄入，配合复合碳水化合物"
  },
  "dinner": {
    "time": "18:00-19:00",
    "foods": [
      {
        "name": "三文鱼",
        "amount": "100g",
        "calories": "225卡",
        "nutrients": {
          "protein": "28g",
          "carbs": "0g",
          "fat": "14g"
        }
      },
      {
        "name": "蔬菜沙拉",
        "amount": "1大份",
        "calories": "120卡",
        "nutrients": {
          "protein": "4g",
          "carbs": "18g",
          "fat": "4g"
        }
      },
      {
        "name": "蒸蛋",
        "amount": "1个",
        "calories": "70卡",
        "nutrients": {
          "protein": "6g",
          "carbs": "1g",
          "fat": "5g"
        }
      }
    ],
    "totalCalories": "415卡",
    "notes": "晚餐应清淡，富含优质蛋白质和膳食纤维"
  },
  "summary": {
    "totalDailyCalories": "1286卡",
    "dailyNutrients": {
      "protein": "97.5g",
      "carbs": "144g",
      "fat": "38.9g"
    },
    "recommendations": [
      "多喝水，每日至少2.5升",
      "餐后30分钟再进行剧烈运动",
      "可在上午10点和下午3点适量加餐坚果或水果",
      "注意细嚼慢咽，每餐用时不少于20分钟"
    ]
  }
}`;

export default { testDietPlanStorage, mockAIResponse };
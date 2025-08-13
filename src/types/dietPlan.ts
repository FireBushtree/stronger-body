// 饮食计划数据类型定义

export interface Food {
  name: string;
  amount: string;
  calories: string;
  nutrients: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface Meal {
  time: string;
  foods: Food[];
  totalCalories: string;
  notes: string;
}

export interface DailyNutrients {
  protein: string;
  carbs: string;
  fat: string;
}

export interface DietPlanSummary {
  totalDailyCalories: string;
  dailyNutrients: DailyNutrients;
  recommendations: string[];
}

export interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  summary: DietPlanSummary;
}
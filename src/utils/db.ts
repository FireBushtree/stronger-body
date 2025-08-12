// 用户身体信息数据结构
export interface UserBodyInfo {
  height: number; // 身高 (cm)
  gender: 'male' | 'female'; // 性别
  age: number; // 年龄
  currentWeight: number; // 当前体重 (kg)
  weeklyWorkIntensity: 'light' | 'moderate' | 'heavy' | 'very-heavy'; // 每周工作强度
  targetWeight?: number; // 目标体重 (kg)
  bmi?: number; // BMI指数 (自动计算)
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 体重记录数据结构
export interface WeightRecord {
  date: string; // 日期 YYYY-MM-DD
  weight: number; // 体重 (kg)
  isFasting: boolean; // 是否空腹测量
  note?: string; // 备注
  timestamp: number; // 时间戳
}

// 营养摄入记录数据结构
export interface NutritionRecord {
  date: string; // 日期 YYYY-MM-DD
  calories: number; // 卡路里 (kcal)
  protein: number; // 蛋白质 (g)
  fat: number; // 脂肪 (g)
  carbohydrates: number; // 碳水化合物 (g)
  timestamp: number; // 时间戳
}

// 体重趋势数据 (使用Map结构)
export type WeightTrendMap = Map<string, WeightRecord>;

// 摄入趋势数据 (使用Map结构)
export type NutritionTrendMap = Map<string, NutritionRecord>;

// localStorage键名常量
const STORAGE_KEYS = {
  USER_BODY_INFO: 'stronger-body-user-info',
  WEIGHT_TREND: 'stronger-body-weight-trend',
  NUTRITION_TREND: 'stronger-body-nutrition-trend'
} as const;

// 工具函数：Map与JSON互相转换
const mapToArray = <T>(map: Map<string, T>): Array<[string, T]> => {
  return Array.from(map.entries());
};

const arrayToMap = <T>(array: Array<[string, T]>): Map<string, T> => {
  return new Map(array);
};

// 用户身体信息相关方法
export class UserBodyInfoDB {
  // 获取用户身体信息
  static get(): UserBodyInfo | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_BODY_INFO);
      if (!data) return null;

      const userInfo: UserBodyInfo = JSON.parse(data);
      // 自动计算BMI
      if (userInfo.height && userInfo.currentWeight) {
        userInfo.bmi = Number((userInfo.currentWeight / Math.pow(userInfo.height / 100, 2)).toFixed(1));
      }

      return userInfo;
    } catch (error) {
      console.error('获取用户身体信息失败:', error);
      return null;
    }
  }

  // 设置用户身体信息
  static set(userInfo: Partial<UserBodyInfo>): boolean {
    try {
      const existingData = UserBodyInfoDB.get();
      const now = new Date().toISOString();

      const updatedInfo: UserBodyInfo = {
        height: userInfo.height || existingData?.height || 170,
        gender: userInfo.gender || existingData?.gender || 'male',
        age: userInfo.age || existingData?.age || 25,
        currentWeight: userInfo.currentWeight || existingData?.currentWeight || 70,
        weeklyWorkIntensity: userInfo.weeklyWorkIntensity || existingData?.weeklyWorkIntensity || 'moderate',
        targetWeight: userInfo.targetWeight || existingData?.targetWeight,
        createdAt: existingData?.createdAt || now,
        updatedAt: now
      };

      // 计算BMI
      updatedInfo.bmi = Number((updatedInfo.currentWeight / Math.pow(updatedInfo.height / 100, 2)).toFixed(1));

      localStorage.setItem(STORAGE_KEYS.USER_BODY_INFO, JSON.stringify(updatedInfo));
      return true;
    } catch (error) {
      console.error('保存用户身体信息失败:', error);
      return false;
    }
  }

  // 更新当前体重
  static updateCurrentWeight(weight: number): boolean {
    const userInfo = UserBodyInfoDB.get();
    if (!userInfo) return false;

    return UserBodyInfoDB.set({ ...userInfo, currentWeight: weight });
  }
}

// 体重趋势相关方法
export class WeightTrendDB {
  // 获取体重趋势数据
  static get(): WeightTrendMap {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_TREND);
      if (!data) return new Map();

      const arrayData: Array<[string, WeightRecord]> = JSON.parse(data);
      return arrayToMap(arrayData);
    } catch (error) {
      console.error('获取体重趋势数据失败:', error);
      return new Map();
    }
  }

  // 设置体重趋势数据
  static set(trendMap: WeightTrendMap): boolean {
    try {
      const arrayData = mapToArray(trendMap);
      localStorage.setItem(STORAGE_KEYS.WEIGHT_TREND, JSON.stringify(arrayData));
      return true;
    } catch (error) {
      console.error('保存体重趋势数据失败:', error);
      return false;
    }
  }

  // 添加单条体重记录
  static addRecord(record: Omit<WeightRecord, 'timestamp'>): boolean {
    const trendMap = WeightTrendDB.get();
    const weightRecord: WeightRecord = {
      ...record,
      timestamp: Date.now()
    };

    trendMap.set(record.date, weightRecord);
    return WeightTrendDB.set(trendMap);
  }

  // 获取指定日期范围的体重数据
  static getDateRange(startDate: string, endDate: string): WeightRecord[] {
    const trendMap = WeightTrendDB.get();
    const result: WeightRecord[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const [date, record] of trendMap.entries()) {
      const recordDate = new Date(date);
      if (recordDate >= start && recordDate <= end) {
        result.push(record);
      }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 获取最近N天的体重数据
  static getRecentDays(days: number): WeightRecord[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    return WeightTrendDB.getDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }
}

// 营养摄入趋势相关方法
export class NutritionTrendDB {
  // 获取营养摄入趋势数据
  static get(): NutritionTrendMap {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NUTRITION_TREND);
      if (!data) return new Map();

      const arrayData: Array<[string, NutritionRecord]> = JSON.parse(data);
      return arrayToMap(arrayData);
    } catch (error) {
      console.error('获取营养摄入趋势数据失败:', error);
      return new Map();
    }
  }

  // 设置营养摄入趋势数据
  static set(trendMap: NutritionTrendMap): boolean {
    try {
      const arrayData = mapToArray(trendMap);
      localStorage.setItem(STORAGE_KEYS.NUTRITION_TREND, JSON.stringify(arrayData));
      return true;
    } catch (error) {
      console.error('保存营养摄入趋势数据失败:', error);
      return false;
    }
  }

  // 添加单条营养记录
  static addRecord(record: Omit<NutritionRecord, 'timestamp'>): boolean {
    const trendMap = NutritionTrendDB.get();
    const nutritionRecord: NutritionRecord = {
      ...record,
      timestamp: Date.now()
    };

    trendMap.set(record.date, nutritionRecord);
    return NutritionTrendDB.set(trendMap);
  }

  // 获取指定日期范围的营养数据
  static getDateRange(startDate: string, endDate: string): NutritionRecord[] {
    const trendMap = NutritionTrendDB.get();
    const result: NutritionRecord[] = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const [date, record] of trendMap.entries()) {
      const recordDate = new Date(date);
      if (recordDate >= start && recordDate <= end) {
        result.push(record);
      }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 获取最近N天的营养数据
  static getRecentDays(days: number): NutritionRecord[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    return NutritionTrendDB.getDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }

  // 获取今日营养摄入
  static getTodayRecord(): NutritionRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const trendMap = NutritionTrendDB.get();
    return trendMap.get(today) || null;
  }
}

// 训练计划数据类型定义

export interface Exercise {
  name: string;
  duration?: string;
  description: string;
  sets?: string;
  reps?: string;
  restTime?: string;
  targetMuscles?: string[];
}

export interface WarmupSection {
  duration: string;
  exercises: Exercise[];
}

export interface MainWorkoutSection {
  duration: string;
  exercises: Exercise[];
}

export interface CooldownSection {
  duration: string;
  exercises: Exercise[];
}

export interface WorkoutPlanSummary {
  totalDuration: string;
  estimatedCaloriesBurned: string;
  difficulty: string;
  recommendations: string[];
}

export interface WorkoutPlan {
  warmup: WarmupSection;
  mainWorkout: MainWorkoutSection;
  cooldown: CooldownSection;
  summary: WorkoutPlanSummary;
}
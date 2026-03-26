import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MealPlan {
    weekStartDate: string;
    planData: string;
}
export interface Recipe {
    id: string;
    title: string;
    difficulty: string;
    cuisineType: string;
    cookTime: bigint;
    description: string;
    nutritionInfo: string;
    steps: Array<string>;
    ingredients: Array<string>;
}
export type Time = bigint;
export interface SessionDataView {
    recipes: Array<Recipe>;
    achievements: Array<Achievement>;
    mealPlan?: MealPlan;
}
export interface Achievement {
    id: string;
    name: string;
    unlocked: boolean;
    unlockedTimestamp: Time;
}
export interface backendInterface {
    getAchievements(sessionId: string): Promise<Array<Achievement>>;
    getMealPlan(sessionId: string): Promise<MealPlan | null>;
    getOrCreateSession(sessionId: string): Promise<void>;
    getSavedRecipes(sessionId: string): Promise<Array<Recipe>>;
    getSessionData(sessionId: string): Promise<SessionDataView | null>;
    removeRecipe(sessionId: string, recipeId: string): Promise<void>;
    saveAchievement(sessionId: string, achievement: Achievement): Promise<void>;
    saveMealPlan(sessionId: string, mealPlan: MealPlan): Promise<void>;
    saveRecipe(sessionId: string, recipe: Recipe): Promise<void>;
}

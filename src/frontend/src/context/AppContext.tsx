import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type Achievement,
  getInitialAchievements,
  unlockAchievement,
} from "../utils/achievementEngine";
import { PERSONALITIES, type Personality } from "../utils/personalityEngine";
import {
  type ScoredRecipe,
  getRandomRecipe,
  matchRecipes,
} from "../utils/recipeEngine";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "achievement" | "info" | "error";
  emoji?: string;
}

export interface MealEntry {
  name: string;
  time: number;
}

export interface DayPlan {
  day: string;
  breakfast: MealEntry;
  lunch: MealEntry;
  dinner: MealEntry;
}

export interface AppState {
  ingredients: string[];
  savedRecipes: ScoredRecipe[];
  achievements: Achievement[];
  personality: Personality;
  activeSection: string;
  selectedCuisine: string;
  budgetMode: { enabled: boolean; amount: number };
  emergencyMode: boolean;
  generatedRecipes: ScoredRecipe[];
  surpriseRecipe: ScoredRecipe | null;
  mealPlan: DayPlan[] | null;
  toasts: ToastItem[];
  usedPersonalities: Set<string>;
  usedCuisines: Set<string>;
  recipesGeneratedCount: number;
  isLoading: boolean;
}

export interface AppActions {
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setIngredients: (ingredients: string[]) => void;
  saveRecipe: (recipe: ScoredRecipe) => void;
  unsaveRecipe: (id: string) => void;
  setPersonality: (p: Personality) => void;
  setActiveSection: (s: string) => void;
  setSelectedCuisine: (c: string) => void;
  setBudgetMode: (mode: { enabled: boolean; amount: number }) => void;
  setEmergencyMode: (v: boolean) => void;
  generateRecipes: (emergency?: boolean) => void;
  generateSurprise: () => void;
  generateMealPlan: (preference: string) => void;
  addToast: (message: string, type: ToastItem["type"], emoji?: string) => void;
  removeToast: (id: string) => void;
  tryUnlockAchievement: (id: string) => void;
}

type AppContextType = AppState & AppActions;

const AppContext = createContext<AppContextType | null>(null);

const MEAL_NAMES = {
  Healthy: [
    ["Overnight Oats", "Greek Salad", "Grilled Salmon"],
    ["Smoothie Bowl", "Quinoa Bowl", "Veggie Stir Fry"],
    ["Avocado Toast", "Lentil Soup", "Baked Chicken"],
    ["Yogurt Parfait", "Tuna Salad", "Roasted Veggies"],
    ["Chia Pudding", "Chickpea Wrap", "Fish Tacos"],
    ["Poached Eggs", "Caprese Salad", "Turkey Meatballs"],
    ["Protein Pancakes", "Buddha Bowl", "Steamed Fish"],
  ],
  "High Protein": [
    ["Egg White Omelette", "Chicken Caesar", "Steak & Veggies"],
    ["Greek Yogurt Bowl", "Tuna Wrap", "Ground Turkey Bowl"],
    ["Cottage Cheese Pancakes", "Protein Salad", "Salmon Fillet"],
    ["Scrambled Eggs", "Chicken Breast", "Shrimp Stir Fry"],
    ["Protein Smoothie", "Egg Salad", "Beef Stir Fry"],
    ["Omelette", "Turkey Burger", "Grilled Chicken"],
    ["French Omelette", "Chicken Wrap", "Lamb Kofta"],
  ],
  Vegetarian: [
    ["Banana Pancakes", "Caprese Salad", "Mushroom Risotto"],
    ["Avocado Toast", "Minestrone Soup", "Palak Paneer"],
    ["Oatmeal", "Greek Salad", "Veggie Pasta"],
    ["Smoothie", "Hummus Wrap", "Shakshuka"],
    ["Yogurt Parfait", "Tabbouleh", "Aloo Gobi"],
    ["Crepes", "Falafel Wrap", "Margherita Pizza"],
    ["Mango Lassi", "Pesto Pasta", "Ratatouille"],
  ],
  Budget: [
    ["Oatmeal", "Dal Makhani", "Egg Fried Rice"],
    ["Toast & Eggs", "Black Bean Soup", "Chana Masala"],
    ["Banana Oats", "Lentil Soup", "Pasta Carbonara"],
    ["Scrambled Eggs", "Rice & Beans", "Grilled Cheese"],
    ["Peanut Butter Toast", "Minestrone", "Masoor Dal"],
    ["Porridge", "Quesadillas", "Aglio e Olio"],
    ["French Toast", "Hummus & Pita", "Veggie Fried Rice"],
  ],
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function generateMealPlanData(preference: string): DayPlan[] {
  const key = preference as keyof typeof MEAL_NAMES;
  const meals = MEAL_NAMES[key] ?? MEAL_NAMES.Healthy;
  return DAYS.map((day, i) => ({
    day,
    breakfast: { name: meals[i][0], time: Math.floor(Math.random() * 10) + 5 },
    lunch: { name: meals[i][1], time: Math.floor(Math.random() * 20) + 10 },
    dinner: { name: meals[i][2], time: Math.floor(Math.random() * 30) + 20 },
  }));
}

function getSavedRecipes(): ScoredRecipe[] {
  try {
    const stored = localStorage.getItem("chefmind_saved");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredientsState] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] =
    useState<ScoredRecipe[]>(getSavedRecipes);
  const [achievements, setAchievements] = useState<Achievement[]>(
    getInitialAchievements,
  );
  const [personality, setPersonalityState] =
    useState<Personality>("Gordon Ramsay");
  const [activeSection, setActiveSectionState] = useState("home");
  const [selectedCuisine, setSelectedCuisineState] = useState("All");
  const [budgetMode, setBudgetModeState] = useState({
    enabled: false,
    amount: 0,
  });
  const [emergencyMode, setEmergencyModeState] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<ScoredRecipe[]>([]);
  const [surpriseRecipe, setSurpriseRecipe] = useState<ScoredRecipe | null>(
    null,
  );
  const [mealPlan, setMealPlan] = useState<DayPlan[] | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [usedPersonalities, setUsedPersonalities] = useState<Set<string>>(
    new Set(["Gordon Ramsay"]),
  );
  const [usedCuisines, setUsedCuisines] = useState<Set<string>>(new Set());
  const [recipesGeneratedCount, setRecipesGeneratedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toastTimeout = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    localStorage.setItem("chefmind_saved", JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const addToast = useCallback(
    (message: string, type: ToastItem["type"], emoji?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-3), { id, message, type, emoji }]);
      const t = setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3500);
      toastTimeout.current.set(id, t);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const t = toastTimeout.current.get(id);
    if (t) clearTimeout(t);
  }, []);

  const tryUnlockAchievement = useCallback(
    (id: string) => {
      setAchievements((prev) => {
        const { updated, newlyUnlocked } = unlockAchievement(prev, id);
        if (newlyUnlocked) {
          setTimeout(() => {
            addToast(
              `${newlyUnlocked.emoji} Achievement Unlocked: ${newlyUnlocked.name}!`,
              "achievement",
            );
          }, 100);
        }
        return updated;
      });
    },
    [addToast],
  );

  const addIngredient = useCallback((ingredient: string) => {
    const normalized = ingredient.trim().toLowerCase();
    if (!normalized) return;
    setIngredientsState((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });
  }, []);

  const removeIngredient = useCallback((ingredient: string) => {
    setIngredientsState((prev) => prev.filter((i) => i !== ingredient));
  }, []);

  const clearIngredients = useCallback(() => setIngredientsState([]), []);

  const setIngredients = useCallback(
    (ings: string[]) => setIngredientsState(ings),
    [],
  );

  const saveRecipe = useCallback(
    (recipe: ScoredRecipe) => {
      setSavedRecipes((prev) => {
        if (prev.find((r) => r.id === recipe.id)) return prev;
        addToast(`${recipe.title} saved to favorites!`, "success", "❤️");
        return [...prev, recipe];
      });
      setTimeout(() => tryUnlockAchievement("first_save"), 50);
    },
    [addToast, tryUnlockAchievement],
  );

  const unsaveRecipe = useCallback(
    (id: string) => {
      setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
      addToast("Recipe removed from favorites", "info");
    },
    [addToast],
  );

  const setPersonality = useCallback(
    (p: Personality) => {
      setPersonalityState(p);
      setUsedPersonalities((prev) => {
        const next = new Set(prev);
        next.add(p);
        if (next.size >= PERSONALITIES.length) {
          setTimeout(() => tryUnlockAchievement("all_personalities"), 50);
        }
        return next;
      });
    },
    [tryUnlockAchievement],
  );

  const setActiveSection = useCallback(
    (s: string) => setActiveSectionState(s),
    [],
  );

  const setSelectedCuisine = useCallback(
    (c: string) => {
      setSelectedCuisineState(c);
      if (c !== "All") {
        setUsedCuisines((prev) => {
          const next = new Set(prev);
          next.add(c);
          if (next.size >= 3) {
            setTimeout(() => tryUnlockAchievement("cuisine_explorer"), 50);
          }
          return next;
        });
      }
    },
    [tryUnlockAchievement],
  );

  const setBudgetMode = useCallback(
    (mode: { enabled: boolean; amount: number }) => {
      setBudgetModeState(mode);
      if (mode.enabled) {
        setTimeout(() => tryUnlockAchievement("budget_chef"), 50);
      }
    },
    [tryUnlockAchievement],
  );

  const setEmergencyMode = useCallback(
    (v: boolean) => {
      setEmergencyModeState(v);
      if (v) {
        setTimeout(() => tryUnlockAchievement("speed_demon"), 50);
      }
    },
    [tryUnlockAchievement],
  );

  const generateRecipes = useCallback(
    (emergency?: boolean) => {
      setIsLoading(true);
      setSurpriseRecipe(null);
      setTimeout(() => {
        const recipes = matchRecipes(ingredients, {
          cuisine: selectedCuisine,
          maxBudget: budgetMode.enabled ? budgetMode.amount : undefined,
          emergency: emergency ?? emergencyMode,
          limit: 100,
        });
        setGeneratedRecipes(recipes);
        setIsLoading(false);
        setRecipesGeneratedCount((prev) => {
          const next = prev + 1;
          if (next === 1)
            setTimeout(() => tryUnlockAchievement("first_recipe"), 50);
          if (next >= 5)
            setTimeout(() => tryUnlockAchievement("five_recipes"), 50);
          return next;
        });
        setActiveSectionState("home");
      }, 2500);
    },
    [
      ingredients,
      selectedCuisine,
      budgetMode,
      emergencyMode,
      tryUnlockAchievement,
    ],
  );

  const generateSurprise = useCallback(() => {
    setIsLoading(true);
    setSurpriseRecipe(null);
    setGeneratedRecipes([]);
    setTimeout(() => {
      const recipe = getRandomRecipe(ingredients);
      setSurpriseRecipe(recipe);
      setIsLoading(false);
      setActiveSectionState("home");
      setTimeout(() => tryUnlockAchievement("chefs_surprise"), 50);
    }, 2500);
  }, [ingredients, tryUnlockAchievement]);

  const generateMealPlan = useCallback(
    (preference: string) => {
      const plan = generateMealPlanData(preference);
      setMealPlan(plan);
      setTimeout(() => tryUnlockAchievement("meal_plan"), 50);
      addToast("7-day meal plan generated!", "success", "📅");
    },
    [tryUnlockAchievement, addToast],
  );

  const value: AppContextType = {
    ingredients,
    savedRecipes,
    achievements,
    personality,
    activeSection,
    selectedCuisine,
    budgetMode,
    emergencyMode,
    generatedRecipes,
    surpriseRecipe,
    mealPlan,
    toasts,
    usedPersonalities,
    usedCuisines,
    recipesGeneratedCount,
    isLoading,
    addIngredient,
    removeIngredient,
    clearIngredients,
    setIngredients,
    saveRecipe,
    unsaveRecipe,
    setPersonality,
    setActiveSection,
    setSelectedCuisine,
    setBudgetMode,
    setEmergencyMode,
    generateRecipes,
    generateSurprise,
    generateMealPlan,
    addToast,
    removeToast,
    tryUnlockAchievement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

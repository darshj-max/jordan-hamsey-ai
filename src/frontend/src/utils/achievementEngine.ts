export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const ACHIEVEMENT_DEFINITIONS: Omit<
  Achievement,
  "unlocked" | "unlockedAt"
>[] = [
  {
    id: "first_recipe",
    emoji: "🍳",
    name: "First Recipe",
    description: "Generated your very first recipe",
  },
  {
    id: "five_recipes",
    emoji: "🔥",
    name: "Hot Streak",
    description: "Generated 5 recipes total",
  },
  {
    id: "first_save",
    emoji: "❤️",
    name: "Recipe Lover",
    description: "Saved your first recipe to favorites",
  },
  {
    id: "chefs_surprise",
    emoji: "🎲",
    name: "Feeling Lucky",
    description: "Used Chef's Surprise to get a random dish",
  },
  {
    id: "fridge_scanner",
    emoji: "📷",
    name: "Tech Chef",
    description: "Scanned your fridge to detect ingredients",
  },
  {
    id: "meal_plan",
    emoji: "📅",
    name: "Meal Prepper",
    description: "Generated a full 7-day meal plan",
  },
  {
    id: "all_personalities",
    emoji: "👨‍🍳",
    name: "Method Actor",
    description: "Tried all 5 chef personality modes",
  },
  {
    id: "cuisine_explorer",
    emoji: "🌍",
    name: "World Explorer",
    description: "Filtered recipes by 3 or more different cuisines",
  },
  {
    id: "speed_demon",
    emoji: "⚡",
    name: "Speed Demon",
    description: "Used emergency mode for quick meals",
  },
  {
    id: "budget_chef",
    emoji: "💰",
    name: "Budget Chef",
    description: "Generated recipes in Budget Mode",
  },
];

export function getInitialAchievements(): Achievement[] {
  const stored = localStorage.getItem("chefmind_achievements");
  if (stored) {
    try {
      return JSON.parse(stored) as Achievement[];
    } catch {
      // fall through
    }
  }
  return ACHIEVEMENT_DEFINITIONS.map((def) => ({ ...def, unlocked: false }));
}

export function saveAchievementsToStorage(achievements: Achievement[]): void {
  localStorage.setItem("chefmind_achievements", JSON.stringify(achievements));
}

export function unlockAchievement(
  achievements: Achievement[],
  id: string,
): { updated: Achievement[]; newlyUnlocked: Achievement | null } {
  const existing = achievements.find((a) => a.id === id);
  if (!existing || existing.unlocked) {
    return { updated: achievements, newlyUnlocked: null };
  }
  const updated = achievements.map((a) =>
    a.id === id
      ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
      : a,
  );
  saveAchievementsToStorage(updated);
  return { updated, newlyUnlocked: updated.find((a) => a.id === id)! };
}

import { type Recipe, recipeDatabase } from "../data/recipeDatabase";

export interface ScoredRecipe extends Recipe {
  matchScore: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export interface MatchOptions {
  cuisine?: string;
  maxTime?: number;
  maxBudget?: number;
  limit?: number;
  emergency?: boolean;
}

export function matchRecipes(
  userIngredients: string[],
  options: MatchOptions = {},
): ScoredRecipe[] {
  const { cuisine, maxTime, maxBudget, limit = 100, emergency } = options;
  const normalized = userIngredients.map((i) => i.toLowerCase().trim());

  let pool = recipeDatabase;

  if (cuisine && cuisine !== "All") {
    pool = pool.filter((r) => r.cuisine === cuisine);
  }

  if (emergency || maxTime) {
    const t = emergency ? 20 : maxTime!;
    pool = pool.filter((r) => r.cookTime <= t);
  }

  if (maxBudget && maxBudget > 0) {
    pool = pool.filter((r) => r.estimatedCost <= maxBudget);
  }

  const scored: ScoredRecipe[] = pool.map((recipe) => {
    const matched = recipe.ingredients.filter((ri) =>
      normalized.some(
        (ui) => ui.includes(ri.toLowerCase()) || ri.toLowerCase().includes(ui),
      ),
    );
    const missing = recipe.ingredients.filter(
      (ri) =>
        !normalized.some(
          (ui) =>
            ui.includes(ri.toLowerCase()) || ri.toLowerCase().includes(ui),
        ),
    );
    const score =
      recipe.ingredients.length > 0
        ? matched.length / recipe.ingredients.length
        : 0;

    return {
      ...recipe,
      matchScore: score,
      matchedIngredients: matched,
      missingIngredients: missing,
    };
  });

  if (normalized.length === 0) {
    return scored.sort(() => Math.random() - 0.5).slice(0, limit);
  }

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

export function getRandomRecipe(userIngredients: string[]): ScoredRecipe {
  const pool =
    userIngredients.length > 0
      ? matchRecipes(userIngredients, { limit: 20 })
      : recipeDatabase.map((r) => ({
          ...r,
          matchScore: Math.random(),
          matchedIngredients: [],
          missingIngredients: r.ingredients,
        }));
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

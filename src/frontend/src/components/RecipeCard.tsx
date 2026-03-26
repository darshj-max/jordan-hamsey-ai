import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Heart,
  Timer,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { applyPersonalityToSteps } from "../utils/personalityEngine";
import type { ScoredRecipe } from "../utils/recipeEngine";

interface Props {
  recipe: ScoredRecipe;
  index: number;
  showBudget?: boolean;
  showEmergency?: boolean;
  onStartTimer?: (seconds: number, label: string) => void;
}

const DIFFICULTY_CONFIG = {
  Easy: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "oklch(0.65 0.14 145)",
  },
  Medium: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "oklch(0.72 0.16 68)",
  },
  Hard: {
    badge: "bg-red-50 text-red-700 border-red-200",
    accent: "oklch(0.60 0.18 25)",
  },
};

const CUISINE_COLORS: Record<string, string> = {
  Italian: "bg-green-50 text-green-700",
  Indian: "bg-orange-50 text-orange-700",
  Mexican: "bg-red-50 text-red-700",
  Japanese: "bg-pink-50 text-pink-700",
  Thai: "bg-purple-50 text-purple-700",
  Mediterranean: "bg-blue-50 text-blue-700",
  American: "bg-sky-50 text-sky-700",
  French: "bg-indigo-50 text-indigo-700",
  Chinese: "bg-rose-50 text-rose-700",
  "Middle Eastern": "bg-amber-50 text-amber-700",
};

export default function RecipeCard({
  recipe,
  index,
  showBudget,
  showEmergency,
  onStartTimer,
}: Props) {
  const { savedRecipes, saveRecipe, unsaveRecipe } = useApp();
  const { personality } = useApp();
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [nutritionVisible, setNutritionVisible] = useState(false);

  const isSaved = savedRecipes.some((r) => r.id === recipe.id);
  const styledSteps = applyPersonalityToSteps(recipe.steps, personality);
  const matchPct = Math.round(recipe.matchScore * 100);

  const handleSaveToggle = () => {
    if (isSaved) unsaveRecipe(recipe.id);
    else saveRecipe(recipe);
  };

  const hasIngredientData = recipe.matchedIngredients.length > 0;
  const difficultyConfig =
    DIFFICULTY_CONFIG[recipe.difficulty as keyof typeof DIFFICULTY_CONFIG] ??
    DIFFICULTY_CONFIG.Easy;

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden card-hover flex flex-col border border-border"
      style={{
        boxShadow: "0 2px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      }}
      data-ocid={`recipe.item.${index}`}
    >
      {/* Difficulty accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: difficultyConfig.accent }}
      />

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground text-xl leading-tight line-clamp-2 mb-2">
              {recipe.title}
            </h3>
            <p className="font-sans text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveToggle}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 active:scale-[0.88] ${
              isSaved
                ? "text-brand bg-brand/10"
                : "text-muted-foreground/50 hover:text-brand hover:bg-brand/8"
            }`}
            data-ocid={`recipe.toggle.${index}`}
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-200 ${
                isSaved ? "scale-110" : ""
              }`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge
            className={`text-xs border font-sans font-medium ${
              difficultyConfig.badge
            }`}
          >
            {recipe.difficulty}
          </Badge>
          <Badge
            className={`text-xs border-0 font-sans font-medium ${
              CUISINE_COLORS[recipe.cuisine] ??
              "bg-muted/60 text-muted-foreground"
            }`}
          >
            {recipe.cuisine}
          </Badge>
          <Badge className="text-xs bg-muted/50 text-muted-foreground border-0 flex items-center gap-1 font-sans">
            <Clock className="h-3 w-3" />
            {recipe.cookTime} min
          </Badge>
          {showEmergency && recipe.cookTime <= 20 && (
            <Badge className="text-xs bg-brand/10 text-brand border-brand/20 border flex items-center gap-1 font-sans">
              <Zap className="h-3 w-3" />
              Quick
            </Badge>
          )}
          {showBudget && (
            <Badge className="text-xs bg-emerald-50 text-emerald-700 border-0 flex items-center gap-1 font-sans">
              <DollarSign className="h-3 w-3" />
              ~${recipe.estimatedCost.toFixed(2)}
            </Badge>
          )}
          {matchPct > 0 && (
            <Badge className="text-xs bg-brand/8 text-brand border-0 font-sans font-semibold">
              {matchPct}% match
            </Badge>
          )}
        </div>

        {/* Ingredients */}
        {hasIngredientData && (
          <div className="space-y-3 pt-1">
            {recipe.matchedIngredients.length > 0 && (
              <div>
                <p className="label-caps text-emerald-600 mb-1.5">You have</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.matchedIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-sans capitalize border border-emerald-100"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {recipe.missingIngredients.length > 0 && (
              <div>
                <p className="label-caps text-muted-foreground mb-1.5">
                  Still need
                </p>
                <div className="flex flex-wrap gap-1">
                  {recipe.missingIngredients.slice(0, 4).map((ing) => (
                    <span
                      key={ing}
                      className="text-xs px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-full font-sans capitalize border border-border"
                    >
                      {ing}
                    </span>
                  ))}
                  {recipe.missingIngredients.length > 4 && (
                    <span className="text-xs text-muted-foreground/60 font-sans self-center pl-1">
                      +{recipe.missingIngredients.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Substitutions */}
      {recipe.substitutions.length > 0 && (
        <div className="px-6 pb-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
            <p className="label-caps text-amber-600 mb-1.5">
              Substitution tips
            </p>
            {recipe.substitutions.slice(0, 2).map((s) => (
              <p
                key={s}
                className="text-xs font-sans text-amber-800/80 leading-relaxed mt-1"
              >
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Actions — visible outlined buttons */}
      <div className="px-5 pb-5 flex gap-2 mt-auto border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setNutritionVisible((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-sans font-medium border transition-all duration-200 active:scale-[0.97] ${
            nutritionVisible
              ? "bg-muted text-foreground border-border"
              : "bg-white text-muted-foreground border-border hover:text-foreground hover:bg-muted/60 hover:border-foreground/20"
          }`}
          data-ocid={`recipe.toggle.${index}`}
        >
          Nutrition
          {nutritionVisible ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setStepsExpanded((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-sans font-semibold border transition-all duration-200 active:scale-[0.97] ${
            stepsExpanded
              ? "bg-brand text-white border-brand"
              : "bg-brand/6 text-brand border-brand/25 hover:bg-brand/12 hover:border-brand/40"
          }`}
          data-ocid={`recipe.button.${index}`}
        >
          {stepsExpanded ? "Hide Steps" : "View Steps"}
          {stepsExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Nutrition Panel */}
      {nutritionVisible && recipe.nutrition && (
        <div className="px-5 pb-5">
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <p className="label-caps mb-3">Nutrition per serving</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-5">
              {(
                [
                  ["Calories", recipe.nutrition.calories, "kcal"],
                  ["Protein", recipe.nutrition.protein, "g"],
                  ["Carbs", recipe.nutrition.carbs, "g"],
                  ["Fat", recipe.nutrition.fat, "g"],
                ] as [string, number, string][]
              ).map(([label, value, unit]) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-sans text-xs text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-sans text-xs font-semibold text-foreground">
                      {value}
                      {unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          100,
                          (value / (label === "Calories" ? 800 : 80)) * 100,
                        )}%`,
                        background: difficultyConfig.accent,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      {stepsExpanded && (
        <div className="px-5 pb-6">
          <p className="label-caps mb-3">Instructions</p>
          <ol className="space-y-4">
            {styledSteps.map((step, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: steps are static
              <li key={i} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white font-sans mt-0.5"
                  style={{ background: "oklch(0.65 0.18 32)" }}
                >
                  {i + 1}
                </span>
                <p className="font-sans text-sm text-foreground/90 leading-relaxed flex-1">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          {recipe.cookTime && onStartTimer && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartTimer(recipe.cookTime * 60, recipe.title)}
              className="mt-4 text-xs rounded-xl border-brand/25 text-brand bg-brand/5 hover:bg-brand/10 transition-all duration-200 active:scale-[0.97] font-sans"
            >
              <Timer className="h-3.5 w-3.5 mr-1.5" />
              Start {recipe.cookTime}min Timer
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

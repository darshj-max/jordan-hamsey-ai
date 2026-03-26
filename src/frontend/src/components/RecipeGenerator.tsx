import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Dices, DollarSign, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { foodFacts } from "../data/facts";
import { chefQuotes } from "../data/quotes";
import FridgeScanner from "./FridgeScanner";
import IngredientInput from "./IngredientInput";
import RecipeCard from "./RecipeCard";

const CUISINES = [
  "All",
  "Italian",
  "Indian",
  "Mexican",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "French",
  "Chinese",
  "Middle Eastern",
];

export default function RecipeGenerator() {
  const {
    generatedRecipes,
    surpriseRecipe,
    isLoading,
    generateRecipes,
    generateSurprise,
    selectedCuisine,
    setSelectedCuisine,
    budgetMode,
    setBudgetMode,
    emergencyMode,
    ingredients,
  } = useApp();

  const [showScanner, setShowScanner] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ingredientError, setIngredientError] = useState("");

  const [quote] = useState(
    () => chefQuotes[Math.floor(Math.random() * chefQuotes.length)],
  );
  const [fact] = useState(
    () => foodFacts[Math.floor(Math.random() * foodFacts.length)],
  );

  const handleGenerate = () => {
    if (ingredients.length === 0) {
      setIngredientError("Add at least one ingredient to generate recipes.");
      return;
    }
    setIngredientError("");
    generateRecipes(emergencyMode);
  };

  const handleBudgetToggle = () => {
    if (budgetMode.enabled) {
      setBudgetMode({ enabled: false, amount: 0 });
    } else {
      const amt = Number.parseFloat(budgetInput);
      setBudgetMode({
        enabled: !Number.isNaN(amt) && amt > 0,
        amount: !Number.isNaN(amt) ? amt : 15,
      });
    }
  };

  const showRecipes = generatedRecipes.length > 0 || surpriseRecipe !== null;

  return (
    <section className="pt-4">
      {/* Cuisine filter */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="label-caps">Cuisine</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
          {CUISINES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setSelectedCuisine(c)}
              data-ocid="recipe.tab"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-sans font-medium border transition-all duration-200 tracking-wide active:scale-[0.96] ${
                selectedCuisine === c
                  ? "bg-brand text-white border-brand"
                  : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-brand/30 hover:bg-brand/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main input panel */}
      <div
        className="bg-white rounded-2xl p-7 mb-5 border border-border"
        style={{
          boxShadow: "0 4px 32px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Panel heading */}
        <div className="mb-5">
          <h2 className="font-display text-xl text-foreground mb-0.5">
            What&apos;s in your kitchen?
          </h2>
          <p className="font-sans text-sm text-muted-foreground">
            Add your ingredients and we&apos;ll find every possible recipe
          </p>
        </div>

        <IngredientInput onScanFridge={() => setShowScanner(true)} />

        {/* Inline error */}
        {ingredientError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm font-sans text-brand/90 flex items-center gap-2"
            data-ocid="recipe.error_state"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block flex-shrink-0" />
            {ingredientError}
          </motion.p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 min-w-[180px] shimmer-hover text-white font-sans font-bold rounded-xl h-14 text-sm transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow-md"
            style={{ background: "oklch(0.38 0.09 160)" }}
            data-ocid="recipe.primary_button"
          >
            &#x1F373; Generate Recipes
          </Button>
          <Button
            onClick={generateSurprise}
            disabled={isLoading}
            variant="outline"
            className="border-border bg-white text-foreground hover:bg-muted/60 hover:border-brand/30 rounded-xl h-14 gap-2 font-sans text-sm transition-all duration-200 active:scale-[0.97]"
            data-ocid="recipe.secondary_button"
          >
            <Dices className="h-4 w-4" />
            Chef&apos;s Surprise
          </Button>
        </div>
      </div>

      {/* Advanced options collapsible */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-2 label-caps hover:text-foreground/70 transition-colors"
          data-ocid="recipe.toggle"
        >
          {showAdvanced ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          Advanced Options
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-border rounded-2xl p-5 mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="label-caps">Budget Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Max budget ($)"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="h-9 w-32 text-xs border-border text-foreground placeholder:text-muted-foreground rounded-xl font-sans bg-muted/40"
                    data-ocid="recipe.input"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleBudgetToggle}
                    className={`h-9 text-xs rounded-xl border font-sans transition-all duration-200 active:scale-[0.97] ${
                      budgetMode.enabled
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-ocid="recipe.toggle"
                  >
                    {budgetMode.enabled
                      ? `Budget: $${budgetMode.amount}`
                      : "Set Budget"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20" data-ocid="recipe.loading_state">
          <div className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-brand/15 border-t-brand animate-spin" />
          <p className="font-display text-lg text-foreground/70 mb-1">
            Crafting your recipes
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Finding everything that matches your pantry&hellip;
          </p>
        </div>
      )}

      <AnimatePresence>
        {!isLoading && showRecipes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Surprise */}
            {surpriseRecipe && (
              <div className="mb-10">
                <div className="mb-5">
                  <h2 className="font-display text-2xl text-foreground mb-1">
                    Chef&apos;s Surprise
                  </h2>
                  <p className="font-sans text-sm text-muted-foreground">
                    Your mystery dish has been revealed
                  </p>
                </div>
                <RecipeCard
                  recipe={surpriseRecipe}
                  index={1}
                  showBudget={budgetMode.enabled}
                  showEmergency={emergencyMode}
                />
              </div>
            )}

            {/* Grid */}
            {generatedRecipes.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-6">
                  <p className="font-sans text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold text-base">
                      {generatedRecipes.length}
                    </span>{" "}
                    recipes found
                    {ingredients.length > 0 &&
                      ` · ${ingredients.length} ingredients matched`}
                  </p>
                </div>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  data-ocid="recipe.list"
                >
                  {generatedRecipes.map((recipe, i) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(i * 0.05, 0.4),
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        index={i + 1}
                        showBudget={budgetMode.enabled}
                        showEmergency={emergencyMode}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-border rounded-2xl p-8 mb-4"
              style={{
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                borderLeft: "4px solid oklch(0.38 0.09 160)",
              }}
            >
              <blockquote className="font-display italic text-xl text-foreground/90 mb-4 leading-snug">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p
                className="font-sans text-sm font-semibold"
                style={{ color: "oklch(0.32 0.09 160)" }}
              >
                &mdash; {quote.author}
              </p>
            </motion.div>

            {/* Fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="bg-brand/5 border border-brand/15 rounded-2xl p-5 flex gap-4 items-start mb-4"
            >
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-brand/15 flex items-center justify-center mt-0.5">
                <span className="text-brand text-sm font-bold">!</span>
              </div>
              <div>
                <p className="label-caps text-brand mb-2">Food Fact</p>
                <p className="font-sans text-sm text-foreground/85 leading-relaxed">
                  {fact}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fridge Scanner */}
      {showScanner && <FridgeScanner onClose={() => setShowScanner(false)} />}
    </section>
  );
}

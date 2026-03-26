import { Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import RecipeCard from "./RecipeCard";

export default function SavedRecipes() {
  const { savedRecipes } = useApp();

  return (
    <section className="pt-28 pb-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Saved Recipes
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          {savedRecipes.length > 0
            ? `${savedRecipes.length} recipe${savedRecipes.length > 1 ? "s" : ""} saved`
            : "Your favourite recipes will appear here"}
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div
          className="text-center py-24 bg-white rounded-2xl border border-border"
          data-ocid="saved.empty_state"
        >
          <Bookmark className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-3">
            Nothing saved yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Generate recipes and press the heart icon to save your favourites
            here.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="saved.list"
        >
          {savedRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.07,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <RecipeCard recipe={recipe} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

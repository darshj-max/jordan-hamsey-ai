import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import RecipeGenerator from "./RecipeGenerator";

const FOOD_TAGS = [
  { label: "Pasta", emoji: "🍝" },
  { label: "Curry", emoji: "🥘" },
  { label: "Salads", emoji: "🥗" },
  { label: "Asian", emoji: "🍱" },
  { label: "Grills", emoji: "🥩" },
  { label: "Soups", emoji: "🍲" },
];

export default function HeroSection() {
  const { generatedRecipes, surpriseRecipe, isLoading } = useApp();
  const hasResults =
    generatedRecipes.length > 0 || surpriseRecipe !== null || isLoading;

  return (
    <div>
      {!hasResults && (
        <div className="relative text-center pt-36 pb-16 px-4 overflow-hidden">
          {/* Warm forest green radial — cozy and inviting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 20%, oklch(0.38 0.09 160 / 0.07) 0%, oklch(0.72 0.10 85 / 0.04) 50%, transparent 75%)",
            }}
          />
          {/* Subtle warm bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, oklch(0.97 0.006 80 / 0.6))",
            }}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full bg-brand/8 border border-brand/15">
              <span className="text-sm">&#x1F373;</span>
              <span
                className="font-sans text-xs font-semibold tracking-widest uppercase"
                style={{ color: "oklch(0.32 0.09 160)" }}
              >
                Intelligent Kitchen Companion
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] text-foreground mb-5 leading-[1.08] tracking-tight">
              Cook something
              <br />
              <em
                className="font-display"
                style={{
                  color: "oklch(0.38 0.09 160)",
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                }}
              >
                magnificent.
              </em>
            </h1>

            <p className="font-sans text-muted-foreground text-base md:text-lg max-w-[420px] mx-auto mt-5 leading-[1.75]">
              Tell Jordan Hamsey what&apos;s in your kitchen — it crafts recipes
              tailored to your ingredients, budget, and taste.
            </p>

            {/* Decorative food category pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mt-9"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              {FOOD_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-sans text-foreground/70 shadow-xs hover:border-brand/30 hover:text-brand/80 hover:bg-brand/4 transition-all duration-200 cursor-default"
                >
                  <span>{tag.emoji}</span>
                  {tag.label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      {hasResults && (
        <div className="pt-28 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-1.5">
              Your Recipes
            </h2>
            <p className="font-sans text-sm text-muted-foreground">
              Crafted to match your ingredients
            </p>
          </motion.div>
        </div>
      )}

      <RecipeGenerator />
    </div>
  );
}

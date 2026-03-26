import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const PREFERENCES = ["Healthy", "High Protein", "Vegetarian", "Budget"];

export default function MealPlanner() {
  const { mealPlan, generateMealPlan, addToast } = useApp();
  const [selectedPref, setSelectedPref] = useState("Healthy");

  const handleExport = () => {
    if (!mealPlan) return;
    const text = mealPlan
      .map(
        (day) =>
          `${day.day}:\n  Breakfast: ${day.breakfast.name} (${day.breakfast.time} min)\n  Lunch: ${day.lunch.name} (${day.lunch.time} min)\n  Dinner: ${day.dinner.name} (${day.dinner.time} min)`,
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    addToast("Meal plan copied to clipboard!", "success", "📅");
  };

  return (
    <section className="pt-28 pb-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Meal Planner
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          Plan your entire week with personalised meal suggestions
        </p>
      </div>

      <div
        className="bg-white rounded-2xl p-6 mb-7 border border-border"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      >
        <p className="font-sans text-sm font-medium text-foreground mb-4">
          Dietary Preference
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {PREFERENCES.map((pref) => (
            <button
              type="button"
              key={pref}
              onClick={() => setSelectedPref(pref)}
              data-ocid="planner.tab"
              className={`px-5 py-2 rounded-xl text-sm font-sans font-semibold border transition-all duration-200 active:scale-[0.97] ${
                selectedPref === pref
                  ? "bg-brand text-white border-brand shadow-coral"
                  : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-brand/30 hover:bg-brand/5"
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
        <Button
          onClick={() => generateMealPlan(selectedPref)}
          className="w-full shimmer-hover text-white font-sans font-bold rounded-xl h-12 text-sm transition-all duration-200 active:scale-[0.97]"
          style={{ background: "oklch(0.65 0.18 32)" }}
          data-ocid="planner.primary_button"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Generate Week Plan
        </Button>
      </div>

      <AnimatePresence>
        {mealPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-xl text-foreground">
                7-Day Plan &mdash; {selectedPref}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl text-xs font-sans transition-all duration-200"
                data-ocid="planner.button"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
            </div>

            {/* Desktop grid */}
            <div
              className="hidden md:grid grid-cols-7 gap-2 mb-4"
              data-ocid="planner.table"
            >
              {mealPlan.map((day) => (
                <div
                  key={day.day}
                  className="bg-white rounded-xl p-3 border border-border"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
                >
                  <p className="font-display text-xs font-semibold text-brand mb-2.5 text-center">
                    {day.day.slice(0, 3)}
                  </p>
                  {[
                    { label: "B", meal: day.breakfast },
                    { label: "L", meal: day.lunch },
                    { label: "D", meal: day.dinner },
                  ].map(({ label, meal }) => (
                    <div key={label} className="mb-2.5 last:mb-0">
                      <p className="label-caps text-muted-foreground/60 mb-0.5">
                        {label}
                      </p>
                      <p className="font-sans text-xs text-foreground font-medium leading-tight">
                        {meal.name}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground/60">
                        {meal.time}m
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile list */}
            <div className="md:hidden space-y-3">
              {mealPlan.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl p-4 border border-border"
                  data-ocid={`planner.item.${i + 1}`}
                >
                  <p className="font-display text-sm font-semibold text-brand mb-3">
                    {day.day}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Breakfast", meal: day.breakfast },
                      { label: "Lunch", meal: day.lunch },
                      { label: "Dinner", meal: day.dinner },
                    ].map(({ label, meal }) => (
                      <div key={label} className="bg-muted/40 rounded-lg p-2.5">
                        <p className="label-caps text-muted-foreground/60 mb-1">
                          {label}
                        </p>
                        <p className="font-sans text-xs text-foreground font-medium leading-tight">
                          {meal.name}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground/60 mt-0.5">
                          {meal.time} min
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!mealPlan && (
        <div
          className="text-center py-20 bg-white rounded-2xl border border-border"
          data-ocid="planner.empty_state"
        >
          <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display text-xl text-foreground mb-2">
            No meal plan yet
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            Select a preference and generate your weekly plan above.
          </p>
        </div>
      )}
    </section>
  );
}

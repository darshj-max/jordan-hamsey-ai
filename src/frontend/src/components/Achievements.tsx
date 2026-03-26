import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { ACHIEVEMENT_DEFINITIONS } from "../utils/achievementEngine";

export default function Achievements() {
  const { achievements, recipesGeneratedCount } = useApp();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section className="pt-28 pb-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Achievements
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          <span className="text-brand font-semibold">{unlockedCount}</span>
          {" / "}
          {achievements.length} unlocked
        </p>
      </div>

      {/* Progress */}
      <div
        className="bg-white rounded-2xl p-6 mb-8 border border-border"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      >
        <div className="flex justify-between items-baseline mb-3">
          <span className="font-sans text-sm font-medium text-foreground">
            Overall Progress
          </span>
          <span className="font-display text-2xl text-brand">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "oklch(0.65 0.18 32)" }}
            initial={{ width: 0 }}
            animate={{
              width: `${(unlockedCount / achievements.length) * 100}%`,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="font-sans text-xs text-muted-foreground mt-3">
          Recipes crafted:{" "}
          <span className="text-foreground font-semibold">
            {recipesGeneratedCount}
          </span>
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="achievements.list"
      >
        {achievements.map((achievement, i) => {
          const def = ACHIEVEMENT_DEFINITIONS.find(
            (d) => d.id === achievement.id,
          );
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`bg-white rounded-2xl p-5 relative overflow-hidden border card-hover transition-all duration-200 ${
                achievement.unlocked
                  ? "border-brand/20"
                  : "border-border opacity-60"
              }`}
              style={{
                boxShadow: achievement.unlocked
                  ? "0 2px 20px rgba(0,0,0,0.06)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
              data-ocid={`achievements.item.${i + 1}`}
            >
              {achievement.unlocked && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, oklch(0.65 0.18 32 / 0.05) 0%, transparent 60%)",
                  }}
                />
              )}
              <div className="flex items-start gap-3.5">
                <div
                  className={`text-2xl flex-shrink-0 p-2.5 rounded-xl ${
                    achievement.unlocked
                      ? "bg-brand/8"
                      : "bg-muted/60 grayscale"
                  }`}
                >
                  {def?.emoji ?? "🏆"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-display text-sm font-semibold ${
                        achievement.unlocked
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    {achievement.unlocked && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-sans font-semibold"
                        style={{
                          background: "oklch(0.65 0.18 32 / 0.12)",
                          color: "oklch(0.50 0.18 32)",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="font-sans text-xs text-muted-foreground/60 mt-1.5">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!achievement.unlocked && (
                    <p className="font-sans text-xs text-muted-foreground/40 mt-1.5">
                      Locked
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

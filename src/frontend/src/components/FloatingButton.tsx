import { Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FloatingButton() {
  const { setActiveSection, setEmergencyMode, generateRecipes } = useApp();

  const handleClick = () => {
    setEmergencyMode(true);
    setActiveSection("home");
    setTimeout(() => generateRecipes(true), 100);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-ocid="floating.button"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 text-white font-bold rounded-2xl shadow-coral hover:scale-105 active:scale-[0.97] transition-all duration-200 text-sm"
      style={{
        background: "oklch(0.65 0.18 32)",
        boxShadow: "0 8px 32px oklch(0.65 0.18 32 / 0.40)",
      }}
      title="I'm Hungry Now!"
    >
      <Zap className="h-4 w-4" />
      <span className="hidden sm:inline">I&apos;m Hungry Now 🔥</span>
      <span className="sm:hidden">🔥</span>
    </button>
  );
}

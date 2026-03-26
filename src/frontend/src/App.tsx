import Achievements from "./components/Achievements";
import CookingTools from "./components/CookingTools";
import FloatingButton from "./components/FloatingButton";
import HeroSection from "./components/HeroSection";
import LoadingOverlay from "./components/LoadingOverlay";
import MealPlanner from "./components/MealPlanner";
import Navbar from "./components/Navbar";
import SavedRecipes from "./components/SavedRecipes";
import ToastContainer from "./components/ToastContainer";
import { AppProvider, useApp } from "./context/AppContext";

function AppContent() {
  const { activeSection, isLoading } = useApp();

  const sections: Record<string, React.ReactNode> = {
    home: <HeroSection />,
    saved: <SavedRecipes />,
    planner: <MealPlanner />,
    tools: <CookingTools />,
    achievements: <Achievements />,
  };

  return (
    <div className="min-h-screen text-foreground bg-background">
      {isLoading && <LoadingOverlay />}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        {sections[activeSection] ?? sections.home}
      </main>
      <FloatingButton />
      <ToastContainer />

      <footer className="border-t border-border mt-16 py-10 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

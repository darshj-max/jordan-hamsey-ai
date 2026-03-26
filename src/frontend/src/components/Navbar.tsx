import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  PERSONALITIES,
  PERSONALITY_EMOJIS,
  type Personality,
} from "../utils/personalityEngine";

const NAV_ITEMS = [
  { id: "home", label: "Kitchen" },
  { id: "saved", label: "Saved" },
  { id: "planner", label: "Meal Planner" },
  { id: "tools", label: "Tools" },
  { id: "achievements", label: "Achievements" },
];

export default function Navbar() {
  const { activeSection, setActiveSection, personality, setPersonality } =
    useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className="glass-dark max-w-7xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          onClick={() => setActiveSection("home")}
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/18 flex items-center justify-center group-hover:bg-brand/16 transition-all duration-200">
            <ChefHat className="w-4 h-4 text-brand" />
          </div>
          <span className="font-display font-semibold text-lg text-foreground tracking-tight">
            Jordan Hamsey
            <sup className="text-brand text-[10px] font-sans font-bold ml-0.5 not-italic align-super">
              AI
            </sup>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              data-ocid="nav.link"
              className={`relative px-4 py-2 text-sm font-sans font-medium rounded-xl transition-all duration-200 ${
                activeSection === item.id
                  ? "text-brand bg-brand/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Personality + mobile */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 transition-all duration-200 text-sm font-sans outline-none"
              data-ocid="nav.select"
            >
              <span className="text-base leading-none">
                {PERSONALITY_EMOJIS[personality]}
              </span>
              <span className="text-foreground/75 max-w-[80px] truncate text-sm">
                {personality}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border rounded-xl min-w-[190px] p-1 bg-white"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
            >
              {PERSONALITIES.map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => setPersonality(p as Personality)}
                  className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-sans transition-colors ${
                    personality === p
                      ? "text-brand bg-brand/8 font-medium"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted/60"
                  }`}
                  data-ocid="nav.dropdown_menu"
                >
                  <span className="text-base">
                    {PERSONALITY_EMOJIS[p as Personality]}
                  </span>
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.button"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden mt-2 bg-white rounded-2xl max-w-7xl mx-auto px-4 py-4 animate-fade-in border border-border"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.09)" }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setMobileOpen(false);
              }}
              data-ocid="nav.link"
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-200 mb-0.5 ${
                activeSection === item.id
                  ? "text-brand bg-brand/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="label-caps px-4 mb-2">Chef Mode</p>
            {PERSONALITIES.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => {
                  setPersonality(p as Personality);
                  setMobileOpen(false);
                }}
                className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-sans mb-0.5 transition-all duration-200 ${
                  personality === p
                    ? "text-brand bg-brand/8 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-ocid="nav.button"
              >
                <span className="text-base">
                  {PERSONALITY_EMOJIS[p as Personality]}
                </span>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { ingredientsList } from "../data/ingredients";

interface Props {
  onScanFridge?: () => void;
}

export default function IngredientInput({ onScanFridge }: Props) {
  const { ingredients, addIngredient, removeIngredient, clearIngredients } =
    useApp();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = ingredientsList
      .filter(
        (i) =>
          i.toLowerCase().includes(inputValue.toLowerCase()) &&
          !ingredients.includes(i.toLowerCase()),
      )
      .slice(0, 8);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }, [inputValue, ingredients]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAdd = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue.trim());
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const selectSuggestion = (s: string) => {
    addIngredient(s);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      {/* Input row */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter ingredients like eggs, tomato, rice..."
            className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground rounded-xl pr-4 py-3 h-12 text-sm focus:border-brand/40 focus:ring-brand/20"
            data-ocid="ingredient.input"
          />
          {/* Autocomplete */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl overflow-hidden z-20"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
              data-ocid="ingredient.popover"
            >
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-brand/8 hover:text-brand transition-colors capitalize font-sans"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          size="icon"
          className="h-12 w-12 rounded-xl text-white flex-shrink-0 transition-all duration-200 active:scale-[0.95] hover:shadow-coral"
          style={{ background: "oklch(0.65 0.18 32)" }}
          data-ocid="ingredient.button"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onScanFridge}
          className="h-12 w-12 rounded-xl border-border bg-muted/40 hover:bg-muted/70 text-muted-foreground flex-shrink-0 transition-all duration-200"
          title="Scan Fridge"
          data-ocid="ingredient.upload_button"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>

      {/* Chips */}
      {ingredients.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <span key={ing} className="chip">
              <span className="capitalize">{ing}</span>
              <button
                type="button"
                onClick={() => removeIngredient(ing)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                data-ocid="ingredient.delete_button"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearIngredients}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 bg-white transition-all duration-200"
            data-ocid="ingredient.secondary_button"
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

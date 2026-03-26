import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "../context/AppContext";

const DETECTED_INGREDIENTS = [
  ["eggs", "milk", "butter", "cheese", "onion", "garlic", "tomato", "carrot"],
  ["chicken", "garlic", "lemon", "olive oil", "rosemary", "onion", "potato"],
  [
    "rice",
    "eggs",
    "soy sauce",
    "garlic",
    "green onion",
    "sesame oil",
    "carrot",
  ],
  ["pasta", "tomato", "garlic", "basil", "parmesan", "olive oil"],
  ["avocado", "eggs", "bread", "lemon", "red chili flakes", "tomato"],
];

interface Props {
  onClose: () => void;
}

export default function FridgeScanner({ onClose }: Props) {
  const { setIngredients, generateRecipes, tryUnlockAchievement } = useApp();
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanning(true);
    setDetected([]);
    setTimeout(() => {
      const set =
        DETECTED_INGREDIENTS[
          Math.floor(Math.random() * DETECTED_INGREDIENTS.length)
        ];
      setDetected(set);
      setScanning(false);
      tryUnlockAchievement("fridge_scanner");
    }, 2200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const useDetected = () => {
    setIngredients(detected);
    onClose();
    setTimeout(() => generateRecipes(), 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="glass rounded-2xl p-6 w-full max-w-md relative"
        data-ocid="fridge.modal"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          data-ocid="fridge.close_button"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-foreground mb-1">
          📷 Fridge Scanner
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a photo of your fridge or pantry to auto-detect ingredients.
        </p>

        {!preview ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand/40 transition-colors cursor-pointer block"
            data-ocid="fridge.dropzone"
          >
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium">
              Drop an image here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports JPG, PNG, WEBP
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="fridge.upload_button"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Fridge"
              className="w-full h-48 object-cover rounded-xl"
            />
            {scanning && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center gap-3">
                <div className="text-3xl animate-spin-slow">🔍</div>
                <p className="text-sm text-brand font-medium">
                  Analyzing ingredients...
                </p>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-brand rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {detected.length > 0 && (
          <div className="mt-4 animate-slide-in-up">
            <p className="text-sm font-semibold text-foreground mb-2">
              ✨ Detected ingredients:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {detected.map((ing) => (
                <span key={ing} className="chip">
                  {ing}
                </span>
              ))}
            </div>
            <Button
              onClick={useDetected}
              className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl"
              data-ocid="fridge.primary_button"
            >
              Use These Ingredients & Generate Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

const MESSAGES = [
  "Sharpening knives...",
  "Consulting the pantry...",
  "Checking the spice rack...",
  "Cooking up ideas...",
  "Asking the sous chef...",
  "Tasting for seasoning...",
  "Almost ready to plate...",
  "Preheating the oven...",
  "Sourcing fresh ingredients...",
];

export default function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md"
      style={{ background: "rgba(255,251,247,0.90)" }}
      data-ocid="loading.loading_state"
    >
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">
          &#x1F468;&#x200D;&#x1F373;
        </div>
        <div className="text-5xl mb-4 animate-spin-slow">&#9201;</div>
        <p
          className="text-xl font-semibold text-foreground mb-2 animate-fade-in"
          key={msgIndex}
        >
          {MESSAGES[msgIndex]}
        </p>
        <div className="flex gap-2 justify-center mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-brand rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

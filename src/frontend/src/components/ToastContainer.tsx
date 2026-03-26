import { CheckCircle, Info, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "../context/AppContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-emerald-600" />,
    achievement: <Star className="h-4 w-4 text-brand" />,
    info: <Info className="h-4 w-4 text-blue-600" />,
    error: <X className="h-4 w-4 text-destructive" />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    achievement: "bg-brand/8 border-brand/20",
    info: "bg-blue-50 border-blue-200",
    error: "bg-red-50 border-red-200",
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`rounded-xl px-4 py-3 border flex items-center gap-3 pointer-events-auto ${
              bgColors[toast.type]
            }`}
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
            data-ocid="toast.toast"
          >
            {toast.emoji ? (
              <span className="text-lg flex-shrink-0">{toast.emoji}</span>
            ) : (
              <span className="flex-shrink-0">{icons[toast.type]}</span>
            )}
            <p className="text-sm text-foreground flex-1 leading-snug font-sans">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
              data-ocid="toast.close_button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

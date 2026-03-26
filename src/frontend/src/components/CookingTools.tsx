import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { foodFacts } from "../data/facts";
import { cookingTips } from "../data/tips";

interface TimerInstance {
  id: string;
  label: string;
  totalSeconds: number;
  remaining: number;
  running: boolean;
  finished: boolean;
}

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {
    // Audio not supported
  }
}

function TimerRing({ remaining, total }: { remaining: number; total: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? remaining / total : 0;
  const dashoffset = circ * (1 - progress);
  return (
    <svg
      width="120"
      height="120"
      className="rotate-[-90deg]"
      aria-hidden="true"
      role="img"
    >
      <circle
        cx="60"
        cy="60"
        r={r}
        strokeWidth="5"
        fill="none"
        className="timer-ring-bg"
      />
      <circle
        cx="60"
        cy="60"
        r={r}
        strokeWidth="5"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={dashoffset}
        className="timer-ring-progress"
      />
    </svg>
  );
}

function TimerCard({
  timer,
  onToggle,
  onReset,
  onDelete,
}: {
  timer: TimerInstance;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const mins = Math.floor(timer.remaining / 60);
  const secs = timer.remaining % 60;
  return (
    <div
      className={`bg-white rounded-2xl p-5 relative border transition-all duration-200 ${
        timer.finished ? "border-brand/30" : "border-border"
      }`}
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      <button
        type="button"
        onClick={() => onDelete(timer.id)}
        className="absolute top-4 right-4 text-muted-foreground/50 hover:text-destructive transition-colors"
        data-ocid="tools.delete_button"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <p className="font-sans text-xs text-muted-foreground/70 mb-3 pr-7 truncate">
        {timer.label}
      </p>
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <TimerRing remaining={timer.remaining} total={timer.totalSeconds} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-lg font-bold font-mono ${
                timer.finished ? "text-brand" : "text-foreground"
              }`}
            >
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={() => onToggle(timer.id)}
            className={`rounded-xl text-xs font-sans transition-all duration-200 active:scale-[0.97] ${
              timer.running
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                : "text-white"
            }`}
            style={!timer.running ? { background: "oklch(0.65 0.18 32)" } : {}}
            data-ocid="tools.button"
          >
            {timer.running ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Start
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onReset(timer.id)}
            className="rounded-xl text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            data-ocid="tools.button"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      {timer.finished && (
        <p className="font-sans text-xs text-brand font-semibold mt-3 animate-pulse">
          Timer complete!
        </p>
      )}
    </div>
  );
}

function TimerSection() {
  const [timers, setTimers] = useState<TimerInstance[]>([]);
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [label, setLabel] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setTimers((prev) => {
      let changed = false;
      const next = prev.map((t) => {
        if (!t.running || t.remaining <= 0) return t;
        const r = t.remaining - 1;
        if (r <= 0 && !t.finished) {
          beep();
          changed = true;
          return { ...t, remaining: 0, running: false, finished: true };
        }
        return { ...t, remaining: r };
      });
      return changed ? [...next] : next;
    });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const addTimer = () => {
    const m = Number.parseInt(minutes) || 0;
    const s = Number.parseInt(seconds) || 0;
    const total = m * 60 + s;
    if (total <= 0) return;
    setTimers((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        label: label || `Timer ${prev.length + 1}`,
        totalSeconds: total,
        remaining: total,
        running: false,
        finished: false,
      },
    ]);
    setLabel("");
  };

  const toggleTimer = (id: string) =>
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, running: !t.running, finished: false } : t,
      ),
    );
  const resetTimer = (id: string) =>
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remaining: t.totalSeconds, running: false, finished: false }
          : t,
      ),
    );
  const deleteTimer = (id: string) =>
    setTimers((prev) => prev.filter((t) => t.id !== id));

  return (
    <div>
      <h2 className="font-display text-xl text-foreground mb-5">
        Cooking Timers
      </h2>
      <div
        className="bg-white rounded-2xl p-5 mb-4 border border-border"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="timer-minutes" className="label-caps block mb-1.5">
              Minutes
            </label>
            <Input
              id="timer-minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              min="0"
              max="99"
              className="border-border text-foreground h-10 text-sm rounded-xl font-sans bg-muted/40"
              data-ocid="tools.input"
            />
          </div>
          <div>
            <label htmlFor="timer-seconds" className="label-caps block mb-1.5">
              Seconds
            </label>
            <Input
              id="timer-seconds"
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              min="0"
              max="59"
              className="border-border text-foreground h-10 text-sm rounded-xl font-sans bg-muted/40"
              data-ocid="tools.input"
            />
          </div>
        </div>
        <Input
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTimer()}
          className="border-border text-foreground h-10 text-sm rounded-xl mb-3 placeholder:text-muted-foreground font-sans bg-muted/40"
          data-ocid="tools.input"
        />
        <Button
          onClick={addTimer}
          className="w-full text-white font-sans font-semibold rounded-xl h-11 text-sm transition-all duration-200 active:scale-[0.97] hover:shadow-coral"
          style={{ background: "oklch(0.65 0.18 32)" }}
          data-ocid="tools.primary_button"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Timer
        </Button>
      </div>
      {timers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {timers.map((t) => (
            <TimerCard
              key={t.id}
              timer={t}
              onToggle={toggleTimer}
              onReset={resetTimer}
              onDelete={deleteTimer}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-10 text-muted-foreground/50"
          data-ocid="tools.empty_state"
        >
          <p className="font-sans text-sm">Add a timer to get started</p>
        </div>
      )}
    </div>
  );
}

function TipsSection() {
  const [index, setIndex] = useState(0);
  const prev = () =>
    setIndex((i) => (i - 1 + cookingTips.length) % cookingTips.length);
  const next = () => setIndex((i) => (i + 1) % cookingTips.length);

  return (
    <div>
      <h2 className="font-display text-xl text-foreground mb-5">
        Cooking Tips
      </h2>
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-6 mb-3 border border-border"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        <Lightbulb className="h-5 w-5 text-brand/60 mb-4" />
        <p className="font-sans text-sm text-foreground/85 leading-relaxed">
          {cookingTips[index]}
        </p>
        <p className="label-caps mt-4 text-muted-foreground/50">
          Tip {index + 1} of {cookingTips.length}
        </p>
      </motion.div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={prev}
          className="flex-1 border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl font-sans text-sm transition-all duration-200 active:scale-[0.97]"
          data-ocid="tools.button"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={next}
          className="flex-1 border-border bg-white text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl font-sans text-sm transition-all duration-200 active:scale-[0.97]"
          data-ocid="tools.button"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function FactsSection() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * foodFacts.length),
  );

  return (
    <div>
      <h2 className="font-display text-xl text-foreground mb-5">Food Facts</h2>
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 mb-3 border border-border"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      >
        <p className="font-sans text-sm text-foreground/85 leading-relaxed">
          {foodFacts[index]}
        </p>
      </motion.div>
      <Button
        onClick={() => setIndex(Math.floor(Math.random() * foodFacts.length))}
        className="w-full border-border bg-white text-foreground hover:bg-muted/60 hover:border-brand/30 rounded-xl font-sans text-sm transition-all duration-200 active:scale-[0.97]"
        variant="outline"
        data-ocid="tools.button"
      >
        Random Fact
      </Button>
    </div>
  );
}

export default function CookingTools() {
  return (
    <section className="pt-28 pb-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Cooking Tools
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          Your kitchen assistant toolkit
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <TimerSection />
        <TipsSection />
        <FactsSection />
      </div>
    </section>
  );
}

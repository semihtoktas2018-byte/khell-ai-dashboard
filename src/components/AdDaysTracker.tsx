import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface AdDaysTrackerProps {
  pid: string;
  isTr?: boolean;
}

const STORAGE_KEY = "khell_ad_days_tracker";

function readAll(): Record<string, { days: number; ts: number }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, { days: number; ts: number }>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage dolu/erişilemez olabilir, sessiz geç
  }
}

function statusFor(days: number, isTr: boolean): { label: string; color: string; bg: string } {
  if (days < 7) return {
    label: isTr ? "🟢 Taze" : "🟢 Fresh",
    color: "hsl(142 71% 55%)",
    bg: "hsl(142 71% 45% / 0.12)",
  };
  if (days <= 30) return {
    label: isTr ? "🟡 Sağlıklı" : "🟡 Healthy",
    color: "hsl(45 93% 55%)",
    bg: "hsl(45 93% 47% / 0.12)",
  };
  return {
    label: isTr ? "🔴 Doygun" : "🔴 Saturated",
    color: "hsl(0 84% 65%)",
    bg: "hsl(0 84% 60% / 0.12)",
  };
}

export default function AdDaysTracker({ pid, isTr = true }: AdDaysTrackerProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState<{ days: number; ts: number } | null>(null);

  useEffect(() => {
    const all = readAll();
    setSaved(all[pid] || null);
  }, [pid]);

  const handleSave = () => {
    const days = parseInt(input, 10);
    if (isNaN(days) || days < 0) return;
    const all = readAll();
    all[pid] = { days, ts: Date.now() };
    saveAll(all);
    setSaved(all[pid]);
    setEditing(false);
    setInput("");
  };

  const meta = saved ? statusFor(saved.days, isTr) : null;

  if (!editing && saved && meta) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); setInput(String(saved.days)); }}
        className="w-full h-6 rounded-md text-[9px] font-semibold flex items-center justify-center gap-1 transition-colors"
        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}
        title={isTr ? "Güncellemek için tıkla" : "Click to update"}
      >
        {meta.label} · {saved.days} {isTr ? "gün" : "days"}
      </button>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
        className="w-full h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1"
        style={{ background: "hsl(0 0% 100% / 0.05)", color: "hsl(215 20% 65%)", border: "1px solid hsl(217 32% 30% / 0.4)" }}
      >
        <Sparkles className="h-2.5 w-2.5" /> {isTr ? "Reklam yaşını gir" : "Enter ad age"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <input
        type="number"
        min={0}
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
        placeholder={isTr ? "gün" : "days"}
        className="w-full h-6 rounded-md text-[9px] px-2 bg-background/60 border border-border outline-none"
      />
      <button
        onClick={handleSave}
        className="h-6 px-2 rounded-md text-[9px] font-semibold shrink-0"
        style={{ background: "hsl(199 89% 60% / 0.2)", color: "hsl(199 89% 65%)", border: "1px solid hsl(199 89% 60% / 0.4)" }}
      >
        {isTr ? "Kaydet" : "Save"}
      </button>
    </div>
  );
}

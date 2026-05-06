import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  isTr?: boolean;
  steps?: string[];
}

export default function LoadingSteps({ isTr = true, steps }: Props) {
  const defaultSteps = isTr
    ? ["Veriler analiz ediliyor...", "Kâr modeli oluşturuluyor...", "AI önerileri hazırlanıyor..."]
    : ["Analyzing data...", "Building profit model...", "Preparing AI insights..."];
  const list = steps ?? defaultSteps;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => Math.min(c + 1, list.length - 1)), 450);
    return () => clearInterval(id);
  }, [list.length]);

  return (
    <div className="space-y-2">
      {list.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={s}
            className={`flex items-center gap-2.5 text-xs transition-all ${
              done ? "text-foreground/80" : active ? "text-foreground" : "text-muted-foreground/60"
            }`}
          >
            {done ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Loader2 className={`h-3.5 w-3.5 shrink-0 ${active ? "animate-spin text-primary" : ""}`} />
            )}
            <span className={active ? "font-medium" : ""}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

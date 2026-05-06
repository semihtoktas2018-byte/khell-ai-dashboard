import { Sparkles, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

export type SuggestionLevel = "good" | "warn" | "critical";

export interface Suggestion {
  level: SuggestionLevel;
  text: string;
}

interface Props {
  isTr?: boolean;
  suggestions: Suggestion[];
  title?: string;
}

const styles: Record<SuggestionLevel, { box: string; icon: JSX.Element; label: string }> = {
  good: {
    box: "border-emerald-500/40 bg-emerald-500/5",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    label: "OK",
  },
  warn: {
    box: "border-yellow-500/40 bg-yellow-500/5",
    icon: <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0" />,
    label: "DİKKAT",
  },
  critical: {
    box: "border-destructive/40 bg-destructive/5",
    icon: <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />,
    label: "KRİTİK",
  },
};

function renderRich(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function AISuggestions({ suggestions, isTr = true, title }: Props) {
  if (!suggestions.length) return null;
  return (
    <div className="card-glow rounded-xl p-5 mt-4">
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
        <Sparkles className="h-4 w-4 text-primary" />
        {title ?? (isTr ? "KHELL AI Önerileri" : "KHELL AI Insights")}
      </h4>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const st = styles[s.level];
          return (
            <div key={i} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${st.box}`}>
              {st.icon}
              <p className="text-xs text-foreground/90 leading-relaxed">{renderRich(s.text)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

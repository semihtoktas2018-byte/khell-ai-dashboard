import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Shared back button used on all analysis pages.
 * Always returns to Dashboard ("/").
 */
export default function BackButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const isTr = locale === "tr";
  return (
    <button
      onClick={() => navigate("/")}
      className={`group flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-border/60 bg-card/40 hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_0_15px_-4px_hsl(var(--primary)/0.5)] text-muted-foreground hover:text-foreground transition-all w-fit ${className}`}
      aria-label="Back"
    >
      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
      <span className="text-xs font-medium">{isTr ? "Geri" : "Back"}</span>
    </button>
  );
}
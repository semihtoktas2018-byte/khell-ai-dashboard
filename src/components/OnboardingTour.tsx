import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SEEN_KEY = "khell_onboarding_seen";

interface Step {
  target: string; // data-tour attribute value
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    target: "nav-analyzer",
    title: "1. Ürün Analizi",
    desc: "İstediğin ürünün adını ve maliyetini gir, AI saniyeler içinde kâr ve risk skorunu hesaplasın.",
  },
  {
    target: "nav-trending",
    title: "2. Trend Ürünler",
    desc: "CJ Dropshipping'den canlı, en çok sipariş alan ürünleri burada görürsün.",
  },
  {
    target: "nav-winning",
    title: "3. Kazanan Ürünler",
    desc: "En yüksek kârlı, kanıtlanmış ürünler burada — direkt analiz edip satışa başlayabilirsin.",
  },
  {
    target: "pro-access",
    title: "4. PRO Erişim",
    desc: "Günde 3 ücretsiz analiz hakkın var. Daha fazlasına ihtiyacın olursa buradan yükseltebilirsin.",
  },
];

function getRect(target: string): DOMRect | null {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

export default function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "true");
    } catch {
      // ignore
    }
    setActive(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "true";
    } catch {
      // ignore
    }
    // Sadece masaüstünde göster (sidebar mobilde gizli, hedefler ölçülemez)
    if (seen || window.innerWidth < 1024) return;

    const timer = setTimeout(() => {
      const r = getRect(steps[0].target);
      if (r) {
        setActive(true);
        setRect(r);
      }
    }, 600); // sayfanın yerleşmesi için kısa bekleme

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active) return;
    const updateRect = () => setRect(getRect(steps[stepIndex].target));
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [active, stepIndex]);

  if (!active || !rect) return null;

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const padding = 8;

  const tooltipWidth = 280;
  const tooltipHeight = 150;
  const spaceBelow = window.innerHeight - rect.bottom;
  const placeAbove = spaceBelow < tooltipHeight + 24;
  const tooltipLeft = Math.min(Math.max(rect.left, 16), window.innerWidth - tooltipWidth - 16);
  const tooltipTop = placeAbove ? Math.max(rect.top - tooltipHeight - 16, 16) : rect.bottom + 16;

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    const nextIndex = stepIndex + 1;
    const r = getRect(steps[nextIndex].target);
    if (r) {
      setStepIndex(nextIndex);
      setRect(r);
    } else {
      finish();
    }
  };

  return (
    <AnimatePresence>
      {/* Spotlight halkası — hedefin etrafını aydınlatır, gerisini koyu bırakır */}
      <motion.div
        key="spotlight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          borderRadius: 12,
          boxShadow: "0 0 0 9999px hsl(222 47% 3% / 0.72)",
          border: "2px solid hsl(217 91% 60% / 0.8)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "all 0.25s ease",
        }}
      />

      {/* Açıklama kartı */}
      <motion.div
        key={`tooltip-${stepIndex}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        style={{
          position: "fixed",
          top: tooltipTop,
          left: tooltipLeft,
          width: tooltipWidth,
          zIndex: 9999,
        }}
        className="rounded-xl p-4"
      >
        <div
          style={{
            background: "linear-gradient(160deg, hsl(222 47% 10%), hsl(222 47% 6%))",
            border: "1px solid hsl(217 91% 60% / 0.3)",
            boxShadow: "0 12px 32px hsl(0 0% 0% / 0.5)",
          }}
          className="rounded-xl p-4"
        >
          <p className="text-[10px] font-semibold tracking-wide mb-1" style={{ color: "hsl(217 91% 70%)" }}>
            {stepIndex + 1} / {steps.length}
          </p>
          <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(215 20% 70%)" }}>
            {step.desc}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={finish}
              className="text-[11px] font-medium hover:underline"
              style={{ color: "hsl(215 20% 55%)" }}
            >
              Atla
            </button>
            <button
              onClick={goNext}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: "hsl(217 91% 60%)" }}
            >
              {isLast ? "Bitir" : "İleri"}
              {!isLast && <ArrowRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

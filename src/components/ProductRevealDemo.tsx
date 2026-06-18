import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Ürün Açığa Çıkarma Demosu — bir ürün taranır, sonra KAZANAN/KAYBEDEN
   diye karar açılır. Dashboard hero'sunda ve ana sayfada paylaşılan,
   tek kaynaktan yönetilen ortak bileşen. */
export default function ProductRevealDemo() {
  const demoItems = [
    { name: "Manyetik Telefon Tutucu", verdict: "WINNER" as const, score: 92, margin: 58, risk: "Düşük" },
    { name: "Plastik Kulaklık Standı", verdict: "LOSER" as const, score: 24, margin: 11, risk: "Yüksek" },
    { name: "LED Gün Batımı Lambası", verdict: "WINNER" as const, score: 81, margin: 47, risk: "Orta" },
  ];
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"scan" | "reveal">("scan");

  useEffect(() => {
    setPhase("scan");
    const toReveal = setTimeout(() => setPhase("reveal"), 1300);
    const toNext = setTimeout(() => setIndex((i) => (i + 1) % demoItems.length), 4200);
    return () => {
      clearTimeout(toReveal);
      clearTimeout(toNext);
    };
  }, [index]);

  const item = demoItems[index];
  const isWinner = item.verdict === "WINNER";
  const accent = isWinner ? "hsl(142 71% 50%)" : "hsl(0 84% 62%)";

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, hsl(222 47% 7% / 0.9), hsl(222 47% 4% / 0.95))",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(217 60% 70% / 0.18)",
        boxShadow: "0 0 80px hsl(217 91% 60% / 0.18), 0 1px 0 hsl(217 91% 70% / 0.15) inset, 0 -1px 0 hsl(0 0% 0% / 0.4) inset",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "hsl(217 60% 70% / 0.1)" }}>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide" style={{ color: "hsl(217 91% 75%)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          CANLI AI ANALİZ MOTORU
        </span>
        <span className="text-[9px] font-mono text-white/30">khell.ai</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === "scan" ? (
            <motion.div
              key={`scan-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{ background: "linear-gradient(145deg, hsl(217 32% 13% / 0.9), hsl(217 32% 8% / 0.9))", border: "1px dashed hsl(217 91% 65% / 0.55)", color: "hsl(217 91% 68%)", boxShadow: "0 8px 24px hsl(217 91% 60% / 0.25), 0 1px 0 hsl(217 91% 80% / 0.2) inset" }}
              >
                ?
              </motion.div>
              <p className="text-sm font-medium text-white/70">{item.name}</p>
              <p className="text-[11px] text-white/40">AI analiz ediyor...</p>
            </motion.div>
          ) : (
            <motion.div
              key={`reveal-${index}`}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-center space-y-3 w-full max-w-[260px]"
            >
              <p className="text-sm font-medium text-white/70 truncate">{item.name}</p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-extrabold tracking-tight"
                style={{
                  background: isWinner ? "linear-gradient(135deg, hsl(142 71% 45% / 0.22), hsl(166 80% 45% / 0.12))" : "linear-gradient(135deg, hsl(0 84% 60% / 0.22), hsl(14 80% 50% / 0.12))",
                  border: `1px solid ${isWinner ? "hsl(142 71% 50% / 0.55)" : "hsl(0 84% 62% / 0.55)"}`,
                  color: accent,
                  boxShadow: `0 6px 20px ${isWinner ? "hsl(142 71% 45% / 0.25)" : "hsl(0 84% 60% / 0.25)"}, 0 1px 0 hsl(0 0% 100% / 0.08) inset`,
                }}
              >
                {isWinner ? "✓ KAZANAN" : "✗ KAYBEDEN"}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded-lg p-2" style={{ background: "hsl(217 32% 10% / 0.7)", backdropFilter: "blur(6px)", border: "1px solid hsl(217 60% 70% / 0.12)" }}>
                  <p className="text-[8px] text-white/40">Skor</p>
                  <p className="text-sm font-bold font-mono" style={{ color: accent }}>{item.score}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "hsl(217 32% 10% / 0.7)", backdropFilter: "blur(6px)", border: "1px solid hsl(217 60% 70% / 0.12)" }}>
                  <p className="text-[8px] text-white/40">Marj</p>
                  <p className="text-sm font-bold font-mono text-white/80">%{item.margin}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "hsl(217 32% 10% / 0.7)", backdropFilter: "blur(6px)", border: "1px solid hsl(217 60% 70% / 0.12)" }}>
                  <p className="text-[8px] text-white/40">Risk</p>
                  <p className="text-sm font-bold text-white/80">{item.risk}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {demoItems.map((_, i) => (
          <span key={i} className="h-1 rounded-full transition-all" style={{ width: i === index ? 18 : 6, background: i === index ? "hsl(217 91% 60%)" : "hsl(217 32% 20%)" }} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, BarChart2, TrendingUp, ShieldCheck, Cpu, FileSpreadsheet, FileText, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/* ─── Ürün Açığa Çıkarma Demosu (sağ panel) ───
   Jenerik soyut grafikler yerine aracın asıl yaptığı şeyi gösteriyor:
   bir ürün taranır, sonra KAZANAN/KAYBEDEN diye karar açılır. */
function ProductRevealDemo() {
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
      className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 flex flex-col"
      style={{ background: "hsl(222 47% 5%)", boxShadow: "0 0 60px hsl(217 91% 60% / 0.15), inset 0 1px 0 hsl(217 91% 60% / 0.1)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide" style={{ color: "hsl(217 91% 70%)" }}>
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
                style={{ background: "hsl(217 32% 10%)", border: "1px dashed hsl(217 91% 60% / 0.5)", color: "hsl(217 91% 65%)" }}
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
                  background: isWinner ? "hsl(142 71% 45% / 0.15)" : "hsl(0 84% 60% / 0.15)",
                  border: `1px solid ${isWinner ? "hsl(142 71% 45% / 0.5)" : "hsl(0 84% 60% / 0.5)"}`,
                  color: accent,
                }}
              >
                {isWinner ? "✓ KAZANAN" : "✗ KAYBEDEN"}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded-lg p-2" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
                  <p className="text-[8px] text-white/40">Skor</p>
                  <p className="text-sm font-bold font-mono" style={{ color: accent }}>{item.score}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
                  <p className="text-[8px] text-white/40">Marj</p>
                  <p className="text-sm font-bold font-mono text-white/80">%{item.margin}</p>
                </div>
                <div className="rounded-lg p-2" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
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
          <span
            key={i}
            className="h-1 rounded-full transition-all"
            style={{ width: i === index ? 18 : 6, background: i === index ? "hsl(217 91% 60%)" : "hsl(217 32% 20%)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Pill ─── */
const featureDefs = [
  { icon: TrendingUp, key: "hero.feat.viral" },
  { icon: BarChart2, key: "hero.feat.fleet" },
  { icon: Cpu, key: "hero.feat.ad" },
  { icon: FileSpreadsheet, key: "hero.feat.csv" },
  { icon: Sparkles, key: "hero.feat.ai" },
  { icon: FileText, key: "hero.feat.pdf" },
];

/* ─── Ana Hero ─── */
export default function HeroSection({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 28 } },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6"
      style={{
        background: "linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(222 47% 3%) 100%)",
        border: "1px solid hsl(217 32% 17%)",
      }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60%), transparent 70%)" }} />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, hsl(142 71% 45%), transparent 70%)" }} />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* ── SOL: Metin ── */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "hsl(217 91% 60% / 0.12)",
                  border: "1px solid hsl(217 91% 60% / 0.35)",
                  color: "hsl(217 91% 70%)",
                  boxShadow: "0 0 16px hsl(217 91% 60% / 0.2)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Ana başlık */}
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-white">
                <span style={{
                  background: "linear-gradient(90deg, hsl(217 91% 65%), hsl(199 89% 70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{t("hero.line1Highlight")}</span>{t("hero.line1Rest")}<br />
                {t("hero.line2")}<br />
                <span style={{
                  background: "linear-gradient(90deg, hsl(142 71% 50%), hsl(166 80% 50%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{t("hero.line3Highlight")}</span>{t("hero.line3Rest")}
              </h1>
            </motion.div>

            {/* Açıklama */}
            <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-lg"
              style={{ color: "hsl(215 20% 62%)" }}>
              {t("hero.desc")}
            </motion.p>

            {/* CTA butonları */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/dashboard/viral-products")}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "hsl(217 91% 60%)",
                  color: "white",
                  boxShadow: "0 0 20px hsl(217 91% 60% / 0.4)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px hsl(217 91% 60% / 0.65)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px hsl(217 91% 60% / 0.4)")}
              >
                <Zap className="h-4 w-4" />
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "hsl(217 32% 12%)",
                  color: "hsl(215 20% 75%)",
                  border: "1px solid hsl(217 32% 22%)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(217 91% 60% / 0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(217 32% 22%)";
                  (e.currentTarget as HTMLButtonElement).style.color = "hsl(215 20% 75%)";
                }}
              >
                {t("hero.cta2")}
              </button>
            </motion.div>

            {/* Slogan */}
            <motion.div variants={fadeUp}>
              <p
                className="text-2xl md:text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(217 91% 70%) 0%, hsl(199 89% 75%) 40%, hsl(142 71% 55%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 18px hsl(217 91% 60% / 0.35))",
                }}
              >
                {t("hero.slogan")}
              </p>
            </motion.div>

            {/* Güven satırı */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {["hero.trust.real", "hero.trust.ai", "hero.trust.mobile", "hero.trust.instant"].map((k) => (
                <span key={k} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(215 20% 55%)" }}>
                  <ShieldCheck className="h-3 w-3" style={{ color: "hsl(142 71% 45%)" }} />
                  {t(k)}
                </span>
              ))}
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 pt-1">
              {featureDefs.map(({ icon: Icon, key }) => (
                <span key={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-default"
                  style={{
                    background: "hsl(217 32% 10%)",
                    border: "1px solid hsl(217 32% 20%)",
                    color: "hsl(215 20% 65%)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(217 91% 60% / 0.4)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(217 91% 70%)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(217 91% 60% / 0.07)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(217 32% 20%)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(215 20% 65%)";
                    (e.currentTarget as HTMLElement).style.background = "hsl(217 32% 10%)";
                  }}
                >
                  <Icon className="h-3 w-3" />
                  {t(key)}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── SAĞ: Ürün açığa çıkarma demosu ── */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block h-[440px]"
          >
            <ProductRevealDemo />
          </motion.div>
        </div>

        {/* ── Dürüst, sade kapanış satırı (uydurma sayılar yerine) ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid hsl(217 32% 15%)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "hsl(142 71% 50%)" }} />
            <p className="text-sm font-medium text-white/80">
              {locale === "tr" ? "Yeni başladık — ilk kullanıcılarımız arasına katıl." : "Just launched — be one of our first users."}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              locale === "tr" ? "Gerçek CJ Dropshipping verisi" : "Real CJ Dropshipping data",
              locale === "tr" ? "AI destekli karar skoru" : "AI-powered decision score",
              locale === "tr" ? "Saniyeler içinde sonuç" : "Results in seconds",
            ].map((txt) => (
              <span key={txt} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(215 20% 60%)" }}>
                <ShieldCheck className="h-3 w-3" style={{ color: "hsl(142 71% 45%)" }} />
                {txt}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

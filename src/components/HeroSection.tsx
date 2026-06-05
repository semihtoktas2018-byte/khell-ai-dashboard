import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, BarChart2, TrendingUp, ShieldCheck, Cpu, FileSpreadsheet, FileText, Sparkles } from "lucide-react";

/* ─── Sayı animasyonu hook'u ─── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ─── Fake AI Dashboard (sağ panel) ─── */
function FakeAIDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  const bars = [62, 78, 55, 90, 71, 84, 67, 95, 58, 88];
  const line = [30, 45, 38, 62, 55, 74, 68, 85, 79, 94];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
      style={{ background: "hsl(222 47% 5%)", boxShadow: "0 0 60px hsl(217 91% 60% / 0.15), inset 0 1px 0 hsl(217 91% 60% / 0.1)" }}>

      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-3 h-5 rounded-md bg-white/5 flex items-center px-2">
          <span className="text-[9px] text-white/30 font-mono">khell.ai/dashboard/analyzer</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      <div className="p-4 space-y-3">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Karar Skoru", value: "94", color: "hsl(217 91% 60%)", suffix: "/100" },
            { label: "Kâr Marjı", value: "61", color: "hsl(142 71% 45%)", suffix: "%" },
            { label: "Risk", value: "Düşük", color: "hsl(142 71% 45%)", suffix: "" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-2.5" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
              <p className="text-[8px] text-white/40 mb-1">{kpi.label}</p>
              <p className="text-sm font-bold font-mono tabular-nums" style={{ color: kpi.color }}>
                {kpi.value}<span className="text-[9px] opacity-60">{kpi.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="rounded-xl p-3" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-white/40 font-mono">ÜRÜN TREND ANALİZİ</span>
            <span className="text-[8px] text-green-400">▲ +12.4%</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: `hsl(217 91% ${50 + h * 0.15}% / ${0.5 + h * 0.005})` }}
                animate={{ height: `${(tick % 2 === 0 ? h : h * (0.85 + Math.random() * 0.3))}%` }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: i * 0.05 }}
                initial={{ height: "20%" }}
              />
            ))}
          </div>
        </div>

        {/* Line chart fake */}
        <div className="rounded-xl p-3" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-white/40 font-mono">AYLIK KÂR TAHMİNİ</span>
            <span className="text-[9px] text-white/50 font-mono">₺18.4K</span>
          </div>
          <svg viewBox="0 0 100 30" className="w-full h-10" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${line.map((v, i) => `${i * 11},${30 - v * 0.28}`).join(" L ")}`}
              fill="none" stroke="hsl(142 71% 45%)" strokeWidth="1.5"
            />
            <path
              d={`M 0,30 L ${line.map((v, i) => `${i * 11},${30 - v * 0.28}`).join(" L ")} L 99,30 Z`}
              fill="url(#lineGrad)"
            />
          </svg>
        </div>

        {/* AI analiz satırı */}
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2"
          style={{ background: "hsl(217 91% 60% / 0.08)", border: "1px solid hsl(217 91% 60% / 0.2)" }}>
          <Sparkles className="h-3 w-3 shrink-0" style={{ color: "hsl(217 91% 60%)" }} />
          <p className="text-[9px] leading-relaxed" style={{ color: "hsl(217 91% 70%)" }}>
            <span className="font-semibold">AI Öneri:</span> Bu ürün düşük rekabetle %61 marj sunuyor. Hemen listele.
          </p>
        </div>

        {/* Ürün listesi */}
        <div className="space-y-1.5">
          {[
            { name: "Manyetik Duruş Kemeri", score: 94, margin: 61, color: "hsl(142 71% 45%)" },
            { name: "LED Gün Batımı Lambası", score: 88, margin: 55, color: "hsl(142 71% 45%)" },
            { name: "Kedi Lazer Oyuncağı", score: 82, margin: 48, color: "hsl(217 91% 60%)" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
              style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 14%)" }}>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-medium text-white/80 truncate">{p.name}</p>
              </div>
              <span className="text-[8px] font-mono" style={{ color: p.color }}>%{p.margin}</span>
              <div className="w-8 h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: p.color }} />
              </div>
              <span className="text-[8px] font-mono font-bold text-white/60">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Pill ─── */
const features = [
  { icon: TrendingUp, label: "Viral Ürün Analizi" },
  { icon: BarChart2, label: "Filo Kâr Hesabı" },
  { icon: Cpu, label: "Reklam AI" },
  { icon: FileSpreadsheet, label: "CSV / Excel Analizi" },
  { icon: Sparkles, label: "AI Önerileri" },
  { icon: FileText, label: "PDF Rapor" },
];

/* ─── Ana Hero ─── */
export default function HeroSection({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();
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

  const rev = useCountUp(2400000, 2200, statsVisible);
  const analyses = useCountUp(12847, 2000, statsVisible);
  const speed = useCountUp(87, 1800, statsVisible);

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
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
                AI destekli iş analiz platformu
              </span>
            </motion.div>

            {/* Ana başlık */}
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-white">
                <span style={{
                  background: "linear-gradient(90deg, hsl(217 91% 65%), hsl(199 89% 70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Kazancı</span>{" "}analiz et.<br />
                Zararı durdur.<br />
                <span style={{
                  background: "linear-gradient(90deg, hsl(142 71% 50%), hsl(166 80% 50%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Büyümeyi</span>{" "}hızlandır.
              </h1>
            </motion.div>

            {/* Açıklama */}
            <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-lg"
              style={{ color: "hsl(215 20% 62%)" }}>
              KHELL AI; filo giderlerini, viral ürünleri ve reklam performansını analiz ederek işletmelerin
              daha hızlı ve daha kârlı kararlar almasını sağlar.
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
                Ücretsiz Analize Başla
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
                Sistemi İncele
              </button>
            </motion.div>

            {/* Güven satırı */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              {["Gerçek analizler", "AI destekli öneriler", "Mobil uyumlu", "Anında sonuç"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(215 20% 55%)" }}>
                  <ShieldCheck className="h-3 w-3" style={{ color: "hsl(142 71% 45%)" }} />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 pt-1">
              {features.map(({ icon: Icon, label }) => (
                <span key={label}
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
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── SAĞ: Fake Dashboard ── */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block h-[440px]"
          >
            <FakeAIDashboard />
          </motion.div>
        </div>

        {/* ── İstatistikler ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6"
          style={{ borderTop: "1px solid hsl(217 32% 15%)" }}
        >
          {[
            { label: "Analiz edilen gelir", value: `₺${(rev / 1000000).toFixed(1)}M+`, suffix: "" },
            { label: "Tamamlanan analiz", value: analyses.toLocaleString("tr-TR"), suffix: "" },
            { label: "Daha hızlı karar", value: `%${speed}`, suffix: "" },
            { label: "AI analiz modülü", value: "3", suffix: " adet" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl"
              style={{ background: "hsl(217 32% 8%)", border: "1px solid hsl(217 32% 15%)" }}>
              <p className="text-xl md:text-2xl font-extrabold font-mono tabular-nums"
                style={{ color: "hsl(217 91% 65%)" }}>
                {stat.value}{stat.suffix}
              </p>
              <p className="text-xs mt-1" style={{ color: "hsl(215 20% 50%)" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

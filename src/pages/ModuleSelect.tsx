import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Truck, Package, Zap, Globe, Megaphone, Sparkles, ArrowRight,
  TrendingUp, BarChart3, FileSpreadsheet, Brain, FileText, Flame,
  CheckCircle2, Activity, DollarSign, LineChart as LineChartIcon,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useEffect, useRef } from "react";
import ProfitCalculator from "@/components/ProfitCalculator";
import SEO from "@/components/SEO";

function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${prefix}${v.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function ModuleSelect() {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();

  const isTr = locale === "tr";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="KHELL AI — E-Ticaret Kârlılık ve Analiz Platformu"
        description="Ürün, filo ve reklam analizi için AI destekli platform. Anlık kâr hesaplayıcı, kazanan ürün bulucu ve premium analiz modülleri."
      />
      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">KHELL AI</span>
        </div>
        <button
          onClick={() => setLocale(isTr ? "en" : "tr")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {isTr ? "TR" : "EN"}
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 px-6 py-12 md:py-16 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/10 blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full bg-winning/10 blur-[140px]"
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Top hero grid: text | mock dashboard */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16">
            {/* Left column */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary shadow-[0_0_20px_hsl(var(--primary)/0.25)] mb-6 animate-pulse"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isTr ? "AI destekli iş analiz platformu" : "AI-powered business analytics platform"}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-6 text-foreground"
              >
                {isTr ? (
                  <>
                    <span className="bg-gradient-to-r from-primary via-primary to-winning bg-clip-text text-transparent drop-shadow-[0_0_25px_hsl(var(--primary)/0.4)]">Kazancı</span> analiz et.<br />
                    Zararı durdur.<br />
                    <span className="bg-gradient-to-r from-winning via-primary to-primary bg-clip-text text-transparent drop-shadow-[0_0_25px_hsl(var(--primary)/0.4)]">Büyümeyi</span> hızlandır.
                  </>
                ) : (
                  <>
                    Analyze <span className="bg-gradient-to-r from-primary via-primary to-winning bg-clip-text text-transparent">profit</span>.<br />
                    Stop the leaks.<br />
                    Accelerate <span className="bg-gradient-to-r from-winning via-primary to-primary bg-clip-text text-transparent">growth</span>.
                  </>
                )}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                {isTr
                  ? "KHELL AI; filo giderlerini, viral ürünleri ve reklam performansını analiz ederek işletmelerin daha hızlı ve daha kârlı kararlar almasını sağlar."
                  : "KHELL AI analyzes fleet expenses, viral products and ad performance — helping businesses make faster, more profitable decisions."}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6"
              >
                <button
                  onClick={() => navigate("/products")}
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_45px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  {isTr ? "Ücretsiz Analize Başla" : "Start Free Analysis"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur text-foreground font-semibold text-sm hover:bg-accent hover:border-primary/40 transition-all"
                >
                  {isTr ? "Sistemi İncele" : "Explore the System"}
                </button>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-xs text-muted-foreground"
              >
                {[
                  isTr ? "Gerçek analizler" : "Real analyses",
                  isTr ? "AI destekli öneriler" : "AI suggestions",
                  isTr ? "Mobil uyumlu" : "Mobile-ready",
                  isTr ? "Anında sonuç" : "Instant results",
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-winning" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right column: Fake AI dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-winning/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-5 shadow-2xl shadow-primary/10">
                {/* mock window header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-winning/70" />
                  <span className="ml-3 text-[10px] text-muted-foreground font-mono">khell-ai / live-analysis</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-winning"><Activity className="h-3 w-3" /> LIVE</span>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: DollarSign, label: isTr ? "Net Kâr" : "Net Profit", value: "₺48.2K", up: "+12%" },
                    { icon: TrendingUp, label: isTr ? "Skor" : "Score", value: "87", up: "+4" },
                    { icon: Flame, label: isTr ? "Viral" : "Viral", value: "HOT", up: "🔥" },
                  ].map((k) => (
                    <div key={k.label} className="rounded-xl border border-border/60 bg-background/60 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <k.icon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[9px] text-winning font-mono">{k.up}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{k.label}</p>
                      <p className="text-sm font-bold font-mono text-foreground">{k.value}</p>
                    </div>
                  ))}
                </div>

                {/* Chart mock */}
                <div className="rounded-xl border border-border/60 bg-background/60 p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <LineChartIcon className="h-3.5 w-3.5 text-primary" />
                      {isTr ? "Kâr Trendi" : "Profit Trend"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">30 {isTr ? "gün" : "days"}</span>
                  </div>
                  <svg viewBox="0 0 300 80" className="w-full h-20">
                    <defs>
                      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      d="M0,60 C30,55 50,40 80,42 C110,44 130,20 160,25 C190,30 210,10 240,15 C270,20 285,8 300,12"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
                    />
                    <path d="M0,60 C30,55 50,40 80,42 C110,44 130,20 160,25 C190,30 210,10 240,15 C270,20 285,8 300,12 L300,80 L0,80 Z" fill="url(#hg)" />
                  </svg>
                </div>

                {/* Bars mock */}
                <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5 text-winning" />
                      {isTr ? "Modül Performansı" : "Module Performance"}
                    </span>
                    <span className="text-[10px] text-winning font-mono">AI</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Fleet", v: 78 },
                      { label: "Product", v: 92 },
                      { label: "Ads", v: 64 },
                    ].map((b, i) => (
                      <div key={b.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-12">{b.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-border/50 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${b.v}%` }}
                            transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-winning"
                            style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.6)" }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-foreground w-8 text-right">{b.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: DollarSign, value: 2.4, prefix: "₺", suffix: "M+", decimals: 1, label: isTr ? "analiz edilen gelir" : "revenue analyzed" },
              { icon: BarChart3, value: 12847, label: isTr ? "analiz" : "analyses" },
              { icon: Zap, value: 87, suffix: "%", label: isTr ? "daha hızlı karar" : "faster decisions" },
              { icon: Brain, value: 3, label: isTr ? "AI analiz modülü" : "AI analysis modules" },
            ].map((s) => (
              <div key={s.label} className="card-glow rounded-2xl p-5 border border-border bg-card/60 backdrop-blur hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] transition-all">
                <s.icon className="h-5 w-5 text-primary mb-3" />
                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground tabular-nums">
                  <CountUp to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} decimals={s.decimals ?? 0} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {[
              { icon: Flame, label: isTr ? "Viral Ürün Analizi" : "Viral Product Analysis" },
              { icon: Truck, label: isTr ? "Filo Kâr Hesabı" : "Fleet Profit Calc" },
              { icon: Megaphone, label: isTr ? "Reklam AI" : "Ad AI" },
              { icon: FileSpreadsheet, label: isTr ? "CSV / Excel Analizi" : "CSV / Excel Analysis" },
              { icon: Brain, label: isTr ? "AI Önerileri" : "AI Suggestions" },
              { icon: FileText, label: isTr ? "PDF Rapor" : "PDF Report" },
            ].map((f) => (
              <span key={f.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 transition-all cursor-default">
                <f.icon className="h-3.5 w-3.5 text-primary" />
                {f.label}
              </span>
            ))}
          </motion.div>

          {/* Instant Profit Calculator */}
          <ProfitCalculator />

          {/* Modules heading */}
          <div id="modules" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              {isTr ? "Analiz Modülleri" : "Analysis Modules"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isTr ? "İhtiyacın olan modülü seç ve saniyeler içinde analizini al." : "Pick a module and get your analysis in seconds."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/fleet")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Filo Analizi" : "Fleet Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Araç bazlı kâr/zarar analizi. Plaka, gelir ve giderlerini gir, anında sonuç al."
                  : "Vehicle-based profit/loss analysis. Enter plate, revenue and costs, get instant results."}
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/products")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Ürün Analizi" : "Product Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Kazanan ürünleri bul, kâr marjını hesapla, viral video reklam üret."
                  : "Find winning products, calculate margins, generate viral video ads."}
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate("/ad-analyzer")}
              className="card-glow rounded-2xl p-10 text-left group cursor-pointer border border-border hover:border-primary/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Megaphone className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Reklam Analizi" : "Ad Analysis"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isTr
                  ? "Kazanan reklamları analiz et, satış metni üret."
                  : "Analyze winning ads, generate sales copy."}
              </p>
            </motion.button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          A BAMİR Online Store's Production
        </p>
      </footer>
    </div>
  );
}
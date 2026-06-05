import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, DollarSign, TrendingUp, Percent, Package } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ type: "spring" as const, stiffness: 260, damping: 24 }}
        className="tabular-nums"
      >
        {prefix}
        {value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
        {suffix}
      </motion.span>
    </AnimatePresence>
  );
}

export default function ProfitCalculator() {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [price, setPrice] = useState(499);
  const [cost, setCost] = useState(180);
  const [units, setUnits] = useState(120);

  const { netPerUnit, monthly, marginPct } = useMemo(() => {
    const n = Math.max(0, price - cost);
    const m = n * Math.max(0, units);
    const pct = price > 0 ? (n / price) * 100 : 0;
    return { netPerUnit: n, monthly: m, marginPct: pct };
  }, [price, cost, units]);

  const t = {
    badge: isTr ? "Anlık Kâr Hesaplayıcı" : "Instant Profit Calculator",
    title: isTr ? "Saniyeler içinde kârını hesapla" : "Calculate your profit in seconds",
    sub: isTr
      ? "Fiyat, maliyet ve aylık satış adedini gir — net kâr ve aylık gelir anında güncellensin."
      : "Enter price, cost and monthly units — net profit and monthly revenue update instantly.",
    price: isTr ? "Satış Fiyatı (₺)" : "Sale Price (₺)",
    cost: isTr ? "Birim Maliyet (₺)" : "Unit Cost (₺)",
    units: isTr ? "Aylık Satış Adedi" : "Monthly Units",
    net: isTr ? "Birim Net Kâr" : "Net Profit / Unit",
    monthly: isTr ? "Aylık Net Gelir" : "Monthly Net Revenue",
    margin: isTr ? "Kâr Marjı" : "Profit Margin",
  };

  const fields: Array<{ label: string; value: number; setter: (v: number) => void; icon: typeof DollarSign; step: number }> = [
    { label: t.price, value: price, setter: setPrice, icon: DollarSign, step: 10 },
    { label: t.cost, value: cost, setter: setCost, icon: Package, step: 5 },
    { label: t.units, value: units, setter: setUnits, icon: TrendingUp, step: 10 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-5xl mx-auto mb-16"
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/40 via-fuchsia-500/30 to-cyan-400/40 blur-2xl opacity-40 pointer-events-none" />
      <div className="relative rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none" />

        <div className="relative flex flex-col items-center text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary mb-3">
            <Calculator className="h-3.5 w-3.5" />
            {t.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">{t.sub}</p>
        </div>

        <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-background/60 p-4 hover:border-primary/40 transition-colors">
                <label className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <f.icon className="h-3.5 w-3.5 text-primary" />
                    {f.label}
                  </span>
                  <span className="font-mono text-foreground tabular-nums">{f.value.toLocaleString("tr-TR")}</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.setter(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-transparent border-0 outline-none text-xl font-bold text-foreground font-mono tabular-nums focus:ring-0 px-0 py-1"
                />
                <input
                  type="range"
                  min={0}
                  max={f.label === t.units ? 1000 : 5000}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.setter(Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="relative rounded-2xl p-5 border border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
              <div className="relative flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-primary/80 font-semibold">{t.monthly}</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="relative text-4xl md:text-5xl font-extrabold text-primary drop-shadow-[0_0_18px_hsl(var(--primary)/0.5)]">
                <AnimatedNumber value={Math.round(monthly)} suffix=" ₺" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl p-4 border border-emerald-400/40 bg-gradient-to-br from-emerald-400/15 via-emerald-400/5 to-transparent overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-400/25 blur-2xl" />
                <div className="relative flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-300/90 font-semibold">{t.net}</span>
                  <DollarSign className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="relative text-2xl font-bold text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                  <AnimatedNumber value={Math.round(netPerUnit)} suffix=" ₺" />
                </div>
              </div>

              <div className="relative rounded-2xl p-4 border border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-400/15 via-fuchsia-400/5 to-transparent overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-fuchsia-400/25 blur-2xl" />
                <div className="relative flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-fuchsia-300/90 font-semibold">{t.margin}</span>
                  <Percent className="h-3.5 w-3.5 text-fuchsia-300" />
                </div>
                <div className="relative text-2xl font-bold text-fuchsia-300 drop-shadow-[0_0_12px_rgba(232,121,249,0.5)]">
                  <AnimatedNumber value={Math.round(marginPct)} suffix=" %" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              {isTr
                ? "Bu hesaplama bilgilendirme amaçlıdır. Tam analiz için modülleri kullan."
                : "This estimate is informational only. Use the modules for full analysis."}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
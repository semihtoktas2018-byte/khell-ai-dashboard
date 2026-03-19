import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { trendingProducts } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useNavigate } from "react-router-dom";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } };

const tooltipStyle = { background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" };


export default function DashboardHome() {
  const { products: savedProducts } = useSavedProducts();
  const navigate = useNavigate();
  const topTrending = trendingProducts.slice(0, 4);

  const metrics = useMemo(() => {
    const total = savedProducts.length;
    const winning = savedProducts.filter((p) => p.decisionScore >= 70 && p.riskLevel === "low").length;
    const risky = savedProducts.filter((p) => p.riskLevel === "medium" || p.riskLevel === "high").length;
    const totalProfit = savedProducts.reduce((sum, p) => sum + (p.monthlyProfit ?? 0), 0);
    return {
      analyzed: total || 0,
      winning: winning || 0,
      risky: risky || 0,
      profit: totalProfit || 0,
    };
  }, [savedProducts]);

  const stats = [
    { label: "Analiz Edilen", value: metrics.analyzed, icon: BarChart3, colorClass: "text-primary" },
    { label: "Kazanan Ürünler", value: metrics.winning, icon: TrendingUp, colorClass: "text-winning pulse-glow" },
    { label: "Riskli Ürünler", value: metrics.risky, icon: AlertTriangle, colorClass: "text-risky" },
    { label: "Tahmini Kâr", value: `$${metrics.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, colorClass: "text-winning" },
  ];

  const pieData = useMemo(() => {
    const low = savedProducts.filter((p) => p.riskLevel === "low").length;
    const med = savedProducts.filter((p) => p.riskLevel === "medium").length;
    const high = savedProducts.filter((p) => p.riskLevel === "high").length;
    if (low + med + high === 0) {
      return [
        { name: "Düşük", value: 1, color: "hsl(142 71% 45%)" },
        { name: "Orta", value: 1, color: "hsl(38 92% 50%)" },
        { name: "Yüksek", value: 1, color: "hsl(0 84% 60%)" },
      ];
    }
    return [
      { name: "Düşük", value: low, color: "hsl(142 71% 45%)" },
      { name: "Orta", value: med, color: "hsl(38 92% 50%)" },
      { name: "Yüksek", value: high, color: "hsl(0 84% 60%)" },
    ];
  }, [savedProducts]);

  const profitData = useMemo(() => {
    if (savedProducts.length === 0) return [];
    // Sort by dateSaved and build cumulative profit trend from real data
    const sorted = [...savedProducts].sort((a, b) => new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime());
    let cumulative = 0;
    return sorted.map((p) => {
      cumulative += (p.monthlyProfit ?? 0);
      return {
        month: new Date(p.dateSaved).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }),
        profit: Math.round(cumulative),
      };
    });
  }, [savedProducts]);

  const scoreData = useMemo(() => {
    if (savedProducts.length === 0) return [];
    return savedProducts.slice(0, 6).map((p) => ({ name: p.name.substring(0, 12), score: p.decisionScore }));
  }, [savedProducts]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="card-glow rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.colorClass}`} />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground tabular-nums">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profit Trend */}
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Kâr Trendi</h3>
          {profitData.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">Henüz veri yok — ürün kaydedin.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="profit" stroke="hsl(217 91% 60%)" strokeWidth={2.5} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Risk Distribution Pie */}
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Dağılımı</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Score Chart & Trending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Karar Skorları</h3>
          {scoreData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">Henüz veri yok.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Trend Ürünler</h3>
            <button onClick={() => navigate("/dashboard/winning")} className="text-xs text-primary hover:underline">Tümünü Gör</button>
          </div>
          <div className="space-y-3">
            {topTrending.map((p) => {
              const v = getVerdict(p.profitMargin);
              return (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.image}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.platform} · {p.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${v.class}`}>%{p.profitMargin}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Saved Products Preview */}
      {savedProducts.length > 0 && (
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Kaydedilen Ürünler</h3>
            <button onClick={() => navigate("/dashboard/saved")} className="text-xs text-primary hover:underline">Tümünü Gör</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {savedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="rounded-lg bg-accent/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-primary">{p.decisionScore}</span>
                </div>
                <p className="text-xs text-muted-foreground">Marj: %{p.profitMargin} · ${p.monthlyProfit.toFixed(0)}/ay</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

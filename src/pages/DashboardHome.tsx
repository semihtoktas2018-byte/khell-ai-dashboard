import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { dashboardStats, trendingProducts } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useNavigate } from "react-router-dom";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } };

const stats = [
  { label: "Analiz Edilen", value: dashboardStats.analyzedProducts, icon: BarChart3, colorClass: "text-primary" },
  { label: "Kazanan Ürünler", value: dashboardStats.winningProducts, icon: TrendingUp, colorClass: "text-winning pulse-glow" },
  { label: "Riskli Ürünler", value: dashboardStats.riskyProducts, icon: AlertTriangle, colorClass: "text-risky" },
  { label: "Tahmini Kâr", value: `$${dashboardStats.estimatedProfit.toLocaleString()}`, icon: DollarSign, colorClass: "text-winning" },
];

const pieData = [
  { name: "Kazanan", value: 38, color: "hsl(142 71% 45%)" },
  { name: "İyi", value: 57, color: "hsl(217 91% 60%)" },
  { name: "Riskli", value: 84, color: "hsl(38 92% 50%)" },
  { name: "Kötü", value: 68, color: "hsl(0 84% 60%)" },
];

const profitData = [
  { month: "Oca", profit: 1200 }, { month: "Şub", profit: 1800 }, { month: "Mar", profit: 2400 },
  { month: "Nis", profit: 2100 }, { month: "May", profit: 3200 }, { month: "Haz", profit: 4100 },
  { month: "Tem", profit: 3800 },
];

const trendData = trendingProducts.slice(0, 6).map((p) => ({ name: p.name.substring(0, 12), score: p.trendScore }));

const tooltipStyle = { background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" };

export default function DashboardHome() {
  const { products: savedProducts } = useSavedProducts();
  const navigate = useNavigate();
  const topTrending = trendingProducts.slice(0, 4);

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
        </motion.div>

        {/* Distribution Pie */}
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ürün Dağılımı</h3>
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

      {/* Trend Scores & Trending Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Score Chart */}
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Trend Skorları</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Trending Preview */}
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

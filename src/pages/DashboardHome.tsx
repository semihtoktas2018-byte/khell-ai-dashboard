import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { dashboardStats } from "@/lib/mock-data";

const transition = { type: "spring", stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } };

const stats = [
  { label: "Analiz Edilen", value: dashboardStats.analyzedProducts, icon: BarChart3, color: "text-primary" },
  { label: "Kazanan Ürünler", value: dashboardStats.winningProducts, icon: TrendingUp, color: "text-winning pulse-glow" },
  { label: "Riskli Ürünler", value: dashboardStats.riskyProducts, icon: AlertTriangle, color: "text-risky" },
  { label: "Tahmini Kâr", value: `$${dashboardStats.estimatedProfit.toLocaleString()}`, icon: DollarSign, color: "text-winning" },
];

const pieData = [
  { name: "Kazanan", value: 38, color: "hsl(142 71% 45%)" },
  { name: "İyi", value: 57, color: "hsl(217 91% 60%)" },
  { name: "Riskli", value: 84, color: "hsl(38 92% 50%)" },
  { name: "Kötü", value: 68, color: "hsl(0 84% 60%)" },
];

const areaData = [
  { month: "Oca", profit: 1200 }, { month: "Şub", profit: 1800 }, { month: "Mar", profit: 2400 },
  { month: "Nis", profit: 2100 }, { month: "May", profit: 3200 }, { month: "Haz", profit: 4100 },
  { month: "Tem", profit: 3800 },
];

export default function DashboardHome() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="card-glow rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground tabular-nums">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Kâr Trendi</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" }}
              />
              <Area type="monotone" dataKey="profit" stroke="hsl(217 91% 60%)" strokeWidth={2.5} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} className="card-glow rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ürün Dağılımı</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={0}>
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

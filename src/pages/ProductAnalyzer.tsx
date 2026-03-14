import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { analyzeProduct, type AnalyzerInput } from "@/lib/analyzer";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const defaultInput: AnalyzerInput = {
  product_cost: 0,
  shipping_cost: 0,
  ad_cost_per_sale: 0,
  platform_fee_percentage: 15,
  selling_price: 0,
  return_rate: 5,
};

const fields: { key: keyof AnalyzerInput; label: string; suffix?: string }[] = [
  { key: "selling_price", label: "Satış Fiyatı", suffix: "$" },
  { key: "product_cost", label: "Ürün Maliyeti", suffix: "$" },
  { key: "shipping_cost", label: "Kargo Maliyeti", suffix: "$" },
  { key: "ad_cost_per_sale", label: "Reklam Maliyeti / Satış", suffix: "$" },
  { key: "platform_fee_percentage", label: "Platform Komisyonu", suffix: "%" },
  { key: "return_rate", label: "İade Oranı", suffix: "%" },
];

export default function ProductAnalyzer() {
  const [input, setInput] = useState<AnalyzerInput>(defaultInput);
  const [showResult, setShowResult] = useState(false);

  const result = analyzeProduct(input);

  const handleChange = (key: keyof AnalyzerInput, val: string) => {
    setInput((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const handleAnalyze = () => setShowResult(true);

  const pieData = [
    { name: "Ürün Maliyeti", value: input.product_cost, color: "hsl(0 84% 60%)" },
    { name: "Kargo", value: input.shipping_cost, color: "hsl(38 92% 50%)" },
    { name: "Reklam", value: input.ad_cost_per_sale, color: "hsl(280 60% 55%)" },
    { name: "Platform", value: result.platform_fee, color: "hsl(217 91% 60%)" },
    { name: "İade", value: result.return_loss, color: "hsl(15 70% 50%)" },
    { name: "Net Kâr", value: Math.max(0, result.net_profit), color: "hsl(142 71% 45%)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="card-glow rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Ürün Maliyet Girişi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
              <div className="relative">
                <input
                  type="number"
                  value={input[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder="0"
                  className="input-dark w-full pr-8"
                />
                {f.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {f.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAnalyze} className="btn-primary w-full mt-6">
          Analiz Et
        </button>
      </motion.div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {showResult && input.selling_price > 0 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transition}
            className="card-glow rounded-xl p-6 space-y-6"
          >
            {/* Verdict */}
            <div className={`rounded-lg p-5 text-center ${result.verdict.class}`}>
              <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Karar Skoru</p>
              <p className="text-3xl font-bold font-mono tabular-nums">
                %{result.profit_margin.toFixed(1)}
              </p>
              <p className="text-lg font-semibold mt-1">{result.verdict.labelTr}</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <Row label="Brüt Kâr" value={result.gross_profit} />
              <Row label="Platform Komisyonu" value={-result.platform_fee} />
              <Row label="İade Kaybı" value={-result.return_loss} />
              <div className="border-t border-border pt-3">
                <Row label="Net Kâr" value={result.net_profit} bold />
              </div>
            </div>

            {/* Pie */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Maliyet Dağılımı</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  const color = value >= 0 ? "text-winning" : "text-destructive";
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-sm font-mono tabular-nums font-medium ${bold ? color : "text-foreground"}`}>
        {value >= 0 ? "+" : ""}${value.toFixed(2)}
      </span>
    </div>
  );
}

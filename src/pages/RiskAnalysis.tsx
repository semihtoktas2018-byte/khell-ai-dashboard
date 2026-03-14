import { useState } from "react";
import { motion } from "framer-motion";
import { analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const presets = [
  { name: "LED Lamba (TikTok)", input: { product_cost: 8.5, shipping_cost: 3, ads_cost: 5, selling_price: 29.99, monthly_orders_estimate: 120 } },
  { name: "Kablosuz Kulaklık", input: { product_cost: 18, shipping_cost: 4, ads_cost: 12, selling_price: 44.99, monthly_orders_estimate: 60 } },
  { name: "Silikon Mutfak Seti", input: { product_cost: 5.5, shipping_cost: 2, ads_cost: 3, selling_price: 18.99, monthly_orders_estimate: 200 } },
  { name: "Riskli Ürün Örneği", input: { product_cost: 15, shipping_cost: 8, ads_cost: 10, selling_price: 24.99, monthly_orders_estimate: 20 } },
];

export default function RiskAnalysis() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customInput, setCustomInput] = useState<AnalyzerInput>(presets[0].input);

  const risks = analyzeRisk(customInput);
  const overallScore = Math.round(risks.reduce((sum, r) => sum + r.score, 0) / risks.length);
  const overallLevel = overallScore >= 60 ? "high" : overallScore >= 35 ? "medium" : "low";

  const handlePreset = (idx: number) => {
    setSelectedPreset(idx);
    setCustomInput(presets[idx].input);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p, i) => (
          <button
            key={p.name}
            onClick={() => handlePreset(i)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPreset === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="card-glow rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ürün Bilgileri</h3>
          <div className="space-y-3">
            {([
              { key: "selling_price" as const, label: "Satış Fiyatı ($)" },
              { key: "product_cost" as const, label: "Ürün Maliyeti ($)" },
              { key: "shipping_cost" as const, label: "Kargo ($)" },
              { key: "ads_cost" as const, label: "Reklam ($)" },
              { key: "monthly_orders_estimate" as const, label: "Aylık Sipariş" },
            ]).map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input
                  type="number"
                  value={customInput[f.key] || ""}
                  onChange={(e) => setCustomInput((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 }))}
                  className="input-dark w-full text-sm"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Factors */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }} className="card-glow rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Risk Değerlendirmesi</h3>
          </div>

          {/* Overall Score */}
          <div className={`rounded-lg p-5 text-center mb-6 ${overallLevel === "low" ? "verdict-winning" : overallLevel === "medium" ? "verdict-risky" : "verdict-bad"}`}>
            <div className="text-4xl font-bold font-mono tabular-nums mb-1">{overallScore}</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mb-1">Genel Risk Skoru / 100</div>
            <p className="text-sm font-medium">
              {overallLevel === "low" ? "Düşük Risk — Güvenli Ürün" : overallLevel === "medium" ? "Orta Risk — Dikkatli Olun" : "Yüksek Risk — Önerilmez"}
            </p>
          </div>

          {/* Individual Factors */}
          <div className="space-y-5">
            {risks.map((risk, i) => (
              <motion.div
                key={risk.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, ...transition }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <RiskIcon level={risk.level} />
                    <span className="text-sm font-medium text-foreground">{risk.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                    risk.level === "low" ? "verdict-winning" : risk.level === "medium" ? "verdict-risky" : "verdict-bad"
                  }`}>
                    {risk.level === "low" ? "Düşük" : risk.level === "medium" ? "Orta" : "Yüksek"}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-accent overflow-hidden mb-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.score}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className={`h-full rounded-full ${risk.level === "high" ? "bg-destructive" : risk.level === "medium" ? "bg-risky" : "bg-winning"}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{risk.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <CheckCircle className="h-4 w-4 text-winning" />;
  if (level === "medium") return <AlertTriangle className="h-4 w-4 text-risky" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

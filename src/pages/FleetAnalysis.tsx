import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Calculator, TrendingUp, TrendingDown, AlertTriangle, Zap, Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface FleetResult {
  netProfit: number;
  margin: number;
  status: "loss" | "marginal" | "profitable";
  risk: "low" | "medium" | "high";
  totalCost: number;
}

function analyze(revenue: number, fuel: number, driver: number, other: number): FleetResult {
  const totalCost = fuel + driver + other;
  const netProfit = revenue - totalCost;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  let status: FleetResult["status"] = "profitable";
  if (netProfit < 0) status = "loss";
  else if (margin < 15) status = "marginal";

  let risk: FleetResult["risk"] = "low";
  if (margin < 10 || netProfit < 0) risk = "high";
  else if (margin < 25) risk = "medium";

  return { netProfit, margin, status, risk, totalCost };
}

export default function FleetAnalysis() {
  const navigate = useNavigate();
  const { locale, setLocale, currency } = useLocale();
  const isTr = locale === "tr";

  const [plate, setPlate] = useState("");
  const [revenue, setRevenue] = useState("");
  const [fuel, setFuel] = useState("");
  const [driver, setDriver] = useState("");
  const [other, setOther] = useState("");
  const [result, setResult] = useState<FleetResult | null>(null);

  const handleAnalyze = () => {
    const r = analyze(
      parseFloat(revenue) || 0,
      parseFloat(fuel) || 0,
      parseFloat(driver) || 0,
      parseFloat(other) || 0,
    );
    setResult(r);
  };

  const statusLabel = (s: FleetResult["status"]) => {
    if (s === "loss") return isTr ? "ZARAR" : "LOSS";
    if (s === "marginal") return isTr ? "SINIRDA" : "MARGINAL";
    return isTr ? "KARLI" : "PROFITABLE";
  };
  const riskLabel = (r: FleetResult["risk"]) => {
    if (r === "high") return isTr ? "YÜKSEK" : "HIGH";
    if (r === "medium") return isTr ? "ORTA" : "MEDIUM";
    return isTr ? "DÜŞÜK" : "LOW";
  };
  const statusColor = (s: FleetResult["status"]) =>
    s === "loss" ? "text-destructive" : s === "marginal" ? "text-risky" : "text-winning";
  const riskColor = (r: FleetResult["risk"]) =>
    r === "high" ? "text-destructive" : r === "medium" ? "text-risky" : "text-winning";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-6 h-16 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">KHELL AI</span>
          </div>
        </div>
        <button
          onClick={() => setLocale(isTr ? "en" : "tr")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {isTr ? "TR" : "EN"}
        </button>
      </nav>

      <main className="container mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {isTr ? "Filo Analizi" : "Fleet Analysis"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isTr ? "Araç bazlı kâr/zarar analizi" : "Vehicle-based profit/loss analysis"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {isTr ? "Araç Bilgileri" : "Vehicle Info"}
            </h2>
            <div className="space-y-4">
              <Field label={isTr ? "Plaka" : "Plate"} value={plate} onChange={setPlate} placeholder="34 ABC 123" type="text" />
              <Field label={isTr ? "Gelir" : "Revenue"} value={revenue} onChange={setRevenue} placeholder="0" type="number" />
              <Field label={isTr ? "Yakıt" : "Fuel"} value={fuel} onChange={setFuel} placeholder="0" type="number" />
              <Field label={isTr ? "Şoför" : "Driver"} value={driver} onChange={setDriver} placeholder="0" type="number" />
              <Field label={isTr ? "Diğer giderler" : "Other costs"} value={other} onChange={setOther} placeholder="0" type="number" />

              <button
                onClick={handleAnalyze}
                className="w-full btn-primary text-sm py-3 mt-2 flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                {isTr ? "Analiz Et" : "Analyze"}
              </button>
            </div>
          </motion.div>

          {/* Result */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-glow rounded-xl p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {isTr ? "Sonuç" : "Result"}
            </h2>

            {!result ? (
              <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                <Calculator className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">
                  {isTr ? "Bilgileri girin ve 'Analiz Et' butonuna basın." : "Enter info and click 'Analyze'."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {plate && (
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {isTr ? "Plaka" : "Plate"}: <span className="text-foreground font-mono font-semibold">{plate}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Stat
                    label={isTr ? "Net Kâr" : "Net Profit"}
                    value={currency(result.netProfit)}
                    icon={result.netProfit >= 0 ? TrendingUp : TrendingDown}
                    color={result.netProfit >= 0 ? "text-winning" : "text-destructive"}
                  />
                  <Stat
                    label={isTr ? "Kâr Oranı" : "Margin"}
                    value={`${result.margin.toFixed(1)}%`}
                    icon={TrendingUp}
                    color={result.margin >= 15 ? "text-winning" : result.margin >= 0 ? "text-risky" : "text-destructive"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      {isTr ? "Durum" : "Status"}
                    </div>
                    <div className={`text-lg font-bold ${statusColor(result.status)}`}>{statusLabel(result.status)}</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {isTr ? "Risk" : "Risk"}
                    </div>
                    <div className={`text-lg font-bold ${riskColor(result.risk)}`}>{riskLabel(result.risk)}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>{isTr ? "Toplam Gider" : "Total Cost"}</span>
                    <span className="font-mono text-foreground">{currency(result.totalCost)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
    </div>
  );
}

function Stat({
  label, value, icon: Icon, color,
}: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
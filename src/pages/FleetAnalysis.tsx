import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Calculator, TrendingUp, TrendingDown, AlertTriangle, Zap, Globe, Wallet, Receipt, ShieldAlert, Save, Sparkles, Wrench, History, GitCompare, Printer, Trash2, Trophy } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface FleetResult {
  netProfit: number;
  margin: number;
  fuelRatio: number;
  status: "loss" | "marginal" | "profitable";
  risk: "low" | "medium" | "high";
  totalCost: number;
}

interface SavedTrip {
  id: string;
  plate: string;
  revenue: number;
  fuel: number;
  driver: number;
  other: number;
  km: number;
  netProfit: number;
  margin: number;
  date: string;
}

interface CompareVehicle {
  revenue: string;
  fuel: string;
  driver: string;
  other: string;
}

const TRIPS_KEY = "khell_fleet_trips";
const MAINTENANCE_PERIOD = 10000;

function analyze(revenue: number, fuel: number, driver: number, other: number): FleetResult {
  const totalCost = fuel + driver + other;
  const netProfit = revenue - totalCost;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const fuelRatio = revenue > 0 ? (fuel / revenue) * 100 : 0;

  let status: FleetResult["status"] = "profitable";
  if (netProfit < 0) status = "loss";
  else if (margin < 15) status = "marginal";

  let risk: FleetResult["risk"] = "low";
  if (netProfit < 0 || fuelRatio > 60) risk = "high";
  else if (fuelRatio >= 45) risk = "medium";

  return { netProfit, margin, fuelRatio, status, risk, totalCost };
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
              <ResultPanel
                result={result}
                plate={plate}
                revenue={parseFloat(revenue) || 0}
                isTr={isTr}
                currency={currency}
                statusLabel={statusLabel}
                riskLabel={riskLabel}
              />
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

function ResultPanel({
  result, plate, revenue, isTr, currency, statusLabel, riskLabel,
}: {
  result: FleetResult;
  plate: string;
  revenue: number;
  isTr: boolean;
  currency: (v: number) => string;
  statusLabel: (s: FleetResult["status"]) => string;
  riskLabel: (r: FleetResult["risk"]) => string;
}) {
  const statusTheme = {
    profitable: {
      ring: "ring-winning/40",
      bg: "bg-winning/10",
      text: "text-winning",
      glow: "shadow-[0_0_40px_-10px_hsl(var(--winning)/0.5)]",
    },
    marginal: {
      ring: "ring-risky/40",
      bg: "bg-risky/10",
      text: "text-risky",
      glow: "shadow-[0_0_40px_-10px_hsl(var(--risky)/0.5)]",
    },
    loss: {
      ring: "ring-destructive/40",
      bg: "bg-destructive/10",
      text: "text-destructive",
      glow: "shadow-[0_0_40px_-10px_hsl(var(--destructive)/0.5)]",
    },
  }[result.status];

  const insight = {
    profitable: isTr ? "Sistem sağlıklı, büyütülebilir" : "System is healthy, scalable",
    marginal: isTr ? "Kâr var ama sistem kırılgan" : "Profit exists but the system is fragile",
    loss: isTr ? "Maliyetler kontrolsüz, acil müdahale gerekli" : "Costs out of control, urgent action required",
  }[result.status];

  const summary = isTr
    ? `${currency(revenue)} gelirden ${currency(result.netProfit)} net ${result.netProfit >= 0 ? "kazanç" : "zarar"}`
    : `${currency(result.netProfit)} net ${result.netProfit >= 0 ? "profit" : "loss"} from ${currency(revenue)} revenue`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Big status header */}
      <div className={`relative rounded-xl border ${statusTheme.bg} ${statusTheme.glow} ring-1 ${statusTheme.ring} px-5 py-6 text-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative">
          {plate && (
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 font-mono">
              {plate}
            </div>
          )}
          <div className={`text-4xl font-bold tracking-tight ${statusTheme.text}`}>
            {statusLabel(result.status)}
          </div>
        </div>
      </div>

      {/* Three premium cards */}
      <div className="space-y-3">
        <ResultCard
          icon={Wallet}
          title={isTr ? "Kâr Durumu" : "Profit Status"}
          accent={result.netProfit >= 0 ? "text-winning" : "text-destructive"}
          rows={[
            { label: isTr ? "Net" : "Net", value: currency(result.netProfit) },
            { label: isTr ? "Kâr Oranı" : "Margin", value: `%${result.margin.toFixed(1)}` },
          ]}
        />
        <ResultCard
          icon={Receipt}
          title={isTr ? "Maliyet" : "Cost"}
          accent="text-foreground"
          rows={[
            { label: isTr ? "Toplam Gider" : "Total Cost", value: currency(result.totalCost) },
            { label: isTr ? "Yakıt Oranı" : "Fuel Ratio", value: `%${result.fuelRatio.toFixed(1)}` },
          ]}
        />
        <ResultCard
          icon={ShieldAlert}
          title={isTr ? "Risk" : "Risk"}
          accent={
            result.risk === "high" ? "text-destructive" : result.risk === "medium" ? "text-risky" : "text-winning"
          }
          rows={[
            { label: isTr ? "Durum" : "Status", value: statusLabel(result.status) },
            { label: isTr ? "Risk" : "Risk", value: riskLabel(result.risk) },
          ]}
        />
      </div>

      {/* Patron summary */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-1.5">
          <Sparkles className="h-3 w-3" />
          {isTr ? "Patron Özeti" : "Owner Summary"}
        </div>
        <p className="text-sm font-semibold text-foreground leading-relaxed">{summary}</p>
        <p className="text-xs text-muted-foreground mt-2 italic">"{insight}"</p>
      </div>

      {/* Save button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-sm font-medium py-3 transition-colors"
      >
        <Save className="h-4 w-4" />
        {isTr ? "Analizi Kaydet" : "Save Analysis"}
      </button>

      <p className="text-center text-[10px] text-muted-foreground">
        {isTr ? "Bu analiz anlık veriye göre hesaplanır" : "This analysis is calculated on real-time data"}
      </p>
    </motion.div>
  );
}

function ResultCard({
  icon: Icon, title, accent, rows,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">{title}</h3>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{r.label}</span>
            <span className={`text-sm font-bold font-mono ${accent}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
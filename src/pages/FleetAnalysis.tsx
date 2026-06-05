import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Calculator, TrendingUp, TrendingDown, AlertTriangle, Zap, Globe, Wallet, Receipt, ShieldAlert, Save, Sparkles, Wrench, History, GitCompare, Printer, Trash2, Trophy, BarChart3, DollarSign, Upload, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { useLocale } from "@/contexts/LocaleContext";
import fleetHero from "@/assets/fleet-hero.jpg";
import BackButton from "@/components/BackButton";
import MoneyLayer from "@/components/MoneyLayer";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import ReportActions from "@/components/ReportActions";
import LoadingSteps from "@/components/LoadingSteps";
import SEO from "@/components/SEO";
import MasrafPusulasiExport from "@/components/MasrafPusulasiExport";

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

interface FleetRow {
  plate: string;
  revenue: number;
  fuel: number;
  driver: number;
  maintenance: number;
  toll: number;
  other: number;
  netProfit: number;
}

const TRIPS_KEY = "khell_fleet_trips";
const MAINTENANCE_PERIOD = 10000;
const PAYWALL_KEY = "filo_count";
const PAYWALL_LIMIT = 2;
const WHATSAPP_NUMBER = "+90 544 645 24 30";
const WHATSAPP_LINK = "https://wa.me/905446452430";

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
  const [km, setKm] = useState("");
  const [result, setResult] = useState<FleetResult | null>(null);

  const [trips, setTrips] = useState<SavedTrip[]>(() => {
    try {
      const raw = localStorage.getItem(TRIPS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [compareVehicles, setCompareVehicles] = useState<CompareVehicle[]>([
    { revenue: "", fuel: "", driver: "", other: "" },
    { revenue: "", fuel: "", driver: "", other: "" },
    { revenue: "", fuel: "", driver: "", other: "" },
  ]);
  const [compareResult, setCompareResult] = useState<FleetResult[] | null>(null);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [filoCount, setFiloCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(PAYWALL_KEY) || "0", 10) || 0;
    } catch {
      return 0;
    }
  });

  // CSV Import state
  const [importedRows, setImportedRows] = useState<FleetRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  }, [trips]);

  const handleAnalyze = () => {
    if (filoCount >= PAYWALL_LIMIT) {
      setPaywallOpen(true);
      return;
    }
    const r = analyze(
      parseFloat(revenue) || 0,
      parseFloat(fuel) || 0,
      parseFloat(driver) || 0,
      parseFloat(other) || 0,
    );
    setResult(r);
    const next = filoCount + 1;
    setFiloCount(next);
    try {
      localStorage.setItem(PAYWALL_KEY, String(next));
    } catch {}
    if (next >= PAYWALL_LIMIT) {
      // allow this result to show; next click will be blocked
    }
  };

  const handleSaveTrip = () => {
    if (!result) return;
    const trip: SavedTrip = {
      id: crypto.randomUUID(),
      plate: plate || "—",
      revenue: parseFloat(revenue) || 0,
      fuel: parseFloat(fuel) || 0,
      driver: parseFloat(driver) || 0,
      other: parseFloat(other) || 0,
      km: parseFloat(km) || 0,
      netProfit: result.netProfit,
      margin: result.margin,
      date: new Date().toISOString(),
    };
    setTrips((prev) => [trip, ...prev].slice(0, 50));
  };

  const handleLoadTrip = (t: SavedTrip) => {
    setPlate(t.plate === "—" ? "" : t.plate);
    setRevenue(String(t.revenue));
    setFuel(String(t.fuel));
    setDriver(String(t.driver));
    setOther(String(t.other));
    setKm(t.km ? String(t.km) : "");
    setResult(analyze(t.revenue, t.fuel, t.driver, t.other));
  };

  const handleDeleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  // -------- CSV Import --------
  const parseCsv = (text: string): FleetRow[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const splitLine = (l: string) => {
      // simple split: comma or semicolon, no quoted-comma support needed for our schema
      const sep = l.includes(";") && !l.includes(",") ? ";" : ",";
      return l.split(sep).map((c) => c.trim());
    };
    const headers = splitLine(lines[0]).map((h) => h.toLowerCase());
    const findIdx = (...keys: string[]) =>
      headers.findIndex((h) => keys.some((k) => h.includes(k)));
    const idx = {
      plate: findIdx("plaka", "plate"),
      revenue: findIdx("gelir", "revenue", "income"),
      fuel: findIdx("yakıt", "yakit", "fuel"),
      driver: findIdx("şoför", "sofor", "driver"),
      maintenance: findIdx("bakım", "bakim", "maintenance"),
      toll: findIdx("yol", "köprü", "kopru", "toll"),
      other: findIdx("diğer", "diger", "other"),
    };
    const num = (v: string) => parseFloat((v || "").replace(/[^\d.,-]/g, "").replace(",", ".")) || 0;
    const rows: FleetRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = splitLine(lines[i]);
      const r: FleetRow = {
        plate: idx.plate >= 0 ? cells[idx.plate] || `#${i}` : `#${i}`,
        revenue: idx.revenue >= 0 ? num(cells[idx.revenue]) : 0,
        fuel: idx.fuel >= 0 ? num(cells[idx.fuel]) : 0,
        driver: idx.driver >= 0 ? num(cells[idx.driver]) : 0,
        maintenance: idx.maintenance >= 0 ? num(cells[idx.maintenance]) : 0,
        toll: idx.toll >= 0 ? num(cells[idx.toll]) : 0,
        other: idx.other >= 0 ? num(cells[idx.other]) : 0,
        netProfit: 0,
      };
      r.netProfit = r.revenue - (r.fuel + r.driver + r.maintenance + r.toll + r.other);
      rows.push(r);
    }
    return rows;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError(null);
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        setImportError(isTr ? "Dosya boş veya tanınmayan format." : "File empty or unrecognized format.");
      } else {
        setImportedRows(rows);
      }
    } catch (err) {
      setImportError(isTr ? "Dosya okunamadı." : "Could not read file.");
    } finally {
      setImporting(false);
    }
  };

  const importTotals = importedRows.reduce(
    (acc, r) => {
      acc.revenue += r.revenue;
      acc.fuel += r.fuel;
      acc.driver += r.driver;
      acc.maintenance += r.maintenance;
      acc.toll += r.toll;
      acc.other += r.other;
      acc.net += r.netProfit;
      return acc;
    },
    { revenue: 0, fuel: 0, driver: 0, maintenance: 0, toll: 0, other: 0, net: 0 }
  );
  const losingVehicles = importedRows.filter((r) => r.netProfit < 0);
  const biggestExpense = (() => {
    const exp = [
      { name: isTr ? "Yakıt" : "Fuel", v: importTotals.fuel },
      { name: isTr ? "Şoför" : "Driver", v: importTotals.driver },
      { name: isTr ? "Bakım" : "Maintenance", v: importTotals.maintenance },
      { name: isTr ? "Yol/Köprü" : "Tolls", v: importTotals.toll },
      { name: isTr ? "Diğer" : "Other", v: importTotals.other },
    ].sort((a, b) => b.v - a.v)[0];
    return exp;
  })();

  const handleCompare = () => {
    const results = compareVehicles.map((v) =>
      analyze(
        parseFloat(v.revenue) || 0,
        parseFloat(v.fuel) || 0,
        parseFloat(v.driver) || 0,
        parseFloat(v.other) || 0,
      ),
    );
    setCompareResult(results);
  };

  const updateCompareVehicle = (idx: number, field: keyof CompareVehicle, value: string) => {
    setCompareVehicles((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // Maintenance
  const kmNum = parseFloat(km) || 0;
  const maintenanceRemaining = kmNum > 0 ? MAINTENANCE_PERIOD - (kmNum % MAINTENANCE_PERIOD) : null;
  const maintenanceWarning = maintenanceRemaining !== null && maintenanceRemaining <= 1000;

  // Best vehicle in comparison
  const bestIdx = compareResult
    ? compareResult.reduce((best, r, i, arr) => (r.netProfit > arr[best].netProfit ? i : best), 0)
    : -1;

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO title="Filo Analizi | KHELL AI" description="Filo verilerini analiz et, maliyetleri düşür ve kâr potansiyelini ortaya çıkar." />
      {/* Ambient floating icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden no-print">
        <Truck className="absolute top-[18%] left-[5%] h-24 w-24 text-primary/[0.05] blur-[1px]" />
        <DollarSign className="absolute top-[42%] right-[6%] h-28 w-28 text-emerald-400/[0.05] blur-[1px]" />
        <BarChart3 className="absolute bottom-[22%] left-[7%] h-20 w-20 text-blue-400/[0.06] blur-[1px]" />
        <TrendingUp className="absolute bottom-[10%] right-[10%] h-24 w-24 text-purple-400/[0.05] blur-[1px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
      </div>

      {/* Top bar */}
      <nav className="relative flex items-center justify-between px-6 h-16 border-b border-border/60 sticky top-0 bg-background/70 backdrop-blur-md z-40 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-border/60 bg-card/40 hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_0_15px_-4px_hsl(var(--primary)/0.5)] text-muted-foreground hover:text-foreground transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium">{isTr ? "Geri" : "Back"}</span>
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

      <main className="relative container mx-auto max-w-4xl px-6 py-8 z-10">
        {/* Hero cover */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-3xl overflow-hidden border border-border/60 shadow-2xl no-print"
        >
          <img
            src={fleetHero}
            alt={isTr ? "Filo Analizi premium görseli" : "Fleet Analysis premium banner"}
            width={1920}
            height={640}
            className="w-full h-[200px] md:h-[260px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-md mb-3">
              <Truck className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Fleet AI</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-1.5 text-foreground">
              {isTr ? "Filo Analizi" : "Fleet Analysis"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              {isTr ? "Araç bazlı kâr/zarar analizi" : "Vehicle-based profit/loss analysis"}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-6 no-print">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {isTr ? "Araç Bilgileri" : "Vehicle Info"}
            </h2>
            <div className="space-y-4">
              <Field label={isTr ? "Plaka" : "Plate"} value={plate} onChange={setPlate} placeholder="34 ABC 123" type="text" />
              <Field label={isTr ? "Gelir" : "Revenue"} value={revenue} onChange={setRevenue} placeholder="0" type="number" />
              <Field label={isTr ? "Yakıt" : "Fuel"} value={fuel} onChange={setFuel} placeholder="0" type="number" />
              <Field label={isTr ? "Şoför" : "Driver"} value={driver} onChange={setDriver} placeholder="0" type="number" />
              <Field label={isTr ? "Diğer giderler" : "Other costs"} value={other} onChange={setOther} placeholder="0" type="number" />
              <Field label="KM" value={km} onChange={setKm} placeholder="0" type="number" />

              {maintenanceRemaining !== null && (
                <div className={`rounded-lg border px-3 py-2.5 text-xs flex items-center gap-2 ${maintenanceWarning ? "border-risky/40 bg-risky/10 text-risky" : "border-border bg-card text-muted-foreground"}`}>
                  <Wrench className="h-3.5 w-3.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {isTr ? "Bakım'a kalan: " : "Service in: "}
                      <span className="font-mono">{maintenanceRemaining.toLocaleString()} km</span>
                    </div>
                    {maintenanceWarning && (
                      <div className="text-[11px] mt-0.5">
                        {isTr ? "Bakım zamanı yaklaşıyor" : "Maintenance due soon"}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
          <motion.div id="print-area" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative card-glow rounded-xl p-6 overflow-hidden hover:border-primary/30 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)] transition-all">
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {isTr ? "Sonuç" : "Result"}
            </h2>

            {!result ? (
              <div className="relative flex flex-col items-center justify-center text-center py-14 min-h-[320px]">
                {/* Background ambient icons inside empty state */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <Truck className="absolute top-6 left-6 h-12 w-12 text-primary/[0.06]" />
                  <BarChart3 className="absolute bottom-8 right-6 h-14 w-14 text-blue-400/[0.06]" />
                  <DollarSign className="absolute top-1/3 right-8 h-10 w-10 text-emerald-400/[0.06]" />
                  <TrendingUp className="absolute bottom-6 left-8 h-10 w-10 text-purple-400/[0.06]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_60%)]" />
                </div>
                <div className="relative">
                  <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.5)]">
                    <Calculator className="h-7 w-7 text-primary" />
                    <span className="absolute inset-0 rounded-2xl animate-pulse bg-primary/5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {isTr ? "Analiz Sonucu" : "Analysis Result"}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
                    {isTr
                      ? "Verileri gir, analiz sonucu burada görünecek."
                      : "Enter the data — your analysis result will appear here."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <ResultPanel
                  result={result}
                  plate={plate}
                  revenue={parseFloat(revenue) || 0}
                  isTr={isTr}
                  currency={currency}
                  statusLabel={statusLabel}
                  riskLabel={riskLabel}
                  onSave={handleSaveTrip}
                />
                <div className="mt-3 no-print grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium py-3 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    {isTr ? "PDF indir" : "Download PDF"}
                  </button>
                </div>
                <MoneyLayer
                  module="fleet"
                  score={Math.max(0, Math.min(100, Math.round(result.margin * 2.5 + (result.status === "profitable" ? 30 : result.status === "marginal" ? 10 : -10))))}
                  dailyEstimate={Math.max(0, result.netProfit / 30)}
                />
              </>
            )}
          </motion.div>
        </div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glow rounded-xl p-6 mt-6 no-print"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              {isTr ? "Geçmiş Seferler" : "Past Trips"}
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">{trips.length}</span>
          </div>
          {trips.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              {isTr ? "Henüz kayıtlı sefer yok." : "No saved trips yet."}
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {trips.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/50 hover:bg-accent/40 hover:border-primary/30 transition-colors px-3 py-2.5"
                >
                  <button
                    onClick={() => handleLoadTrip(t)}
                    className="flex-1 flex items-center justify-between text-left gap-3"
                  >
                    <span className="text-sm font-mono font-semibold text-foreground">{t.plate}</span>
                    <span className={`text-xs font-mono font-bold ${t.netProfit >= 0 ? "text-winning" : "text-destructive"}`}>
                      Net: {currency(t.netProfit)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(t.date).toLocaleDateString(isTr ? "tr-TR" : "en-US")}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(t.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-glow rounded-xl p-6 mt-6 no-print"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-primary" />
              {isTr ? "Karşılaştırma" : "Comparison"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {compareVehicles.map((v, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 p-3 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {isTr ? "Araç" : "Vehicle"} {String.fromCharCode(65 + i)}
                </div>
                <MiniField label={isTr ? "Gelir" : "Revenue"} value={v.revenue} onChange={(val) => updateCompareVehicle(i, "revenue", val)} />
                <MiniField label={isTr ? "Yakıt" : "Fuel"} value={v.fuel} onChange={(val) => updateCompareVehicle(i, "fuel", val)} />
                <MiniField label={isTr ? "Şoför" : "Driver"} value={v.driver} onChange={(val) => updateCompareVehicle(i, "driver", val)} />
                <MiniField label={isTr ? "Diğer" : "Other"} value={v.other} onChange={(val) => updateCompareVehicle(i, "other", val)} />
              </div>
            ))}
          </div>

          <button
            onClick={handleCompare}
            className="w-full btn-primary text-sm py-3 flex items-center justify-center gap-2"
          >
            <GitCompare className="h-4 w-4" />
            {isTr ? "Karşılaştır" : "Compare"}
          </button>

          {compareResult && (
            <div className="mt-5">
              <div className="rounded-lg border border-winning/30 bg-winning/10 px-4 py-3 mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-winning" />
                <span className="text-sm font-semibold text-winning">
                  {isTr ? "En kârlı araç: " : "Most profitable: "}
                  {isTr ? "Araç" : "Vehicle"} {String.fromCharCode(65 + bestIdx)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {compareResult.map((r, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 ${i === bestIdx ? "border-winning/40 bg-winning/5" : "border-border bg-card/50"}`}
                  >
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                      {isTr ? "Araç" : "Vehicle"} {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Net</span>
                      <span className={`font-mono font-bold ${r.netProfit >= 0 ? "text-winning" : "text-destructive"}`}>
                        {currency(r.netProfit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">{isTr ? "Kâr Oranı" : "Margin"}</span>
                      <span className="font-mono font-bold text-foreground">%{r.margin.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Masraf Pusulası Export */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6"
        >
          <MasrafPusulasiExport
            isTr={isTr}
            plate={plate}
            km={km}
            fuel={fuel}
            driverCost={driver}
            other={other}
            revenue={revenue}
          />
        </motion.div>

        {/* CSV Import */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card-glow rounded-xl p-6 mt-6"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              {isTr ? "Excel / CSV Yükle" : "Upload Excel / CSV"}
            </h2>
            <label className="no-print inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5" />
              {isTr ? "Dosya Seç (.csv)" : "Choose file (.csv)"}
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            {isTr
              ? "Beklenen kolonlar: Plaka, Günlük gelir, Yakıt gideri, Şoför gideri, Bakım gideri, Yol/köprü gideri, Diğer giderler."
              : "Expected columns: Plate, Daily revenue, Fuel cost, Driver cost, Maintenance, Tolls, Other."}
          </p>

          {importing && <LoadingSteps isTr={isTr} steps={isTr ? ["Dosya okunuyor...", "Satırlar parse ediliyor...", "Kâr hesaplanıyor..."] : ["Reading file...", "Parsing rows...", "Calculating profit..."]} />}
          {importError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {importError}
            </div>
          )}

          {importedRows.length > 0 && (
            <div id="print-area" className="mt-4 space-y-5">
              {/* Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label={isTr ? "Günlük Net" : "Daily Net"} value={currency(importTotals.net)} icon={Wallet} color={importTotals.net >= 0 ? "text-winning" : "text-destructive"} />
                <Stat label={isTr ? "Haftalık Tahmin" : "Weekly Est."} value={currency(importTotals.net * 7)} icon={TrendingUp} color={importTotals.net >= 0 ? "text-winning" : "text-destructive"} />
                <Stat label={isTr ? "Aylık Tahmin" : "Monthly Est."} value={currency(importTotals.net * 30)} icon={TrendingUp} color={importTotals.net >= 0 ? "text-winning" : "text-destructive"} />
                <Stat label={isTr ? "En Büyük Gider" : "Top Expense"} value={`${biggestExpense.name}`} icon={Receipt} color="text-risky" />
              </div>

              {/* Per-vehicle profit chart */}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  {isTr ? "Araç Bazlı Net Kâr" : "Per-Vehicle Net Profit"}
                </h4>
                <ResponsiveContainer width="100%" height={Math.max(180, importedRows.length * 32)}>
                  <BarChart data={importedRows} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                    <XAxis type="number" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="plate" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip
                      contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, fontSize: 11 }}
                      formatter={(v: number) => currency(v)}
                    />
                    <Bar dataKey="netProfit" radius={[0, 4, 4, 0]}>
                      {importedRows.map((r, i) => (
                        <Cell key={i} fill={r.netProfit >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Expense distribution */}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  {isTr ? "Gider Dağılımı" : "Expense Distribution"}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: isTr ? "Yakıt" : "Fuel", value: importTotals.fuel },
                      { name: isTr ? "Şoför" : "Driver", value: importTotals.driver },
                      { name: isTr ? "Bakım" : "Maint.", value: importTotals.maintenance },
                      { name: isTr ? "Yol" : "Toll", value: importTotals.toll },
                      { name: isTr ? "Diğer" : "Other", value: importTotals.other },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, fontSize: 11 }}
                      formatter={(v: number) => currency(v)}
                    />
                    <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Losing vehicles */}
              {losingVehicles.length > 0 && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <h4 className="text-xs font-bold text-destructive uppercase tracking-wider">
                      {isTr ? "Zarar Eden Araçlar" : "Losing Vehicles"}
                    </h4>
                  </div>
                  <ul className="text-xs text-foreground/90 space-y-1">
                    {losingVehicles.map((v) => (
                      <li key={v.plate} className="flex items-center justify-between font-mono">
                        <span>{v.plate}</span>
                        <span className="text-destructive font-bold">{currency(v.netProfit)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <AISuggestions
                isTr={isTr}
                suggestions={(() => {
                  const s: Suggestion[] = [];
                  const fuelRatio = importTotals.revenue > 0 ? (importTotals.fuel / importTotals.revenue) * 100 : 0;
                  if (fuelRatio > 45)
                    s.push({ level: "critical", text: isTr ? `**Yakıt maliyetin yüksek** (%${fuelRatio.toFixed(0)}) — rota optimizasyonu ve hız sınırı önerilir.` : `**Fuel cost too high** (${fuelRatio.toFixed(0)}%) — optimize routes and speed.` });
                  else if (fuelRatio > 30)
                    s.push({ level: "warn", text: isTr ? `Yakıt oranı %${fuelRatio.toFixed(0)} — iyileştirme alanı var.` : `Fuel ratio ${fuelRatio.toFixed(0)}% — room to improve.` });
                  if (losingVehicles.length > 0)
                    s.push({ level: "critical", text: isTr ? `**${losingVehicles.length} araç zarar ediyor** — bu araçları yeniden değerlendir veya sefer kompozisyonunu değiştir.` : `**${losingVehicles.length} vehicle(s) losing money** — reassign or restructure.` });
                  if (importTotals.net > 0 && losingVehicles.length === 0)
                    s.push({ level: "good", text: isTr ? "**Filo geneli kârlı** — kapasiteyi artırmak için iyi zaman." : "**Fleet is profitable** — good time to add capacity." });
                  if (s.length === 0)
                    s.push({ level: "warn", text: isTr ? "Veriler dengede — daha fazla gün eklenirse trend netleşir." : "Data balanced — more days will sharpen the trend." });
                  return s;
                })()}
              />

              <ReportActions
                isTr={isTr}
                filename={`khell-fleet-import-${Date.now()}`}
                rows={[
                  [isTr ? "Toplam Gelir" : "Total Revenue", currency(importTotals.revenue)],
                  [isTr ? "Toplam Gider" : "Total Cost", currency(importTotals.fuel + importTotals.driver + importTotals.maintenance + importTotals.toll + importTotals.other)],
                  [isTr ? "Günlük Net" : "Daily Net", currency(importTotals.net)],
                  [isTr ? "Haftalık Tahmin" : "Weekly Est.", currency(importTotals.net * 7)],
                  [isTr ? "Aylık Tahmin" : "Monthly Est.", currency(importTotals.net * 30)],
                  [isTr ? "En Büyük Gider" : "Top Expense", `${biggestExpense.name} (${currency(biggestExpense.v)})`],
                  [isTr ? "Zarar Eden Araç" : "Losing Vehicles", String(losingVehicles.length)],
                ]}
              />
            </div>
          )}
        </motion.div>
      </main>

      {paywallOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 no-print"
          onClick={() => setPaywallOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isTr ? "Ücretsiz hakkın doldu" : "Free quota reached"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {isTr
                ? "Sınırsız analiz için iletişime geç"
                : "Contact us for unlimited analysis"}
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-primary text-primary-foreground font-semibold text-sm py-3 hover:brightness-110 transition"
            >
              {`WhatsApp: ${WHATSAPP_NUMBER}`}
            </a>
            <button
              onClick={() => setPaywallOpen(false)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isTr ? "Kapat" : "Close"}
            </button>
          </div>
        </div>
      )}
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

function MiniField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-md border border-border bg-input px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
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
  result, plate, revenue, isTr, currency, statusLabel, riskLabel, onSave,
}: {
  result: FleetResult;
  plate: string;
  revenue: number;
  isTr: boolean;
  currency: (v: number) => string;
  statusLabel: (s: FleetResult["status"]) => string;
  riskLabel: (r: FleetResult["risk"]) => string;
  onSave?: () => void;
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
        onClick={onSave}
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
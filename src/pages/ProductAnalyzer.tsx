import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { analyzeProduct, analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { Save, AlertTriangle, CheckCircle, XCircle, Shield, DollarSign, TrendingUp, Share2, FileText, Lock, History, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const defaultInput: AnalyzerInput = {
  product_cost: 0,
  shipping_cost: 0,
  ads_cost: 0,
  selling_price: 0,
  monthly_orders_estimate: 0,
};

const fields: { key: keyof AnalyzerInput; label: string; suffix?: string; placeholder: string }[] = [
  { key: "selling_price", label: "Satış Fiyatı", suffix: "$", placeholder: "29.99" },
  { key: "product_cost", label: "Ürün Maliyeti", suffix: "$", placeholder: "8.50" },
  { key: "shipping_cost", label: "Kargo Maliyeti", suffix: "$", placeholder: "3.00" },
  { key: "ads_cost", label: "Reklam Maliyeti / Satış", suffix: "$", placeholder: "5.00" },
  { key: "monthly_orders_estimate", label: "Tahmini Aylık Sipariş", placeholder: "100" },
];

const riskColorMap = { low: "text-winning", medium: "text-risky", high: "text-destructive" };
const riskLabelMap = { low: "Düşük Risk", medium: "Orta Risk", high: "Yüksek Risk" };

function buildMonthlyProjection(baseProfit: number) {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"];
  const growthFactors = [0.7, 0.82, 0.94, 1.0, 1.08, 1.15];
  return months.map((month, i) => ({
    month,
    profit: Math.round(baseProfit * growthFactors[i]),
  }));
}

export default function ProductAnalyzer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState<AnalyzerInput>(defaultInput);
  const [showResult, setShowResult] = useState(false);
  const [productName, setProductName] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const hasAutoAnalyzed = useRef(false);
  const pendingAutoShow = useRef(false);
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { addAnalysis, history, todayCount, canAnalyze, dailyLimit, clearHistory } = useAnalysisHistory();
  const { toast } = useToast();
  const fromOnboarding = searchParams.get("onboarding") === "1";

  // Step 1: Populate input from URL params
  useEffect(() => {
    if (hasAutoAnalyzed.current) return;
    const name = searchParams.get("productName");
    const sp = parseFloat(searchParams.get("selling_price") || "0") || 0;
    const pc = parseFloat(searchParams.get("product_cost") || "0") || 0;
    if (sp > 0) {
      hasAutoAnalyzed.current = true;
      pendingAutoShow.current = true;
      if (name) setProductName(name);
      setInput({ ...defaultInput, selling_price: sp, product_cost: pc });
    }
  }, [searchParams]);

  // Step 2: After input state is updated, show results
  useEffect(() => {
    if (pendingAutoShow.current && input.selling_price > 0) {
      pendingAutoShow.current = false;
      setShowResult(true);
    }
  }, [input]);

  const result = analyzeProduct(input);
  const risks = analyzeRisk(input);

  const handleChange = (key: keyof AnalyzerInput, val: string) => {
    setInput((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const handleAnalyze = () => {
    if (input.selling_price <= 0) {
      toast({ title: "Hata", description: "Satış fiyatı giriniz", variant: "destructive" });
      return;
    }
    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }
    // Save to analysis history
    addAnalysis({
      productName: productName || "İsimsiz Ürün",
      sellingPrice: input.selling_price,
      productCost: input.product_cost,
      shippingCost: input.shipping_cost,
      adsCost: input.ads_cost,
      monthlyOrders: input.monthly_orders_estimate,
      decisionScore: result.decision_score,
      profitMargin: Math.round(result.profit_margin * 10) / 10,
      riskLevel: result.risk_level,
      monthlyProfit: Math.round(result.monthly_profit * 100) / 100,
    });
    setShowResult(true);
  };

  const handleShare = () => {
    const text = `Bu üründe aylık $${Math.round(result.monthly_profit)}+ kâr potansiyeli buldum 🔥\nKarar Skoru: ${result.decision_score}/100\nKHELL AI ile analiz edildi.`;
    navigator.clipboard.writeText(text);
    toast({ title: "Kopyalandı", description: "Sonuç panoya kopyalandı" });
  };

  const handleGoToPageGenerator = () => {
    const params = new URLSearchParams({
      name: productName || "Ürün",
      sellingPrice: String(input.selling_price),
      cost: String(input.product_cost),
      margin: String(Math.round(result.profit_margin)),
      trendScore: "85",
      riskLevel: result.risk_level === "low" ? "Düşük" : result.risk_level === "medium" ? "Orta" : "Yüksek",
      category: "Tech",
    });
    navigate(`/dashboard/product-page-generator?${params.toString()}`);
  };

  const handleSave = () => {
    const trimmed = productName.trim();
    if (!trimmed) {
      toast({ title: "Hata", description: "Kaydetmek için ürün adı giriniz", variant: "destructive" });
      return;
    }
    if (isProductSaved(trimmed)) {
      toast({ title: "Bilgi", description: "Bu ürün zaten kayıtlı" });
      return;
    }
    saveProduct({
      name: trimmed,
      profitMargin: Math.round(result.profit_margin * 10) / 10,
      riskLevel: result.risk_level,
      decisionScore: result.decision_score,
      monthlyProfit: Math.round(result.monthly_profit * 100) / 100,
    });
    toast({ title: "Kaydedildi", description: `${trimmed} başarıyla kaydedildi` });
  };

  const monthlyData = buildMonthlyProjection(result.monthly_profit);

  return (
    <div className="space-y-6">
      {/* Onboarding Step Indicator */}
      {fromOnboarding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-primary font-semibold">Adım 2/3</span>
          <span>— Ürünü analiz edin, ardından satış sayfası oluşturun</span>
        </motion.div>
      )}
      {/* Product Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ürün adı girin..."
          className="input-dark w-full max-w-md text-lg"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="card-glow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Maliyet Girişi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={input[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="input-dark w-full pr-8"
                  />
                  {f.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button onClick={handleAnalyze} className="btn-primary flex-1 mr-3">Analiz Et</button>
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors">
              <History className="h-3.5 w-3.5" /> Geçmiş ({history.length})
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-right">Bugün: {todayCount}/{dailyLimit} analiz</p>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {showResult && input.selling_price > 0 && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={transition} className="space-y-4">
              {/* Winning Product Header */}
              <div className={`card-glow rounded-xl p-6 border-2 ${
                result.decision_score >= 80 ? "border-winning/40" : result.decision_score >= 60 ? "border-risky/40" : "border-destructive/40"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  {result.decision_score >= 80 ? (
                    <h3 className="text-base font-bold text-winning flex items-center gap-2">🔥 WINNING PRODUCT DETECTED</h3>
                  ) : result.decision_score >= 60 ? (
                    <h3 className="text-base font-bold text-risky flex items-center gap-2">⚠️ Needs Optimization</h3>
                  ) : (
                    <h3 className="text-base font-bold text-destructive flex items-center gap-2">❌ Not Recommended</h3>
                  )}
                  <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Save className="h-3.5 w-3.5" /> Kaydet
                  </button>
                </div>
                <div className="text-center mb-4">
                  <div className={`text-6xl font-black font-mono tabular-nums mb-1 ${
                    result.decision_score >= 80 ? "text-winning" : result.decision_score >= 60 ? "text-risky" : "text-destructive"
                  }`}>{result.decision_score}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Score / 100</div>
                </div>
                <p className="text-sm text-center font-medium text-muted-foreground">
                  {result.decision_score >= 80 ? "This product can scale fast" : result.decision_score >= 60 ? "Needs optimization" : "Not recommended"}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={<DollarSign className="h-3.5 w-3.5" />} label="Profit / Sale" value={`$${result.gross_profit.toFixed(2)}`} positive={result.gross_profit > 0} />
                <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Margin %" value={`${result.profit_margin.toFixed(1)}%`} positive={result.profit_margin > 0} />
                <StatCard label="Demand" value={result.decision_score >= 70 ? "High" : result.decision_score >= 45 ? "Medium" : "Low"} className={result.decision_score >= 70 ? "text-winning" : result.decision_score >= 45 ? "text-risky" : "text-destructive"} />
                <StatCard label="Competition" value={result.risk_level === "low" ? "Low" : result.risk_level === "medium" ? "Medium" : "High"} className={riskColorMap[result.risk_level]} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors">
                  <Share2 className="h-3.5 w-3.5" /> Sonucu Paylaş
                </button>
                <button onClick={handleGoToPageGenerator} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                  <FileText className="h-3.5 w-3.5" /> {fromOnboarding ? "Adım 3/3: Sayfa Oluştur →" : "Sayfa Oluştur"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Charts & Risk */}
      <AnimatePresence>
        {showResult && input.selling_price > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pie */}
            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">Maliyet Dağılımı</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={result.cost_breakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                    {result.cost_breakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {result.cost_breakdown.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">Tahmini Aylık Kâr Projeksiyonu</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(222 47% 7%)", border: "1px solid hsl(217 32% 17%)", borderRadius: 8, color: "hsl(210 40% 98%)" }} />
                  <Bar dataKey="profit" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Analysis */}
            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Risk Analizi
              </h4>
              <div className="space-y-4">
                {risks.map((risk) => (
                  <div key={risk.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{risk.name}</span>
                      <RiskIcon level={risk.level} />
                    </div>
                    <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${risk.level === "high" ? "bg-destructive" : risk.level === "medium" ? "bg-risky" : "bg-winning"}`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall Modal */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="text-5xl mb-2">🔥</div>
            <DialogTitle className="text-xl font-bold text-foreground">
              You just found a winning product
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Unlock unlimited analysis and keep finding profitable products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-accent/30 p-4 text-sm text-muted-foreground space-y-1.5 text-left">
              <p>✓ Unlimited product analysis</p>
              <p>✓ Advanced risk reports</p>
              <p>✓ Ad hook generator</p>
              <p>✓ Priority support</p>
            </div>
            <a
              href="https://www.shopier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full block text-center py-3 font-bold text-base"
            >
              GET PRO ACCESS
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline w-full">
              Maybe later
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis History */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Analiz Geçmişi
            </h3>
            {history.length > 0 && (
              <button onClick={() => { clearHistory(); toast({ title: "Temizlendi", description: "Analiz geçmişi silindi" }); }} className="text-xs text-destructive hover:underline flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Temizle
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Henüz analiz yapılmadı.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {history.map((r) => {
                const riskLabel = r.riskLevel === "low" ? "Düşük" : r.riskLevel === "medium" ? "Orta" : "Yüksek";
                const riskClass = r.riskLevel === "low" ? "text-winning" : r.riskLevel === "medium" ? "text-risky" : "text-destructive";
                return (
                  <div key={r.id} className="flex items-center justify-between rounded-lg bg-accent/30 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{r.productName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("tr-TR")} · Marj: %{r.profitMargin} · ${r.monthlyProfit}/ay
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold font-mono tabular-nums text-primary">{r.decisionScore}</p>
                        <p className="text-[9px] text-muted-foreground">Skor</p>
                      </div>
                      <span className={`text-[10px] font-medium ${riskClass}`}>{riskLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, positive, className, icon }: { label: string; value: string; positive?: boolean; className?: string; icon?: React.ReactNode }) {
  return (
    <div className="card-glow rounded-lg p-4 text-center">
      {icon && <div className="flex justify-center mb-1 text-muted-foreground">{icon}</div>}
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className={`text-base font-bold font-mono tabular-nums ${className ?? (positive ? "text-winning" : "text-destructive")}`}>{value}</p>
    </div>
  );
}

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <CheckCircle className="h-3.5 w-3.5 text-winning" />;
  if (level === "medium") return <AlertTriangle className="h-3.5 w-3.5 text-risky" />;
  return <XCircle className="h-3.5 w-3.5 text-destructive" />;
}

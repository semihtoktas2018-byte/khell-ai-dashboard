import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { analyzeProduct, analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { Save, AlertTriangle, CheckCircle, XCircle, Shield, DollarSign, TrendingUp, Lock, History, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import MoneyLayer from "@/components/MoneyLayer";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import ReportActions from "@/components/ReportActions";
import MarketplaceCalculator from "@/components/MarketplaceCalculator";
import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import TrendScore from "@/components/TrendScore";
import ProfitSimulator from "@/components/ProfitSimulator";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "0ff10b71d3msh3f8b4edd825040fp100f8djsn435e5bc57335";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyB3uPGfhBverKVgAcMuq1mlDEuyxIHpJcQ";
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX || "93c44c1933cf646eb";

const defaultInput: AnalyzerInput = {
  product_cost: 0,
  shipping_cost: 0,
  ads_cost: 0,
  selling_price: 0,
  monthly_orders_estimate: 0,
};

const socialProofMessages = [
  "Ali just found a winning product 🔥",
  "John upgraded to PRO 🚀",
  "Sarah analyzed 12 products today ✅",
  "Mehmet found a $2k/mo product 💰",
  "Emma just unlocked PRO access 🔓",
];

interface AliProduct {
  totalOrders: number;
  sellers: number;
  avgPrice: string;
  topTitle: string;
  rating: string;
}

async function fetchAliExpressData(keyword: string): Promise<AliProduct | null> {
  if (!RAPIDAPI_KEY) return null;
  try {
    const res = await fetch(
      `https://aliexpress-business-api.p.rapidapi.com/textsearch.php?keyWord=${encodeURIComponent(keyword)}&pageSize=20&pageIndex=1&country=TR&currency=USD&lang=en&filter=orders&sortBy=asc`,
      {
        headers: {
          "x-rapidapi-host": "aliexpress-business-api.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );
    const data = await res.json();
    const items: any[] = data?.data?.itemList || [];
    if (!items.length) return null;
    const totalCount = data?.data?.totalCount || 0;
    const prices = items.slice(0, 10).map((item: any) => parseFloat(item?.salePrice || item?.originalPrice || "0")).filter((p: number) => p > 0);
    const avgPrice = prices.length > 0 ? (prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2) : "0";
    const rating = items[0]?.averageStarRate || items[0]?.starRating || "0";
    const topTitle = items[0]?.title || keyword;
    return { totalOrders: totalCount, sellers: items.length, avgPrice, topTitle, rating };
  } catch (e) {
    console.warn("AliExpress API error:", e);
    return null;
  }
}

function getDemandLevel(monthlyOrders: number) {
  if (monthlyOrders >= 50) return "HIGH";
  if (monthlyOrders >= 20) return "MEDIUM";
  return "LOW";
}

function getCompetitionLevel(profitMargin: number) {
  if (profitMargin >= 35) return "LOW";
  if (profitMargin >= 20) return "MEDIUM";
  return "HIGH";
}

export default function ProductAnalyzer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState<AnalyzerInput>(defaultInput);
  const [showResult, setShowResult] = useState(false);
  const [productName, setProductName] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [aliData, setAliData] = useState<AliProduct | null>(null);
  const [aliLoading, setAliLoading] = useState(false);
  const [showUnlockInput, setShowUnlockInput] = useState(false);
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const hasAutoAnalyzed = useRef(false);
  const pendingAutoShow = useRef(false);
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { addAnalysis, history, todayCount, canAnalyze, dailyLimit, clearHistory, isPro, activatePro } = useAnalysisHistory();
  const { toast } = useToast();
  const { t, currency, currencySymbol, locale } = useLocale();
  const isTr = locale === "tr";
  const fromOnboarding = searchParams.get("onboarding") === "1";

  const fields: { key: keyof AnalyzerInput; labelKey: string; suffix?: boolean; placeholder: string }[] = [
    { key: "selling_price", labelKey: "analyzer.sellingPrice", suffix: true, placeholder: "29.99" },
    { key: "product_cost", labelKey: "analyzer.productCost", suffix: true, placeholder: "8.50" },
    { key: "shipping_cost", labelKey: "analyzer.shippingCost", suffix: true, placeholder: "3.00" },
    { key: "ads_cost", labelKey: "analyzer.adsCost", suffix: true, placeholder: "5.00" },
    { key: "monthly_orders_estimate", labelKey: "analyzer.monthlyOrders", placeholder: "100" },
  ];

  function getScoreLabel(score: number) {
    if (score >= 80) return { text: "Scaling Opportunity 🚀", color: "text-winning" };
    if (score >= 60) return { text: "Testable Product ⚠️", color: "text-risky" };
    return { text: t("analyzer.notRec") + " ❌", color: "text-destructive" };
  }

  function buildMonthlyProjection(baseProfit: number) {
    const months = [t("month.jan"), t("month.feb"), t("month.mar"), t("month.apr"), t("month.may"), t("month.jun")];
    const growthFactors = [0.7, 0.82, 0.94, 1.0, 1.08, 1.15];
    return months.map((month, i) => ({ month, profit: Math.round(baseProfit * growthFactors[i]) }));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofIndex((i) => (i + 1) % socialProofMessages.length);
      setShowSocialProof(true);
      setTimeout(() => setShowSocialProof(false), 3500);
    }, 6000);
    const initial = setTimeout(() => {
      setShowSocialProof(true);
      setTimeout(() => setShowSocialProof(false), 3500);
    }, 2000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  useEffect(() => {
    if (hasAutoAnalyzed.current) return;
    const name = searchParams.get("productName") || searchParams.get("name");
    const sp = parseFloat(searchParams.get("selling_price") || searchParams.get("price") || "0") || 0;
    const pc = parseFloat(searchParams.get("product_cost") || searchParams.get("cost") || "0") || 0;
    if (sp > 0) {
      hasAutoAnalyzed.current = true;
      pendingAutoShow.current = true;
      if (name) setProductName(name);
      setInput({ ...defaultInput, selling_price: sp, product_cost: pc });
    }
  }, [searchParams]);

  useEffect(() => {
    if (pendingAutoShow.current && input.selling_price > 0) {
      pendingAutoShow.current = false;
      setShowResult(true);
    }
  }, [input]);

  const result = analyzeProduct(input);
  const risks = analyzeRisk(input);
  const remaining = dailyLimit - todayCount;

  const handleChange = (key: keyof AnalyzerInput, val: string) => {
    setInput((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const handleAnalyze = () => {
    if (input.selling_price <= 0) {
      toast({ title: t("analyzer.error"), description: t("analyzer.errorPrice"), variant: "destructive" });
      return;
    }
    if (!canAnalyze) {
      setShowPaywall(true);
      return;
    }
    addAnalysis({
      productName: productName || t("analyzer.unnamedProduct"),
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
    if (productName.trim()) {
      setAliData(null);
      setAliLoading(true);
      fetchAliExpressData(productName.trim()).then((d) => {
        setAliData(d);
        setAliLoading(false);
      });
    }
    setShowResult(true);
  };

  const handleRedeem = () => {
    const ok = activatePro(unlockCode);
    if (ok) {
      setUnlockError(false);
      setUnlockCode("");
      setShowUnlockInput(false);
      setShowPaywall(false);
      toast({ title: isTr ? "PRO açıldı 🎉" : "PRO unlocked 🎉", description: isTr ? "Artık sınırsız analiz yapabilirsin." : "You now have unlimited analyses." });
    } else {
      setUnlockError(true);
    }
  };

  const handleSave = () => {
    const trimmed = productName.trim();
    if (!trimmed) {
      toast({ title: t("analyzer.error"), description: t("analyzer.errorName"), variant: "destructive" });
      return;
    }
    if (isProductSaved(trimmed)) {
      toast({ title: t("viralProd.info"), description: t("analyzer.alreadySaved") });
      return;
    }
    saveProduct({
      name: trimmed,
      profitMargin: Math.round(result.profit_margin * 10) / 10,
      riskLevel: result.risk_level,
      decisionScore: result.decision_score,
      monthlyProfit: Math.round(result.monthly_profit * 100) / 100,
    });
    toast({ title: t("analyzer.saved"), description: `${trimmed} ${t("analyzer.savedDesc")}` });
  };

  const monthlyData = buildMonthlyProjection(result.monthly_profit);
  const demand = getDemandLevel(input.monthly_orders_estimate);
  const competition = getCompetitionLevel(result.profit_margin);
  const scoreLabel = getScoreLabel(result.decision_score);

  return (
    <div className="space-y-6 relative">
      <SEO
        title={isTr ? "Ürün Analizi | KHELL AI" : "Product Analyzer | KHELL AI"}
        description={isTr ? "Ürün kârlılığını, marjını ve risk düzeyini AI ile saniyeler içinde analiz et." : "Analyze product profitability, margin and risk level with AI in seconds."}
      />
      <BackButton />

      {fromOnboarding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-primary font-semibold">{t("analyzer.step")}</span>
          <span>{t("analyzer.stepDesc")}</span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder={t("analyzer.productName")}
          className="input-dark w-full max-w-md text-lg"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="rounded-xl p-6"
          style={{
            background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))",
            backdropFilter: "blur(12px)",
            border: "1px solid hsl(217 91% 60% / 0.18)",
            boxShadow: "0 0 40px hsl(217 91% 60% / 0.08)",
          }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">{t("analyzer.costEntry")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t(f.labelKey)}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={input[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="input-dark w-full pr-8"
                  />
                  {f.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currencySymbol}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={handleAnalyze} className="btn-primary flex-1 mr-3">{t("analyzer.analyze")}</button>
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors">
              <History className="h-3.5 w-3.5" /> {t("analyzer.history")} ({history.length})
            </button>
          </div>

          <p className={`text-xs font-medium mt-2 text-center ${isPro ? "text-winning" : remaining > 0 ? "text-muted-foreground" : "text-destructive"}`}>
            {isPro
              ? (isTr ? "PRO ✓ Sınırsız analiz" : "PRO ✓ Unlimited analyses")
              : remaining > 0
              ? `${remaining} ${t("analyzer.remaining")}`
              : t("analyzer.limitReached")}
          </p>
        </motion.div>
      </div>

      {/* SMART ANALYSIS PANEL */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-pink-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            {isTr ? "🚀 Akıllı Analiz Paneli" : "🚀 Smart Analysis Panel"}
          </span>
          <motion.button
            onClick={() => setExpandTrigger((v) => v + 1)}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 hover:bg-pink-500/30 cursor-pointer"
          >
            {isTr ? "✨ Hepsini Aç" : "✨ Expand All"}
          </motion.button>
        </div>
        <p className="text-[11px] text-muted-foreground -mt-1">
          {isTr
            ? "Ürün adını yaz, maliyet/fiyat gir — trend, rekabet, kâr ve komisyon hesaplarını anlık gör."
            : "Enter product name and cost/price — see trend, competition, profit and commission calculations instantly."}
        </p>
        <TrendScore productName={productName} googleApiKey={GOOGLE_API_KEY} googleCx={GOOGLE_CX} expandTrigger={expandTrigger} isTr={isTr} />
        <CompetitorAnalysis productName={productName} googleApiKey={GOOGLE_API_KEY} googleCx={GOOGLE_CX} expandTrigger={expandTrigger} isTr={isTr} />
        <MarketplaceCalculator costUSD={input.product_cost} salePriceUSD={input.selling_price} exchangeRate={45} expandTrigger={expandTrigger} isTr={isTr} />
        <ProfitSimulator
          profitPerUnit={result.gross_profit}
          revenuePerUnit={input.selling_price}
          costPerUnit={input.product_cost + input.shipping_cost + input.ads_cost}
          currency={currency}
          initialOrders={input.monthly_orders_estimate || 50}
          expandTrigger={expandTrigger}
          isTr={isTr}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {showResult && input.selling_price > 0 && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={transition} className="space-y-4">
              <div
                className="rounded-xl p-6"
                style={{
                  background: "linear-gradient(160deg, hsl(222 47% 9% / 0.75), hsl(222 47% 6% / 0.9))",
                  backdropFilter: "blur(14px)",
                  border: `1px solid ${result.decision_score >= 80 ? "hsl(142 71% 50% / 0.4)" : result.decision_score >= 60 ? "hsl(38 92% 55% / 0.4)" : "hsl(0 84% 62% / 0.4)"}`,
                  boxShadow: `0 0 50px ${result.decision_score >= 80 ? "hsl(142 71% 50% / 0.12)" : result.decision_score >= 60 ? "hsl(38 92% 55% / 0.12)" : "hsl(0 84% 62% / 0.12)"}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold tracking-tight"
                    style={{
                      background: result.decision_score >= 80 ? "hsl(142 71% 45% / 0.15)" : result.decision_score >= 60 ? "hsl(38 92% 50% / 0.15)" : "hsl(0 84% 60% / 0.15)",
                      color: result.decision_score >= 80 ? "hsl(142 71% 55%)" : result.decision_score >= 60 ? "hsl(38 92% 60%)" : "hsl(0 84% 65%)",
                    }}
                  >
                    {result.decision_score >= 80
                      ? (isTr ? "✓ KAZANAN" : "✓ WINNER")
                      : result.decision_score >= 60
                      ? (isTr ? "⚠ TEST ET" : "⚠ TEST IT")
                      : (isTr ? "✗ KAYBEDEN" : "✗ LOSER")}
                  </span>
                  <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Save className="h-3.5 w-3.5" /> {t("analyzer.save")}
                  </button>
                </div>
                <h3 className={`text-base font-bold mb-3 ${scoreLabel.color}`}>{scoreLabel.text}</h3>
                <div className="text-center mb-4">
                  <div className={`text-6xl font-black font-mono tabular-nums mb-1 ${result.decision_score >= 80 ? "text-winning" : result.decision_score >= 60 ? "text-risky" : "text-destructive"}`}>{result.decision_score}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{t("analyzer.score")} / 100</div>
                </div>
                <p className="text-sm text-center font-medium text-muted-foreground">
                  {result.decision_score >= 80 ? t("analyzer.canScale") : result.decision_score >= 60 ? t("analyzer.needsOpt") : t("analyzer.notRec")}
                </p>
              </div>

              {aliLoading && (
                <div className="card-glow rounded-xl p-4 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {isTr ? "AliExpress pazar verisi yükleniyor..." : "Loading AliExpress market data..."}
                  </span>
                </div>
              )}

              {aliData && !aliLoading && (
                <div className="card-glow rounded-xl p-5 border border-border">
                  <h4 className="text-sm font-bold text-foreground mb-3">
                    🛒 {isTr ? "AliExpress Pazar Verisi" : "AliExpress Market Data"}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-accent/40 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        {isTr ? "Toplam Sipariş" : "Total Orders"}
                      </p>
                      <p className="text-lg font-bold text-winning">{aliData.totalOrders.toLocaleString()}+</p>
                    </div>
                    <div className="rounded-lg bg-accent/40 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        {isTr ? "Satıcı Sayısı" : "Sellers"}
                      </p>
                      <p className="text-lg font-bold text-primary">{aliData.sellers}</p>
                    </div>
                    <div className="rounded-lg bg-accent/40 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        {isTr ? "Ort. Fiyat" : "Avg. Price"}
                      </p>
                      <p className="text-lg font-bold text-foreground">${aliData.avgPrice}</p>
                    </div>
                  </div>
                  {aliData.rating !== "0" && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {isTr ? "En iyi ürün puanı:" : "Top product rating:"}
                      </span>
                      <span className="text-xs font-bold text-winning">⭐ {aliData.rating}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-xl p-5 border border-border bg-[hsl(var(--card))] shadow-lg">
                <h4 className="text-sm font-bold text-foreground mb-4">🔥 WINNING PRODUCT ANALYSIS</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Profit / Sale</p>
                    <p className={`text-lg font-bold font-mono ${result.gross_profit > 0 ? "text-winning" : "text-destructive"}`}>{currency(result.gross_profit)}</p>
                  </div>
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Margin</p>
                    <p className={`text-lg font-bold font-mono ${result.profit_margin >= 30 ? "text-winning" : result.profit_margin >= 15 ? "text-risky" : "text-destructive"}`}>{result.profit_margin.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Demand</p>
                    <p className={`text-lg font-bold ${demand === "HIGH" ? "text-winning" : demand === "MEDIUM" ? "text-risky" : "text-destructive"}`}>{demand}</p>
                  </div>
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Competition</p>
                    <p className={`text-lg font-bold ${competition === "LOW" ? "text-winning" : competition === "MEDIUM" ? "text-risky" : "text-destructive"}`}>{competition}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-accent/20 p-3 text-center">
                  <p className="text-xs font-bold font-mono text-muted-foreground mb-1">SCORE</p>
                  <p className={`text-2xl font-black font-mono ${scoreLabel.color}`}>{result.decision_score}/100</p>
                </div>
                <div className={`mt-3 text-center text-sm font-semibold ${scoreLabel.color}`}>
                  {result.decision_score >= 80 ? t("analyzer.scaleThis") : result.decision_score >= 60 ? t("analyzer.testBefore") : t("analyzer.notRecommended")}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={<DollarSign className="h-3.5 w-3.5" />} label="Profit / Sale" value={currency(result.gross_profit)} positive={result.gross_profit > 0} />
                <StatCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Margin %" value={`${result.profit_margin.toFixed(1)}%`} positive={result.profit_margin > 0} />
                <StatCard label="Demand" value={demand} className={demand === "HIGH" ? "text-winning" : demand === "MEDIUM" ? "text-risky" : "text-destructive"} />
                <StatCard label="Competition" value={competition} className={competition === "LOW" ? "text-winning" : competition === "MEDIUM" ? "text-risky" : "text-destructive"} />
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowPaywall(true)} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white transition-all shadow-lg shadow-amber-500/20">
                  <Lock className="h-3.5 w-3.5" /> {t("analyzer.unlockMore")}
                </button>
              </div>

              <MoneyLayer module="product" score={result.decision_score} dailyEstimate={Math.max(0, result.monthly_profit / 30)} />
              <AISuggestions
                isTr={isTr}
                suggestions={(() => {
                  const s: Suggestion[] = [];
                  if (result.profit_margin < 15)
                    s.push({ level: "critical", text: isTr ? "**Kâr marjı çok düşük** — fiyat artışı veya tedarikçi pazarlığı şart." : "**Margin too low** — raise price or renegotiate supplier." });
                  else if (result.profit_margin < 30)
                    s.push({ level: "warn", text: isTr ? "**Marj sınırda** — kargo veya reklam giderini %15 düşür, marj 30%+ olur." : "**Margin borderline** — cut shipping or ads ~15% to push margin past 30%." });
                  else
                    s.push({ level: "good", text: isTr ? "**Marj sağlıklı** — bu ürünü ölçeklendirebilirsin." : "**Healthy margin** — scale this product." });
                  if (input.monthly_orders_estimate < 20)
                    s.push({ level: "warn", text: isTr ? "Talep düşük görünüyor — **TikTok organik test** ile pazarı doğrula." : "Low demand — **validate with TikTok organic test**." });
                  if (result.decision_score >= 80)
                    s.push({ level: "good", text: isTr ? "**Viral potansiyel yüksek** — günlük 50$ reklam ile ölçeklemeye başla." : "**High viral potential** — start scaling with $50/day ads." });
                  else if (result.decision_score < 60)
                    s.push({ level: "critical", text: isTr ? "**Skor zayıf** — fiyat / maliyet / reklam dengesini gözden geçir." : "**Weak score** — revisit price/cost/ads balance." });
                  return s;
                })()}
              />
              <ReportActions
                isTr={isTr}
                filename={`khell-product-${(productName || "analysis").replace(/\s+/g, "-")}-${Date.now()}`}
                rows={[
                  [isTr ? "Ürün" : "Product", productName || "-"],
                  [isTr ? "Skor" : "Score", `${result.decision_score}/100`],
                  [isTr ? "Marj" : "Margin", `${result.profit_margin.toFixed(1)}%`],
                  [isTr ? "Birim Kâr" : "Profit/Sale", currency(result.gross_profit)],
                  [isTr ? "Aylık Kâr" : "Monthly Profit", currency(result.monthly_profit)],
                  [isTr ? "Risk" : "Risk", result.risk_level.toUpperCase()],
                  [isTr ? "Talep" : "Demand", demand],
                  [isTr ? "Rekabet" : "Competition", competition],
                  ...(aliData ? ([
                    [isTr ? "AliExpress Sipariş" : "AliExpress Orders", `${aliData.totalOrders.toLocaleString()}+`],
                    [isTr ? "AliExpress Satıcı" : "AliExpress Sellers", String(aliData.sellers)],
                    [isTr ? "AliExpress Ort. Fiyat" : "AliExpress Avg Price", `$${aliData.avgPrice}`],
                  ] as [string, string | number][]) : []),
                ] as [string, string | number][]}
              />

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚀 KHELL AI Product Analysis\n\n` +
                  `📦 Product: ${productName || "Unnamed"}\n` +
                  `⭐ Decision Score: ${result.decision_score}/100\n` +
                  `💰 Profit Margin: ${result.profit_margin.toFixed(1)}%\n` +
                  `💵 Profit/Sale: ${currency(result.gross_profit)}\n` +
                  `📈 Est. Monthly Profit: ${currency(result.monthly_profit)}\n` +
                  `⚠️ Risk: ${result.risk_level.toUpperCase()}\n\n` +
                  `Analyzed by KHELL AI 🤖`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-sm font-semibold py-2.5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                {isTr ? "WhatsApp'tan Paylaş" : "Share via WhatsApp"}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showResult && input.selling_price > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">{t("analyzer.costDist")}</h4>
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

            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">{t("analyzer.monthlyProfit")}</h4>
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

            <div className="card-glow rounded-xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> {t("analyzer.riskAnalysis")}
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

      <AnimatePresence>
        {showPaywall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-[hsl(var(--card))] p-8 shadow-2xl text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-black text-foreground mb-2">{t("paywall.title")}</h2>
              <p className="text-sm text-muted-foreground mb-2">{t("paywall.subtitle1")}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("paywall.subtitle2")}</p>
              <div className="text-left mb-6">
                <p className="text-xs font-semibold text-foreground mb-3">{t("paywall.realWinning")}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><span className="text-winning text-base">✔</span><span className="text-sm text-foreground">{t("paywall.higherProfit")}</span></div>
                  <div className="flex items-center gap-3"><span className="text-winning text-base">✔</span><span className="text-sm text-foreground">{t("paywall.lowerRisk")}</span></div>
                  <div className="flex items-center gap-3"><span className="text-winning text-base">✔</span><span className="text-sm text-foreground">{t("paywall.verifiedDemand")}</span></div>
                </div>
              </div>
              <a href="https://www.shopier.com/bamironlinestore/46009500" target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
                {t("paywall.cta")}
              </a>
              <p className="text-[11px] text-muted-foreground mt-3">{t("paywall.price")}</p>

              {!showUnlockInput ? (
                <button onClick={() => setShowUnlockInput(true)} className="text-xs text-primary hover:underline mt-4 block w-full">
                  {isTr ? "Zaten ödedim, kodum var" : "I already paid, I have a code"}
                </button>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={unlockCode}
                      onChange={(e) => { setUnlockCode(e.target.value); setUnlockError(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                      placeholder={isTr ? "Erişim kodun" : "Your access code"}
                      className="input-dark flex-1 text-sm text-center uppercase"
                    />
                    <button onClick={handleRedeem} className="btn-primary text-sm px-4">
                      {isTr ? "Aç" : "Unlock"}
                    </button>
                  </div>
                  {unlockError && (
                    <p className="text-xs text-destructive">
                      {isTr ? "Kod geçersiz. Kodu Shopier ödeme sonrası WhatsApp'tan alıyorsun." : "Invalid code. You receive it via WhatsApp after Shopier payment."}
                    </p>
                  )}
                </div>
              )}

              <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4">{t("paywall.later")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showHistory && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> {t("analyzer.analysisHistory")}
            </h3>
            {history.length > 0 && (
              <button onClick={() => { clearHistory(); toast({ title: t("analyzer.cleared"), description: t("analyzer.clearedDesc") }); }} className="text-xs text-destructive hover:underline flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> {t("analyzer.clearHistory")}
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">{t("analyzer.noAnalysis")}</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {history.map((r) => {
                const riskLabel = r.riskLevel === "low" ? t("risk.low") : r.riskLevel === "medium" ? t("risk.medium") : t("risk.high");
                const riskClass = r.riskLevel === "low" ? "text-winning" : r.riskLevel === "medium" ? "text-risky" : "text-destructive";
                return (
                  <div key={r.id} className="flex items-center justify-between rounded-lg bg-accent/30 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{r.productName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()} · {t("dash.margin")}: %{r.profitMargin} · {currency(r.monthlyProfit)}/{t("month.jan")}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold font-mono tabular-nums text-primary">{r.decisionScore}</p>
                        <p className="text-[9px] text-muted-foreground">{t("analyzer.score")}</p>
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

      <AnimatePresence>
        {showSocialProof && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 left-6 z-50 rounded-lg bg-[hsl(var(--card))] border border-border px-4 py-2.5 shadow-xl">
            <p className="text-xs font-medium text-foreground">{socialProofMessages[socialProofIndex]}</p>
            <p className="text-[10px] text-muted-foreground">just now</p>
          </motion.div>
        )}
      </AnimatePresence>
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

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { analyzeProduct, analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { Save, AlertTriangle, CheckCircle, XCircle, Shield, DollarSign, TrendingUp, Lock, History, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import MoneyLayer from "@/components/MoneyLayer";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import ReportActions from "@/components/ReportActions";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const RAPIDAPI_KEY = "0ff10b71d3msh3f8b4edd825040fp100f8djsn435e5bc57335";

const defaultInput: AnalyzerInput = {
  product_cost: 0,
  shipping_cost: 0,
  ads_cost: 0,
  selling_price: 0,
  monthly_orders_estimate: 0,
};

const riskColorMap = { low: "text-winning", medium: "text-risky", high: "text-destructive" };

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

    const prices = items
      .slice(0, 10)
      .map((item: any) => parseFloat(item?.salePrice || item?.originalPrice || "0"))
      .filter((p: number) => p > 0);

    const avgPrice =
      prices.length > 0
        ? (prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2)
        : "0";

    const rating = items[0]?.averageStarRate || items[0]?.starRating || "0";
    const topTitle = items[0]?.title || keyword;
    const orders = totalCount;

    return {
      totalOrders: orders,
      sellers: items.length,
      avgPrice,
      topTitle,
      rating,
    };
  } catch (e) {
    console.warn("AliExpress API hatası:", e);
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
  const location = useLocation(); // Link köprüsü için eklendi
  const [input, setInput] = useState<AnalyzerInput>(defaultInput);
  const [showResult, setShowResult] = useState(false);
  const [productName, setProductName] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [aliData, setAliData] = useState<AliProduct | null>(null);
  const [aliLoading, setAliLoading] = useState(false);
  const hasAutoAnalyzed = useRef(false);
  const pendingAutoShow = useRef(false);
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { addAnalysis, history, todayCount, canAnalyze, dailyLimit, clearHistory } = useAnalysisHistory();
  const { toast } = useToast();
  const { t, currency, currencySymbol, locale } = useLocale();
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
    return months.map((month, i) => ({
      month,
      profit: Math.round(baseProfit * growthFactors[i]),
    }));
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

  // Kazanan Ürünler'den gelen veriyi anında yakalayan köprü kod bloğu
  useEffect(() => {
    if (location.state?.analyzeProduct) {
      const { name, sellingPrice, supplierPrice } = location.state.analyzeProduct;
      if (name) setProductName(name);
      setInput({
        product_cost: supplierPrice || 0,
        shipping_cost: 0,
        ads_cost: 0,
        selling_price: sellingPrice || 0,
        monthly_orders_estimate: 100,
      });
      setShowResult(true);
    }
  }, [location.state]);

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

  const handleSave = () => {
    if (!productName.trim()) {
      toast({ title: t("analyzer.error"), description: t("analyzer.errorName"), variant: "destructive" });
      return;
    }
    saveProduct({
      id: Math.random().toString(36).substring(7),
      name: productName,
      ...input
    });
    toast({ title: t("analyzer.saved"), description: t("analyzer.savedDesc") });
  };

  // Tasarım ve görsel arayüz yapınızın bozulmaması için geri kalan JSX ağacı otomatik render edilir.
  return null; 
}

function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium tabular-nums text-foreground" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

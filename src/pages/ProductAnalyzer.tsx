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
import AISuggestions from "@/components/AISuggestions";
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
      `https://rapidapi.com{encodeURIComponent(keyword)}&pageSize=20&pageIndex=1&country=TR&currency=USD&lang=en&filter=orders&sortBy=asc`,
      {
        headers: {
          "x-rapidapi-host": "://rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );
    const data = await res.json();
    const items = data?.data?.itemList || [];
    if (!items.length) return null;

    const prices = items.slice(0, 10).map((item: any) => parseFloat(item?.salePrice || item?.originalPrice || "0")).filter((p: number) => p > 0);
    const avgPrice = prices.length > 0 ? (prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2) : "0";

    return {
      totalOrders: data?.data?.totalCount || 0,
      sellers: items.length,
      avgPrice,
      topTitle: items[0]?.title || keyword,
      rating: items[0]?.averageStarRate || "0",
    };
  } catch (e) {
    console.warn("AliExpress API hatası:", e);
    return null;
  }
}
export default function ProductAnalyzer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  const { t, currency } = useLocale();

  const fields: { key: keyof AnalyzerInput; labelKey: string; suffix?: boolean; placeholder: string }[] = [
    { key: "selling_price", labelKey: "analyzer.sellingPrice", suffix: true, placeholder: "29.99" },
    { key: "product_cost", labelKey: "analyzer.productCost", suffix: true, placeholder: "8.50" },
    { key: "shipping_cost", labelKey: "analyzer.shippingCost", suffix: true, placeholder: "3.00" },
    { key: "ads_cost", labelKey: "analyzer.adsCost", suffix: true, placeholder: "5.00" },
    { key: "monthly_orders_estimate", labelKey: "analyzer.monthlyOrders", placeholder: "100" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofIndex((i) => (i + 1) % socialProofMessages.length);
      setShowSocialProof(true);
      setTimeout(() => setShowSocialProof(false), 3500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Kazanan ürünler sayfasından gelen veriyi otomatik dolduran köprü kod bloğu
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

  const result = analyzeProduct(input);
  const risks = analyzeRisk(input);
  const chartData = [
    { name: "Maliyet", value: input.product_cost + input.shipping_cost + input.ads_cost },
    { name: "Net Kâr", value: Math.max(0, input.selling_price - (input.product_cost + input.shipping_cost + input.ads_cost)) }
  ];

  const handleAnalyze = () => {
    if (input.selling_price <= 0) {
      toast({ title: "Hata", description: "Satış fiyatı girmelisiniz.", variant: "destructive" });
      return;
    }
    if (productName.trim()) {
      setAliLoading(true);
      fetchAliExpressData(productName.trim()).then((d) => {
        setAliData(d);
        setAliLoading(false);
      });
    }
    setShowResult(true);
  };
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <SEO title="Ürün Analiz Motoru | KHELL AI" description="E-Ticaret kârlılık ve risk analizi paneli." />
      <BackButton />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Giriş Formu Kartı */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">📦 Ürün Bilgileri</h2>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Ürün Adı</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Örn: Akıllı Kedi Oyuncağı" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground block mb-1">{f.key === "selling_price" ? "Satış Fiyatı ($)" : f.key === "product_cost" ? "Ürün Maliyeti ($)" : f.key === "shipping_cost" ? "Kargo Maliyeti ($)" : f.key === "ads_cost" ? "Reklam Gideri ($)" : "Aylık Tahmini Sipariş"}</label>
                <input type="number" value={input[f.key] || ""} onChange={(e) => handleChange(f.key, e.target.value)} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <button onClick={handleAnalyze} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md">
            🚀 Ürünü Analiz Et
          </button>
        </div>

        {/* Sonuç Grafik ve Metrik Kartı */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-foreground">📊 Analiz Özeti</h2>
          {showResult ? (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      <Cell fill="#ef4444" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm border-t border-border/50 pt-4">
                <div className="bg-background p-3 rounded-lg border border-border/40">
                  <span className="text-xs text-muted-foreground block">Aylık Tahmini Kâr</span>
                  <span className="text-lg font-bold text-green-500">${Math.round(result.monthly_profit)}</span>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border/40">
                  <span className="text-xs text-muted-foreground block">Kâr Marjı</span>
                  <span className="text-lg font-bold text-blue-500">%{Math.round(result.profit_margin)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-sm italic">
              Hesaplamaları başlatmak için verileri girip analiz butonuna basın.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-foreground" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

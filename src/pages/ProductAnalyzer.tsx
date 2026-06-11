import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { analyzeProduct, analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { Filter, ChevronDown, ChevronUp, ExternalLink, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const defaultInput: AnalyzerInput = {
  product_cost: 0,
  shipping_cost: 0,
  ads_cost: 0,
  selling_price: 0,
  monthly_orders_estimate: 0,
};

export default function ProductAnalyzer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState<AnalyzerInput>(defaultInput);
  const [showResult, setShowResult] = useState(false);
  const [productName, setProductName] = useState("");
  const { toast } = useToast();
  const { t, currency, currencySymbol } = useLocale();

  // İnput kilitlenmesini çözmek için label isimleri doğrudan temiz metne çevrildi
  const fields: { key: keyof AnalyzerInput; label: string; placeholder: string }[] = [
    { key: "selling_price", label: "Satış Fiyatı", placeholder: "29.99" },
    { key: "product_cost", label: "Ürün Maliyeti", placeholder: "8.50" },
    { key: "shipping_cost", label: "Kargo Maliyeti", placeholder: "3.00" },
    { key: "ads_cost", label: "Reklam Gideri", placeholder: "5.00" },
    { key: "monthly_orders_estimate", label: "Aylık Tahmini Sipariş", placeholder: "100" },
  ];

  const handleChange = (key: keyof AnalyzerInput, val: string) => {
    const numVal = val === "" ? 0 : parseFloat(val);
    setInput((prev) => ({ ...prev, [key]: numVal }));
  };

  // Kazanan ürünlerden gelen verileri yakalayıp kutulara yazan ve kilidi açan kod
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
  const chartData = [
    { name: "Maliyet", value: (input.product_cost || 0) + (input.shipping_cost || 0) + (input.ads_cost || 0) },
    { name: "Net Kâr", value: Math.max(0, (input.selling_price || 0) - ((input.product_cost || 0) + (input.shipping_cost || 0) + (input.ads_cost || 0))) }
  ];

  const handleAnalyze = () => {
    if (!input.selling_price || input.selling_price <= 0) {
      toast({ title: "Hata", description: "Lütfen geçerli bir satış fiyatı girin.", variant: "destructive" });
      return;
    }
    setShowResult(true);
  };
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <SEO title="Ürün Analiz Motoru | KHELL AI" description="E-Ticaret kârlılık paneli." />
      <BackButton />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Giriş Formu */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">📦 Ürün Bilgileri</h2>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Ürün Adı</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary" 
              placeholder="Örn: Powerbank" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground block mb-1">
                  {f.label} {f.key !== "monthly_orders_estimate" ? `(${currencySymbol})` : ""}
                </label>
                <input 
                  type="number" 
                  step="any"
                  value={input[f.key] === 0 ? "" : input[f.key]} 
                  onChange={(e) => handleChange(f.key, e.target.value)} 
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:border-primary" 
                  placeholder={f.placeholder} 
                />
              </div>
            ))}
          </div>
          <button onClick={handleAnalyze} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md">
            🚀 Ürünü Analiz Et
          </button>
        </div>

        {/* Sonuç Özeti */}
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
                  <span className="text-lg font-bold text-green-500">{currency(result.monthly_profit || 0)}</span>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border/40">
                  <span className="text-xs text-muted-foreground block">Kâr Marjı</span>
                  <span className="text-lg font-bold text-blue-500">%{Math.round(result.profit_margin || 0)}</span>
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

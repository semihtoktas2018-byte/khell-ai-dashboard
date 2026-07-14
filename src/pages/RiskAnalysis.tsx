import { useState } from "react";
import { motion } from "framer-motion";
import { analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, Package, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";
import { supabase } from "@/integrations/supabase/client";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const presets = [
  { name: "LED Lamba (TikTok)", input: { product_cost: 8.5, shipping_cost: 3, ads_cost: 5, selling_price: 29.99, monthly_orders_estimate: 120 } },
  { name: "Kablosuz Kulaklık", input: { product_cost: 18, shipping_cost: 4, ads_cost: 12, selling_price: 44.99, monthly_orders_estimate: 60 } },
  { name: "Silikon Mutfak Seti", input: { product_cost: 5.5, shipping_cost: 2, ads_cost: 3, selling_price: 18.99, monthly_orders_estimate: 200 } },
  { name: "Riskli Ürün Örneği", input: { product_cost: 15, shipping_cost: 8, ads_cost: 10, selling_price: 24.99, monthly_orders_estimate: 20 } },
];

// Gercek CJ urunu icin makul, dropshipping'te yaygin kar-katsayisi (marka/reklam giderleri
// zaten ayrica alanlarda hesaba katilir, bu sadece baslangic satis fiyati tahminidir).
function estimateMarkup(cost: number): number {
  if (cost < 10) return 3;
  if (cost < 25) return 2.6;
  return 2.2;
}

const REAL_TERMS = ["gadget", "kitchen tool", "pet accessory", "phone holder", "beauty tool", "home decor", "fitness gear", "car accessory"];

interface RealProduct {
  name: string;
  image: string;
}

export default function RiskAnalysis() {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [customInput, setCustomInput] = useState<AnalyzerInput>(presets[0].input);
  const { t, currencySymbol, locale } = useLocale();
  const isTr = locale === "tr";
  const isFr = locale === "fr";

  const [realProduct, setRealProduct] = useState<RealProduct | null>(null);
  const [loadingReal, setLoadingReal] = useState(false);
  const [realError, setRealError] = useState<string | null>(null);

  const risks = analyzeRisk(customInput);
  const overallScore = Math.round(risks.reduce((sum, r) => sum + r.score, 0) / risks.length);
  const overallLevel = overallScore >= 60 ? "high" : overallScore >= 35 ? "medium" : "low";

  const handlePreset = (idx: number) => {
    setSelectedPreset(idx);
    setRealProduct(null);
    setRealError(null);
    setCustomInput(presets[idx].input);
  };

  // Gercek bir CJ urunu cekip formu onunla doldurur — uydurma rakam yok, canli veri.
  const fetchRealProduct = async () => {
    setLoadingReal(true);
    setRealError(null);
    setSelectedPreset(null);
    try {
      const term = REAL_TERMS[Math.floor(Math.random() * REAL_TERMS.length)];
      const { data, error } = await supabase.functions.invoke("cj-proxy", {
        body: {
          path: "/api2.0/v1/product/list",
          query: { pageNum: "1", pageSize: "20", sortField: "recentOrders", sortType: "DESC", productNameEn: term },
        },
      });
      if (error || !data?.data?.list?.length) throw new Error("no data");
      const list: any[] = data.data.list;
      const candidates = list.filter((p) => parseFloat(p.sellPrice || "0") > 0);
      if (!candidates.length) throw new Error("empty");
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const cost = parseFloat(pick.sellPrice || "0");
      const sale = Math.round(cost * estimateMarkup(cost) * 100) / 100;
      const orders = parseInt(pick.listedNum || pick.recentOrders || "0", 10) || 50;
      setCustomInput({
        product_cost: cost,
        shipping_cost: Math.round(cost * 0.25 * 100) / 100,
        ads_cost: Math.round(sale * 0.2 * 100) / 100,
        selling_price: sale,
        monthly_orders_estimate: Math.min(Math.max(orders, 10), 500),
      });
      setRealProduct({ name: pick.productNameEn || pick.productName || term, image: (pick.productImage || "").split(",")[0] || "" });
    } catch {
      setRealError(isTr ? "Şu an gerçek ürün çekilemedi, tekrar dene." : isFr ? "Impossible de charger un produit réel, réessayez." : "Could not load a real product, try again.");
    } finally {
      setLoadingReal(false);
    }
  };

  const fieldLabels = [
    { key: "selling_price" as const, label: `${t("risk.sellingPrice")} (${currencySymbol})` },
    { key: "product_cost" as const, label: `${t("risk.productCost")} (${currencySymbol})` },
    { key: "shipping_cost" as const, label: `${t("risk.shippingCost")} (${currencySymbol})` },
    { key: "ads_cost" as const, label: `${t("risk.adsCost")} (${currencySymbol})` },
    { key: "monthly_orders_estimate" as const, label: t("risk.monthlyOrders") },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Risk Analizi | KHELL AI" description="Ürünlerinin pazar, marj ve rekabet risklerini detaylı incele." />

      {/* Gercek CJ urunuyle doldur — canli veri */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={fetchRealProduct}
          disabled={loadingReal}
          className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, hsl(258 90% 58%), hsl(262 83% 50%))", boxShadow: "0 4px 16px hsl(258 90% 58% / 0.3)" }}
        >
          {loadingReal ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {isTr ? "Gerçek Ürünle Doldur" : isFr ? "Remplir avec un produit réel" : "Fill with Real Product"}
        </button>
        <span className="text-[11px] text-muted-foreground">
          {isTr ? "CJ Dropshipping'ten canlı veri" : isFr ? "Données en direct de CJ Dropshipping" : "Live data from CJ Dropshipping"}
        </span>
      </div>

      {realError && (
        <p className="text-xs text-destructive">{realError}</p>
      )}

      {realProduct && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl p-3" style={{ background: "hsl(258 90% 58% / 0.08)", border: "1px solid hsl(258 90% 58% / 0.25)" }}>
          <div className="h-12 w-12 rounded-lg overflow-hidden bg-black/20 shrink-0">
            {realProduct.image ? <img src={realProduct.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{realProduct.name}</p>
            <p className="text-[10px]" style={{ color: "#a78bfa" }}>{isTr ? "Gerçek ürün — CJ Dropshipping" : isFr ? "Produit réel — CJ Dropshipping" : "Real product — CJ Dropshipping"}</p>
          </div>
        </motion.div>
      )}

      <div>
        <p className="text-xs text-muted-foreground mb-2">{isTr ? "Ya da örnek senaryolardan seç:" : isFr ? "Ou choisissez un scénario d'exemple :" : "Or pick an example scenario:"}</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button key={p.name} onClick={() => handlePreset(i)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedPreset === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="card-glow rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("risk.productInfo")}</h3>
          <div className="space-y-3">
            {fieldLabels.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input type="number" value={customInput[f.key] || ""} onChange={(e) => { setSelectedPreset(null); setRealProduct(null); setCustomInput((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 })); }} className="input-dark w-full text-sm" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }} className="card-glow rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{t("risk.assessment")}</h3>
          </div>

          <div className={`rounded-lg p-5 text-center mb-6 ${overallLevel === "low" ? "verdict-winning" : overallLevel === "medium" ? "verdict-risky" : "verdict-bad"}`}>
            <div className="text-4xl font-bold font-mono tabular-nums mb-1">{overallScore}</div>
            <div className="text-xs uppercase tracking-widest opacity-70 mb-1">{t("risk.overallScore")}</div>
            <p className="text-sm font-medium">
              {overallLevel === "low" ? t("risk.lowRisk") : overallLevel === "medium" ? t("risk.medRisk") : t("risk.highRisk")}
            </p>
          </div>

          <div className="space-y-5">
            {risks.map((risk, i) => (
              <motion.div key={risk.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, ...transition }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <RiskIcon level={risk.level} />
                    <span className="text-sm font-medium text-foreground">{risk.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${risk.level === "low" ? "verdict-winning" : risk.level === "medium" ? "verdict-risky" : "verdict-bad"}`}>
                    {risk.level === "low" ? t("risk.low") : risk.level === "medium" ? t("risk.medium") : t("risk.high")}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-accent overflow-hidden mb-1.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${risk.score}%` }} transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className={`h-full rounded-full ${risk.level === "high" ? "bg-destructive" : risk.level === "medium" ? "bg-risky" : "bg-winning"}`} />
                </div>
                <p className="text-xs text-muted-foreground">{risk.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <BamirFooter />
      </div>
    </div>
  );
}

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <CheckCircle className="h-4 w-4 text-winning" />;
  if (level === "medium") return <AlertTriangle className="h-4 w-4 text-risky" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

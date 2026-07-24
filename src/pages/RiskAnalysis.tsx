import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeRisk, type AnalyzerInput } from "@/lib/analyzer";
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, Package, Sparkles, Check } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { convertUsdForLocale } from "@/config/khell";
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

// Alan bazlı veri kaynağı etiketi: gerçek API mi, tahmini mi, yoksa manuel/örnek mi?
// "live-cj"   -> CJ Dropshipping'ten gerçek, canlı çekilen değer
// "live-ebay" -> eBay'den gerçek, canlı çekilen değer
// "estimated" -> hiçbir API'den gelmeyen, mantıklı bir oranla hesaplanmış tahmini değer
// null        -> manuel giriş ya da örnek senaryo (kaynak iddiası yok)
type FieldTag = "live-cj" | "live-ebay" | "estimated" | null;
type FieldKey = keyof AnalyzerInput;

const EMPTY_TAGS: Record<FieldKey, FieldTag> = {
  selling_price: null,
  product_cost: null,
  shipping_cost: null,
  ads_cost: null,
  monthly_orders_estimate: null,
};

// Dropshipping'te yaygin kar katsayisi (CJ maliyetinden tahmini satis fiyati icin)
function estimateSaleFromCost(cost: number): number {
  const markup = cost < 10 ? 3 : cost < 25 ? 2.6 : 2.2;
  return Math.round(cost * markup * 100) / 100;
}
// eBay gercek satis fiyatindan tahmini tedarikci maliyeti (API bu veriyi vermez)
function estimateCostFromSale(sale: number): number {
  return Math.round(sale * 0.4 * 100) / 100;
}

const REAL_TERMS = ["gadget", "kitchen tool", "pet accessory", "phone holder", "beauty tool", "home decor"];

interface RealCandidate {
  source: "cj" | "ebay";
  name: string;
  image: string | null;
  costUSD: number;   // her zaman dolu (gercek ya da tahmini)
  saleUSD: number;   // her zaman dolu (gercek ya da tahmini)
  ordersSignal: number | null; // gercek talep sinyali varsa (recentOrders / soldQuantity)
}

export default function RiskAnalysis() {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [customInput, setCustomInput] = useState<AnalyzerInput>(presets[0].input);
  const [fieldTags, setFieldTags] = useState<Record<FieldKey, FieldTag>>(EMPTY_TAGS);
  const { t, currencySymbol, locale, usdToTry } = useLocale();
  const isTr = locale === "tr";
  const isFr = locale === "fr";

  const [candidates, setCandidates] = useState<RealCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loadingReal, setLoadingReal] = useState(false);
  const [realError, setRealError] = useState<string | null>(null);

  const risks = analyzeRisk(customInput);
  const overallScore = Math.round(risks.reduce((sum, r) => sum + r.score, 0) / Math.max(risks.length, 1));
  const overallLevel = overallScore >= 60 ? "high" : overallScore >= 35 ? "medium" : "low";

  const handlePreset = (idx: number) => {
    setSelectedPreset(idx);
    setSelectedCandidate(null);
    setRealError(null);
    setCustomInput(presets[idx].input);
    setFieldTags(EMPTY_TAGS); // örnek senaryo — kaynak iddiası yok
  };

  const handleManualChange = (key: FieldKey, raw: string) => {
    setSelectedPreset(null);
    setSelectedCandidate(null);
    setCustomInput((prev) => ({ ...prev, [key]: parseFloat(raw) || 0 }));
    // Kullanıcı elle değiştirdiği an, o alan artık "gerçek/tahmini" değil — manuel girdi.
    setFieldTags((prev) => ({ ...prev, [key]: null }));
  };

  // CJ + eBay'den gercek urun adaylari cek (biri basarisiz olsa bile digeri calismaya devam eder)
  const fetchRealCandidates = async () => {
    setLoadingReal(true);
    setRealError(null);
    setSelectedPreset(null);
    setSelectedCandidate(null);
    setCandidates([]);

    const term = REAL_TERMS[Math.floor(Math.random() * REAL_TERMS.length)];
    const results: RealCandidate[] = [];

    // --- CJ Dropshipping ---
    try {
      const { data, error } = await supabase.functions.invoke("cj-proxy", {
        body: { path: "/api2.0/v1/product/list", query: { pageNum: "1", pageSize: "20", sortField: "recentOrders", sortType: "DESC", productNameEn: term } },
      });
      if (!error && data?.data?.list?.length) {
        const list: any[] = data.data.list;
        const pool = list.filter((p) => parseFloat(p?.sellPrice || "0") > 0).slice(0, 8);
        // Tekrarsiz secim: havuzu karistir, ilk 2'yi al (ayni urun iki kez cikmasin)
        const shuffledCj = [...pool].sort(() => Math.random() - 0.5).slice(0, 2);
        for (const p of shuffledCj) {
          const cost = parseFloat(p?.sellPrice || "0") || 0;
          if (cost <= 0) continue;
          results.push({
            source: "cj",
            name: p?.productNameEn || p?.productName || term,
            image: (p?.productImage || "").split(",")[0] || null,
            costUSD: cost,
            saleUSD: estimateSaleFromCost(cost),
            ordersSignal: parseInt(p?.listedNum || p?.recentOrders || "0", 10) || null,
          });
        }
      }
    } catch {
      // CJ basarisiz olsa da eBay tarafi denenmeye devam eder
    }

    // --- eBay ---
    try {
      const { data, error } = await supabase.functions.invoke("ebay-proxy", { body: { q: term, limit: 8, marketplace: "EBAY_US" } });
      const items: any[] = data?.items || [];
      if (!error && items.length) {
        const poolEbay = items.filter((it) => it && parseFloat(String(it.price || "0")) > 0).slice(0, 8);
        const shuffledEbay = [...poolEbay].sort(() => Math.random() - 0.5).slice(0, 2);
        for (const it of shuffledEbay) {
          const sale = parseFloat(String(it.price || "0")) || 0;
          if (sale <= 0) continue;
          results.push({
            source: "ebay",
            name: it.title || term,
            image: it.image || null,
            costUSD: estimateCostFromSale(sale),
            saleUSD: sale,
            ordersSignal: typeof it.soldQuantity === "number" ? it.soldQuantity : null,
          });
        }
      }
    } catch {
      // eBay basarisiz olsa da CJ sonuclari varsa gosterilmeye devam eder
    }

    setLoadingReal(false);

    if (!results.length) {
      setRealError(isTr ? "Şu an gerçek ürün çekilemedi, tekrar dene." : isFr ? "Impossible de charger des produits réels, réessayez." : "Could not load real products, try again.");
      return;
    }
    setCandidates(results);
  };

  const applyCandidate = (idx: number) => {
    const cand = candidates[idx];
    if (!cand) return;
    setSelectedCandidate(idx);
    setSelectedPreset(null);

    const costConv = convertUsdForLocale(cand.costUSD, locale, usdToTry);
    const saleConv = convertUsdForLocale(cand.saleUSD, locale, usdToTry);
    // Kargo ve reklam gideri hicbir API'den gelmez — ikisi de daima tahminidir.
    const shippingUSD = cand.costUSD * 0.25;
    const adsUSD = cand.saleUSD * 0.2;
    const shippingConv = convertUsdForLocale(shippingUSD, locale, usdToTry);
    const adsConv = convertUsdForLocale(adsUSD, locale, usdToTry);

    setCustomInput({
      product_cost: costConv.value,
      selling_price: saleConv.value,
      shipping_cost: shippingConv.value,
      ads_cost: adsConv.value,
      monthly_orders_estimate: cand.ordersSignal ? Math.min(Math.max(cand.ordersSignal, 10), 500) : 50,
    });

    setFieldTags({
      product_cost: cand.source === "cj" ? "live-cj" : "estimated",
      selling_price: cand.source === "ebay" ? "live-ebay" : "estimated",
      shipping_cost: "estimated",
      ads_cost: "estimated",
      monthly_orders_estimate: cand.ordersSignal ? (cand.source === "cj" ? "live-cj" : "live-ebay") : "estimated",
    });
  };

  // Locale veya kur (usdToTry) degistiginde, secili aday varsa onun ORIJINAL USD
  // degerinden rakamlari yeniden hesapla. Boylece sadece sembol degil, rakam da guncellenir.
  // Manuel girilmis alanlara (fieldTags[key] === null) dokunulmaz, double conversion olusmaz
  // cunku kaynak her zaman cand.costUSD / cand.saleUSD'dir, mevcut customInput degeri degil.
  useEffect(() => {
    if (selectedCandidate === null) return;
    const cand = candidates[selectedCandidate];
    if (!cand) return;

    const costConv = convertUsdForLocale(cand.costUSD, locale, usdToTry);
    const saleConv = convertUsdForLocale(cand.saleUSD, locale, usdToTry);
    const shippingUSD = cand.costUSD * 0.25;
    const adsUSD = cand.saleUSD * 0.2;
    const shippingConv = convertUsdForLocale(shippingUSD, locale, usdToTry);
    const adsConv = convertUsdForLocale(adsUSD, locale, usdToTry);

    setCustomInput((prev) => ({
      ...prev,
      ...(fieldTags.product_cost !== null ? { product_cost: costConv.value } : {}),
      ...(fieldTags.selling_price !== null ? { selling_price: saleConv.value } : {}),
      ...(fieldTags.shipping_cost !== null ? { shipping_cost: shippingConv.value } : {}),
      ...(fieldTags.ads_cost !== null ? { ads_cost: adsConv.value } : {}),
    }));
    // Sadece locale/usdToTry degisiminde tetiklensin — fieldTags/candidates degisimi
    // zaten applyCandidate() tarafindan ayrica yonetiliyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, usdToTry]);

  const fieldLabels: { key: FieldKey; label: string }[] = [
    { key: "selling_price", label: `${t("risk.sellingPrice")} (${currencySymbol})` },
    { key: "product_cost", label: `${t("risk.productCost")} (${currencySymbol})` },
    { key: "shipping_cost", label: `${t("risk.shippingCost")} (${currencySymbol})` },
    { key: "ads_cost", label: `${t("risk.adsCost")} (${currencySymbol})` },
    { key: "monthly_orders_estimate", label: t("risk.monthlyOrders") },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Risk Analizi | KHELL AI" description="Ürünlerinin pazar, marj ve rekabet risklerini detaylı incele." />

      {/* Gercek CJ + eBay urunleriyle doldur */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={fetchRealCandidates}
            disabled={loadingReal}
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(258 90% 58%), hsl(262 83% 50%))", boxShadow: "0 4px 16px hsl(258 90% 58% / 0.3)" }}
          >
            {loadingReal ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isTr ? "Gerçek Ürünlerle Doldur" : isFr ? "Remplir avec des produits réels" : "Fill with Real Products"}
          </button>
          <span className="text-[11px] text-muted-foreground">
            {isTr ? "CJ Dropshipping + eBay canlı veri" : isFr ? "Données en direct CJ Dropshipping + eBay" : "Live data from CJ Dropshipping + eBay"}
          </span>
        </div>

        {realError && <p className="text-xs text-destructive mb-2">{realError}</p>}

        {candidates.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2">
            <AnimatePresence>
              {candidates.map((cand, idx) => {
                const isActive = selectedCandidate === idx;
                return (
                  <motion.button
                    key={`${cand.source}-${idx}-${cand.name}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    onClick={() => applyCandidate(idx)}
                    className="text-left rounded-xl p-2.5 transition-all"
                    style={{
                      background: isActive ? "hsl(258 90% 58% / 0.12)" : "hsl(var(--card))",
                      border: `1px solid ${isActive ? "hsl(258 90% 58% / 0.6)" : "hsl(var(--border))"}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-9 w-9 rounded-lg overflow-hidden bg-black/20 shrink-0">
                        {cand.image ? <img src={cand.image} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate leading-tight">{cand.name}</p>
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ color: cand.source === "cj" ? "#fb923c" : "#3665F3", background: cand.source === "cj" ? "rgba(251,146,60,.12)" : "rgba(54,101,243,.12)" }}>
                          {cand.source === "cj" ? "CJ Dropshipping" : "eBay"}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#34d399" }}>
                        <Check className="h-3 w-3" /> {isTr ? "Uygulandı" : isFr ? "Appliqué" : "Applied"}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mb-3">
          {isTr ? "Kargo ve reklam gideri her zaman tahminidir — alanları dilediğin gibi değiştirebilirsin." : isFr ? "Livraison et publicité sont toujours estimées — modifiez librement les champs." : "Shipping and ads cost are always estimated — feel free to edit the fields."}
        </p>

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
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 flex-wrap">
                  {f.label}
                  <FieldSourceBadge tag={fieldTags[f.key]} isTr={isTr} isFr={isFr} />
                </label>
                <input type="number" value={customInput[f.key] || ""} onChange={(e) => handleManualChange(f.key, e.target.value)} className="input-dark w-full text-sm" />
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

function FieldSourceBadge({ tag, isTr, isFr }: { tag: FieldTag; isTr: boolean; isFr: boolean }) {
  if (tag === "live-cj" || tag === "live-ebay") {
    const src = tag === "live-cj" ? "CJ" : "eBay";
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: "#34d399", background: "rgba(52,211,153,.12)" }}>
        ✓ {isTr ? `Canlı ${src} Verisi` : isFr ? `Données ${src} en direct` : `Live ${src} Data`}
      </span>
    );
  }
  if (tag === "estimated") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: "#fbbf24", background: "rgba(251,191,36,.12)" }}>
        ⚠ {isTr ? "Tahmini" : isFr ? "Estimé" : "Estimated"}
      </span>
    );
  }
  return null;
}

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <CheckCircle className="h-4 w-4 text-winning" />;
  if (level === "medium") return <AlertTriangle className="h-4 w-4 text-risky" />;
  return <XCircle className="h-4 w-4 text-destructive" />;
}

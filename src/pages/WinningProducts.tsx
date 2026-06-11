import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trendingProducts, categories } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";
import { Filter, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const MARKETPLACE_SETTINGS = {
  Trendyol: { commissionRate: 0.18, kdvRate: 0.20, label: "Trendyol" },
  Hepsiburada: { commissionRate: 0.16, kdvRate: 0.20, label: "Hepsiburada" },
  AmazonTR: { commissionRate: 0.12, kdvRate: 0.20, label: "Amazon TR" },
  N11: { commissionRate: 0.15, kdvRate: 0.20, label: "N11" },
};

export default function WinningProducts() {
  const [platform, setPlatform] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [marginFilter, setMarginFilter] = useState(0);
  const [trendFilter, setTrendFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const { t, currency, locale } = useLocale();

  const marginFilters = [
    { label: t("winning.all"), min: 0, max: 100 },
    { label: locale === "tr" ? "%30+" : "30%+", min: 30, max: 100 },
    { label: locale === "tr" ? "%40+" : "40%+", min: 40, max: 100 },
    { label: locale === "tr" ? "%50+" : "50%+", min: 50, max: 100 },
  ];
  const trendFilters = [
    { label: t("winning.all"), min: 0 },
    { label: "80+", min: 80 },
    { label: "90+", min: 90 },
  ];

  const platforms = ["Tümü", "TikTok", "Amazon", "AliExpress"];
  const platformLabel = (p: string) => (p === "Tümü" ? t("winning.all") : p);
  const catLabel = (c: string) => t(`cat.${c}`) ?? c;

  const filtered = useMemo(() => {
    return trendingProducts.filter((p) => {
      if (platform !== "Tümü" && p.platform !== platform) return false;
      if (category !== "Tümü" && p.category !== category) return false;
      if (p.profitMargin < marginFilters[marginFilter].min) return false;
      if (p.trendScore < trendFilters[trendFilter].min) return false;
      return true;
    });
  }, [platform, category, marginFilter, trendFilter]);

  const calculateMarketplaceProfit = (sellingPrice: number, costPrice: number) => {
    const dollarRate = 46.15;
    const priceInTL = sellingPrice * dollarRate;
    const costInTL = costPrice * dollarRate;

    return Object.entries(MARKETPLACE_SETTINGS).map(([key, config]) => {
      const commission = priceInTL * config.commissionRate;
      const kdv = priceInTL * (config.kdvRate / (1 + config.kdvRate)) * config.commissionRate;
      const netProfit = priceInTL - costInTL - commission - kdv;
      const margin = Math.round((netProfit / priceInTL) * 100);

      return {
        name: config.label,
        commission: Math.round(commission),
        rate: Math.round(config.commissionRate * 100),
        kdv: Math.round(kdv),
        netProfit: Math.round(netProfit),
        margin: margin,
      };
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Kazanan Ürünler | KHELL AI" description="Yüksek kârlılık potansiyeli taşıyan kazanan ürünleri keşfet." />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {platforms.map((p) => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${platform === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {platformLabel(p)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="h-4 w-4" /> {t("winning.filters")}
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="card-glow rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.category")}</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 text-xs rounded-md transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{catLabel(c)}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.profitMargin")}</label>
            <div className="flex flex-wrap gap-1.5">
              {marginFilters.map((f, i) => (
                <button key={f.label} onClick={() => setMarginFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${marginFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.trendScore")}</label>
            <div className="flex flex-wrap gap-1.5">
              {trendFilters.map((f, i) => (
                <button key={f.label} onClick={() => setTrendFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length} {t("winning.found")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => {
          const verdict = getVerdict(product.profitMargin);
          const isExpanded = expandedProduct === product.id;
          const marketplaceData = calculateMarketplaceProfit(product.estimatedSellingPrice, product.supplierPrice);
          return (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, ...transition }} whileHover={{ y: -4 }} className="card-glow rounded-xl p-5 cursor-default flex flex-col justify-between h-full bg-card border border-border">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{product.image}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${verdict.class}`}>{verdict.labelTr}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{product.name}</h3>
                <p className="text-[10px] text-muted-foreground mb-3">{catLabel(product.category)} · {product.platform}</p>
                <div className="space-y-2 mb-4">
                  <DataRow label={t("winning.sellingPrice")} value={currency(product.estimatedSellingPrice)} />
                  <DataRow label={t("winning.supplierPrice")} value={currency(product.supplierPrice)} />
                  <DataRow label={t("winning.trendScore")} value={`${product.trendScore}/100`} />
                  <DataRow label={t("winning.profitMargin")} value={locale === "tr" ? `%${product.profitMargin}` : `${product.profitMargin}%`} color={verdict.color} />
                  <DataRow label={t("winning.competition")} value={product.competition} />
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-border/60">
                <button 
                  onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                  className="w-full flex items-center justify-between py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-accent/30 rounded-lg px-3 border border-border/40"
                >
                  <span className="flex items-center gap-1.5">📊 {isExpanded ? "Detayları Gizle" : "Pazar Yeri Komisyonu"}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 space-y-2 bg-background/50 p-3 rounded-lg border border-border/40 text-[11px]"
                    >
                      {marketplaceData.map((market) => (
                        <div key={market.name} className="p-2 bg-card rounded border border-border/30 space-y-1">
                          <div className="flex justify-between font-medium text-foreground">
                            <span>{market.name}</span>
                            <span className="text-green-500">Net: ₺{market.netProfit.toLocaleString()} (%{market.margin})</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Komisyon (%{market.rate})</span>
                            <span className="text-red-400">-₺{market.commission}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground">

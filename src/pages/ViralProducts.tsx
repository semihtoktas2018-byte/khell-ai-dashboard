import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight, Bookmark, Filter, FileText, RefreshCw } from "lucide-react";
import { fetchViralProducts, type ViralProduct } from "@/lib/viral-products-data";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocale } from "@/contexts/LocaleContext";

const riskColor: Record<string, string> = {
  "Düşük": "bg-winning/15 text-winning border-winning/30",
  "Orta": "bg-risky/15 text-risky border-risky/30",
  "Yüksek": "bg-destructive/15 text-destructive border-destructive/30",
};

const categoryColor: Record<string, string> = {
  Fitness: "bg-primary/15 text-primary",
  Pet: "bg-accent text-accent-foreground",
  Tech: "bg-secondary text-secondary-foreground",
  Home: "bg-muted text-muted-foreground",
  Car: "bg-primary/10 text-primary",
};

type FilterKey = "highTrend" | "lowComp" | "highProfit";

export default function ViralProducts() {
  const [filters, setFilters] = useState<FilterKey[]>([]);
  const [products, setProducts] = useState<ViralProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);
  const navigate = useNavigate();
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { toast } = useToast();
  const { t, currencySymbol } = useLocale();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchViralProducts();
      setProducts(data);
      // Gerçek veri mi fallback mı anla
      setIsReal(!data[0]?.id?.startsWith("f-"));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.includes("highTrend")) list = list.filter((p) => p.trendScore > 70);
    if (filters.includes("lowComp")) list = list.filter((p) => p.competitionLevel === "low");
    if (filters.includes("highProfit")) list = list.filter((p) => p.margin > 40);
    return list.sort((a, b) => b.decisionScore - a.decisionScore);
  }, [filters, products]);

  const handleSave = (p: ViralProduct) => {
    if (isProductSaved(p.name)) {
      toast({ title: t("viralProd.info"), description: t("viralProd.alreadySaved") });
      return;
    }
    saveProduct({
      name: p.name,
      profitMargin: p.margin,
      riskLevel: p.riskLevel === "Düşük" ? "low" : p.riskLevel === "Yüksek" ? "high" : "medium",
      decisionScore: p.decisionScore,
      monthlyProfit: Math.round((p.sellingPrice - p.cost) * 100) / 100,
      platform: t("viralProd.title"),
    });
    toast({ title: t("analyzer.saved"), description: `${p.name} ${t("viralProd.savedMsg")}` });
  };

  const handleAnalyze = (p: ViralProduct) => {
    const params = new URLSearchParams({
      productName: p.name,
      selling_price: String(p.sellingPrice),
      product_cost: String(p.cost),
      onboarding: "1",
    });
    navigate(`/dashboard/analyzer?${params.toString()}`);
  };

  const handleGeneratePage = (p: ViralProduct) => {
    const params = new URLSearchParams({
      name: p.name,
      category: p.category,
      sellingPrice: String(p.sellingPrice),
      cost: String(p.cost),
      margin: String(p.margin),
      trendScore: String(p.trendScore),
      riskLevel: p.riskLevel,
    });
    navigate(`/dashboard/product-page-generator?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary font-semibold">{t("viralProd.step")}</span>
        <span>{t("viralProd.stepDesc")}</span>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" /> {t("viralProd.title")}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              {loading ? "Yükleniyor..." : `${filtered.length} ${t("viralProd.listing")}`}
            </p>
            {!loading && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isReal
                  ? "bg-winning/15 text-winning border-winning/30"
                  : "bg-muted text-muted-foreground border-border"
              }`}>
                {isReal ? "🟢 Canlı AliExpress Verisi" : "⚪ Örnek Veri"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1"
            onClick={loadProducts}
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
          <Filter className="h-4 w-4 text-muted-foreground" />
          <ToggleGroup
            type="multiple"
            value={filters}
            onValueChange={(v) => setFilters(v as FilterKey[])}
            className="flex-wrap"
          >
            <ToggleGroupItem value="highTrend" size="sm" className="text-xs">{t("viralProd.highTrend")}</ToggleGroupItem>
            <ToggleGroupItem value="lowComp" size="sm" className="text-xs">{t("viralProd.lowComp")}</ToggleGroupItem>
            <ToggleGroupItem value="highProfit" size="sm" className="text-xs">{t("viralProd.highProfit")}</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 space-y-3 animate-pulse">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
              </div>
              <div className="h-8 rounded bg-muted mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Product grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="relative overflow-hidden group hover:border-primary/40 transition-colors h-full flex flex-col">
                {p.isHot && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-destructive/90 text-destructive-foreground border-0 text-[10px] font-bold px-2 py-0.5">
                      HOT 🔥
                    </Badge>
                  </div>
                )}

                {/* Ürün görseli */}
                {p.imageUrl && (
                  <div className="w-full h-32 overflow-hidden bg-muted">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}

                <CardContent className="p-5 flex flex-col flex-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${categoryColor[p.category] ?? "bg-muted text-muted-foreground"}`}>
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold text-foreground mt-3 leading-snug line-clamp-2">{p.name}</h3>

                  {/* Sipariş ve puan — sadece gerçek veriden geliyorsa göster */}
                  {p.orders !== undefined && p.orders > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        📦 {p.orders.toLocaleString()}+ sipariş
                      </span>
                      {p.rating && (
                        <span className="text-[10px] text-muted-foreground">
                          ⭐ {p.rating}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Stat label={t("winning.trendScore")} value={`${p.trendScore}`} icon={<TrendingUp className="h-3 w-3" />} />
                    <Stat label={t("viralProd.profit")} value={`${currencySymbol}${(p.sellingPrice - p.cost).toFixed(2)}`} />
                    <Stat label={t("viralProd.margin")} value={`%${p.margin.toFixed(0)}`} />
                    <Stat label={t("viralProd.decisionScore")} value={`${p.decisionScore}`} highlight />
                  </div>

                  <div className="mt-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskColor[p.riskLevel]}`}>
                      {t("viralProd.risk")}: {p.riskLevel}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto pt-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleSave(p)}
                        disabled={isProductSaved(p.name)}
                      >
                        <Bookmark className="h-3 w-3 mr-1" />
                        {isProductSaved(p.name) ? t("viralProd.saved") : t("viralProd.saveBtn")}
                      </Button>
                      <Button size="sm" className="flex-1 text-xs" onClick={() => handleAnalyze(p)}>
                        {t("viralProd.sendAnalysis")} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full text-xs"
                      onClick={() => handleGeneratePage(p)}
                    >
                      <FileText className="h-3 w-3 mr-1" /> {t("viralProd.createPage")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">{t("viralProd.noProducts")}</p>
          <p className="text-sm mt-1">{t("viralProd.changeFilters")}</p>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
        {icon} {label}
      </p>
      <p className={`text-sm font-bold font-mono tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

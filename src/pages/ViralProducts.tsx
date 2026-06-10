import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight, Bookmark, Filter, FileText, Users, Search } from "lucide-react";
import { getViralProducts, type ViralProduct } from "@/lib/viral-products-data";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocale } from "@/contexts/LocaleContext";

const allProducts = getViralProducts();

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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { toast } = useToast();
  const { t, currency } = useLocale();

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (filters.includes("highTrend")) list = list.filter((p) => p.trendScore > 70);
    if (filters.includes("lowComp")) list = list.filter((p) => p.competitionLevel === "low");
    if (filters.includes("highProfit")) list = list.filter((p) => p.margin > 40);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameTr.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.targetMarket.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.decisionScore - a.decisionScore);
  }, [filters, searchQuery]);

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
      platform: p.platform,
    });
    toast({ title: t("analyzer.saved"), description: `${p.nameTr} ${t("viralProd.savedMsg")}` });
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
      name: p.nameTr, category: p.category, sellingPrice: String(p.sellingPrice),
      cost: String(p.cost), margin: String(p.margin), trendScore: String(p.trendScore), riskLevel: p.riskLevel,
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
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} {t("viralProd.listing")}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <ToggleGroup type="multiple" value={filters} onValueChange={(v) => setFilters(v as FilterKey[])} className="flex-wrap">
            <ToggleGroupItem value="highTrend" size="sm" className="text-xs">{t("viralProd.highTrend")}</ToggleGroupItem>
            <ToggleGroupItem value="lowComp" size="sm" className="text-xs">{t("viralProd.lowComp")}</ToggleGroupItem>
            <ToggleGroupItem value="highProfit" size="sm" className="text-xs">{t("viralProd.highProfit")}</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Arama */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Ürün veya kategori ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="relative overflow-hidden group hover:border-primary/40 transition-colors h-full flex flex-col">
              {p.isHot && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-destructive/90 text-destructive-foreground border-0 text-[10px] font-bold px-2 py-0.5">HOT 🔥</Badge>
                </div>
              )}
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${categoryColor[p.category] ?? "bg-muted text-muted-foreground"}`}>{p.category}</span>
                  <span className="text-[10px] text-muted-foreground">{p.platform}</span>
                </div>

                <h3 className="text-sm font-bold text-foreground mt-2 leading-snug line-clamp-2">{p.nameTr}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{p.name}</p>

                {/* Pazar bilgisi */}
                <div className="flex items-center gap-1 mt-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{p.targetMarket}</span>
                </div>

                {/* Aylık arama hacmi */}
                <div className="flex items-center gap-1 mt-1">
                  <Search className="h-3 w-3 text-primary/60" />
                  <span className="text-[10px] text-primary/80 font-medium">{p.monthlySearchVolume} aylık arama</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Stat label={t("winning.trendScore")} value={`${p.trendScore}`} icon={<TrendingUp className="h-3 w-3" />} />
                  <Stat label={t("viralProd.profit")} value={currency(p.sellingPrice - p.cost)} />
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
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleSave(p)} disabled={isProductSaved(p.name)}>
                      <Bookmark className="h-3 w-3 mr-1" /> {isProductSaved(p.name) ? t("viralProd.saved") : t("viralProd.saveBtn")}
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" onClick={() => handleAnalyze(p)}>
                      {t("viralProd.sendAnalysis")} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => handleGeneratePage(p)}>
                    <FileText className="h-3 w-3 mr-1" /> {t("viralProd.createPage")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">{t("viralProd.noProducts")}</p>
          <p className="text-sm mt-1">{t("viralProd.changeFilters")}</p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-[10px] text-muted-foreground flex items-center gap-1">{icon} {label}</p>
      <p className={`text-sm font-bold font-mono tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

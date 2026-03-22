import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight, Bookmark, Filter, FileText } from "lucide-react";
import { getViralProducts, type ViralProduct } from "@/lib/viral-products-data";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const navigate = useNavigate();
  const { saveProduct, isProductSaved } = useSavedProducts();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (filters.includes("highTrend")) list = list.filter((p) => p.trendScore > 70);
    if (filters.includes("lowComp")) list = list.filter((p) => p.competitionLevel === "low");
    if (filters.includes("highProfit")) list = list.filter((p) => p.margin > 40);
    return list.sort((a, b) => b.decisionScore - a.decisionScore);
  }, [filters]);

  const handleSave = (p: ViralProduct) => {
    if (isProductSaved(p.name)) {
      toast({ title: "Bilgi", description: "Bu ürün zaten kayıtlı" });
      return;
    }
    saveProduct({
      name: p.name,
      profitMargin: p.margin,
      riskLevel: p.riskLevel === "Düşük" ? "low" : p.riskLevel === "Yüksek" ? "high" : "medium",
      decisionScore: p.decisionScore,
      monthlyProfit: Math.round((p.sellingPrice - p.cost) * 100) / 100,
      platform: "Viral Ürün Bulucu",
    });
    toast({ title: "Kaydedildi", description: `${p.name} kaydedildi` });
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
      {/* Onboarding hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary font-semibold">Adım 1/3</span>
        <span>— Bir ürün seçin ve "Analize Gönder" butonuna tıklayın</span>
      </motion.div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            Viral Ürün Bulucu
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} ürün listeleniyor — en yüksek karar skoruna göre sıralı
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <ToggleGroup
            type="multiple"
            value={filters}
            onValueChange={(v) => setFilters(v as FilterKey[])}
            className="flex-wrap"
          >
            <ToggleGroupItem value="highTrend" size="sm" className="text-xs">
              Yüksek Trend
            </ToggleGroupItem>
            <ToggleGroupItem value="lowComp" size="sm" className="text-xs">
              Düşük Rekabet
            </ToggleGroupItem>
            <ToggleGroupItem value="highProfit" size="sm" className="text-xs">
              Yüksek Kâr
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Grid */}
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
              <CardContent className="p-5 flex flex-col flex-1">
                {/* Category */}
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${categoryColor[p.category] ?? "bg-muted text-muted-foreground"}`}>
                  {p.category}
                </span>

                {/* Name */}
                <h3 className="text-sm font-bold text-foreground mt-3 leading-snug line-clamp-2">
                  {p.name}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Stat label="Trend Skoru" value={`${p.trendScore}`} icon={<TrendingUp className="h-3 w-3" />} />
                  <Stat label="Kâr" value={`$${(p.sellingPrice - p.cost).toFixed(2)}`} />
                  <Stat label="Marj" value={`%${p.margin.toFixed(0)}`} />
                  <Stat label="Karar Skoru" value={`${p.decisionScore}`} highlight />
                </div>

                {/* Risk */}
                <div className="mt-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskColor[p.riskLevel]}`}>
                    Risk: {p.riskLevel}
                  </span>
                </div>

                {/* Actions */}
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
                      {isProductSaved(p.name) ? "Kayıtlı" : "Kaydet"}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleAnalyze(p)}
                    >
                      Analize Gönder
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => handleGeneratePage(p)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Sayfa Oluştur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Filtrelere uygun ürün bulunamadı</p>
          <p className="text-sm mt-1">Filtreleri değiştirmeyi deneyin</p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
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

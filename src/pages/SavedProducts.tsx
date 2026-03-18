import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowUpDown, Bookmark, Search, Package, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const riskLabelMap = { low: "Düşük", medium: "Orta", high: "Yüksek" };
const riskClassMap = { low: "verdict-winning", medium: "verdict-risky", high: "verdict-bad" };

type SortKey = "decisionScore" | "profitMargin" | "dateSaved" | "monthlyProfit";
type RiskFilter = "all" | "low" | "medium" | "high";

const SCORE_RANGES = [
  { key: "all", label: "Tümü" },
  { key: "80", label: "80+" },
  { key: "60", label: "60+" },
  { key: "40", label: "40+" },
  { key: "0-40", label: "<40" },
] as const;

type ScoreRange = (typeof SCORE_RANGES)[number]["key"];

export default function SavedProducts() {
  const { products, deleteProduct } = useSavedProducts();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortKey>("decisionScore");
  const [sortDesc, setSortDesc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [scoreRange, setScoreRange] = useState<ScoreRange>("all");

  const counts = useMemo(() => ({
    total: products.length,
    low: products.filter((p) => p.riskLevel === "low").length,
    medium: products.filter((p) => p.riskLevel === "medium").length,
    high: products.filter((p) => p.riskLevel === "high").length,
  }), [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (riskFilter !== "all") {
      list = list.filter((p) => p.riskLevel === riskFilter);
    }

    if (scoreRange !== "all") {
      if (scoreRange === "0-40") {
        list = list.filter((p) => p.decisionScore < 40);
      } else {
        const min = Number(scoreRange);
        list = list.filter((p) => p.decisionScore >= min);
      }
    }

    list.sort((a, b) => {
      const aVal = sortBy === "dateSaved" ? new Date(a[sortBy]).getTime() : a[sortBy];
      const bVal = sortBy === "dateSaved" ? new Date(b[sortBy]).getTime() : b[sortBy];
      return sortDesc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    return list;
  }, [products, searchQuery, riskFilter, scoreRange, sortBy, sortDesc]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDesc(!sortDesc);
    else { setSortBy(key); setSortDesc(true); }
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast({ title: "Silindi", description: `${name} listeden kaldırıldı` });
  };

  if (products.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Bookmark className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Henüz Kaydedilen Ürün Yok</h3>
        <p className="text-sm text-muted-foreground max-w-sm">Ürün Analizi sayfasından ürün analiz edip kaydedin.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard icon={Package} label="Toplam Ürün" value={counts.total} color="text-primary" />
        <SummaryCard icon={ShieldCheck} label="Düşük Risk" value={counts.low} color="text-winning" />
        <SummaryCard icon={ShieldAlert} label="Orta Risk" value={counts.medium} color="text-risky" />
        <SummaryCard icon={ShieldX} label="Yüksek Risk" value={counts.high} color="text-destructive" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ürün adı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Risk:</span>
          {(["all", "low", "medium", "high"] as RiskFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                riskFilter === r ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "all" ? "Tümü" : riskLabelMap[r]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Skor:</span>
          {SCORE_RANGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setScoreRange(s.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                scoreRange === s.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sırala:</span>
          {([
            { key: "decisionScore" as SortKey, label: "Skor" },
            { key: "profitMargin" as SortKey, label: "Marj" },
            { key: "monthlyProfit" as SortKey, label: "Aylık Kâr" },
            { key: "dateSaved" as SortKey, label: "Tarih" },
          ]).map((s) => (
            <button
              key={s.key}
              onClick={() => handleSort(s.key)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                sortBy === s.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
              {sortBy === s.key && <ArrowUpDown className="h-3 w-3" />}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} / {products.length} ürün</p>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Filtrelere uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, ...transition }}
              className="card-glow rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`text-2xl font-bold font-mono tabular-nums ${product.decisionScore >= 60 ? "text-winning" : product.decisionScore >= 35 ? "text-primary" : "text-destructive"}`}>
                  {product.decisionScore}
                  <span className="text-xs text-muted-foreground font-normal">/100</span>
                </div>
                <button onClick={() => handleDelete(product.id, product.name)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-3">{product.name}</h3>
              <div className="space-y-2">
                <DataRow label="Kâr Marjı" value={`%${product.profitMargin}`} />
                <DataRow label="Aylık Kâr" value={`$${product.monthlyProfit.toFixed(0)}`} />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Risk</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${riskClassMap[product.riskLevel]}`}>
                    {riskLabelMap[product.riskLevel]}
                  </span>
                </div>
                <DataRow label="Tarih" value={new Date(product.dateSaved).toLocaleDateString("tr-TR")} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <div className={`h-9 w-9 rounded-lg bg-secondary flex items-center justify-center ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold font-mono tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

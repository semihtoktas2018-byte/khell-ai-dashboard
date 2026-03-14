import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { trendingProducts, categories } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";
import { Filter } from "lucide-react";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const platforms = ["Tümü", "TikTok", "Amazon", "AliExpress"];
const marginFilters = [
  { label: "Tümü", min: 0, max: 100 },
  { label: "%30+", min: 30, max: 100 },
  { label: "%40+", min: 40, max: 100 },
  { label: "%50+", min: 50, max: 100 },
];
const trendFilters = [
  { label: "Tümü", min: 0 },
  { label: "80+", min: 80 },
  { label: "90+", min: 90 },
];

export default function WinningProducts() {
  const [platform, setPlatform] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [marginFilter, setMarginFilter] = useState(0);
  const [trendFilter, setTrendFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return trendingProducts.filter((p) => {
      if (platform !== "Tümü" && p.platform !== platform) return false;
      if (category !== "Tümü" && p.category !== category) return false;
      if (p.profitMargin < marginFilters[marginFilter].min) return false;
      if (p.trendScore < trendFilters[trendFilter].min) return false;
      return true;
    });
  }, [platform, category, marginFilter, trendFilter]);

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                platform === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="h-4 w-4" /> Filtreler
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="card-glow rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Kategori</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 text-xs rounded-md transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Kâr Marjı</label>
            <div className="flex flex-wrap gap-1.5">
              {marginFilters.map((f, i) => (
                <button key={f.label} onClick={() => setMarginFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${marginFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Trend Skoru</label>
            <div className="flex flex-wrap gap-1.5">
              {trendFilters.map((f, i) => (
                <button key={f.label} onClick={() => setTrendFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} ürün bulundu</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => {
          const verdict = getVerdict(product.profitMargin);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, ...transition }}
              whileHover={{ y: -4 }}
              className="card-glow rounded-xl p-5 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{product.image}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${verdict.class}`}>
                  {verdict.labelTr}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{product.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-3">{product.category} · {product.platform}</p>
              <div className="space-y-2">
                <DataRow label="Satış Fiyatı" value={`$${product.estimatedSellingPrice.toFixed(2)}`} />
                <DataRow label="Tedarikçi Fiyatı" value={`$${product.supplierPrice.toFixed(2)}`} />
                <DataRow label="Trend Skoru" value={`${product.trendScore}/100`} />
                <DataRow label="Kâr Marjı" value={`%${product.profitMargin}`} color={verdict.color} />
                <DataRow label="Rekabet" value={product.competition} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Filtrelere uygun ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium tabular-nums text-foreground" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, Award, ArrowUpDown, CheckCircle, Clock } from "lucide-react";
import { suppliers } from "@/lib/mock-data";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

type SortKey = "price" | "shippingCost" | "rating" | "minOrder" | "totalCost";
type SortDir = "asc" | "desc";

export default function Suppliers() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalCost");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const { t, currencySymbol } = useLocale();

  const sources = ["all", "AliExpress", "Alibaba", "CJ Dropshipping"];
  const sourceLabel = (s: string) => (s === "all" ? t("suppliers.all") : s);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let items = suppliers.filter((s) => {
      if (source !== "all" && s.source !== source) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.product.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    items = [...items].sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortKey === "totalCost") { aVal = a.price + a.shippingCost; bVal = b.price + b.shippingCost; }
      else { aVal = a[sortKey] as number; bVal = b[sortKey] as number; }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return items;
  }, [query, source, sortKey, sortDir]);

  const bestId = useMemo(() => {
    if (filtered.length === 0) return null;
    const eligible = filtered.filter((s) => s.rating >= 4.5);
    if (eligible.length === 0) return filtered[0].id;
    return eligible.reduce((best, s) => (s.price + s.shippingCost < best.price + best.shippingCost ? s : best)).id;
  }, [filtered]);

  const SortHeader = ({ label, sortField }: { label: string; sortField: SortKey }) => (
    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none" onClick={() => handleSort(sortField)}>
      <span className="inline-flex items-center gap-1">{label}{sortKey === sortField && <ArrowUpDown className="h-3 w-3 text-primary" />}</span>
    </th>
  );

  return (
    <div className="space-y-6">
      <SEO title="Tedarikçi Karşılaştırma | KHELL AI" description="AliExpress, Alibaba ve CJ tedarikçilerini fiyat ve teslimat üzerinden karşılaştır." />
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("suppliers.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("suppliers.desc")}</p>
      </div>

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("suppliers.totalSuppliers"), value: suppliers.length, color: "text-foreground" },
          { label: t("suppliers.verified"), value: suppliers.filter(s => s.verified).length, color: "text-winning" },
          { label: t("suppliers.freeShipping"), value: suppliers.filter(s => s.shippingCost === 0).length, color: "text-primary" },
          { label: t("suppliers.minOrder1"), value: suppliers.filter(s => s.minOrder === 1).length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="card-glow rounded-xl p-4">
            <p className={`text-2xl font-bold font-mono tabular-nums ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("suppliers.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${source === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
            >{sourceLabel(s)}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} {t("suppliers.found")}</p>

      {/* Tablo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="card-glow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-8"></th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{t("suppliers.supplier")}</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{t("suppliers.platform")}</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{t("suppliers.productGroup")}</th>
                <SortHeader label={t("suppliers.price")} sortField="price" />
                <SortHeader label={t("suppliers.shipping")} sortField="shippingCost" />
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{t("suppliers.delivery")}</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{t("suppliers.response")}</th>
                <SortHeader label={t("suppliers.minOrder")} sortField="minOrder" />
                <SortHeader label={t("suppliers.rating")} sortField="rating" />
                <SortHeader label={t("suppliers.total")} sortField="totalCost" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const isBest = s.id === bestId;
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-border/50 transition-colors ${isBest ? "bg-winning/5" : "hover:bg-accent/30"}`}
                  >
                    <td className="py-3 px-4">
                      {isBest && (
                        <span className="verdict-winning rounded-md px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1 w-fit whitespace-nowrap">
                          <Award className="h-3 w-3" /> {t("suppliers.best")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{s.name}</span>
                        {s.verified && <CheckCircle className="h-3.5 w-3.5 text-winning shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.location}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        s.source === "CJ Dropshipping" ? "bg-primary/10 text-primary" :
                        s.source === "Alibaba" ? "bg-risky/10 text-risky" :
                        "bg-winning/10 text-winning"
                      }`}>{s.source}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{s.product}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-foreground">{currencySymbol}{s.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground">
                      {s.shippingCost === 0 ? <span className="text-winning text-xs font-medium">{t("suppliers.freeUpper")}</span> : `${currencySymbol}${s.shippingCost.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">{s.deliveryTime}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3" />{s.responseTime}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground">{s.minOrder}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-risky">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="font-mono tabular-nums text-xs">{s.rating}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-foreground font-medium">
                      {currencySymbol}{(s.price + s.shippingCost).toFixed(2)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">{t("suppliers.noSuppliers")}</p>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import { suppliers } from "@/lib/mock-data";

const transition = { type: "spring", stiffness: 300, damping: 30 };

export default function Suppliers() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? suppliers.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : suppliers;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tedarikçi veya ürün ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-dark w-full pl-10"
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="card-glow rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Tedarikçi</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-muted-foreground">Fiyat</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-muted-foreground">Min. Sipariş</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-muted-foreground">Kargo</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-muted-foreground">Puan</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Konum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-3 px-5 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 px-5 text-right font-mono tabular-nums text-foreground">${s.price.toFixed(2)}</td>
                  <td className="py-3 px-5 text-right font-mono tabular-nums text-muted-foreground">{s.minOrder}</td>
                  <td className="py-3 px-5 text-right font-mono tabular-nums text-muted-foreground">${s.shipping.toFixed(2)}</td>
                  <td className="py-3 px-5 text-right">
                    <span className="inline-flex items-center gap-1 text-risky">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-mono tabular-nums text-xs">{s.rating}</span>
                    </span>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground">{s.location}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

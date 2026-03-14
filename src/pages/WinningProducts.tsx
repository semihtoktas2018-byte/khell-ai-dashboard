import { useState } from "react";
import { motion } from "framer-motion";
import { trendingProducts } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const platforms = ["Tümü", "TikTok", "Amazon", "AliExpress"];

export default function WinningProducts() {
  const [platform, setPlatform] = useState("Tümü");

  const filtered = platform === "Tümü" ? trendingProducts : trendingProducts.filter((p) => p.platform === platform);

  return (
    <div className="space-y-6">
      {/* Filter */}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => {
          const verdict = getVerdict(product.estimatedMargin);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ...transition }}
              whileHover={{ y: -4 }}
              className="card-glow rounded-xl p-5 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{product.image}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${verdict.class}`}>
                  {verdict.labelTr}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-3">{product.name}</h3>
              <div className="space-y-2">
                <DataRow label="Platform" value={product.platform} />
                <DataRow label="Trend Skoru" value={`${product.trendScore}/100`} />
                <DataRow label="Tahmini Marj" value={`%${product.estimatedMargin}`} color={verdict.color} />
                <DataRow label="Rekabet" value={product.competition} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium tabular-nums" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

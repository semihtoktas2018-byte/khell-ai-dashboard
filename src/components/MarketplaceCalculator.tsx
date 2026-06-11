import { useState } from "react";
import { ChevronDown, ChevronUp, Store } from "lucide-react";

interface MarketplaceCalculatorProps {
  costUSD: number;        // CJ maliyeti (dolar)
  salePriceUSD: number;   // Tahmini satış fiyatı (dolar)
  exchangeRate?: number;  // 1 USD = ? TL (default 45)
}

interface MarketplaceResult {
  name: string;
  emoji: string;
  commission: number;       // yüzde
  kdv: number;              // yüzde
  cargoTL: number;          // sabit TL
  grossRevenueTL: number;
  commissionTL: number;
  kdvTL: number;
  netProfitTL: number;
  netMargin: number;
  verdict: "iyi" | "orta" | "kötü";
}

const MARKETPLACES = [
  { name: "Trendyol", emoji: "🟠", commission: 15, kdv: 20, cargo: 0 },
  { name: "Hepsiburada", emoji: "🟡", commission: 12, kdv: 20, cargo: 0 },
  { name: "Amazon TR", emoji: "🔵", commission: 15, kdv: 20, cargo: 0 },
  { name: "N11", emoji: "🟣", commission: 10, kdv: 20, cargo: 0 },
];

function calculate(
  costUSD: number,
  salePriceUSD: number,
  exchangeRate: number,
  mp: typeof MARKETPLACES[0]
): MarketplaceResult {
  const costTL = costUSD * exchangeRate;
  const grossRevenueTL = salePriceUSD * exchangeRate;
  const commissionTL = grossRevenueTL * (mp.commission / 100);
  const kdvTL = grossRevenueTL * (mp.kdv / 100);
  const netProfitTL = grossRevenueTL - commissionTL - kdvTL - costTL - mp.cargo;
  const netMargin = grossRevenueTL > 0 ? Math.round((netProfitTL / grossRevenueTL) * 100) : 0;

  const verdict: MarketplaceResult["verdict"] =
    netMargin >= 20 ? "iyi" : netMargin >= 5 ? "orta" : "kötü";

  return {
    name: mp.name,
    emoji: mp.emoji,
    commission: mp.commission,
    kdv: mp.kdv,
    cargoTL: mp.cargo,
    grossRevenueTL,
    commissionTL,
    kdvTL,
    netProfitTL,
    netMargin,
    verdict,
  };
}

const verdictColors = {
  iyi: "text-green-400",
  orta: "text-yellow-400",
  kötü: "text-red-400",
};

const verdictBg = {
  iyi: "bg-green-500/10 border-green-500/20",
  orta: "bg-yellow-500/10 border-yellow-500/20",
  kötü: "bg-red-500/10 border-red-500/20",
};

export default function MarketplaceCalculator({
  costUSD,
  salePriceUSD,
  exchangeRate = 45,
}: MarketplaceCalculatorProps) {
  const [open, setOpen] = useState(false);

  if (costUSD <= 0 || salePriceUSD <= 0) return null;

  const results = MARKETPLACES.map((mp) =>
    calculate(costUSD, salePriceUSD, exchangeRate, mp)
  );

  const best = results.reduce((a, b) =>
    a.netProfitTL > b.netProfitTL ? a : b
  );

  return (
    <div className="rounded-md border border-purple-500/20 bg-purple-500/5 text-[10px] overflow-hidden">
      {/* Başlık / Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-purple-500/10 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Store className="h-2.5 w-2.5 text-purple-400" />
          <span className="font-semibold text-purple-400">Pazar Yeri Komisyon</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            En iyi:{" "}
            <span className={`font-bold ${verdictColors[best.verdict]}`}>
              {best.name} ({best.netMargin > 0 ? "+" : ""}{best.netMargin}%)
            </span>
          </span>
          {open ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Detay */}
      {open && (
        <div className="px-2 pb-2 space-y-1.5 border-t border-purple-500/10 pt-1.5">
          <div className="grid grid-cols-2 gap-1 text-muted-foreground mb-1">
            <span>Maliyet: <span className="text-foreground font-mono">${costUSD.toFixed(2)} = ₺{(costUSD * exchangeRate).toFixed(0)}</span></span>
            <span>Satış: <span className="text-foreground font-mono">${salePriceUSD.toFixed(2)} = ₺{(salePriceUSD * exchangeRate).toFixed(0)}</span></span>
          </div>
          {results.map((r) => (
            <div
              key={r.name}
              className={`rounded border px-2 py-1.5 ${verdictBg[r.verdict]}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-foreground">
                  {r.emoji} {r.name}
                </span>
                <span className={`font-mono font-bold text-xs ${verdictColors[r.verdict]}`}>
                  Net: ₺{r.netProfitTL.toFixed(0)} ({r.netMargin}%)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-muted-foreground">
                <span>Komisyon %{r.commission}: <span className="text-red-400">-₺{r.commissionTL.toFixed(0)}</span></span>
                <span>KDV %{r.kdv}: <span className="text-red-400">-₺{r.kdvTL.toFixed(0)}</span></span>
                <span>Maliyet: <span className="text-red-400">-₺{(costUSD * exchangeRate).toFixed(0)}</span></span>
              </div>
            </div>
          ))}
          <p className="text-muted-foreground text-center pt-0.5">
            Kur: 1$ = ₺{exchangeRate} · KDV satış fiyatı üzerinden
          </p>
        </div>
      )}
    </div>
  );
}

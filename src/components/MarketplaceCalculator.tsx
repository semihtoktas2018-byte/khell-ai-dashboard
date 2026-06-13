import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Store } from "lucide-react";

interface MarketplaceCalculatorProps {
  expandTrigger?: number;
  costUSD: number;
  salePriceUSD: number;
  exchangeRate?: number;
}

interface MarketplaceResult {
  name: string;
  emoji: string;
  commission: number;
  kdv: number;
  cargoTL: number;
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

function calculate(costUSD: number, salePriceUSD: number, exchangeRate: number, mp: typeof MARKETPLACES[0]): MarketplaceResult {
  const costTL = costUSD * exchangeRate;
  const grossRevenueTL = salePriceUSD * exchangeRate;
  const commissionTL = grossRevenueTL * (mp.commission / 100);
  const kdvTL = grossRevenueTL * (mp.kdv / 100);
  const netProfitTL = grossRevenueTL - commissionTL - kdvTL - costTL - mp.cargo;
  const netMargin = grossRevenueTL > 0 ? Math.round((netProfitTL / grossRevenueTL) * 100) : 0;
  const verdict: MarketplaceResult["verdict"] = netMargin >= 20 ? "iyi" : netMargin >= 5 ? "orta" : "kötü";
  return { name: mp.name, emoji: mp.emoji, commission: mp.commission, kdv: mp.kdv, cargoTL: mp.cargo, grossRevenueTL, commissionTL, kdvTL, netProfitTL, netMargin, verdict };
}

const verdictColors = { iyi: "text-green-400", orta: "text-yellow-400", kötü: "text-red-400" };
const verdictBg = { iyi: "bg-green-500/10 border-green-500/20", orta: "bg-yellow-500/10 border-yellow-500/20", kötü: "bg-red-500/10 border-red-500/20" };

export default function MarketplaceCalculator({ costUSD, salePriceUSD, exchangeRate = 45 , expandTrigger }: MarketplaceCalculatorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expandTrigger && expandTrigger > 0) setOpen(true);
  }, [expandTrigger]);
  const hasData = costUSD > 0 && salePriceUSD > 0;

  const results = hasData ? MARKETPLACES.map((mp) => calculate(costUSD, salePriceUSD, exchangeRate, mp)) : [];
  const best = results.length > 0 ? results.reduce((a, b) => (a.netProfitTL > b.netProfitTL ? a : b)) : null;

  return (
    <div className="group rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent text-[11px] overflow-hidden transition-all duration-300 hover:border-purple-400/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-purple-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/15 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.6)] transition-shadow">
            <Store className="h-3 w-3 text-purple-400" />
          </div>
          <span className="font-bold text-purple-400 tracking-wide">PAZAR YERİ KOMİSYON</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasData ? (
            <span className="text-muted-foreground italic">Maliyet & satış fiyatı girin →</span>
          ) : best ? (
            <span className="text-muted-foreground">
              En iyi: <span className={`font-bold ${verdictColors[best.verdict]}`}>{best.name} ({best.netMargin > 0 ? "+" : ""}{best.netMargin}%)</span>
            </span>
          ) : null}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-purple-500/10 pt-2">
          {!hasData ? (
            <p className="text-muted-foreground text-center py-2">
              Maliyet ve satış fiyatını girince Trendyol, Hepsiburada, Amazon TR, N11 net kâr karşılaştırması burada çıkar 🏪
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground mb-1">
                <span>Maliyet: <span className="text-foreground font-mono">${costUSD.toFixed(2)} = ₺{(costUSD * exchangeRate).toFixed(0)}</span></span>
                <span>Satış: <span className="text-foreground font-mono">${salePriceUSD.toFixed(2)} = ₺{(salePriceUSD * exchangeRate).toFixed(0)}</span></span>
              </div>
              {results.map((r) => (
                <div key={r.name} className={`rounded-lg border px-2.5 py-2 ${verdictBg[r.verdict]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">{r.emoji} {r.name}</span>
                    <span className={`font-mono font-bold text-xs ${verdictColors[r.verdict]}`}>Net: ₺{r.netProfitTL.toFixed(0)} ({r.netMargin}%)</span>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

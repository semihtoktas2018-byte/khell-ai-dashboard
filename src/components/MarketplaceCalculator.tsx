import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Store } from "lucide-react";

interface MarketplaceCalculatorProps {
  expandTrigger?: number;
  costUSD: number;
  salePriceUSD: number;
  exchangeRate?: number;
  isTr?: boolean;
  countryCode?: string; // "TR", "US", "FR", "NL", "DE", "UK" vs.
}

interface MarketplaceConfig {
  name: string;
  emoji: string;
  commission: number;
  vat: number;
  cargo: number;
  currency: "TL" | "USD" | "EUR" | "GBP";
}

interface MarketplaceResult extends MarketplaceConfig {
  grossRevenue: number;
  commissionAmt: number;
  vatAmt: number;
  netProfit: number;
  netMargin: number;
  verdict: "iyi" | "orta" | "kötü";
}

// Ülkeye göre yerel pazar yerleri. Kur hep costUSD/salePriceUSD üzerinden,
// gösterim para birimi ülkeye göre değişiyor (basitlik için TL'ye çevirmiyoruz,
// USD/EUR/GBP olanları kendi para biriminde gösteriyoruz).
const MARKETPLACES_BY_COUNTRY: Record<string, MarketplaceConfig[]> = {
  TR: [
    { name: "Trendyol", emoji: "🟠", commission: 15, vat: 20, cargo: 0, currency: "TL" },
    { name: "Hepsiburada", emoji: "🟡", commission: 12, vat: 20, cargo: 0, currency: "TL" },
    { name: "Amazon TR", emoji: "🔵", commission: 15, vat: 20, cargo: 0, currency: "TL" },
    { name: "N11", emoji: "🟣", commission: 10, vat: 20, cargo: 0, currency: "TL" },
  ],
  US: [
    { name: "Amazon US", emoji: "🟠", commission: 15, vat: 0, cargo: 0, currency: "USD" },
    { name: "eBay", emoji: "🔵", commission: 13, vat: 0, cargo: 0, currency: "USD" },
    { name: "Walmart", emoji: "🟡", commission: 15, vat: 0, cargo: 0, currency: "USD" },
    { name: "Etsy", emoji: "🟣", commission: 6.5, vat: 0, cargo: 0, currency: "USD" },
  ],
  FR: [
    { name: "Cdiscount", emoji: "🟠", commission: 12, vat: 20, cargo: 0, currency: "EUR" },
    { name: "Fnac", emoji: "🔵", commission: 15, vat: 20, cargo: 0, currency: "EUR" },
    { name: "Amazon FR", emoji: "🟡", commission: 15, vat: 20, cargo: 0, currency: "EUR" },
    { name: "Rakuten FR", emoji: "🟣", commission: 10, vat: 20, cargo: 0, currency: "EUR" },
  ],
  NL: [
    { name: "Bol.com", emoji: "🟠", commission: 13, vat: 21, cargo: 0, currency: "EUR" },
    { name: "Amazon NL", emoji: "🔵", commission: 15, vat: 21, cargo: 0, currency: "EUR" },
    { name: "Marktplaats", emoji: "🟡", commission: 5, vat: 21, cargo: 0, currency: "EUR" },
  ],
  DE: [
    { name: "OTTO", emoji: "🟠", commission: 14, vat: 19, cargo: 0, currency: "EUR" },
    { name: "Amazon DE", emoji: "🔵", commission: 15, vat: 19, cargo: 0, currency: "EUR" },
    { name: "Kaufland", emoji: "🟣", commission: 10, vat: 19, cargo: 0, currency: "EUR" },
  ],
  UK: [
    { name: "Amazon UK", emoji: "🟠", commission: 15, vat: 20, cargo: 0, currency: "GBP" },
    { name: "eBay UK", emoji: "🔵", commission: 13, vat: 20, cargo: 0, currency: "GBP" },
  ],
};

const CURRENCY_SYMBOL: Record<MarketplaceConfig["currency"], string> = {
  TL: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function calculate(costUSD: number, salePriceUSD: number, exchangeRate: number, mp: MarketplaceConfig): MarketplaceResult {
  // TL bazlı pazar yerleri kur ile çevrilir, diğerleri direkt USD tutarını kendi para birimi kabul eder (yaklaşık).
  const rate = mp.currency === "TL" ? exchangeRate : 1;
  const cost = costUSD * rate;
  const grossRevenue = salePriceUSD * rate;
  const commissionAmt = grossRevenue * (mp.commission / 100);
  const vatAmt = grossRevenue * (mp.vat / 100);
  const netProfit = grossRevenue - commissionAmt - vatAmt - cost - mp.cargo;
  const netMargin = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;
  const verdict: MarketplaceResult["verdict"] = netMargin >= 20 ? "iyi" : netMargin >= 5 ? "orta" : "kötü";
  return { ...mp, grossRevenue, commissionAmt, vatAmt, netProfit, netMargin, verdict };
}

const verdictColors = { iyi: "text-green-400", orta: "text-yellow-400", kötü: "text-red-400" };
const verdictBg = { iyi: "bg-green-500/10 border-green-500/20", orta: "bg-yellow-500/10 border-yellow-500/20", kötü: "bg-red-500/10 border-red-500/20" };

export default function MarketplaceCalculator({
  costUSD,
  salePriceUSD,
  exchangeRate = 45,
  expandTrigger,
  isTr = true,
  countryCode = "TR",
}: MarketplaceCalculatorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expandTrigger && expandTrigger > 0) setOpen(true);
  }, [expandTrigger]);

  const hasData = costUSD > 0 && salePriceUSD > 0;
  const marketplaces = MARKETPLACES_BY_COUNTRY[countryCode] ?? MARKETPLACES_BY_COUNTRY.TR;

  const results = hasData ? marketplaces.map((mp) => calculate(costUSD, salePriceUSD, exchangeRate, mp)) : [];
  const best = results.length > 0 ? results.reduce((a, b) => (a.netProfit > b.netProfit ? a : b)) : null;

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
          <span className="font-bold text-purple-400 tracking-wide">{isTr ? "PAZAR YERİ KOMİSYON" : "MARKETPLACE COMMISSION"}</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasData ? (
            <span className="text-muted-foreground italic">{isTr ? "Maliyet & satış fiyatı girin →" : "Enter cost & sale price →"}</span>
          ) : best ? (
            <span className="text-muted-foreground">
              {isTr ? "En iyi:" : "Best:"} <span className={`font-bold ${verdictColors[best.verdict]}`}>{best.name} ({best.netMargin > 0 ? "+" : ""}{best.netMargin}%)</span>
            </span>
          ) : null}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-purple-500/10 pt-2">
          {!hasData ? (
            <p className="text-muted-foreground text-center py-2">
              {isTr
                ? "Maliyet ve satış fiyatını girince hedef ülkendeki pazar yerlerinde net kâr karşılaştırması burada çıkar 🏪"
                : "Enter cost and sale price to compare net profit across marketplaces in your target country 🏪"}
            </p>
          ) : (
            <>
              {results.map((r) => {
                const sym = CURRENCY_SYMBOL[r.currency];
                return (
                  <div key={r.name} className={`rounded-lg border px-2.5 py-2 ${verdictBg[r.verdict]}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground">{r.emoji} {r.name}</span>
                      <span className={`font-mono font-bold text-xs ${verdictColors[r.verdict]}`}>
                        {isTr ? "Net:" : "Net:"} {sym}{r.netProfit.toFixed(2)} ({r.netMargin}%)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-muted-foreground">
                      <span>{isTr ? "Komisyon" : "Commission"} %{r.commission}: <span className="text-red-400">-{sym}{r.commissionAmt.toFixed(2)}</span></span>
                      {r.vat > 0 && (
                        <span>{isTr ? "KDV" : "VAT"} %{r.vat}: <span className="text-red-400">-{sym}{r.vatAmt.toFixed(2)}</span></span>
                      )}
                      <span>{isTr ? "Maliyet:" : "Cost:"} <span className="text-red-400">-{sym}{(r.currency === "TL" ? costUSD * exchangeRate : costUSD).toFixed(2)}</span></span>
                    </div>
                  </div>
                );
              })}
              <p className="text-muted-foreground text-center pt-0.5">
                {isTr ? `Kur: 1$ = ₺${exchangeRate} · Ülke: ${countryCode}` : `Rate: $1 = ₺${exchangeRate} · Country: ${countryCode}`}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

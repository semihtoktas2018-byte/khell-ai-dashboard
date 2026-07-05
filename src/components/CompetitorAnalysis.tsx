import { useState, useEffect } from "react";
import { Target, Loader2, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompetitorAnalysisProps {
  expandTrigger?: number;
  productName: string;
  googleApiKey: string;
  googleCx: string;
  isTr?: boolean;
}

interface MarketResult {
  name: string;
  emoji: string;
  site: string;
  count: number | null;
  loading: boolean;
  error: boolean;
}

interface EbayResult {
  total: number | null;
  lowestPrice: number | null;
  currency: string | null;
  loading: boolean;
  error: boolean;
}

const MARKETS = [
  { name: "Trendyol", emoji: "🟠", site: "trendyol.com" },
  { name: "Hepsiburada", emoji: "🟡", site: "hepsiburada.com" },
  { name: "N11", emoji: "🟣", site: "n11.com" },
  { name: "AliExpress", emoji: "🔵", site: "aliexpress.com" },
];

function getLevel(count: number | null, isTr: boolean): { label: string; color: string; bg: string } {
  if (count === null) return { label: isTr ? "Veri yok" : "No data", color: "text-muted-foreground", bg: "bg-muted/20" };
  if (count <= 15) return { label: isTr ? "Az Rakip 🟢" : "Low Competition 🟢", color: "text-green-400", bg: "bg-green-500/10" };
  if (count <= 50) return { label: isTr ? "Orta Rekabet 🟡" : "Medium Competition 🟡", color: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { label: isTr ? "Yüksek Rekabet 🔴" : "High Competition 🔴", color: "text-red-400", bg: "bg-red-500/10" };
}

// eBay listeleme sayısına göre rekabet seviyesi (gerçek veri)
function getEbayLevel(total: number | null, isTr: boolean): { label: string; color: string; bg: string } {
  if (total === null) return { label: isTr ? "Veri yok" : "No data", color: "text-muted-foreground", bg: "bg-muted/20" };
  if (total <= 500) return { label: isTr ? "Az Rakip 🟢" : "Low Competition 🟢", color: "text-green-400", bg: "bg-green-500/10" };
  if (total <= 5000) return { label: isTr ? "Orta Rekabet 🟡" : "Medium Competition 🟡", color: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { label: isTr ? "Yüksek Rekabet 🔴" : "High Competition 🔴", color: "text-red-400", bg: "bg-red-500/10" };
}

function getScore(results: MarketResult[]): number {
  const done = results.filter((r) => r.count !== null);
  if (done.length === 0) return 0;
  const avg = done.reduce((a, b) => a + (b.count || 0), 0) / done.length;
  if (avg <= 15) return 90;
  if (avg <= 30) return 70;
  if (avg <= 60) return 50;
  return 25;
}

export default function CompetitorAnalysis({ productName, googleApiKey, googleCx, expandTrigger, isTr = true }: CompetitorAnalysisProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expandTrigger && expandTrigger > 0) setOpen(true);
  }, [expandTrigger]);
  const [results, setResults] = useState<MarketResult[]>(
    MARKETS.map((m) => ({ ...m, count: null, loading: false, error: false }))
  );
  const [ebay, setEbay] = useState<EbayResult>({
    total: null,
    lowestPrice: null,
    currency: null,
    loading: false,
    error: false,
  });
  const [started, setStarted] = useState(false);
  const hasName = productName.trim().length > 0;

  const fetchEbay = async () => {
    setEbay({ total: null, lowestPrice: null, currency: null, loading: true, error: false });
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("ebay-proxy", {
        body: { q: productName, limit: 20, sort: "price" },
      });
      if (fnErr || !data || data.error) throw new Error("ebay error");

      const items = data.items || [];
      const prices = items
        .map((it: any) => parseFloat(it.price))
        .filter((p: number) => !isNaN(p));
      const lowest = prices.length ? Math.min(...prices) : null;
      const currency = items[0]?.currency || "USD";

      setEbay({
        total: data.total ?? items.length,
        lowestPrice: lowest,
        currency,
        loading: false,
        error: false,
      });
    } catch {
      setEbay({ total: null, lowestPrice: null, currency: null, loading: false, error: true });
    }
  };

  const fetchAll = async () => {
    if (!productName.trim()) return;
    setStarted(true);

    // eBay gerçek veri (paralel başlat)
    fetchEbay();

    // Google tahmini platformlar
    if (googleApiKey) {
      setResults(MARKETS.map((m) => ({ ...m, count: null, loading: true, error: false })));
      for (const market of MARKETS) {
        try {
          const query = encodeURIComponent(`${productName} site:${market.site}`);
          const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${query}&num=1`;
          const res = await fetch(url);
          const data = await res.json();
          const totalResults = parseInt(data?.searchInformation?.totalResults || "0");
          setResults((prev) =>
            prev.map((r) => (r.site === market.site ? { ...r, count: totalResults, loading: false } : r))
          );
        } catch {
          setResults((prev) =>
            prev.map((r) => (r.site === market.site ? { ...r, error: true, loading: false } : r))
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  };

  useEffect(() => {
    if (open && hasName && !started) fetchAll();
    if (!hasName) {
      setStarted(false);
      setResults(MARKETS.map((m) => ({ ...m, count: null, loading: false, error: false })));
      setEbay({ total: null, lowestPrice: null, currency: null, loading: false, error: false });
    }
  }, [open, productName]);

  const score = getScore(results);
  const allDone = results.every((r) => !r.loading) && !ebay.loading;
  const bestMarket = results.filter((r) => r.count !== null).sort((a, b) => (a.count || 0) - (b.count || 0))[0];
  const ebayLevel = getEbayLevel(ebay.total, isTr);

  return (
    <div className="group rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent text-[11px] overflow-hidden transition-all duration-300 hover:border-blue-400/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.35)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-500/15 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-shadow">
            <Target className="h-3 w-3 text-blue-400" />
          </div>
          <span className="font-bold text-blue-400 tracking-wide">{isTr ? "RAKİP ANALİZİ" : "COMPETITOR ANALYSIS"}</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasName ? (
            <span className="text-muted-foreground italic">{isTr ? "Ürün adı girin →" : "Enter product name →"}</span>
          ) : !started ? (
            <span className="text-muted-foreground">{isTr ? "Tıkla, analiz başlasın" : "Click to start analysis"}</span>
          ) : allDone && bestMarket ? (
            <span className="text-muted-foreground">
              {isTr ? "En az rakip:" : "Lowest competition:"} <span className="font-bold text-green-400">{bestMarket.name} ({bestMarket.count})</span>
              {" · "}
              <span className={`font-bold ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                {isTr ? "Fırsat Skoru:" : "Opportunity Score:"} {score}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> {isTr ? "Analiz ediliyor..." : "Analyzing..."}
            </span>
          )}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-blue-500/10 pt-2">
          {!hasName ? (
            <p className="text-muted-foreground text-center py-2">
              {isTr
                ? "Yukarıdaki kutuya ürün adını yaz, platformlarda + eBay'de rakip analizi yapılsın 🎯"
                : "Enter the product name above to analyze competition across platforms + eBay 🎯"}
            </p>
          ) : (
            <>
              {/* eBay - GERÇEK VERİ */}
              <div className={`rounded-lg border border-blue-400/40 px-2.5 py-2 ${ebayLevel.bg}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3 text-blue-400" /> eBay
                    <span className="text-[9px] font-semibold text-blue-400 bg-blue-500/15 rounded px-1 py-0.5 ml-1">
                      {isTr ? "GERÇEK VERİ" : "LIVE DATA"}
                    </span>
                  </span>
                  {ebay.loading ? (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" /> {isTr ? "Yükleniyor..." : "Loading..."}
                    </span>
                  ) : ebay.error ? (
                    <span className="text-muted-foreground">{isTr ? "Veri alınamadı" : "Data unavailable"}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">
                        {ebay.total?.toLocaleString()} {isTr ? "ilan" : "listings"}
                      </span>
                      <span className={`font-semibold ${ebayLevel.color}`}>{ebayLevel.label}</span>
                    </div>
                  )}
                </div>
                {!ebay.loading && !ebay.error && ebay.lowestPrice !== null && (
                  <div className="mt-1 text-muted-foreground">
                    {isTr ? "En düşük fiyat:" : "Lowest price:"}{" "}
                    <span className="font-bold text-green-400">
                      {ebay.lowestPrice.toFixed(2)} {ebay.currency}
                    </span>
                  </div>
                )}
              </div>

              {/* Google tahmini platformlar */}
              {results.map((r) => {
                const level = getLevel(r.count, isTr);
                return (
                  <div key={r.site} className={`rounded-lg border border-transparent px-2.5 py-2 ${level.bg}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{r.emoji} {r.name}</span>
                      {r.loading ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Loader2 className="h-2.5 w-2.5 animate-spin" /> {isTr ? "Yükleniyor..." : "Loading..."}
                        </span>
                      ) : r.error ? (
                        <span className="text-muted-foreground">{isTr ? "Veri alınamadı" : "Data unavailable"}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-foreground">{r.count?.toLocaleString()} {isTr ? "sonuç" : "results"}</span>
                          <span className={`font-semibold ${level.color}`}>{level.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {allDone && (
                <div className="mt-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-2 text-center">
                  <span className="text-muted-foreground">{isTr ? "Fırsat Skoru:" : "Opportunity Score:"} </span>
                  <span className={`font-bold text-sm ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {score}/100
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {score >= 70
                      ? (isTr ? "— Düşük rekabet, gir!" : "— Low competition, go for it!")
                      : score >= 50
                      ? (isTr ? "— Orta rekabet, dikkatli ol" : "— Medium competition, be careful")
                      : (isTr ? "— Yüksek rekabet, zorlu pazar" : "— High competition, tough market")}
                  </span>
                </div>
              )}

              <p className="text-muted-foreground text-center pt-0.5">
                {isTr
                  ? "eBay gerçek zamanlı · Diğer platformlar Google sonuç tahmini"
                  : "eBay real-time · Others estimated from Google results"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

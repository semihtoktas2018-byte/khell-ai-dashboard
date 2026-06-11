import { useState, useEffect } from "react";
import { Target, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface CompetitorAnalysisProps {
  productName: string;
  googleApiKey: string;
  googleCx: string;
}

interface MarketResult {
  name: string;
  emoji: string;
  site: string;
  count: number | null;
  loading: boolean;
  error: boolean;
}

const MARKETS = [
  { name: "Trendyol", emoji: "🟠", site: "trendyol.com" },
  { name: "Hepsiburada", emoji: "🟡", site: "hepsiburada.com" },
  { name: "N11", emoji: "🟣", site: "n11.com" },
  { name: "AliExpress", emoji: "🔵", site: "aliexpress.com" },
];

function getLevel(count: number | null): { label: string; color: string; bg: string } {
  if (count === null) return { label: "Veri yok", color: "text-muted-foreground", bg: "bg-muted/20" };
  if (count <= 15) return { label: "Az Rakip 🟢", color: "text-green-400", bg: "bg-green-500/10" };
  if (count <= 50) return { label: "Orta Rekabet 🟡", color: "text-yellow-400", bg: "bg-yellow-500/10" };
  return { label: "Yüksek Rekabet 🔴", color: "text-red-400", bg: "bg-red-500/10" };
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

export default function CompetitorAnalysis({ productName, googleApiKey, googleCx }: CompetitorAnalysisProps) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<MarketResult[]>(
    MARKETS.map((m) => ({ ...m, count: null, loading: false, error: false }))
  );
  const [started, setStarted] = useState(false);

  const fetchAll = async () => {
    if (!productName.trim() || !googleApiKey) return;
    setStarted(true);
    setResults(MARKETS.map((m) => ({ ...m, count: null, loading: true, error: false })));

    for (const market of MARKETS) {
      try {
        const query = encodeURIComponent(`${productName} site:${market.site}`);
        const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${query}&num=1`;
        const res = await fetch(url);
        const data = await res.json();
        const totalResults = parseInt(data?.searchInformation?.totalResults || "0");
        setResults((prev) =>
          prev.map((r) =>
            r.site === market.site
              ? { ...r, count: totalResults, loading: false }
              : r
          )
        );
      } catch {
        setResults((prev) =>
          prev.map((r) =>
            r.site === market.site
              ? { ...r, error: true, loading: false }
              : r
          )
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  useEffect(() => {
    if (open && !started && productName.trim()) {
      fetchAll();
    }
  }, [open]);

  const score = getScore(results);
  const allDone = results.every((r) => !r.loading);
  const bestMarket = results
    .filter((r) => r.count !== null)
    .sort((a, b) => (a.count || 0) - (b.count || 0))[0];

  return (
    <div className="rounded-md border border-blue-500/20 bg-blue-500/5 text-[10px] overflow-hidden">
      {/* Başlık */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-blue-500/10 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Target className="h-2.5 w-2.5 text-blue-400" />
          <span className="font-semibold text-blue-400">Rakip Analizi</span>
        </div>
        <div className="flex items-center gap-2">
          {!started ? (
            <span className="text-muted-foreground">Tıkla, analiz başlasın</span>
          ) : allDone && bestMarket ? (
            <span className="text-muted-foreground">
              En az rakip:{" "}
              <span className="font-bold text-green-400">{bestMarket.name} ({bestMarket.count})</span>
              {" · "}
              <span className={`font-bold ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                Fırsat Skoru: {score}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> Analiz ediliyor...
            </span>
          )}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {/* Detay */}
      {open && (
        <div className="px-2 pb-2 space-y-1.5 border-t border-blue-500/10 pt-1.5">
          {results.map((r) => {
            const level = getLevel(r.count);
            return (
              <div key={r.site} className={`rounded border border-transparent px-2 py-1.5 ${level.bg}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{r.emoji} {r.name}</span>
                  {r.loading ? (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" /> Yükleniyor...
                    </span>
                  ) : r.error ? (
                    <span className="text-muted-foreground">Veri alınamadı</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">{r.count?.toLocaleString()} sonuç</span>
                      <span className={`font-semibold ${level.color}`}>{level.label}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {allDone && (
            <div className="mt-2 rounded border border-blue-500/20 bg-blue-500/10 px-2 py-1.5 text-center">
              <span className="text-muted-foreground">Fırsat Skoru: </span>
              <span className={`font-bold text-sm ${score >= 70 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                {score}/100
              </span>
              <span className="text-muted-foreground ml-2">
                {score >= 70 ? "— Düşük rekabet, gir!" : score >= 50 ? "— Orta rekabet, dikkatli ol" : "— Yüksek rekabet, zorlu pazar"}
              </span>
            </div>
          )}

          <p className="text-muted-foreground text-center pt-0.5">
            Google arama sonuç sayısına göre tahmin · Gerçek zamanlı değil
          </p>
        </div>
      )}
    </div>
  );
}

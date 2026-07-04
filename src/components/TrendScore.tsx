import { useState, useEffect } from "react";
import { Flame, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface TrendScoreProps {
  expandTrigger?: number;
  productName: string;
  googleApiKey: string;
  googleCx: string;
  isTr?: boolean;
}

const CJ_EMAIL = import.meta.env.VITE_CJ_EMAIL || "bamir.global@gmail.com";
const CJ_API_KEY = import.meta.env.VITE_CJ_API_KEY || "26689fbeeb5045f89ec8764c32aaada0";

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) throw new Error("Token alınamadı");
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

// KHELL Skoru etiketleri — Minea'nın "hidden gem" mantığına benzer kademeler
function khellScoreMeta(score: number, isTr: boolean): { label: string; color: string; glow: string } {
  if (score >= 85) return {
    label: isTr ? "💎 Gizli Hazine" : "💎 Hidden Gem",
    color: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.5)]",
  };
  if (score >= 70) return {
    label: isTr ? "🔥 Güçlü Fırsat" : "🔥 Strong Opportunity",
    color: "text-emerald-400",
    glow: "shadow-[0_0_14px_rgba(52,211,153,0.35)]",
  };
  if (score >= 45) return {
    label: isTr ? "⚡ Orta Potansiyel" : "⚡ Medium Potential",
    color: "text-yellow-400",
    glow: "",
  };
  return {
    label: isTr ? "Düşük Potansiyel" : "Low Potential",
    color: "text-red-400",
    glow: "",
  };
}

export default function TrendScore({ productName, googleApiKey, googleCx, expandTrigger, isTr = true }: TrendScoreProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (expandTrigger && expandTrigger > 0) setOpen(true);
  }, [expandTrigger]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [cjCount, setCjCount] = useState<number | null>(null);
  const [marketCount, setMarketCount] = useState<number | null>(null);
  const [redditCount, setRedditCount] = useState<number | null>(null);

  const hasName = productName.trim().length > 0;

  const fetchData = async () => {
    if (!productName.trim()) return;
    setStarted(true);
    setLoading(true);
    setCjCount(null);
    setMarketCount(null);
    setRedditCount(null);

    try {
      const token = await getAccessToken();
      const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&productNameEn=${encodeURIComponent(productName)}`;
      const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
      const data = await res.json();
      const count = data?.data?.total ?? data?.data?.list?.length ?? 0;
      setCjCount(count);
    } catch {
      setCjCount(null);
    }

    if (googleApiKey) {
      try {
        const query = encodeURIComponent(
          `${productName} (site:trendyol.com OR site:n11.com OR site:hepsiburada.com)`
        );
        const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${query}&num=1`;
        const res = await fetch(url);
        const data = await res.json();
        const total = parseInt(data?.searchInformation?.totalResults || "0");
        setMarketCount(total);
      } catch {
        setMarketCount(null);
      }
    }

    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(productName)}&limit=25&sort=new&t=month`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const count = data?.data?.children?.length ?? null;
        setRedditCount(count);
      } else {
        setRedditCount(null);
      }
    } catch {
      setRedditCount(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (open && hasName && !started) fetchData();
    if (!hasName) { setStarted(false); setCjCount(null); setMarketCount(null); setRedditCount(null); }
  }, [open, productName]);

  const cjScore = cjCount !== null ? Math.min(100, Math.round((cjCount / 50) * 100)) : null;

  let satScore: number | null = null;
  if (marketCount !== null) {
    if (marketCount <= 15) satScore = 90;
    else if (marketCount <= 50) satScore = 65;
    else if (marketCount <= 150) satScore = 40;
    else satScore = 20;
  }

  const redditScore = redditCount !== null ? Math.min(100, Math.round((redditCount / 15) * 100)) : null;

  // KHELL Skoru: ağırlıklı ortalama. Doygunluk en kritik sinyal (rakip azsa fırsat büyük),
  // sonra talep/tedarikçi yoğunluğu, sonra organik ilgi (Reddit).
  const weighted: { score: number; weight: number }[] = [];
  if (satScore !== null) weighted.push({ score: satScore, weight: 0.4 });
  if (cjScore !== null) weighted.push({ score: cjScore, weight: 0.3 });
  if (redditScore !== null) weighted.push({ score: redditScore, weight: 0.3 });

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  const khellScore = totalWeight > 0
    ? Math.round(weighted.reduce((sum, w) => sum + w.score * w.weight, 0) / totalWeight)
    : null;

  const meta = khellScore !== null ? khellScoreMeta(khellScore, isTr) : null;

  return (
    <div className={`group rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent text-[11px] overflow-hidden transition-all duration-300 hover:border-pink-400/60 hover:shadow-[0_0_24px_rgba(236,72,153,0.35)] ${meta?.glow || ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-pink-500/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-pink-500/15 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.6)] transition-shadow">
            <Flame className="h-3 w-3 text-pink-400" />
          </div>
          <span className="font-bold text-pink-400 tracking-wide">{isTr ? "KHELL SKORU" : "KHELL SCORE"}</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasName ? (
            <span className="text-muted-foreground italic">{isTr ? "Ürün adı girin →" : "Enter product name →"}</span>
          ) : !started ? (
            <span className="text-muted-foreground">{isTr ? "Tıkla, hesaplansın" : "Click to calculate"}</span>
          ) : loading ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> {isTr ? "Hesaplanıyor..." : "Calculating..."}
            </span>
          ) : khellScore !== null && meta ? (
            <span className="flex items-center gap-1.5">
              <span className={`font-extrabold text-base leading-none ${meta.color}`}>{khellScore}</span>
              <span className="text-muted-foreground">/100 —</span>
              <span className={`font-semibold ${meta.color}`}>{meta.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{isTr ? "Veri yok" : "No data"}</span>
          )}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-pink-500/10 pt-2">
          {!hasName ? (
            <p className="text-muted-foreground text-center py-2">
              {isTr
                ? "Yukarıdaki kutuya ürün adını yaz, KHELL Skoru otomatik hesaplanır 🚀"
                : "Enter the product name above, the KHELL Score will be calculated automatically 🚀"}
            </p>
          ) : (
            <>
              <div className="rounded-lg bg-background/40 px-2.5 py-2 flex items-center justify-between">
                <span className="text-muted-foreground">🛒 {isTr ? "Pazar Doygunluğu (%40 ağırlık)" : "Market Saturation (40% weight)"}</span>
                {marketCount !== null ? (
                  <span className="text-foreground font-mono">{marketCount} {isTr ? "sonuç" : "results"} → {satScore}/100</span>
                ) : (
                  <span className="text-muted-foreground">{loading ? "..." : isTr ? "veri yok" : "no data"}</span>
                )}
              </div>
              <div className="rounded-lg bg-background/40 px-2.5 py-2 flex items-center justify-between">
                <span className="text-muted-foreground">📦 {isTr ? "Tedarikçi Yoğunluğu (%30 ağırlık)" : "Supplier Density (30% weight)"}</span>
                {cjCount !== null ? (
                  <span className="text-foreground font-mono">{cjCount} {isTr ? "ürün" : "products"} → {cjScore}/100</span>
                ) : (
                  <span className="text-muted-foreground">{loading ? "..." : isTr ? "veri yok" : "no data"}</span>
                )}
              </div>
              <div className="rounded-lg bg-background/40 px-2.5 py-2 flex items-center justify-between">
                <span className="text-muted-foreground">💬 {isTr ? "Organik İlgi (%30 ağırlık)" : "Organic Buzz (30% weight)"}</span>
                {redditCount !== null ? (
                  <span className="text-foreground font-mono">{redditCount} {isTr ? "gönderi" : "posts"} → {redditScore}/100</span>
                ) : (
                  <span className="text-muted-foreground">{loading ? "..." : isTr ? "veri yok" : "no data"}</span>
                )}
              </div>
              <p className="text-muted-foreground text-center pt-0.5">
                {isTr
                  ? "KHELL Skoru: pazar doygunluğu + tedarikçi yoğunluğu + organik ilgiye göre ağırlıklı hesaplanır"
                  : "KHELL Score: weighted calculation based on market saturation + supplier density + organic buzz"}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

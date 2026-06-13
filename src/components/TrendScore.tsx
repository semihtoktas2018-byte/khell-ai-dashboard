import { useState, useEffect } from "react";
import { Flame, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface TrendScoreProps {
  productName: string;
  googleApiKey: string;
  googleCx: string;
}

const CJ_EMAIL = "bamir.global@gmail.com";
const CJ_API_KEY = "26689fbeeb5045f89ec8764c32aaada0";

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

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Yüksek Potansiyel 🔥", color: "text-emerald-400" };
  if (score >= 45) return { label: "Orta Potansiyel ⚡", color: "text-yellow-400" };
  return { label: "Düşük Potansiyel", color: "text-red-400" };
}

export default function TrendScore({ productName, googleApiKey, googleCx }: TrendScoreProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [cjCount, setCjCount] = useState<number | null>(null);
  const [marketCount, setMarketCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    if (!productName.trim()) return;
    setStarted(true);
    setLoading(true);
    setError(false);
    setCjCount(null);
    setMarketCount(null);

    // CJ Popularity
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

    // Market Saturation (tek sorgu, 4 site OR ile)
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

    setLoading(false);
  };

  useEffect(() => {
    if (open && !started && productName.trim()) fetchData();
  }, [open]);

  // CJ Popularity Score: 0-100 (daha çok tedarikçi = kategori aktif/trend)
  const cjScore = cjCount !== null ? Math.min(100, Math.round((cjCount / 50) * 100)) : null;

  // Market Saturation Score: düşük rekabet = yüksek skor
  let satScore: number | null = null;
  if (marketCount !== null) {
    if (marketCount <= 15) satScore = 90;
    else if (marketCount <= 50) satScore = 65;
    else if (marketCount <= 150) satScore = 40;
    else satScore = 20;
  }

  const validScores = [cjScore, satScore].filter((s): s is number => s !== null);
  const trendScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : null;

  const meta = trendScore !== null ? scoreLabel(trendScore) : null;

  return (
    <div className="rounded-md border border-pink-500/20 bg-pink-500/5 text-[10px] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-pink-500/10 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Flame className="h-2.5 w-2.5 text-pink-400" />
          <span className="font-semibold text-pink-400">Trend Skoru</span>
        </div>
        <div className="flex items-center gap-2">
          {!started ? (
            <span className="text-muted-foreground">Tıkla, hesaplansın</span>
          ) : loading ? (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> Hesaplanıyor...
            </span>
          ) : trendScore !== null && meta ? (
            <span className="text-muted-foreground">
              <span className={`font-bold text-sm ${meta.color}`}>{trendScore}/100</span>
              {" — "}
              <span className={meta.color}>{meta.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Veri yok</span>
          )}
          {open ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-2 pb-2 space-y-1.5 border-t border-pink-500/10 pt-1.5">
          <div className="rounded bg-background/40 px-2 py-1.5 flex items-center justify-between">
            <span className="text-muted-foreground">📦 CJ Tedarikçi Yoğunluğu</span>
            {cjCount !== null ? (
              <span className="text-foreground font-mono">{cjCount} ürün → {cjScore}/100</span>
            ) : (
              <span className="text-muted-foreground">{loading ? "..." : "veri yok"}</span>
            )}
          </div>
          <div className="rounded bg-background/40 px-2 py-1.5 flex items-center justify-between">
            <span className="text-muted-foreground">🛒 Pazar Doygunluğu</span>
            {marketCount !== null ? (
              <span className="text-foreground font-mono">{marketCount} sonuç → {satScore}/100</span>
            ) : (
              <span className="text-muted-foreground">{loading ? "..." : "veri yok"}</span>
            )}
          </div>
          <p className="text-muted-foreground text-center pt-0.5">
            CJ tedarikçi sayısı + pazar yeri doygunluğuna göre tahmini skor
          </p>
        </div>
      )}
    </div>
  );
}

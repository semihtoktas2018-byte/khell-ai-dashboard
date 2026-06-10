import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/mock-data";
import { getVerdict } from "@/lib/analyzer";
import { Filter, Loader2, Package } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

// Geçici olarak doğrudan koda gömülen API bilgileri
const CJ_EMAIL = "bamir.global@gmail.com";
const CJ_API_KEY = "26689fbeeb5045f89ec8764c32aaada0";

interface CJProduct {
  id: string;
  name: string;
  image: string;
  estimatedSellingPrice: number;
  supplierPrice: number;
  trendScore: number;
  profitMargin: number;
  competition: string;
  category: string;
  platform: string;
}

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const res = await fetch("https://cjdropshipping.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) {
    throw new Error("Token alınamadı");
  }
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

export default function WinningProducts() {
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [platform, setPlatform] = useState("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [marginFilter, setMarginFilter] = useState(0);
  const [trendFilter, setTrendFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { t, currency, locale } = useLocale();

  // CJ'den Canlı Trend Ürünleri Çeken useEffect
  useEffect(() => {
    async function fetchLiveTrendingProducts() {
      try {
        setLoading(true);
        const token = await getAccessToken();
        
        // CJdropshipping'in en çok listelenen popüler ürünlerini çekiyoruz
        const url = "https://cjdropshipping.com";
        const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
        const resData = await res.json();
        
        if (resData?.data?.list) {
          const mappedProducts = resData.data.list.map((p: any, index: number) => {
            const cost = parseFloat(p.sellPrice || "0") || 0;
            const estSale = cost * 3; // Maliyetin 3 katı satış fiyatı kuralı
            const margin = cost > 0 ? Math.round(((estSale - cost) / estSale) * 100) : 0;
            
            // Dinamik trend skoru ve rekabet simülasyonu
            const dynamicTrendScore = 80 + Math.floor(Math.abs(Math.sin(index)) * 20); 
            const dynamicCompetition = index % 3 === 0 ? "Yüksek" : index % 3 === 1 ? "Orta" : "Düşük";

            return {
              id: p.pid || String(index),
              name: p.productNameEn || p.productName || "E-Commerce Product",
              image: p.productImage?.split(",")[0] || "", // İlk görseli alıyoruz
              supplierPrice: cost,
              estimatedSellingPrice: estSale,
              profitMargin: margin,
              trendScore: dynamicTrendScore,
              competition: dynamicCompetition,
              category: p.categoryName || "Genel",
              platform: index % 4 === 0 ? "TikTok" : index % 4 === 1 ? "Amazon" : index % 4 === 2 ? "AliExpress" : "TikTok"
            };
          });
          setProducts(mappedProducts);
        } else {
          setError("Canlı ürün verisi yüklenemedi.");
        }
      } catch (err: any) {
        setError("Bağlantı hatası oluştu. Lütfen API bilgilerini kontrol edin.");
      } finally {
        setLoading(false);
      }
    }
    fetchLiveTrendingProducts();
  }, []);

  const marginFilters = [
    { label: t("winning.all"), min: 0, max: 100 },
    { label: locale === "tr" ? "%30+" : "30%+", min: 30, max: 100 },
    { label: locale === "tr" ? "%40+" : "40%+", min: 40, max: 100 },
    { label: locale === "tr" ? "%50+" : "50%+", min: 50, max: 100 },
  ];
  const trendFilters = [
    { label: t("winning.all"), min: 0 },
    { label: "80+", min: 80 },
    { label: "90+", min: 90 },
  ];

  const platforms = ["Tümü", "TikTok", "Amazon", "AliExpress"];
  const platformLabel = (p: string) => (p === "Tümü" ? t("winning.all") : p);
  const catLabel = (c: string) => t(`cat.${c}`) ?? c;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (platform !== "Tümü" && p.platform !== platform) return false;
      if (category !== "Tümü" && p.category !== category) return false;
      if (p.profitMargin < marginFilters[marginFilter].min) return false;
      if (p.trendScore < trendFilters[trendFilter].min) return false;
      return true;
    });
  }, [platform, category, marginFilter, trendFilter, products]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm">CJ Dropshipping üzerinden canlı kazanan ürünler çekiliyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-risky text-sm bg-risky/5 rounded-xl p-5 border border-risky/20">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO title="Kazanan Ürünler | KHELL AI" description="Yüksek kârlılık potansiyeli taşıyan kazanan ürünleri keşfet." />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {platforms.map((p) => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${platform === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {platformLabel(p)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="h-4 w-4" /> {t("winning.filters")}
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="card-glow rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.category")}</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 text-xs rounded-md transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{catLabel(c)}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.profitMargin")}</label>
            <div className="flex flex-wrap gap-1.5">
              {marginFilters.map((f, i) => (
                <button key={f.label} onClick={() => setMarginFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${marginFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("winning.trendScore")}</label>
            <div className="flex flex-wrap gap-1.5">
              {trendFilters.map((f, i) => (
                <button key={f.label} onClick={() => setTrendFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${trendFilter === i ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length} {t("winning.found")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => {
          const verdict = getVerdict(product.profitMargin);
          return (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, ...transition }} whileHover={{ y: -4 }} className="card-glow rounded-xl p-5 overflow-hidden flex flex-col cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded bg-background overflow-hidden border border-border/40 flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="h-5 w-5" /></div>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${verdict.class}`}>{verdict.labelTr}</span>
              </div>

import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Search, ExternalLink, AlertCircle, Sparkles, Globe2, Info } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

interface FbAd {
  page_name?: string;
  ad_snapshot_url?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_captions?: string[];
  ad_delivery_start_time?: string;
  publisher_platforms?: string[];
}

const EU_UK_COUNTRIES = [
  { code: "GB", label: "İngiltere 🇬🇧" },
  { code: "FR", label: "Fransa 🇫🇷" },
  { code: "NL", label: "Hollanda 🇳🇱" },
  { code: "DE", label: "Almanya 🇩🇪" },
];

const OTHER_PLATFORMS = [
  {
    name: "Meta Ad Library (tüm ülkeler)",
    build: (q: string) => `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(q)}`,
  },
  {
    name: "TikTok Creative Center",
    build: (q: string) => `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?keyword=${encodeURIComponent(q)}`,
  },
  {
    name: "Google Ads Transparency Center",
    build: (q: string) => `https://adstransparency.google.com/?query=${encodeURIComponent(q)}`,
  },
];

export default function AdSpy() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const [keyword, setKeyword] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["GB"]);
  const [ads, setAds] = useState<FbAd[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  const [adText, setAdText] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const toggleCountry = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSearch = async () => {
    if (!keyword.trim() || selectedCountries.length === 0) return;
    setLoading(true);
    setError(null);
    setAds(null);
    setNeedsSetup(false);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("fb-ad-proxy", {
        body: { searchTerms: keyword.trim(), countries: selectedCountries },
      });
      if (fnError) throw fnError;
      if (data?.needsSetup) {
        setNeedsSetup(true);
        setError(data.error);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setAds((data?.data as FbAd[]) || []);
      }
    } catch (e: any) {
      setError(isTr ? "Reklamlar çekilemedi. Tekrar dene." : "Could not fetch ads. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!adText.trim()) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalysis(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("anthropic-proxy", {
        body: {
          model: "claude-sonnet-5",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Aşağıdaki reklam metnini bir e-ticaret/dropshipping büyüme uzmanı gibi analiz et. Türkçe cevap ver, kısa ve maddeler halinde: 1) Kanca/Hook nedir 2) Teklif/Offer nedir (fiyat, indirim, bonus vs) 3) Hedef kitle kim 4) Kullanılan psikolojik tetikleyiciler (aciliyet, sosyal kanıt, korku vs) 5) CTA (harekete geçirici mesaj) nedir 6) Bu reklamdan ilham alıp nasıl farklılaştırılabilir.\n\nReklam metni:\n"""${adText.trim()}"""`,
            },
          ],
        },
      });
      if (fnError) throw fnError;
      const text = data?.content?.map((c: any) => c.text || "").join("\n") || "";
      if (!text) throw new Error("empty");
      setAnalysis(text);
    } catch (e: any) {
      setAnalyzeError(isTr ? "Analiz yapılamadı, tekrar dene." : "Could not analyze, try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title={isTr ? "Reklam Casusu | KHELL AI" : "Ad Spy | KHELL AI"}
        description={isTr ? "Rakiplerin reklamlarını araştır ve kreatiflerini analiz et." : "Research competitor ads and analyze creatives."}
      />
      <BackButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(222 47% 7%) 0%, hsl(222 47% 4%) 100%)",
          border: "1px solid hsl(217 32% 17%)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isTr ? "📢 Reklam Casusu" : "📢 Ad Spy"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isTr ? "Rakiplerin reklamlarını bul, kreatiflerini AI ile çözümle" : "Find competitor ads and break down their creatives with AI"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-400" />
          <p>
            {isTr
              ? "Meta'nın ücretsiz resmi API'si ticari reklamları yalnızca İngiltere ve AB ülkelerinde veriyor. ABD ve diğer pazarlar için aşağıdaki hızlı bağlantılarla manuel araştırma yapabilirsin."
              : "Meta's free official API only returns commercial ads for the UK and EU. For the US and other markets, use the quick links below for manual research."}
          </p>
        </div>
      </motion.div>

      {/* EU/UK live search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{ background: "hsl(222 47% 6%)", border: "1px solid hsl(217 32% 17%)" }}
      >
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" /> {isTr ? "İngiltere / AB Reklam Arama" : "UK / EU Ad Search"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={isTr ? "marka adı veya anahtar kelime (örn. gymshark)" : "brand name or keyword (e.g. gymshark)"}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
              style={{ border: "1px solid hsl(217 32% 20%)" }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !keyword.trim() || selectedCountries.length === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "hsl(330 81% 60%)", boxShadow: "0 0 20px hsl(330 81% 60% / 0.3)" }}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="h-4 w-4" />}
            {isTr ? "Ara" : "Search"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {EU_UK_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => toggleCountry(c.code)}
              className="text-[11px] px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: selectedCountries.includes(c.code) ? "hsl(330 81% 60% / 0.15)" : "hsl(217 32% 12%)",
                border: `1px solid ${selectedCountries.includes(c.code) ? "hsl(330 81% 60% / 0.5)" : "hsl(217 32% 20%)"}`,
                color: selectedCountries.includes(c.code) ? "hsl(330 81% 70%)" : "var(--muted-foreground)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {error}
              {needsSetup && (
                <>
                  {" "}
                  {isTr
                    ? "— Bu özellik için Facebook Developer hesabından Ad Library API erişimi alıp token'ı Supabase'e eklememiz gerekiyor, istersen adımları çıkarayım."
                    : "— This feature needs a Facebook Developer Ad Library API token added to Supabase."}
                </>
              )}
            </span>
          </div>
        )}

        {ads && ads.length === 0 && !error && (
          <p className="mt-3 text-xs text-muted-foreground">{isTr ? "Sonuç bulunamadı, farklı bir kelime dene." : "No results, try a different keyword."}</p>
        )}

        {ads && ads.length > 0 && (
          <div className="mt-4 divide-y divide-border rounded-xl overflow-hidden" style={{ border: "1px solid hsl(217 32% 17%)" }}>
            {ads.map((ad, i) => (
              <div key={i} className="px-4 py-3 hover:bg-accent/20 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{ad.page_name || "—"}</p>
                    {ad.ad_creative_bodies?.[0] && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{ad.ad_creative_bodies[0]}</p>
                    )}
                    {ad.ad_delivery_start_time && (
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {isTr ? "Başlangıç: " : "Started: "}{new Date(ad.ad_delivery_start_time).toLocaleDateString(isTr ? "tr-TR" : "en-US")}
                      </p>
                    )}
                  </div>
                  {ad.ad_snapshot_url && (
                    <a href={ad.ad_snapshot_url} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 transition-colors">
                      {isTr ? "Reklamı Gör" : "View Ad"} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Other markets - quick launcher */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.15 }}
        className="rounded-2xl p-5"
        style={{ background: "hsl(222 47% 6%)", border: "1px solid hsl(217 32% 17%)" }}
      >
        <h3 className="text-sm font-bold text-white mb-3">
          {isTr ? "🌍 Diğer Pazarlar (ABD, TR, global)" : "🌍 Other Markets (US, TR, global)"}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {isTr ? "Bu platformların resmi ücretsiz API'si yok, ama aramanı hazır sorguyla direkt açar." : "These platforms have no free API, but this opens your search pre-filled."}
        </p>
        <div className="flex flex-wrap gap-2">
          {OTHER_PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.build(keyword || "")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-foreground hover:border-primary/40 transition-colors"
              style={{ background: "hsl(217 32% 12%)", border: "1px solid hsl(217 32% 20%)" }}
            >
              {p.name} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* AI Creative Analyzer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }}
        className="rounded-2xl p-5"
        style={{ background: "hsl(222 47% 6%)", border: "1px solid hsl(217 32% 17%)" }}
      >
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" /> {isTr ? "AI Kreatif Analizi" : "AI Creative Analysis"}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {isTr ? "Yukarıda bulduğun ya da elle gördüğün bir reklam metnini buraya yapıştır, hook/teklif/CTA'sını çözelim." : "Paste any ad copy you found and we'll break down its hook, offer, and CTA."}
        </p>
        <textarea
          value={adText}
          onChange={(e) => setAdText(e.target.value)}
          rows={4}
          placeholder={isTr ? "Reklam metnini buraya yapıştır..." : "Paste ad copy here..."}
          className="w-full px-3 py-2.5 rounded-xl text-sm bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
          style={{ border: "1px solid hsl(217 32% 20%)" }}
        />
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !adText.trim()}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: "hsl(38 92% 50%)", boxShadow: "0 0 20px hsl(38 92% 50% / 0.3)" }}
        >
          {analyzing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isTr ? "Analiz Et" : "Analyze"}
        </button>

        {analyzeError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {analyzeError}
          </div>
        )}

        {analysis && (
          <div className="mt-4 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
            {analysis}
          </div>
        )}
      </motion.div>

      <BamirFooter />
    </div>
  );
}

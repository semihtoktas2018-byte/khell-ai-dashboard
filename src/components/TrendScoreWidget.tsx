import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Target, Globe, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";

type Verdict = "SAT" | "BEKLE" | "SATMA";

interface TrendResult {
  verdict: Verdict;
  trendScore: number;
  profitMargin: number;
  targetAudience: string;
  bestPlatform: string;
  reason: string;
}

async function analyzeProduct(name: string, isTr: boolean): Promise<TrendResult> {
  const prompt = isTr
    ? `Sen bir e-ticaret dropshipping uzmanısın. "${name}" ürünü için hızlı bir trend analizi yap. SADECE şu JSON'u döndür:
{
  "verdict": "SAT" | "BEKLE" | "SATMA",
  "trendScore": 0-100 arası sayı,
  "profitMargin": 0-100 arası tahmini kâr marjı yüzdesi,
  "targetAudience": "Hedef kitle (kısa, 1 cümle, Türkçe)",
  "bestPlatform": "En iyi satış platformu (TikTok Shop / Instagram / Shopify / Trendyol / Amazon / Etsy)",
  "reason": "Karar gerekçesi (1 cümle, Türkçe)"
}`
    : `You are a dropshipping expert. Quickly analyze "${name}". Return ONLY this JSON:
{
  "verdict": "SAT" | "BEKLE" | "SATMA",
  "trendScore": number 0-100,
  "profitMargin": estimated profit margin 0-100,
  "targetAudience": "Target audience (short, 1 sentence)",
  "bestPlatform": "Best platform (TikTok Shop / Instagram / Shopify / Amazon / Etsy)",
  "reason": "Reason for verdict (1 sentence)"
}`;

  const { data, error } = await supabase.functions.invoke("anthropic-proxy", {
    body: {
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    },
  });
  if (error) throw error;
  const text = data.content?.map((i: { type: string; text?: string }) => i.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean);
}

const verdictStyle: Record<Verdict, { class: string; icon: typeof CheckCircle2 }> = {
  SAT: { class: "bg-winning/15 text-winning border-winning/40 shadow-[0_0_30px_hsl(142_71%_45%/0.35)]", icon: CheckCircle2 },
  BEKLE: { class: "bg-yellow-500/15 text-yellow-500 border-yellow-500/40 shadow-[0_0_30px_hsl(48_96%_53%/0.35)]", icon: Clock },
  SATMA: { class: "bg-risky/15 text-risky border-risky/40 shadow-[0_0_30px_hsl(0_84%_60%/0.35)]", icon: XCircle },
};

export default function TrendScoreWidget() {
  const { t, locale } = useLocale();
  const isTr = locale === "tr";
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrendResult | null>(null);

  const handleAnalyze = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await analyzeProduct(name.trim(), isTr);
      setResult(r);
    } catch (e) {
      setError(isTr ? "Analiz başarısız. Tekrar deneyin." : "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const VIcon = result ? verdictStyle[result.verdict].icon : null;

  return (
    <div className="card-glow rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-winning/5 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
            {isTr ? "AI Powered" : "AI Powered"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">
          {isTr ? "Anlık Trend Skoru" : "Instant Trend Score"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isTr
            ? "Ürün adını yaz, AI saniyeler içinde SAT / BEKLE / SATMA kararı versin."
            : "Enter a product name, AI gives SELL / WAIT / DON'T SELL in seconds."}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
            placeholder={isTr ? "Örn: LED Strip Light, Mini Projektör..." : "e.g. LED Strip Light, Mini Projector..."}
            className="flex-1 bg-background/60 border-border focus-visible:ring-primary"
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading || !name.trim()}
            className="bg-gradient-to-r from-primary to-winning text-primary-foreground shadow-[0_0_24px_hsl(217_91%_60%/0.45)] hover:opacity-90 min-w-[140px]"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {isTr ? "Analiz..." : "Analyzing..."}</>
            ) : (
              <><Sparkles className="h-4 w-4" /> {isTr ? "Analiz Et" : "Analyze"}</>
            )}
          </Button>
        </div>

        {error && (
          <p className="text-xs text-risky mt-3">{error}</p>
        )}

        <AnimatePresence mode="wait">
          {result && VIcon && (
            <motion.div
              key={result.verdict + result.trendScore}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-5 space-y-4"
            >
              <div className={`flex items-center justify-between rounded-xl border p-4 ${verdictStyle[result.verdict].class}`}>
                <div className="flex items-center gap-3">
                  <VIcon className="h-6 w-6" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">
                      {isTr ? "AI Kararı" : "AI Verdict"}
                    </p>
                    <p className="text-2xl font-bold">{result.verdict}</p>
                  </div>
                </div>
                <p className="text-xs max-w-[60%] text-right opacity-90">{result.reason}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      {isTr ? "Trend Skoru" : "Trend Score"}
                    </span>
                    <span className="font-mono text-sm font-bold text-primary tabular-nums">{result.trendScore}/100</span>
                  </div>
                  <Progress value={result.trendScore} className="h-2" />
                </div>
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-winning" />
                      {isTr ? "Kâr Marjı" : "Profit Margin"}
                    </span>
                    <span className="font-mono text-sm font-bold text-winning tabular-nums">%{result.profitMargin}</span>
                  </div>
                  <Progress value={result.profitMargin} className="h-2" />
                </div>
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    {isTr ? "Hedef Kitle" : "Target Audience"}
                  </p>
                  <p className="text-sm text-foreground">{result.targetAudience}</p>
                </div>
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Globe className="h-3.5 w-3.5 text-winning" />
                    {isTr ? "En İyi Platform" : "Best Platform"}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{result.bestPlatform}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

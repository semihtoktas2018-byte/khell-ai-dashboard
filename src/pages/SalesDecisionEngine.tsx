import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Copy, Target, TrendingUp, ShieldAlert, Megaphone, Check, MessageCircle, Bookmark, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runDecisionEngine, runDecisionEngineAI, type DecisionInput, type DecisionOutput } from "@/lib/sales-decision-engine";
import { useSavedProducts } from "@/contexts/SavedProductsContext";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

const categories = [
  "Furniture", "Home Decor", "Luxury Decor", "Fashion", "Jewelry", "Watches",
  "Gadget", "Tech", "Electronics", "Beauty", "Fitness", "Phone Accessories",
  "Bags", "Shoes", "Lighting", "Decoration", "Health", "Security", "Other",
];

const countries = [
  "Turkey", "Saudi Arabia", "UAE", "Qatar", "Kuwait", "USA", "Germany", "France", "UK", "Other",
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreGlow(score: number) {
  if (score >= 80) return "shadow-[0_0_40px_rgba(52,211,153,0.3)]";
  if (score >= 60) return "shadow-[0_0_40px_rgba(251,191,36,0.3)]";
  return "shadow-[0_0_40px_rgba(248,113,113,0.3)]";
}

function scoreBorder(score: number) {
  if (score >= 80) return "border-emerald-500/40";
  if (score >= 60) return "border-amber-500/40";
  return "border-red-500/40";
}

export default function SalesDecisionEngine() {
  const { t, currencySymbol } = useLocale();
  const [form, setForm] = useState<DecisionInput>({
    product_name: "", product_price: 0, cost_price: 0,
    target_country: "Turkey", product_category: "Furniture", product_link: "", description: "",
  });
  const [result, setResult] = useState<DecisionOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const { saveProduct, isProductSaved } = useSavedProducts();

  const handleRun = async () => {
    if (!form.product_name || form.product_price <= 0 || form.cost_price <= 0) {
      toast.error(t("sde.required"));
      return;
    }
    const baseResult = runDecisionEngine(form);
    setResult(baseResult);
    setAiAnalysis("");

    // AI analizi arka planda çek
    setAiLoading(true);
    runDecisionEngineAI(form).then((analysis) => {
      setAiAnalysis(analysis);
      setAiLoading(false);
    }).catch(() => setAiLoading(false));
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify({ ...result, ai_analysis: aiAnalysis }, null, 2));
    setCopied(true);
    toast.success(t("sde.jsonCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!result) return;
    const msg = encodeURIComponent(`Merhaba, bu ürünü incelemek istiyorum:\n\n${form.product_name}\n\nHedef Ülke: ${form.target_country}\n\nLink: ${form.product_link || "N/A"}`);
    window.open(`https://wa.me/905446452430?text=${msg}`, "_blank");
  };

  const handleSave = () => {
    if (!result) return;
    if (isProductSaved(form.product_name)) { toast.error(t("sde.alreadySaved")); return; }
    saveProduct({
      name: form.product_name,
      profitMargin: result.estimated_margin_percent,
      riskLevel: result.confidence_score >= 70 ? "low" : result.confidence_score >= 45 ? "medium" : "high",
      decisionScore: result.confidence_score,
      monthlyProfit: Math.round((form.product_price - form.cost_price) * 30),
    });
    toast.success(t("sde.productSaved"));
  };

  const decisionColor = (d: string) => d === "WINNER" ? "text-emerald-400" : "text-red-400";
  const actionColor = (a: string) =>
    a === "LAUNCH" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
    a === "TEST" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
    "bg-red-500/20 text-red-400 border-red-500/30";

  const ScoreBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span>
        <span className="font-bold text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: value > 70 ? "hsl(142 71% 45%)" : value > 45 ? "hsl(38 92% 50%)" : "hsl(0 84% 60%)" }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} />
      </div>
    </div>
  );

  const alreadySaved = result ? isProductSaved(form.product_name) : false;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SEO title="Satış Karar Motoru | KHELL AI" description="Sat / satma kararını veri ve AI skoru ile saniyeler içinde al." />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Zap className="h-5 w-5 text-primary" /></div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("sde.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("sde.desc")}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">{t("sde.productInfo")}</h2>
          <div className="space-y-3">
            <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.productName")}</label>
              <Input value={form.product_name} onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))} placeholder={t("sde.placeholder.name")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.sellingPrice")} ({currencySymbol})</label>
                <Input type="number" value={form.product_price || ""} onChange={e => setForm(p => ({ ...p, product_price: +e.target.value }))} placeholder="299" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.cost")} ({currencySymbol})</label>
                <Input type="number" value={form.cost_price || ""} onChange={e => setForm(p => ({ ...p, cost_price: +e.target.value }))} placeholder="85" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.targetCountry")}</label>
                <select value={form.target_country} onChange={e => setForm(p => ({ ...p, target_country: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.category")}</label>
                <select value={form.product_category} onChange={e => setForm(p => ({ ...p, product_category: e.target.value }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.productLink")}</label>
              <Input value={form.product_link} onChange={e => setForm(p => ({ ...p, product_link: e.target.value }))} placeholder={t("sde.placeholder.link")} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t("sde.description")}</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder={t("sde.placeholder.desc")} /></div>
          </div>
          <Button onClick={handleRun} className="w-full gap-2"><Zap className="h-4 w-4" /> {t("sde.analyzeDecide")}</Button>
        </div>

        <div className="space-y-4">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className={`rounded-2xl border-2 ${scoreBorder(result.confidence_score)} bg-card p-8 text-center ${scoreGlow(result.confidence_score)}`}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Final Score</p>
                <motion.p className={`text-8xl font-black tracking-tighter leading-none ${scoreColor(result.confidence_score)}`}
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  {result.confidence_score}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2">/ 100</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 text-center space-y-3">
                <p className={`text-4xl font-black tracking-tight ${decisionColor(result.decision)}`}>{result.decision}</p>
                <div className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold ${actionColor(result.action)}`}>{result.action}</div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">{result.quick_reason}</p>
              </div>

              {/* AI Analizi */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> AI Değerlendirmesi
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Analiz ediliyor...
                  </div>
                ) : aiAnalysis ? (
                  <p className="text-xs text-foreground leading-relaxed">{aiAnalysis}</p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">AI analizi yüklenemedi.</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <ScoreBar label="Confidence" value={result.confidence_score} icon={Zap} />
                <ScoreBar label="Market Fit" value={result.market_fit} icon={Target} />
                <ScoreBar label="Ad Potential" value={result.ad_potential} icon={Megaphone} />
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" />{t("sde.margin")}</span>
                  <span className="font-bold text-foreground">%{result.estimated_margin_percent}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><ShieldAlert className="h-3.5 w-3.5" />{t("sde.competition")}</span>
                  <span className={`font-bold ${result.competition_level === "LOW" ? "text-emerald-400" : result.competition_level === "MEDIUM" ? "text-amber-400" : "text-red-400"}`}>{result.competition_level}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-xs">
                <div><span className="text-muted-foreground">{t("sde.targetAudience")}</span><p className="text-foreground mt-0.5">{result.target_audience}</p></div>
                <div><span className="text-muted-foreground">{t("sde.emotionalTriggers")}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">{result.emotional_trigger.map(tt => <span key={tt} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{tt}</span>)}</div></div>
                <div><span className="text-muted-foreground">{t("sde.recommendedPlatforms")}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">{result.recommended_platform.map(pp => <span key={pp} className="px-2 py-0.5 rounded-full bg-accent text-foreground text-[10px] font-medium">{pp}</span>)}</div></div>
                <div><span className="text-muted-foreground">{t("sde.pricingStrategy")}</span><p className="text-foreground mt-0.5">{result.pricing_strategy}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleWhatsApp} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <MessageCircle className="h-4 w-4" /> {t("sde.sendWhatsApp")}
                </Button>
                <Button onClick={handleSave} variant={alreadySaved ? "secondary" : "outline"} disabled={alreadySaved} className="gap-2">
                  <Bookmark className="h-4 w-4" /> {alreadySaved ? t("sde.savedCheck") : t("sde.saveProduct")}
                </Button>
              </div>
              <Button variant="outline" onClick={handleCopy} className="w-full gap-2 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t("sde.copied") : t("sde.copyJson")}
              </Button>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Zap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("sde.enterInfo")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("sde.resultHere")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

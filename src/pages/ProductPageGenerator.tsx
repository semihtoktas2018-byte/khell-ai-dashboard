import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Copy, Check, Flame, Calculator, Sparkles, ShoppingBag,
  Target, Clock, MousePointerClick, Tag, Globe, Search, Star, AlertTriangle,
  MessageSquare, Megaphone, ClipboardList, Loader2, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  generateProductPage,
  generateProductPageAI,
  suggestSalesAngle,
  type ProductPageInput,
  type ProductPageContent,
  type SalesAngle,
} from "@/lib/product-page-generator";
import { getViralProducts } from "@/lib/viral-products-data";
import { useLocale } from "@/contexts/LocaleContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const defaultInput: ProductPageInput = {
  name: "", category: "Tech", sellingPrice: 0, cost: 0, margin: 0, trendScore: 0, riskLevel: "Orta", salesAngle: "trend",
};

const categories = ["Fitness", "Pet", "Tech", "Home", "Car"];

const salesAngles: { value: SalesAngle; label: string; icon: string }[] = [
  { value: "problem", label: "Problem Çözen", icon: "🛡️" },
  { value: "trend", label: "Trend / Viral", icon: "🔥" },
  { value: "premium", label: "Premium", icon: "💎" },
  { value: "budget", label: "Ucuz / Fırsat", icon: "💰" },
];

export default function ProductPageGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState<ProductPageInput>(defaultInput);
  const [content, setContent] = useState<ProductPageContent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const hasAutoFilled = useRef(false);
  const { currencySymbol, t, locale } = useLocale();
  const { isPro } = useAnalysisHistory();
  const isTr = locale === "tr";

  const FREE_USE_KEY = "khell_pagegen_ai_used_count";
  const FREE_LIMIT = 3;
  const getFreeUsed = () => parseInt(localStorage.getItem(FREE_USE_KEY) || "0", 10);
  const hasUsedFree = () => getFreeUsed() >= FREE_LIMIT;
  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";
  const [showPaywall, setShowPaywall] = useState(false);

  const salesAnglesI18n: { value: SalesAngle; key: string; icon: string }[] = [
    { value: "problem", key: "ppg.problemSolving", icon: "🛡️" },
    { value: "trend", key: "ppg.trendViral", icon: "🔥" },
    { value: "premium", key: "ppg.premium", icon: "💎" },
    { value: "budget", key: "ppg.budget", icon: "💰" },
  ];

  // Marj her zaman girilmiyor (ör. manuel form) — canlı öneri için fiyat/maliyetten türet.
  const liveMargin = input.margin > 0 ? input.margin : (input.sellingPrice > 0 ? ((input.sellingPrice - input.cost) / input.sellingPrice) * 100 : 0);
  const angleSuggestion = useMemo(
    () => suggestSalesAngle({ trendScore: input.trendScore, margin: liveMargin, riskLevel: input.riskLevel, sellingPrice: input.sellingPrice, cost: input.cost }, locale),
    [input.trendScore, liveMargin, input.riskLevel, input.sellingPrice, input.cost, locale]
  );

  useEffect(() => {
    if (hasAutoFilled.current) return;
    const name = searchParams.get("name");
    const sp = parseFloat(searchParams.get("sellingPrice") || searchParams.get("price") || "0");
    if (name && sp > 0) {
      hasAutoFilled.current = true;
      const cost = parseFloat(searchParams.get("cost") || "0");
      const margin = parseFloat(searchParams.get("margin") || "0");
      const trendScore = parseFloat(searchParams.get("trendScore") || "0");
      const category = searchParams.get("category") || "Tech";
      const riskLevel = searchParams.get("riskLevel") || "Orta";
      const effectiveMargin = margin > 0 ? margin : (sp > 0 ? ((sp - cost) / sp) * 100 : 0);
      const suggested = suggestSalesAngle({ trendScore, margin: effectiveMargin, riskLevel, sellingPrice: sp, cost }, locale)?.angle || "trend";
      const filled: ProductPageInput = { name, category, sellingPrice: sp, cost, margin, trendScore, riskLevel, salesAngle: suggested };
      setInput(filled);
      setContent(generateProductPage(filled));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleGenerateAI = async () => {
    if (!input.name.trim()) { toast({ title: "Hata", description: "Ürün adı giriniz", variant: "destructive" }); return; }
    if (input.sellingPrice <= 0) { toast({ title: "Hata", description: "Satış fiyatı giriniz", variant: "destructive" }); return; }
    if (!isPro && hasUsedFree()) {
      setShowPaywall(true);
      return;
    }
    const margin = input.sellingPrice > 0 ? ((input.sellingPrice - input.cost) / input.sellingPrice) * 100 : 0;
    const finalInput = { ...input, margin, locale };
    setIsLoadingAI(true);
    try {
      const result = await generateProductPageAI(finalInput);
      setContent(result);
      if (!isPro) localStorage.setItem(FREE_USE_KEY, String(getFreeUsed() + 1));
      toast({ title: "✅ AI İçerik Hazır!", description: "Claude tarafından üretildi" });
    } catch (err) {
      console.error("AI hatası:", err);
      toast({ title: "AI Hatası", description: "Template içerik kullanılıyor", variant: "destructive" });
      setContent(generateProductPage(finalInput));
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGenerate = () => {
    if (!input.name.trim()) { toast({ title: "Hata", description: "Ürün adı giriniz", variant: "destructive" }); return; }
    if (input.sellingPrice <= 0) { toast({ title: "Hata", description: "Satış fiyatı giriniz", variant: "destructive" }); return; }
    const margin = input.sellingPrice > 0 ? ((input.sellingPrice - input.cost) / input.sellingPrice) * 100 : 0;
    setContent(generateProductPage({ ...input, margin }));
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Kopyalandı", description: "Metin panoya kopyalandı" });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    if (!content) return;
    const all = [
      `ÜRÜN BAŞLIĞI:\n${content.title}`,
      `KISA AÇIKLAMA:\n${content.shortDescription}`,
      `UZUN AÇIKLAMA:\n${content.longDescription}`,
      `FAYDALAR:\n${content.benefits.map((b, i) => `${i + 1}. ${b}`).join("\n")}`,
      `TEKNİK ÖZELLİKLER:\n${content.specs.join("\n")}`,
      `KİME UYGUN:\n${content.targetAudience}`,
      `NEDEN ŞİMDİ:\n${content.whyNow}`,
      `CTA:\n${content.ctaText}`,
      content.urgency.length > 0 ? `ACİLİYET:\n${content.urgency.join("\n")}` : null,
      content.trustReview
        ? `MÜŞTERİ YORUMU:\n"${content.trustReview.text}" — ${content.trustReview.name}${content.trustReview.rating != null ? ` (${content.trustReview.rating}/5)` : ""}`
        : null,
      `TIKTOK HOOKS:\n${content.tiktokHooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
      `FACEBOOK HOOKS:\n${content.facebookHooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
      `SHOPIFY BAŞLIK:\n${content.shopifyTitle}`,
      `SEO TITLE:\n${content.seoTitle}`,
      `META DESCRIPTION:\n${content.metaDescription}`,
      `SHOPIFY HTML:\n${content.shopifyBody}`,
    ].filter((x): x is string => x !== null).join("\n\n---\n\n");
    navigator.clipboard.writeText(all);
    toast({ title: "Tümü Kopyalandı", description: "Tüm içerik panoya kopyalandı" });
  };

  const handleFetchFromViral = () => {
    const products = getViralProducts();
    const best = products.sort((a, b) => b.decisionScore - a.decisionScore)[0];
    if (best) {
      const filled: ProductPageInput = {
        name: best.name, category: best.category, sellingPrice: best.sellingPrice,
        cost: best.cost, margin: best.margin, trendScore: best.trendScore, riskLevel: best.riskLevel, salesAngle: input.salesAngle,
      };
      setInput(filled);
      setContent(generateProductPage(filled));
      toast({ title: "Ürün Getirildi", description: `${best.name} viral ürünlerden yüklendi` });
    }
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => handleCopy(text, field)}>
      {copiedField === field ? <Check className="h-3 w-3 text-winning" /> : <Copy className="h-3 w-3" />}
      {copiedField === field ? "Kopyalandı" : "Kopyala"}
    </Button>
  );

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.3;
    return (
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < full ? "fill-yellow-400 text-yellow-400" : i === full && hasHalf ? "fill-yellow-400/50 text-yellow-400" : "text-muted-foreground/30"}`} />
        ))}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Ürün Sayfası Oluşturucu — KHELL AI"
        description="Ürün sayfası HTML'ini AI ile oluştur: başlık, açıklama, satış açısı ve incelemelerle Shopify uyumlu şablon."
      />
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          {t("ppg.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("ppg.desc")}
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.05 }}>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t("ppg.productInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.productName")}</label>
                <Input value={input.name} onChange={(e) => setInput(p => ({ ...p, name: e.target.value }))} placeholder={t("analyzer.productName")} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.category")}</label>
                <select value={input.category} onChange={(e) => setInput(p => ({ ...p, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.sellingPrice")} ({currencySymbol})</label>
                <Input type="number" value={input.sellingPrice || ""} onChange={(e) => setInput(p => ({ ...p, sellingPrice: parseFloat(e.target.value) || 0 }))} placeholder="29.99" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.cost")} ({currencySymbol})</label>
                <Input type="number" value={input.cost || ""} onChange={(e) => setInput(p => ({ ...p, cost: parseFloat(e.target.value) || 0 }))} placeholder="8.50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.trendScore")}</label>
                <Input type="number" value={input.trendScore || ""} onChange={(e) => setInput(p => ({ ...p, trendScore: parseFloat(e.target.value) || 0 }))} placeholder="85" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.riskLevel")}</label>
                <select value={input.riskLevel} onChange={(e) => setInput(p => ({ ...p, riskLevel: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="Düşük">{t("ppg.lowRisk")}</option>
                  <option value="Orta">{t("ppg.medRisk")}</option>
                  <option value="Yüksek">{t("ppg.highRisk")}</option>
                </select>
              </div>
            </div>

            {/* Sales Angle */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("ppg.salesAngle")}</label>
              <div className="flex flex-wrap gap-2">
                {salesAnglesI18n.map(a => (
                  <button key={a.value} onClick={() => setInput(p => ({ ...p, salesAngle: a.value }))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${input.salesAngle === a.value
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/50"}`}>
                    <span>{a.icon}</span>{t(a.key)}
                    {angleSuggestion?.angle === a.value && <span title={t("ppg.aiSuggestion")}>✨</span>}
                  </button>
                ))}
              </div>
              {angleSuggestion && (
                <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-foreground">
                    <strong>{t("ppg.aiSuggestion")}:</strong>{" "}
                    {salesAnglesI18n.find(a => a.value === angleSuggestion.angle)?.icon}{" "}
                    {t(salesAnglesI18n.find(a => a.value === angleSuggestion.angle)!.key)} — {angleSuggestion.reason}
                  </span>
                  {input.salesAngle !== angleSuggestion.angle && (
                    <button
                      onClick={() => setInput(p => ({ ...p, salesAngle: angleSuggestion.angle }))}
                      className="ml-auto shrink-0 text-primary font-semibold hover:underline"
                    >
                      {t("ppg.applySuggestion")}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Real Trust Data (optional) — never auto-generated; left blank means omitted from output */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.trustSection")}</label>
              <p className="text-[11px] text-muted-foreground mb-2">{t("ppg.trustSectionDesc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.reviewText")}</label>
                  <Input value={input.reviewText || ""} onChange={(e) => setInput(p => ({ ...p, reviewText: e.target.value || undefined }))} placeholder={t("ppg.reviewTextPlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.reviewerName")}</label>
                  <Input value={input.reviewerName || ""} onChange={(e) => setInput(p => ({ ...p, reviewerName: e.target.value || undefined }))} placeholder={t("ppg.reviewerNamePlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.rating")}</label>
                  <Input type="number" min={0} max={5} step={0.1} value={input.rating ?? ""} onChange={(e) => setInput(p => ({ ...p, rating: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder={t("ppg.ratingPlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.reviewCount")}</label>
                  <Input type="number" min={0} value={input.reviewCount ?? ""} onChange={(e) => setInput(p => ({ ...p, reviewCount: e.target.value ? parseInt(e.target.value, 10) : undefined }))} placeholder={t("ppg.reviewCountPlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.soldCount")}</label>
                  <Input type="number" min={0} value={input.soldCount ?? ""} onChange={(e) => setInput(p => ({ ...p, soldCount: e.target.value ? parseInt(e.target.value, 10) : undefined }))} placeholder={t("ppg.soldCountPlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("ppg.stockCount")}</label>
                  <Input type="number" min={0} value={input.stockCount ?? ""} onChange={(e) => setInput(p => ({ ...p, stockCount: e.target.value ? parseInt(e.target.value, 10) : undefined }))} placeholder={t("ppg.stockCountPlaceholder")} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* AI Butonu - Ana buton */}
              <Button
                onClick={handleGenerateAI}
                disabled={isLoadingAI}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-semibold px-5"
              >
                {isLoadingAI ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Claude AI Yazıyor...</>
                ) : (
                  <><Zap className="h-4 w-4" />AI ile Oluştur</>
                )}
              </Button>

              {/* Hızlı Template */}
              <Button variant="outline" onClick={handleGenerate} className="gap-2 text-xs">
                <Sparkles className="h-4 w-4" />Hızlı Template
              </Button>

              <Button variant="outline" onClick={handleFetchFromViral} className="gap-2">
                <Flame className="h-4 w-4" />Viral Ürün'den Getir
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard/analyzer")} className="gap-2">
                <Calculator className="h-4 w-4" />Ürün Analizi'nden Getir
              </Button>
              {content && (
                <Button variant="outline" onClick={handleCopyAll} className="gap-2 border-primary/40 text-primary hover:bg-primary/10">
                  <ClipboardList className="h-4 w-4" />Tümünü Kopyala
                </Button>
              )}
            </div>

            {/* AI Loading State */}
            {isLoadingAI && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Claude AI içerik üretiyor...</p>
                  <p className="text-xs text-muted-foreground">Dönüşüm odaklı, ikna edici metinler hazırlanıyor</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Content */}
      <AnimatePresence mode="wait">
        {content && (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="space-y-4">

            <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title={t("ppg.titleField")} copyField="title" content={content.title} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<ShoppingBag className="h-4 w-4 text-primary" />} title={t("ppg.shortDescField")} copyField="short" content={content.shortDescription} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title={t("ppg.longDescField")} copyField="long" content={content.longDescription} onCopy={handleCopy} copiedField={copiedField} />

            {/* Benefits */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><Check className="h-4 w-4 text-primary" />5 Fayda Maddesi</CardTitle>
                  <CopyBtn text={content.benefits.join("\n")} field="benefits" />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground"><span className="text-primary font-bold mt-0.5">✓</span>{b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><Search className="h-4 w-4 text-primary" />Teknik Özellikler</CardTitle>
                  <CopyBtn text={content.specs.join("\n")} field="specs" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {content.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">{s}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <ContentBlock icon={<Target className="h-4 w-4 text-primary" />} title={t("ppg.targetAudienceField")} copyField="audience" content={content.targetAudience} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<Clock className="h-4 w-4 text-primary" />} title={t("ppg.whyNowField")} copyField="whynow" content={content.whyNow} onCopy={handleCopy} copiedField={copiedField} />

            {/* CTA */}
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><MousePointerClick className="h-4 w-4 text-primary" />CTA Metni</CardTitle>
                  <CopyBtn text={content.ctaText} field="cta" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-primary">{content.ctaText}</p>
                </div>
              </CardContent>
            </Card>

            {/* Urgency — only rendered when the user supplied real stock/sold data */}
            {content.urgency.length > 0 && (
              <Card className="border-destructive/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" />Aciliyet Bloğu</CardTitle>
                    <CopyBtn text={content.urgency.join("\n")} field="urgency" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.urgency.map((u, i) => (
                      <div key={i} className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground">{u}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trust — only rendered when the user supplied a real review and/or real stats */}
            {(content.trustReview || content.trustStats) && (() => {
              const statTiles = [
                content.trustStats?.rating != null ? { label: "Puan", value: `${content.trustStats.rating}` } : null,
                content.trustStats?.reviewCount != null ? { label: "Değerlendirme", value: `${content.trustStats.reviewCount}` } : null,
                content.trustStats?.soldCount != null ? { label: "Satış", value: `${content.trustStats.soldCount}+` } : null,
              ].filter((x): x is { label: string; value: string } => x !== null);
              const copyParts = [
                content.trustReview ? `"${content.trustReview.text}" — ${content.trustReview.name}${content.trustReview.rating != null ? ` (${content.trustReview.rating}/5)` : ""}` : null,
                statTiles.length > 0 ? statTiles.map(s => `${s.value} ${s.label}`).join(" | ") : null,
              ].filter((x): x is string => x !== null).join("\n\n");
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" />Güven Bloğu</CardTitle>
                      <CopyBtn text={copyParts} field="trust" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {content.trustReview && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        {content.trustReview.rating != null && (
                          <div className="flex items-center gap-2">
                            {renderStars(content.trustReview.rating)}
                            <span className="text-xs text-muted-foreground">{content.trustReview.rating}/5</span>
                          </div>
                        )}
                        <p className="text-sm text-foreground italic">"{content.trustReview.text}"</p>
                        <p className="text-xs text-muted-foreground font-medium">— {content.trustReview.name}</p>
                      </div>
                    )}
                    {statTiles.length > 0 && (
                      <div className={`grid gap-3 ${statTiles.length === 3 ? "grid-cols-3" : statTiles.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {statTiles.map((s, i) => (
                          <div key={i} className="text-center bg-muted/30 rounded-lg py-3">
                            <p className="text-lg font-bold text-foreground">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Ad Hooks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" />TikTok Reklam Hook'ları</CardTitle>
                    <CopyBtn text={content.tiktokHooks.join("\n")} field="tiktok" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.tiktokHooks.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2.5">
                        <Badge variant="outline" className="shrink-0 text-[10px] px-1.5">{i + 1}</Badge>{h}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" />Facebook Reklam Hook'ları</CardTitle>
                    <CopyBtn text={content.facebookHooks.join("\n")} field="facebook" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.facebookHooks.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2.5">
                        <Badge variant="outline" className="shrink-0 text-[10px] px-1.5">{i + 1}</Badge>{h}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopify Export */}
            <div className="pt-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4"><Globe className="h-5 w-5 text-primary" />Shopify Export</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title={t("ppg.shopifyTitleField")} copyField="shopTitle" content={content.shopifyTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<Globe className="h-4 w-4 text-primary" />} title={t("ppg.seoTitleField")} copyField="seoTitle" content={content.seoTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title={t("ppg.metaDescField")} copyField="metaDesc" content={content.metaDescription} onCopy={handleCopy} copiedField={copiedField} />
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" />Shopify Açıklama Gövdesi (HTML)</CardTitle>
                      <CopyBtn text={content.shopifyBody} field="shopBody" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                      {content.shopifyBody}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {isTr ? "Sınırsız AI İçerik PRO'da" : "Unlimited AI Content with PRO"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isTr ? "Ücretsiz AI kullanım hakkını doldurdun. Sınırsız AI ürün sayfası için PRO'ya geç." : "You've used your free AI generations. Upgrade to PRO for unlimited AI product pages."}
            </p>
            <div className="space-y-2 text-left mb-6">
              {[
                isTr ? "📄 Sınırsız AI ürün sayfası" : "📄 Unlimited AI product pages",
                isTr ? "🎬 Sınırsız içerik üretimi" : "🎬 Unlimited content generation",
                isTr ? "🛍️ Sınırsız eBay araştırma" : "🛍️ Unlimited eBay research",
                isTr ? "🔔 Fiyat takibi ve bildirimler" : "🔔 Price tracking & alerts",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground"><span className="text-winning">✔</span> {f}</div>
              ))}
            </div>
            <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              {isTr ? "Pro'ya Geç" : "Go Pro"} — {proPriceLabel}
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">
              {isTr ? "Şimdi değil" : "Not now"}
            </button>
          </div>
        </div>
      )}

      <BamirFooter />
    </div>
  );
}

function ContentBlock({
  icon, title, content, copyField, onCopy, copiedField,
}: {
  icon: React.ReactNode; title: string; content: string; copyField: string;
  onCopy: (text: string, field: string) => void; copiedField: string | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">{icon}{title}</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => onCopy(content, copyField)}>
            {copiedField === copyField ? <Check className="h-3 w-3 text-winning" /> : <Copy className="h-3 w-3" />}
            {copiedField === copyField ? "Kopyalandı" : "Kopyala"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}

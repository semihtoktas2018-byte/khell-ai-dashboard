import { useState, useEffect, useRef } from "react";
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
  type ProductPageInput,
  type ProductPageContent,
  type SalesAngle,
} from "@/lib/product-page-generator";
import { getViralProducts } from "@/lib/viral-products-data";

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

  useEffect(() => {
    if (hasAutoFilled.current) return;
    const name = searchParams.get("name");
    const sp = parseFloat(searchParams.get("sellingPrice") || "0");
    if (name && sp > 0) {
      hasAutoFilled.current = true;
      const cost = parseFloat(searchParams.get("cost") || "0");
      const margin = parseFloat(searchParams.get("margin") || "0");
      const trendScore = parseFloat(searchParams.get("trendScore") || "0");
      const category = searchParams.get("category") || "Tech";
      const riskLevel = searchParams.get("riskLevel") || "Orta";
      const filled: ProductPageInput = { name, category, sellingPrice: sp, cost, margin, trendScore, riskLevel, salesAngle: "trend" };
      setInput(filled);
      setContent(generateProductPage(filled));
    }
  }, [searchParams]);

  const handleGenerateAI = async () => {
    if (!input.name.trim()) { toast({ title: "Hata", description: "Ürün adı giriniz", variant: "destructive" }); return; }
    if (input.sellingPrice <= 0) { toast({ title: "Hata", description: "Satış fiyatı giriniz", variant: "destructive" }); return; }
    const margin = input.sellingPrice > 0 ? ((input.sellingPrice - input.cost) / input.sellingPrice) * 100 : 0;
    const finalInput = { ...input, margin };
    setIsLoadingAI(true);
    try {
      const result = await generateProductPageAI(finalInput);
      setContent(result);
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
      `ACİLİYET:\n${content.urgency.join("\n")}`,
      `MÜŞTERİ YORUMU:\n"${content.trustReview.text}" — ${content.trustReview.name} (${content.trustReview.rating}/5)`,
      `TIKTOK HOOKS:\n${content.tiktokHooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
      `FACEBOOK HOOKS:\n${content.facebookHooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
      `SHOPIFY BAŞLIK:\n${content.shopifyTitle}`,
      `SEO TITLE:\n${content.seoTitle}`,
      `META DESCRIPTION:\n${content.metaDescription}`,
      `SHOPIFY HTML:\n${content.shopifyBody}`,
    ].join("\n\n---\n\n");
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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Ürün Sayfası Oluşturucu
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Shopify ürün sayfası için hazır, yüksek dönüşümlü içerik bloğu oluşturun
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.05 }}>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Ürün Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ürün Adı</label>
                <Input value={input.name} onChange={(e) => setInput(p => ({ ...p, name: e.target.value }))} placeholder="Ürün adı girin..." />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kategori</label>
                <select value={input.category} onChange={(e) => setInput(p => ({ ...p, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Satış Fiyatı ($)</label>
                <Input type="number" value={input.sellingPrice || ""} onChange={(e) => setInput(p => ({ ...p, sellingPrice: parseFloat(e.target.value) || 0 }))} placeholder="29.99" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Maliyet ($)</label>
                <Input type="number" value={input.cost || ""} onChange={(e) => setInput(p => ({ ...p, cost: parseFloat(e.target.value) || 0 }))} placeholder="8.50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Trend Skoru</label>
                <Input type="number" value={input.trendScore || ""} onChange={(e) => setInput(p => ({ ...p, trendScore: parseFloat(e.target.value) || 0 }))} placeholder="85" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Risk Seviyesi</label>
                <select value={input.riskLevel} onChange={(e) => setInput(p => ({ ...p, riskLevel: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                </select>
              </div>
            </div>

            {/* Sales Angle */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Satış Açısı</label>
              <div className="flex flex-wrap gap-2">
                {salesAngles.map(a => (
                  <button key={a.value} onClick={() => setInput(p => ({ ...p, salesAngle: a.value }))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${input.salesAngle === a.value
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/50"}`}>
                    <span>{a.icon}</span>{a.label}
                  </button>
                ))}
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

            <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title="Ürün Başlığı" copyField="title" content={content.title} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<ShoppingBag className="h-4 w-4 text-primary" />} title="Kısa Satış Açıklaması" copyField="short" content={content.shortDescription} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title="Uzun Ürün Açıklaması" copyField="long" content={content.longDescription} onCopy={handleCopy} copiedField={copiedField} />

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

            <ContentBlock icon={<Target className="h-4 w-4 text-primary" />} title="Kime Uygun" copyField="audience" content={content.targetAudience} onCopy={handleCopy} copiedField={copiedField} />
            <ContentBlock icon={<Clock className="h-4 w-4 text-primary" />} title="Neden Şimdi Alınmalı" copyField="whynow" content={content.whyNow} onCopy={handleCopy} copiedField={copiedField} />

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

            {/* Urgency */}
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

            {/* Trust */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" />Güven Bloğu</CardTitle>
                  <CopyBtn text={`"${content.trustReview.text}" — ${content.trustReview.name} (${content.trustReview.rating}/5)\n\n${content.trustStats.rating}/5 puan | ${content.trustStats.reviewCount} değerlendirme | ${content.trustStats.soldCount}+ satış`} field="trust" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {renderStars(content.trustReview.rating)}
                    <span className="text-xs text-muted-foreground">{content.trustReview.rating}/5</span>
                  </div>
                  <p className="text-sm text-foreground italic">"{content.trustReview.text}"</p>
                  <p className="text-xs text-muted-foreground font-medium">— {content.trustReview.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <p className="text-lg font-bold text-foreground">{content.trustStats.rating}</p>
                    <p className="text-xs text-muted-foreground">Puan</p>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <p className="text-lg font-bold text-foreground">{content.trustStats.reviewCount}</p>
                    <p className="text-xs text-muted-foreground">Değerlendirme</p>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg py-3">
                    <p className="text-lg font-bold text-foreground">{content.trustStats.soldCount}+</p>
                    <p className="text-xs text-muted-foreground">Satış</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title="Shopify Ürün Başlığı" copyField="shopTitle" content={content.shopifyTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<Globe className="h-4 w-4 text-primary" />} title="SEO Title Önerisi" copyField="seoTitle" content={content.seoTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title="Meta Description" copyField="metaDesc" content={content.metaDescription} onCopy={handleCopy} copiedField={copiedField} />
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

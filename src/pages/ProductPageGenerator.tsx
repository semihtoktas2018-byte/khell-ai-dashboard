import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check, ArrowRight, Flame, Calculator, Sparkles, ShoppingBag, Target, Clock, MousePointerClick, Tag, Globe, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateProductPage, type ProductPageInput, type ProductPageContent } from "@/lib/product-page-generator";
import { getViralProducts } from "@/lib/viral-products-data";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const defaultInput: ProductPageInput = {
  name: "",
  category: "Tech",
  sellingPrice: 0,
  cost: 0,
  margin: 0,
  trendScore: 0,
  riskLevel: "Orta",
};

const categories = ["Fitness", "Pet", "Tech", "Home", "Car"];

export default function ProductPageGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState<ProductPageInput>(defaultInput);
  const [content, setContent] = useState<ProductPageContent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const hasAutoFilled = useRef(false);

  // Auto-fill from URL params
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
      const filled: ProductPageInput = { name, category, sellingPrice: sp, cost, margin, trendScore, riskLevel };
      setInput(filled);
      setContent(generateProductPage(filled));
    }
  }, [searchParams]);

  const handleGenerate = () => {
    if (!input.name.trim()) {
      toast({ title: "Hata", description: "Ürün adı giriniz", variant: "destructive" });
      return;
    }
    if (input.sellingPrice <= 0) {
      toast({ title: "Hata", description: "Satış fiyatı giriniz", variant: "destructive" });
      return;
    }
    const margin = input.sellingPrice > 0 ? ((input.sellingPrice - input.cost) / input.sellingPrice) * 100 : 0;
    setContent(generateProductPage({ ...input, margin }));
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Kopyalandı", description: "Metin panoya kopyalandı" });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFetchFromViral = () => {
    const products = getViralProducts();
    const best = products.sort((a, b) => b.decisionScore - a.decisionScore)[0];
    if (best) {
      const filled: ProductPageInput = {
        name: best.name,
        category: best.category,
        sellingPrice: best.sellingPrice,
        cost: best.cost,
        margin: best.margin,
        trendScore: best.trendScore,
        riskLevel: best.riskLevel,
      };
      setInput(filled);
      setContent(generateProductPage(filled));
      toast({ title: "Ürün Getirildi", description: `${best.name} viral ürünlerden yüklendi` });
    }
  };

  const handleFetchFromAnalyzer = () => {
    navigate("/dashboard/analyzer");
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => handleCopy(text, field)}>
      {copiedField === field ? <Check className="h-3 w-3 text-winning" /> : <Copy className="h-3 w-3" />}
      {copiedField === field ? "Kopyalandı" : "Kopyala"}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Ürün Sayfası Oluşturucu
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Shopify ürün sayfası için hazır içerik bloğu oluşturun
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
                <select
                  value={input.category}
                  onChange={(e) => setInput(p => ({ ...p, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
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
                <select
                  value={input.riskLevel}
                  onChange={(e) => setInput(p => ({ ...p, riskLevel: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleGenerate} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Metin Oluştur
              </Button>
              <Button variant="outline" onClick={handleFetchFromViral} className="gap-2">
                <Flame className="h-4 w-4" />
                Viral Ürün'den Getir
              </Button>
              <Button variant="outline" onClick={handleFetchFromAnalyzer} className="gap-2">
                <Calculator className="h-4 w-4" />
                Ürün Analizi'nden Getir
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Content */}
      <AnimatePresence mode="wait">
        {content && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="space-y-4"
          >
            {/* Title */}
            <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title="Ürün Başlığı" copyField="title" content={content.title} onCopy={handleCopy} copiedField={copiedField} />

            {/* Short Description */}
            <ContentBlock icon={<ShoppingBag className="h-4 w-4 text-primary" />} title="Kısa Satış Açıklaması" copyField="short" content={content.shortDescription} onCopy={handleCopy} copiedField={copiedField} />

            {/* Long Description */}
            <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title="Uzun Ürün Açıklaması" copyField="long" content={content.longDescription} onCopy={handleCopy} copiedField={copiedField} />

            {/* Benefits */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    5 Fayda Maddesi
                  </CardTitle>
                  <CopyBtn text={content.benefits.join("\n")} field="benefits" />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Specs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Teknik Özellikler
                  </CardTitle>
                  <CopyBtn text={content.specs.join("\n")} field="specs" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {content.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                      {s}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <ContentBlock icon={<Target className="h-4 w-4 text-primary" />} title="Kime Uygun" copyField="audience" content={content.targetAudience} onCopy={handleCopy} copiedField={copiedField} />

            {/* Why Now */}
            <ContentBlock icon={<Clock className="h-4 w-4 text-primary" />} title="Neden Şimdi Alınmalı" copyField="whynow" content={content.whyNow} onCopy={handleCopy} copiedField={copiedField} />

            {/* CTA */}
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-primary" />
                    CTA Metni
                  </CardTitle>
                  <CopyBtn text={content.ctaText} field="cta" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-primary">{content.ctaText}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shopify Export Block */}
            <div className="pt-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                Shopify Export
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ContentBlock icon={<Tag className="h-4 w-4 text-primary" />} title="Shopify Ürün Başlığı" copyField="shopTitle" content={content.shopifyTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<Globe className="h-4 w-4 text-primary" />} title="SEO Title Önerisi" copyField="seoTitle" content={content.seoTitle} onCopy={handleCopy} copiedField={copiedField} />
                <ContentBlock icon={<FileText className="h-4 w-4 text-primary" />} title="Meta Description" copyField="metaDesc" content={content.metaDescription} onCopy={handleCopy} copiedField={copiedField} />

                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        Shopify Açıklama Gövdesi (HTML)
                      </CardTitle>
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
          <CardTitle className="text-sm flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
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

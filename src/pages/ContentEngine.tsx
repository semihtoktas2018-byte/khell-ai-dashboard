import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Video, Upload, Copy, Hash, Sparkles, RefreshCw, CheckCircle,
  Target, DollarSign, Zap, Film, MessageSquare, Anchor, Play, Pause,
  FileText, Mic, MousePointerClick, X, Plus, ImageIcon,
} from "lucide-react";
import { generateContent, type ContentEngineOutput } from "@/lib/content-engine";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

export default function ContentEngine() {
  const { t, locale } = useLocale();
  const { isPro } = useAnalysisHistory();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const isTr = locale === "tr";

  const FREE_USE_KEY = "khell_contentengine_used_count";
  const FREE_LIMIT = 3;
  const getFreeUsed = () => parseInt(localStorage.getItem(FREE_USE_KEY) || "0", 10);
  const hasUsedFree = () => getFreeUsed() >= FREE_LIMIT;
  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";
  const [showPaywall, setShowPaywall] = useState(false);

  const [productName, setProductName] = useState("");
  const [niche, setNiche] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [style, setStyle] = useState<"dark" | "luxury" | "minimal">("dark");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentEngineOutput | null>(null);
  const [error, setError] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [autoLoadingImage, setAutoLoadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newFiles = [...imageFiles, ...files].slice(0, 10);
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Kazanan/Trend Ürünler'den "Video Reklam Oluştur" ile gelindiğinde
  // ürün adı + görseli otomatik doldurup üretimi kendiliğinden başlatır.
  useEffect(() => {
    const incomingName = searchParams.get("productName");
    const incomingImage = searchParams.get("imageUrl");
    const incomingNiche = searchParams.get("niche");
    if (!incomingName && !incomingImage) return;

    if (incomingName) setProductName(incomingName);
    if (incomingNiche) setNiche(incomingNiche);

    if (incomingImage) {
      setAutoLoadingImage(true);
      fetch(incomingImage)
        .then((res) => {
          if (!res.ok) throw new Error("Görsel alınamadı");
          return res.blob();
        })
        .then((blob) => {
          const file = new File([blob], "urun-gorseli.jpg", { type: blob.type || "image/jpeg" });
          setImageFiles([file]);
          setImagePreviews([URL.createObjectURL(file)]);
        })
        .catch(() => {
          toast({
            title: t("ce.error"),
            description: locale === "tr" ? "Ürün görseli otomatik yüklenemedi, elle yükleyebilirsin." : "Couldn't auto-load the product image, please upload manually.",
            variant: "destructive",
          });
        })
        .finally(() => setAutoLoadingImage(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hem ürün adı hem görsel hazır olduğunda (otomatik yüklendiğinde) üretimi kendiliğinden başlat
  useEffect(() => {
    if (productName.trim() && imageFiles.length > 0 && searchParams.get("productName") && !result && !loading) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  const removeImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast({ title: t("ce.error"), description: t("ce.errorName"), variant: "destructive" });
      return;
    }
    if (imageFiles.length === 0) {
      toast({ title: t("ce.error"), description: t("ce.errorImage"), variant: "destructive" });
      return;
    }
    if (!isPro && hasUsedFree()) {
      setShowPaywall(true);
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const output = await generateContent({
        productName: productName.trim(),
        imageFile: imageFiles[0],
        style,
        niche: niche.trim() || undefined,
        locale,
      });
      setResult(output);
      if (!isPro) localStorage.setItem(FREE_USE_KEY, String(getFreeUsed() + 1));
    } catch (err) {
      console.error("Content generation failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("ce.copied"), description: t("ce.copiedDesc") });
  };

  const handlePlayVideo = (idx: number) => {
    setPlayingIdx(playingIdx === idx ? null : idx);
  };

  const priceColors: Record<string, string> = {
    low: "text-emerald-400",
    mid: "text-amber-400",
    premium: "text-orange-400",
  };

  const VideoPreviewCard = ({ idx, hook, label, description }: { idx: number; hook: string; label: string; description: string }) => {
    const isPlaying = playingIdx === idx;
    const previewImg = imagePreviews[idx % imagePreviews.length] || imagePreviews[0];

    return (
      <div
        className="relative rounded-xl overflow-hidden bg-black group cursor-pointer select-none"
        style={{ aspectRatio: "9/16" }}
        onClick={() => handlePlayVideo(idx)}
      >
        {previewImg && (
          <img
            src={previewImg}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isPlaying ? "opacity-60 scale-105" : "opacity-40"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />
        <div className={`absolute top-5 left-0 right-0 text-center px-4 transition-all duration-300 ${isPlaying ? "opacity-100 translate-y-0" : "opacity-80 translate-y-1"}`}>
          <p className="text-white font-extrabold text-base drop-shadow-lg leading-tight">{hook}</p>
        </div>
        {isPlaying && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end gap-1 h-12">
            {[3, 6, 9, 6, 4, 8, 5, 9, 3, 7].map((h, i) => (
              <div key={i} className="w-1 rounded-full bg-amber-400"
                style={{ height: `${h * 4}px`, animation: `pulse 0.${4 + i}s ease-in-out infinite alternate`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all group-hover:scale-110">
              <Play className="h-7 w-7 text-white ml-1" />
            </div>
          </div>
        )}
        {imagePreviews.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1">
            {imagePreviews.slice(0, 5).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx % imagePreviews.length ? "bg-amber-400 scale-125" : "bg-white/40"}`} />
            ))}
          </div>
        )}
        <div className="absolute bottom-4 left-0 right-0 text-center px-3">
          <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">{label}</span>
          <p className="text-[10px] text-white/60 mt-1.5 line-clamp-2">{description}</p>
        </div>
        {isPlaying && (
          <div className="absolute top-3 left-3">
            <div className="flex gap-0.5">
              <div className="w-1 h-4 bg-amber-400 rounded-full" />
              <div className="w-1 h-4 bg-amber-400 rounded-full" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SEO title="İçerik Motoru | KHELL AI" description="TikTok kancaları, başlık varyasyonları ve ürün konumlandırma metinleri üret." />

      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Video className="h-6 w-6 text-amber-500" />
          {t("ce.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("ce.desc")}</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("ce.inputTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("ce.productName")}</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t("ce.productNamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("ce.niche")}</Label>
              <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t("ce.nichePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("ce.style")}</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as "dark" | "luxury" | "minimal")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">🖤 Dark</SelectItem>
                  <SelectItem value="luxury">✨ Luxury</SelectItem>
                  <SelectItem value="minimal">◻️ Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("ce.productImage")} <span className="text-muted-foreground text-xs ml-1">(max 10)</span></Label>
              {imageFiles.length > 0 && (
                <span className="text-xs text-amber-500">{imageFiles.length} {locale === "tr" ? "görsel seçildi" : locale === "fr" ? "images sélectionnées" : "images selected"}</span>
              )}
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">
                        {locale === "tr" ? "ANA" : locale === "fr" ? "MAIN" : "MAIN"}
                      </div>
                    )}
                  </div>
                ))}
                {imageFiles.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-amber-500/50 flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{locale === "tr" ? "Ekle" : locale === "fr" ? "Ajouter" : "Add"}</span>
                  </button>
                )}
              </div>
            )}

            {autoLoadingImage && (
              <div className="flex items-center gap-2 text-xs text-amber-500 mb-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                {locale === "tr" ? "Ürün görseli otomatik yükleniyor..." : "Auto-loading product image..."}
              </div>
            )}

            {imagePreviews.length === 0 && !autoLoadingImage && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="flex gap-2">
                    <ImageIcon className="h-8 w-8" />
                    <Plus className="h-5 w-5 mt-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("ce.uploadHint")}</p>
                    <p className="text-xs mt-1 text-muted-foreground">JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />{t("ce.generating")}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />{t("ce.generateVideo")}
              </span>
            )}
          </Button>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-amber-500"
                    style={{ animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t("ce.generatingContent")}</p>
            </div>
          )}

          {error && (
            <div className="text-center space-y-2 py-4">
              <p className="text-sm text-destructive">{t("ce.failed")}</p>
              <Button variant="outline" onClick={handleGenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />{t("ce.retry")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Film className="h-4 w-4 text-amber-500" />
                {t("ce.videoPreview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.videoPlaceholders.map((v, i) => (
                  <VideoPreviewCard key={i} idx={i} hook={result.hooks[i] || result.hooks[0]} label={v.label} description={v.description} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="script" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" /> {t("ce.tabScript")}</TabsTrigger>
              <TabsTrigger value="captions" className="gap-1.5 text-xs"><MessageSquare className="h-3.5 w-3.5" /> {t("ce.tabCaptions")}</TabsTrigger>
              <TabsTrigger value="hooks" className="gap-1.5 text-xs"><Anchor className="h-3.5 w-3.5" /> {t("ce.tabHooks")}</TabsTrigger>
              <TabsTrigger value="hashtags" className="gap-1.5 text-xs"><Hash className="h-3.5 w-3.5" /> {t("ce.tabHashtags")}</TabsTrigger>
              <TabsTrigger value="voiceover" className="gap-1.5 text-xs"><Mic className="h-3.5 w-3.5" /> {t("ce.tabVoiceover")}</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="mt-4 space-y-3">
              {result.videoScript.scenes.map((scene, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg bg-accent/30 border border-border">
                  <div className="shrink-0 w-16 text-center">
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 rounded-full px-2 py-1">{scene.second}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">{scene.visual}</p>
                    <p className="text-sm font-semibold text-foreground">"{scene.text}"</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:text-amber-500" onClick={() => handleCopy(scene.text)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <MousePointerClick className="h-5 w-5 text-amber-500" />
                  <div>
                    <span className="text-xs text-muted-foreground">{t("ce.ctaLabel")}</span>
                    <p className="text-sm font-bold text-foreground">{result.videoScript.cta}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-amber-500" onClick={() => handleCopy(result.videoScript.cta)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="captions" className="mt-4 space-y-4">
              {result.captions.map((group, i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">{group.label}</span>
                        <p className="text-sm text-foreground leading-relaxed">{group.caption}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:text-amber-500" onClick={() => handleCopy(group.caption)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="hooks" className="mt-4 space-y-3">
              {result.hooks.map((hook, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-amber-500">#{i + 1}</span>
                    <p className="text-sm font-semibold text-foreground">{hook}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:text-amber-500" onClick={() => handleCopy(hook)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="hashtags" className="mt-4 space-y-4">
              {result.hashtagGroups.map((group, i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">{group.label}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 hover:text-amber-500" onClick={() => handleCopy(group.tags.join(" "))}>
                        <Copy className="h-3 w-3" />{t("ce.copyAll")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, j) => (
                        <span key={j} className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors" onClick={() => handleCopy(tag)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="voiceover" className="mt-4 space-y-4">
              <Card className="border-border bg-card">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mic className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">{t("ce.voiceoverScript")}</span>
                      <p className="text-sm text-foreground leading-relaxed italic">"{result.videoScript.voiceover}"</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:text-amber-500" onClick={() => handleCopy(result.videoScript.voiceover)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-5 space-y-3">
                  <span className="text-xs font-semibold text-muted-foreground">{t("ce.onScreenTexts")}</span>
                  <div className="space-y-2">
                    {result.videoScript.onScreenTexts.map((text, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                        <p className="text-sm text-foreground">"{text}"</p>
                        <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7 hover:text-amber-500" onClick={() => handleCopy(text)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />{t("ce.howToSell")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />{t("ce.targetAudience")}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.positioning.targetAudience}</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />{t("ce.priceSuggestion")}
                  </div>
                  <p className={`text-sm font-semibold ${priceColors[result.positioning.priceRange]}`}>
                    {result.positioning.priceRange.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.positioning.priceLabel}</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" />{t("ce.salesAngle")}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.positioning.salesAngle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-emerald-500 py-2">
            <CheckCircle className="h-4 w-4" />{t("ce.ready")}
          </div>
        </div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {isTr ? "Sınırsız İçerik Motoru PRO'da" : "Unlimited Content Engine with PRO"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isTr ? "Ücretsiz kullanım hakkını doldurdun. Sınırsız içerik üretimi için PRO'ya geç." : "You've used your free generations. Upgrade to PRO for unlimited content generation."}
            </p>
            <div className="space-y-2 text-left mb-6">
              {[
                isTr ? "🎬 Sınırsız içerik üretimi" : "🎬 Unlimited content generation",
                isTr ? "🛍️ Sınırsız eBay araştırma" : "🛍️ Unlimited eBay research",
                isTr ? "🕵️ Sınırsız mağaza analizi" : "🕵️ Unlimited store analysis",
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

import { useState, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Video, Upload, Copy, Hash, Sparkles, RefreshCw, CheckCircle,
  Target, DollarSign, Zap, Film, MessageSquare, Anchor,
} from "lucide-react";
import { generateContent, type ContentEngineOutput } from "@/lib/content-engine";

export default function ContentEngine() {
  const { t } = useLocale();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [style, setStyle] = useState<"dark" | "luxury" | "minimal">("dark");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentEngineOutput | null>(null);
  const [error, setError] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast({ title: t("ce.error"), description: t("ce.errorName"), variant: "destructive" });
      return;
    }
    if (!imageFile) {
      toast({ title: t("ce.error"), description: t("ce.errorImage"), variant: "destructive" });
      return;
    }

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const output = await generateContent({ productName: productName.trim(), imageFile, style });
      setResult(output);
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

  const priceColors: Record<string, string> = {
    low: "text-emerald-400",
    mid: "text-amber-400",
    premium: "text-orange-400",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Video className="h-6 w-6 text-amber-500" />
          {t("ce.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("ce.desc")}</p>
      </div>

      {/* Input Section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("ce.inputTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("ce.productName")}</Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t("ce.productNamePlaceholder")}
              />
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
            <Label>{t("ce.productImage")}</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">{t("ce.uploadHint")}</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {t("ce.generating")}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t("ce.generate")}
              </span>
            )}
          </Button>

          {/* Loading animation */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-500"
                    style={{
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t("ce.generatingContent")}</p>
            </div>
          )}

          {error && (
            <div className="text-center space-y-2 py-4">
              <p className="text-sm text-destructive">{t("ce.failed")}</p>
              <Button variant="outline" onClick={handleGenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("ce.retry")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results with Tabs */}
      {result && (
        <div className="space-y-6">
          <Tabs defaultValue="captions" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="videos" className="gap-1.5 text-xs">
                <Film className="h-3.5 w-3.5" /> {t("ce.tabVideos")}
              </TabsTrigger>
              <TabsTrigger value="captions" className="gap-1.5 text-xs">
                <MessageSquare className="h-3.5 w-3.5" /> {t("ce.tabCaptions")}
              </TabsTrigger>
              <TabsTrigger value="hooks" className="gap-1.5 text-xs">
                <Anchor className="h-3.5 w-3.5" /> {t("ce.tabHooks")}
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="gap-1.5 text-xs">
                <Hash className="h-3.5 w-3.5" /> {t("ce.tabHashtags")}
              </TabsTrigger>
            </TabsList>

            {/* Videos Tab (placeholder) */}
            <TabsContent value="videos" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.videoPlaceholders.map((v, i) => (
                  <Card key={i} className="border-border bg-card overflow-hidden">
                    <div className="aspect-[9/16] bg-gradient-to-b from-background to-muted/30 rounded-t-lg flex flex-col items-center justify-center gap-3 p-4">
                      <Film className="h-10 w-10 text-amber-500/40" />
                      <span className="text-xs font-semibold text-foreground">{v.label}</span>
                      <span className="text-[10px] text-muted-foreground text-center px-4">{v.description}</span>
                      <span className="mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-medium border border-amber-500/20">
                        {t("ce.comingSoon")}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Captions Tab */}
            <TabsContent value="captions" className="mt-4 space-y-4">
              {result.captions.map((group, i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">{group.label}</span>
                        <p className="text-sm text-foreground leading-relaxed">{group.caption}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 hover:text-amber-500"
                        onClick={() => handleCopy(group.caption)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Hooks Tab */}
            <TabsContent value="hooks" className="mt-4 space-y-3">
              {result.hooks.map((hook, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-amber-500">#{i + 1}</span>
                    <p className="text-sm font-semibold text-foreground">{hook}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 hover:text-amber-500"
                    onClick={() => handleCopy(hook)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            {/* Hashtags Tab */}
            <TabsContent value="hashtags" className="mt-4 space-y-4">
              {result.hashtagGroups.map((group, i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">{group.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 hover:text-amber-500"
                        onClick={() => handleCopy(group.tags.join(" "))}
                      >
                        <Copy className="h-3 w-3" />
                        {t("ce.copyAll")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-colors"
                          onClick={() => handleCopy(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Product Positioning Block */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                {t("ce.howToSell")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Target Audience */}
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    {t("ce.targetAudience")}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.positioning.targetAudience}</p>
                </div>

                {/* Price Suggestion */}
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    {t("ce.priceSuggestion")}
                  </div>
                  <p className={`text-sm font-semibold ${priceColors[result.positioning.priceRange]}`}>
                    {result.positioning.priceRange.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{result.positioning.priceLabel}</p>
                </div>

                {/* Sales Angle */}
                <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" />
                    {t("ce.salesAngle")}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.positioning.salesAngle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success */}
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-500 py-2">
            <CheckCircle className="h-4 w-4" />
            {t("ce.ready")}
          </div>
        </div>
      )}
    </div>
  );
}

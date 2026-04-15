import { useState, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Video, Upload, Download, Copy, Hash, Sparkles, RefreshCw, CheckCircle } from "lucide-react";
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
  const [progress, setProgress] = useState<{ video: number; percent: number }>({ video: 0, percent: 0 });
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
      const output = await generateContent(
        { productName: productName.trim(), imageFile, style },
        (videoIndex, percent) => setProgress({ video: videoIndex, percent })
      );
      setResult(output);
    } catch (err) {
      console.error("Content generation failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (blob: Blob, index: number) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${productName.replace(/\s+/g, "_")}_video_${index + 1}.webm`;
    a.click();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("ce.copied"), description: t("ce.copiedDesc") });
  };

  const overallProgress = loading
    ? Math.round(((progress.video * 100 + progress.percent) / 300) * 100)
    : 0;

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
            {/* Product Name */}
            <div className="space-y-2">
              <Label>{t("ce.productName")}</Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t("ce.productNamePlaceholder")}
              />
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label>{t("ce.style")}</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">🖤 Dark</SelectItem>
                  <SelectItem value="luxury">✨ Luxury</SelectItem>
                  <SelectItem value="minimal">◻️ Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {t("ce.generating")} ({overallProgress}%)
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t("ce.generate")}
              </span>
            )}
          </Button>

          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {t("ce.generatingVideo")} {progress.video + 1}/3...
              </p>
            </div>
          )}

          {/* Error + Retry */}
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

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Videos */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Video className="h-5 w-5 text-amber-500" />
              {t("ce.videoPreviews")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.videos.map((v, i) => (
                <Card key={i} className="border-border bg-card overflow-hidden">
                  <div className="aspect-[9/16] bg-black rounded-t-lg overflow-hidden">
                    <video
                      src={v.url}
                      controls
                      className="w-full h-full object-contain"
                      playsInline
                    />
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-xs text-muted-foreground italic">"{v.label}"</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => handleDownload(v.blob, i)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("ce.download")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Captions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Copy className="h-4 w-4 text-amber-500" />
                {t("ce.captions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.captions.map((cap, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-accent/30">
                  <p className="text-sm text-foreground flex-1">{cap}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={() => handleCopy(cap)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Hook */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {t("ce.hookLine")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <p className="text-sm font-semibold text-foreground">{result.hook}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={() => handleCopy(result.hook)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hashtags */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-amber-500" />
                {t("ce.hashtags")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {result.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleCopy(result.hashtags.join(" "))}
              >
                <Copy className="h-3.5 w-3.5" />
                {t("ce.copyAll")}
              </Button>
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

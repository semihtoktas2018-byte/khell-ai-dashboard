import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();

export async function translateProducts(names: string[]): Promise<Record<string, string>> {
  const toTranslate = names.filter((n) => n && !/[\u4e00-\u9fff]/.test(n) && !cache.has(n));
  if (toTranslate.length === 0) {
    return Object.fromEntries(names.map((n) => [n, cache.get(n) || n]));
  }

  try {
    const prompt = `Aşağıdaki e-ticaret ürün adlarını Türkçeye çevir. Kısa ve anlaşılır olsun, teknik terimleri koru. SADECE JSON döndür, başka hiçbir şey yazma:\n\n${JSON.stringify(toTranslate)}\n\nFormat: {"orijinal_ad": "türkçe_karşılık", ...}`;

    const { data, error } = await supabase.functions.invoke("anthropic-proxy", {
      body: {
        model: "claude-haiku-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      },
    });

    if (error) throw error;

    const text = data.content?.map((i: { type: string; text?: string }) => i.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    Object.entries(parsed).forEach(([orig, tr]) => {
      cache.set(orig, tr as string);
    });
  } catch {
    // Hata olursa orijinal adları kullan
  }

  return Object.fromEntries(names.map((n) => [n, cache.get(n) || n]));
}

const cache = new Map<string, string>();

export async function translateProducts(names: string[]): Promise<Record<string, string>> {
  const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  
  if (!ANTHROPIC_KEY) {
    return Object.fromEntries(names.map((n) => [n, n]));
  }

  const toTranslate = names.filter((n) => n && !/[\u4e00-\u9fff]/.test(n) && !cache.has(n));

  if (toTranslate.length === 0) {
    return Object.fromEntries(names.map((n) => [n, cache.get(n) || n]));
  }

  try {
    const prompt = `Aşağıdaki e-ticaret ürün adlarını Türkçeye çevir. Kısa ve anlaşılır olsun, teknik terimleri koru. SADECE JSON döndür, başka hiçbir şey yazma:\n\n${JSON.stringify(toTranslate)}\n\nFormat: {"orijinal_ad": "türkçe_karşılık", ...}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
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

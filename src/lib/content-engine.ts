export interface ContentEngineInput {
  productName: string;
  imageFile: File;
  style: "dark" | "luxury" | "minimal";
  niche?: string;
  locale?: "tr" | "en" | "fr";
}

export interface CaptionGroup {
  style: "aggressive" | "minimal";
  label: string;
  caption: string;
}

export interface HashtagGroup {
  category: "viral" | "niche" | "broad";
  label: string;
  tags: string[];
}

export interface ProductPositioning {
  targetAudience: string;
  priceRange: "low" | "mid" | "premium";
  priceLabel: string;
  salesAngle: string;
}

export interface VideoScene {
  second: string;
  visual: string;
  text: string;
}

export interface VideoScript {
  scenes: VideoScene[];
  voiceover: string;
  cta: string;
  onScreenTexts: string[];
}

export interface ContentEngineOutput {
  captions: CaptionGroup[];
  hooks: string[];
  hashtagGroups: HashtagGroup[];
  positioning: ProductPositioning;
  videoScript: VideoScript;
  videoPlaceholders: { label: string; description: string }[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function generateHashtagGroups(name: string, niche?: string): HashtagGroup[] {
  const clean = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  const nicheClean = niche ? niche.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") : "";
  return [
    {
      category: "viral",
      label: "🔥 Viral",
      tags: ["#fyp", "#viral", "#tiktokmademebuyit", "#foryou", "#trending", "#blowthisup"],
    },
    {
      category: "niche",
      label: "🎯 Niche",
      tags: [
        `#${clean}`,
        `#${clean}review`,
        `#best${clean}`,
        "#musthave",
        ...(nicheClean ? [`#${nicheClean}`, `#${nicheClean}style`] : ["#tiktokfinds"]),
        `#${clean}lover`,
      ],
    },
    {
      category: "broad",
      label: "🌍 Broad",
      tags: ["#shopping", "#onlineshopping", "#productreview", "#lifestyle", "#trending", "#newproduct", "#tiktokshop"],
    },
  ];
}

function generateVideoPlaceholders(): ContentEngineOutput["videoPlaceholders"] {
  return [
    { label: "Cinematic Opening", description: "Slow zoom + text overlay: hook line" },
    { label: "Fast Showcase", description: "Quick cuts + bold text: key benefits" },
    { label: "Aesthetic Loop", description: "Soft pan + minimal text: emotion-driven" },
  ];
}

// locale support added
export async function generateContent(input: ContentEngineInput): Promise<ContentEngineOutput> {
  const base64Image = await fileToBase64(input.imageFile);
  const mediaType = input.imageFile.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

  const styleGuide = {
    dark: "bold, raw, edgy, FOMO-driven. Target: 18-30 risk-takers. Tone: provocative, exclusive.",
    luxury: "elegant, aspirational, status-driven. Target: 25-40 quality-seekers. Tone: sophisticated, desire-evoking.",
    minimal: "clean, calm, quality-focused. Target: conscious buyers. Tone: understated, confident.",
  }[input.style];

  const langMap = { tr: "Turkish", en: "English", fr: "French" };
  const lang = langMap[input.locale || "en"];

  const prompt = `You are an elite TikTok/Instagram viral content strategist. You have seen the product image and know the product name: "${input.productName}"${input.niche ? ` in the "${input.niche}" niche` : ""}.

CRITICAL: Write ALL content in ${lang}. Every single word must be in ${lang}.

Style directive: ${styleGuide}

Analyze the product visually and create HIGH-CONVERTING content that makes people stop scrolling and feel "I NEED this." Focus on EMOTION, not features. Sell the transformation, the feeling, the identity — not the product itself.

Return ONLY valid JSON with this exact structure:
{
  "hooks": ["hook1", "hook2", "hook3"],
  "captions": [
    {
      "style": "aggressive",
      "label": "🔥 High-Converting",
      "caption": "caption text with emojis and CTA"
    },
    {
      "style": "minimal", 
      "label": "✨ Aesthetic / Minimal",
      "caption": "caption text"
    }
  ],
  "positioning": {
    "targetAudience": "specific audience description",
    "priceRange": "mid",
    "priceLabel": "price range suggestion with reasoning",
    "salesAngle": "the core emotional angle to sell this product"
  },
  "videoScript": {
    "scenes": [
      {"second": "0-3s", "visual": "visual direction", "text": "on-screen text"},
      {"second": "3-8s", "visual": "visual direction", "text": "on-screen text"},
      {"second": "8-15s", "visual": "visual direction", "text": "on-screen text"},
      {"second": "15-22s", "visual": "visual direction", "text": "on-screen text"},
      {"second": "22-27s", "visual": "visual direction", "text": "on-screen text"},
      {"second": "27-30s", "visual": "visual direction", "text": "on-screen text"}
    ],
    "voiceover": "full 30-second voiceover script",
    "cta": "call to action text",
    "onScreenTexts": ["text1", "text2", "text3", "text4", "text5", "text6"]
  }
}

Rules:
- Hooks must be SCROLL-STOPPING. First 3 words must create curiosity or shock.
- Captions must sell EMOTION not features. Make them feel something.
- Video script scenes must tell a story: Problem → Discovery → Solution → Desire → Social proof → CTA
- Voiceover should sound like a confident friend recommending something life-changing, not an ad.
- All content in ${lang}. Do not mix languages.
- NO generic phrases like "amazing product" or "great quality". Be specific and emotional.
- priceRange must be exactly one of: "low", "mid", "premium"`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Image },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  const text = data.content.map((i: { type: string; text?: string }) => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    captions: parsed.captions,
    hooks: parsed.hooks,
    hashtagGroups: generateHashtagGroups(input.productName, input.niche),
    positioning: parsed.positioning,
    videoScript: parsed.videoScript,
    videoPlaceholders: generateVideoPlaceholders(),
  };
}

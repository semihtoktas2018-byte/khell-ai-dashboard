// Content Engine - Video Ad Creator with scripts, hooks, voiceover, CTA, captions, hashtags

export interface ContentEngineInput {
  productName: string;
  imageFile: File;
  style: "dark" | "luxury" | "minimal";
  niche?: string;
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

// --- Caption generation ---

function generateCaptions(name: string): CaptionGroup[] {
  return [
    {
      style: "aggressive",
      label: "🔥 Aggressive / High-Converting",
      caption: pickRandom([
        `This ${name} is selling out FAST — grab yours before it's gone 🚨 Link in bio`,
        `Everyone's buying this ${name}. Don't be the last one 💀 Link in bio ⬇️`,
        `I made $2K in 3 days with this ${name}. You're sleeping on it 💰`,
        `POV: You found THE ${name} and your life changed. Link in bio 🔥`,
        `Stop scrolling. This ${name} will change your game. Trust me 🫠`,
      ]),
    },
    {
      style: "minimal",
      label: "✨ Minimal / Aesthetic",
      caption: pickRandom([
        `${name}. That's it. That's the post.`,
        `Less noise. More ${name}. ◽`,
        `Quiet luxury starts with ${name}.`,
        `Details matter. ${name}. ✦`,
        `${name} — for those who know.`,
      ]),
    },
  ];
}

// --- Hook generation (3 variations, max 6 words) ---

function generateHooks(): string[] {
  const pool = [
    "This is not for everyone.",
    "Only a few will get it.",
    "You weren't supposed to see this.",
    "Stop. Look at this.",
    "Wait for it…",
    "Nobody's talking about this.",
    "Delete this before it blows up.",
    "This changes everything.",
    "You're sleeping on this.",
    "Don't scroll past this.",
  ];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// --- Hashtag generation ---

function generateHashtagGroups(name: string, niche?: string): HashtagGroup[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nicheClean = niche ? niche.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
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
        ...(nicheClean ? [`#${nicheClean}`, `#${nicheClean}style`] : ["#findsoftiktok"]),
        `#${clean}lover`,
      ],
    },
    {
      category: "broad",
      label: "🌍 Broad Reach",
      tags: ["#shopping", "#onlineshopping", "#productreview", "#lifestyle", "#trend", "#newproduct", "#tiktokshop"],
    },
  ];
}

// --- Product positioning ---

function generatePositioning(name: string, style: ContentEngineInput["style"]): ProductPositioning {
  const audiences: Record<ContentEngineInput["style"], string> = {
    dark: `Young adults (18-30) who value edgy, bold aesthetics. Impulse buyers drawn to exclusive, limited-feel products.`,
    luxury: `Style-conscious consumers (25-40) seeking premium quality. They buy based on perceived value and brand image.`,
    minimal: `Design-focused millennials and Gen-Z who appreciate clean, simple products. Converts through aesthetics.`,
  };
  const prices: Record<ContentEngineInput["style"], { range: "low" | "mid" | "premium"; label: string }> = {
    dark: { range: "mid", label: "$19–$39 — Mid-range impulse buy" },
    luxury: { range: "premium", label: "$49–$99 — Premium positioning" },
    minimal: { range: "mid", label: "$15–$35 — Accessible yet stylish" },
  };
  const angles: Record<ContentEngineInput["style"], string> = {
    dark: `Exclusivity & FOMO — "Not everyone can handle this ${name}." Position as a bold statement piece.`,
    luxury: `Aspiration & Status — "You deserve the ${name}." Tap into desire for elevated lifestyle.`,
    minimal: `Simplicity & Quality — "Less is more with ${name}." Appeal to refined taste and intentional living.`,
  };
  return {
    targetAudience: audiences[style],
    priceRange: prices[style].range,
    priceLabel: prices[style].label,
    salesAngle: angles[style],
  };
}

// --- Video Script Generation ---

function generateVideoScript(name: string, style: ContentEngineInput["style"], hooks: string[]): VideoScript {
  const hook = hooks[0] || "This is not for everyone.";

  const sceneSets: Record<ContentEngineInput["style"], VideoScene[]> = {
    dark: [
      { second: "0-3s", visual: "Black screen → product reveal with flash", text: hook },
      { second: "3-8s", visual: "Slow zoom on product, cinematic lighting", text: `Meet the ${name}.` },
      { second: "8-15s", visual: "Close-up details, dramatic angles", text: "Built different. Designed for the bold." },
      { second: "15-22s", visual: "Lifestyle shot — person using product", text: "Not everyone will understand." },
      { second: "22-27s", visual: "Quick cuts of features/benefits", text: "Premium quality. Limited drop." },
      { second: "27-30s", visual: "Logo + CTA overlay", text: "Link in bio 🔥" },
    ],
    luxury: [
      { second: "0-3s", visual: "Elegant fade-in, golden particles", text: hook },
      { second: "3-8s", visual: "Product on marble/velvet surface", text: `Introducing ${name}.` },
      { second: "8-15s", visual: "Slow pan across product details", text: "Crafted for those who demand more." },
      { second: "15-22s", visual: "Lifestyle — premium setting", text: "Elevate your everyday." },
      { second: "22-27s", visual: "Social proof / reviews overlay", text: "Join thousands who upgraded." },
      { second: "27-30s", visual: "Brand + CTA", text: "Shop now — Link in bio ✨" },
    ],
    minimal: [
      { second: "0-3s", visual: "Clean white bg, product drops in", text: hook },
      { second: "3-8s", visual: "Static product shot, soft shadow", text: `${name}.` },
      { second: "8-15s", visual: "Slow rotation / minimal animation", text: "Simple. Clean. Essential." },
      { second: "15-22s", visual: "Flat lay with lifestyle elements", text: "Less is more." },
      { second: "22-27s", visual: "Feature highlights, clean typography", text: "Designed with intention." },
      { second: "27-30s", visual: "Minimal CTA card", text: "Link in bio ◽" },
    ],
  };

  const voiceovers: Record<ContentEngineInput["style"], string> = {
    dark: `${hook} This is the ${name}. Built for people who don't follow trends — they set them. Premium quality, limited stock. If you know, you know. Link in bio.`,
    luxury: `${hook} Introducing the ${name}. Crafted for those who demand more from life. Elevate your everyday with something truly special. Thousands already have. Will you? Link in bio.`,
    minimal: `${hook} ${name}. Simple. Clean. Essential. Designed with intention for people who value quality over quantity. Link in bio.`,
  };

  const ctas: Record<ContentEngineInput["style"], string> = {
    dark: "🔥 Grab yours before it's gone — Link in bio",
    luxury: "✨ Shop now — Elevate your lifestyle — Link in bio",
    minimal: "◽ Get yours — Link in bio",
  };

  return {
    scenes: sceneSets[style],
    voiceover: voiceovers[style],
    cta: ctas[style],
    onScreenTexts: sceneSets[style].map((s) => s.text),
  };
}

// --- Video placeholders ---

function generateVideoPlaceholders(): ContentEngineOutput["videoPlaceholders"] {
  return [
    { label: "Cinematic Reveal", description: "Slow zoom + text overlay: \"Not everyone will understand this.\"" },
    { label: "Quick Showcase", description: "Fast cuts + bold text: \"Only a few belong to the pack.\"" },
    { label: "Aesthetic Loop", description: "Smooth pan + minimal text: \"If you know, you know.\"" },
  ];
}

// --- Helpers ---

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Main generator ---

export async function generateContent(
  input: ContentEngineInput,
): Promise<ContentEngineOutput> {
  await new Promise((r) => setTimeout(r, 1500));

  const hooks = generateHooks();

  return {
    captions: generateCaptions(input.productName),
    hooks,
    hashtagGroups: generateHashtagGroups(input.productName, input.niche),
    positioning: generatePositioning(input.productName, input.style),
    videoScript: generateVideoScript(input.productName, input.style, hooks),
    videoPlaceholders: generateVideoPlaceholders(),
  };
}

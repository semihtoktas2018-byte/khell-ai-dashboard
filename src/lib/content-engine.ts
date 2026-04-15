// Content Engine - Upgraded with multi-style captions, hooks, hashtag groups, and positioning

export interface ContentEngineInput {
  productName: string;
  imageFile: File;
  style: "dark" | "luxury" | "minimal";
}

export interface CaptionGroup {
  style: "viral" | "direct" | "minimal";
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

export interface ContentEngineOutput {
  captions: CaptionGroup[];
  hooks: string[];
  hashtagGroups: HashtagGroup[];
  positioning: ProductPositioning;
  videoPlaceholders: { label: string; description: string }[];
}

// --- Caption generation ---

function generateCaptions(name: string, style: ContentEngineInput["style"]): CaptionGroup[] {
  const n = name;
  return [
    {
      style: "viral",
      label: "🔥 Viral / Emotional",
      caption: pickRandom([
        `I wasn't ready for this ${n}. Neither are you. 😳🔥`,
        `This ${n} made me feel something I can't explain. Link in bio 💀`,
        `POV: You finally found THE ${n} and your life changed 🫠`,
        `I don't gatekeep. This ${n} is everything. 🔥`,
        `The way this ${n} hits different… you're not ready 👀`,
      ]),
    },
    {
      style: "direct",
      label: "💰 Direct Selling",
      caption: pickRandom([
        `This ${n} is selling out FAST — grab yours before it's gone 🚨`,
        `Why is everyone buying this ${n}? Because it WORKS. Link in bio ⬇️`,
        `${n} — limited stock, unlimited results. Don't sleep on this 💰`,
        `You need this ${n}. Trust me. Check the link 👆`,
        `Last chance to get this ${n} at this price. Move fast ⚡`,
      ]),
    },
    {
      style: "minimal",
      label: "✨ Minimal / Aesthetic",
      caption: pickRandom([
        `${n}. That's it. That's the post.`,
        `Less noise. More ${n}. ◽`,
        `Quiet luxury starts with ${n}.`,
        `Details matter. ${n}. ✦`,
        `${n} — for those who know.`,
      ]),
    },
  ];
}

// --- Hook generation ---

function generateHooks(): string[] {
  const pool = [
    "This is not for everyone.",
    "Only a few will get it.",
    "You weren't supposed to see this.",
    "Stop. Look at this.",
    "Wait for it…",
    "Nobody's talking about this.",
    "Delete this before it blows up.",
    "I'm gatekeeping this one.",
    "This changes everything.",
    "You're sleeping on this.",
    "Don't scroll past this.",
    "You'll regret not watching.",
  ];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// --- Hashtag generation ---

function generateHashtagGroups(name: string): HashtagGroup[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return [
    {
      category: "viral",
      label: "🔥 Viral",
      tags: ["#fyp", "#viral", "#tiktokmademebuyit", "#foryou", "#trending", "#blowthisup"],
    },
    {
      category: "niche",
      label: "🎯 Niche",
      tags: [`#${clean}`, `#${clean}review`, `#best${clean}`, "#musthave", "#findsoftiktok", `#${clean}lover`],
    },
    {
      category: "broad",
      label: "🌍 Broad Reach",
      tags: ["#shopping", "#onlineshopping", "#productreview", "#lifestyle", "#trend", "#newproduct", "#recommendation"],
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

// --- Main generator (lightweight, no video rendering) ---

export async function generateContent(
  input: ContentEngineInput,
): Promise<ContentEngineOutput> {
  // Simulate brief processing delay for UX
  await new Promise((r) => setTimeout(r, 1200));

  return {
    captions: generateCaptions(input.productName, input.style),
    hooks: generateHooks(),
    hashtagGroups: generateHashtagGroups(input.productName),
    positioning: generatePositioning(input.productName, input.style),
    videoPlaceholders: generateVideoPlaceholders(),
  };
}

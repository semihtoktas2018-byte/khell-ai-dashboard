// Content Engine - Client-side video generation using Canvas + MediaRecorder

export interface ContentEngineInput {
  productName: string;
  imageFile: File;
  style: "dark" | "luxury" | "minimal";
}

export interface ContentEngineOutput {
  videos: { blob: Blob; url: string; label: string }[];
  captions: string[];
  hook: string;
  hashtags: string[];
}

const TEXT_OVERLAYS = [
  "Not everyone will understand this.",
  "Only a few belong to the pack.",
  "If you know, you know.",
];

function getStyleConfig(style: ContentEngineInput["style"]) {
  switch (style) {
    case "dark":
      return { bg: "#0a0a0a", vignette: 0.7, contrast: 1.3, textColor: "#ffffff" };
    case "luxury":
      return { bg: "#1a1207", vignette: 0.5, contrast: 1.2, textColor: "#f5e6c8" };
    case "minimal":
      return { bg: "#111111", vignette: 0.3, contrast: 1.1, textColor: "#e0e0e0" };
  }
}

function generateCaptions(productName: string): string[] {
  return [
    `This ${productName} hits different. Link in bio 🔥`,
    `POV: You finally found THE ${productName} 💀`,
    `Stop scrolling. You need this ${productName} 👀`,
  ];
}

function generateHook(productName: string): string {
  const hooks = [
    `This ${productName} changes everything.`,
    `Wait till you see this.`,
    `You're not ready for this.`,
    `The ${productName} everyone wants.`,
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function generateHashtags(productName: string): string[] {
  const clean = productName.toLowerCase().replace(/\s+/g, "");
  return [
    `#${clean}`,
    "#tiktokmademebuyit",
    "#viral",
    "#trending",
    "#musthave",
    "#fyp",
    "#dropshipping",
    `#${clean}review`,
  ];
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.9);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, w: number, h: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Word wrap
  const maxWidth = w - 120;
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 70;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });
  ctx.restore();
}

async function generateSingleVideo(
  img: HTMLImageElement,
  textOverlay: string,
  style: ContentEngineInput["style"],
  durationSec: number,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const FPS = 30;
  const totalFrames = durationSec * FPS;
  const config = getStyleConfig(style);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Use MediaRecorder
  const stream = canvas.captureStream(FPS);
  const chunks: Blob[] = [];

  // Try VP8 first (widely supported), fallback to default
  let mimeType = "video/webm;codecs=vp8";
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = "video/webm";
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: "video/webm" }));
    };
    recorder.onerror = (e) => reject(e);
    recorder.start();

    let frame = 0;
    const renderFrame = () => {
      if (frame >= totalFrames) {
        recorder.stop();
        return;
      }

      const progress = frame / totalFrames;
      // Ken Burns: slow zoom from 1.0 to 1.15
      const zoom = 1.0 + progress * 0.15;

      // Clear
      ctx.fillStyle = config.bg;
      ctx.fillRect(0, 0, W, H);

      // Draw image with zoom
      ctx.save();
      ctx.filter = `contrast(${config.contrast})`;
      const imgAspect = img.width / img.height;
      const canvasAspect = W / H;
      let drawW: number, drawH: number;
      if (imgAspect > canvasAspect) {
        drawH = H * zoom;
        drawW = drawH * imgAspect;
      } else {
        drawW = W * zoom;
        drawH = drawW / imgAspect;
      }
      const drawX = (W - drawW) / 2;
      const drawY = (H - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.filter = "none";
      ctx.restore();

      // Vignette
      drawVignette(ctx, W, H, config.vignette);

      // Text fade in (appears at 20% of timeline, fully visible by 35%)
      const textStart = 0.2;
      const textFull = 0.35;
      let textOpacity = 0;
      if (progress >= textStart) {
        textOpacity = Math.min(1, (progress - textStart) / (textFull - textStart));
      }
      if (textOpacity > 0) {
        ctx.globalAlpha = textOpacity;
        drawText(ctx, textOverlay, W, H, config.textColor);
        ctx.globalAlpha = 1;
      }

      onProgress?.(Math.round((frame / totalFrames) * 100));
      frame++;
      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  });
}

export async function generateContent(
  input: ContentEngineInput,
  onProgress?: (videoIndex: number, percent: number) => void
): Promise<ContentEngineOutput> {
  const img = await loadImage(input.imageFile);
  const durations = [5, 6, 7];
  const videos: ContentEngineOutput["videos"] = [];

  for (let i = 0; i < 3; i++) {
    const blob = await generateSingleVideo(
      img,
      TEXT_OVERLAYS[i],
      input.style,
      durations[i],
      (p) => onProgress?.(i, p)
    );
    const url = URL.createObjectURL(blob);
    videos.push({ blob, url, label: TEXT_OVERLAYS[i] });
  }

  return {
    videos,
    captions: generateCaptions(input.productName),
    hook: generateHook(input.productName),
    hashtags: generateHashtags(input.productName),
  };
}

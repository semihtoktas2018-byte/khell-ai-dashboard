import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const BOT_UA_PATTERNS = [
  "bot", "crawl", "spider", "slurp", "headless", "phantom", "puppeteer",
  "facebookexternalhit", "whatsapp", "telegrambot", "discordbot", "preview",
  "lighthouse", "pingdom", "uptimerobot", "ahrefs", "semrush", "mj12bot",
];

function detectBotSignals(): { isLikelyBot: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const ua = navigator.userAgent.toLowerCase();

  if (BOT_UA_PATTERNS.some((p) => ua.includes(p))) reasons.push("ua_pattern");
  if ((navigator as any).webdriver) reasons.push("webdriver_flag");
  if (navigator.languages && navigator.languages.length === 0) reasons.push("no_languages");
  if (typeof window !== "undefined" && !("chrome" in window) && ua.includes("chrome")) reasons.push("fake_chrome");
  if (navigator.hardwareConcurrency === 0) reasons.push("zero_cores");
  if (!("plugins" in navigator) || navigator.plugins.length === 0) {
    // Weak signal alone (common on real mobile too), only counts combined with another signal
    if (reasons.length > 0) reasons.push("no_plugins");
  }

  return { isLikelyBot: reasons.length > 0, reasons };
}

export default function BotSignal() {
  useEffect(() => {
    try {
      const { isLikelyBot, reasons } = detectBotSignals();
      if (window.gtag) {
        window.gtag("event", "traffic_quality_check", {
          traffic_quality: isLikelyBot ? "possible_bot" : "likely_human",
          bot_signals: reasons.join(",") || "none",
        });
      }
    } catch {
      // fail silently — never break the app for a measurement signal
    }
  }, []);

  return null;
}

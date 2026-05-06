import { MessageCircle } from "lucide-react";

const WA_LINK =
  "https://wa.me/905446452430?text=" +
  encodeURIComponent("Merhaba, KHELL AI PRO hakkında bilgi almak istiyorum.");

export default function FloatingWhatsApp() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişim"
      className="no-print fixed bottom-5 right-5 z-[100] group"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500/40 blur-xl animate-pulse" aria-hidden />
      <span className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_8px_30px_-4px_rgba(16,185,129,0.6)] hover:shadow-[0_8px_40px_-2px_rgba(16,185,129,0.8)] hover:scale-105 transition-all px-4 py-3 border border-emerald-300/30">
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">PRO</span>
      </span>
    </a>
  );
}

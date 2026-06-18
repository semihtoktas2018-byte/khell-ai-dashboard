import { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  const rings = [0, 1, 2];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(222 47% 4%), hsl(222 47% 2%))" }}
    >
      <div className="relative h-16 w-16 mb-5 flex items-center justify-center">
        {/* Patlama halkaları — logo belirdiği anda dışa doğru yayılır */}
        {rings.map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 1.1, delay: 0.15 + i * 0.15, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ border: "2px solid hsl(217 91% 65%)" }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.05 }}
          className="relative h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(199 89% 55%))",
            boxShadow: "0 0 50px hsl(217 91% 60% / 0.6)",
          }}
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-3xl font-extrabold tracking-tight"
        style={{
          background: "linear-gradient(90deg, hsl(217 91% 65%), hsl(199 89% 65%), hsl(142 71% 55%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        KHELL AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-xs mt-1"
        style={{ color: "hsl(215 20% 55%)" }}
      >
        Ürün senden, analiz Khell'den.
      </motion.p>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 120, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
        className="h-[3px] rounded-full mt-7 overflow-hidden"
        style={{ background: "hsl(217 32% 18%)" }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear", delay: 1.2 }}
          className="h-full w-1/2"
          style={{ background: "linear-gradient(90deg, transparent, hsl(217 91% 65%), transparent)" }}
        />
      </motion.div>
    </motion.div>
  );
}

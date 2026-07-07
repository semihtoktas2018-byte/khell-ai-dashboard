import { motion } from "framer-motion";

export default function PromoIntro({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onDone}
      className="fixed inset-0 z-[290] cursor-pointer overflow-y-auto"
      style={{ background: "hsl(222 47% 2%)" }}
    >
      <img
        src="/promo-intro.png"
        alt="KHELL AI"
        className="w-full h-auto min-h-full object-cover select-none"
        draggable={false}
      />
    </motion.div>
  );
}

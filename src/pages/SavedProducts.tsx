import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

export default function SavedProducts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
        <Bookmark className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Henüz Kaydedilen Ürün Yok</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Kazanan ürünleri kaydedin ve burada takip edin.
      </p>
    </motion.div>
  );
}

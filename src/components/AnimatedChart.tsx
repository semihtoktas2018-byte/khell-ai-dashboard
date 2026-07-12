import { motion } from "framer-motion";

export default function AnimatedChart() {
  const path =
    "M40 180 L100 165 L160 170 L220 145 L280 135 L340 105 L400 100 L460 80";

  return (
    <div className="relative w-full h-[220px] rounded-xl overflow-hidden">
      <svg
        viewBox="0 0 500 220"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="strokeGlow">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Alt dolgu */}
        <motion.path
          d={`${path} L460 200 L40 200 Z`}
          fill="url(#fillPurple)"
          animate={{
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
        />

        {/* Çizgi */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#strokeGlow)"
          strokeWidth="4"
          filter="url(#glow)"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Hareket eden ışık */}
        <motion.circle
          r="7"
          fill="#A855F7"
          filter="url(#glow)"
          initial={{ cx: 40, cy: 180 }}
          animate={{
            cx: [40,100,160,220,280,340,400,460],
            cy: [180,165,170,145,135,105,100,80],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
        />

        {/* Son nokta */}
        <motion.circle
          cx="460"
          cy="80"
          r="8"
          fill="#C084FC"
          filter="url(#glow)"
          animate={{
            scale: [1,1.45,1],
            opacity: [1,0.55,1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        />
      </svg>
    </div>
  );
}

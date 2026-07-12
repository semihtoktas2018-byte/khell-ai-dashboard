import { motion } from "framer-motion";

const points = [
  { x: 40, y: 180 },
  { x: 100, y: 165 },
  { x: 160, y: 170 },
  { x: 220, y: 145 },
  { x: 280, y: 135 },
  { x: 340, y: 105 },
  { x: 400, y: 100 },
  { x: 460, y: 80 },
];

const path = points
  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
  .join(" ");

export default function AnimatedChart() {
  const last = points[points.length - 1];

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 500 220"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d={`${path} L460 200 L40 200 Z`}
          fill="url(#fillPurple)"
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.path
          d={path}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="4"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        <motion.g
          animate={{
            x: [0, 60, 120, 180, 240, 300, 360, 420],
            y: [0, -15, -10, -35, -45, -75, -80, -100],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx={40}
            cy={180}
            r={7}
            fill="#C084FC"
            filter="url(#glow)"
          />
        </motion.g>

        <motion.circle
          cx={last.x}
          cy={last.y}
          r={8}
          fill="#C084FC"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </svg>
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotCount((d) => (d + 1) % 4);
    }, 400);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearInterval(dotsInterval);
    };
  }, [onDone]);

  const dots = ".".repeat(dotCount);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #0F1A24 0%, #0B1E30 40%, #0F1A24 60%, #1A0A0A 100%)",
          }}
        >
          {/* Glow rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full"
              style={{
                width: 300,
                height: 300,
                background:
                  "radial-gradient(circle, oklch(0.762 0.142 213 / 0.15) 0%, transparent 70%)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* KT Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glow-pulse relative z-10 select-none"
          >
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: 120,
                height: 120,
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background:
                    "linear-gradient(135deg, #E53935, #FF6B6B, #40C4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                KT
              </span>
            </div>
          </motion.div>

          {/* Kazutube text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 relative z-10 text-center"
          >
            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              Kazu<span style={{ color: "#E53935" }}>tube</span>
            </h1>
          </motion.div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-8 relative z-10"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              letterSpacing: 1,
            }}
          >
            Loading Kazutube{dots}
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-4 relative z-10 rounded-full overflow-hidden"
            style={{
              width: 200,
              height: 3,
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #E53935, #40C4FF)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

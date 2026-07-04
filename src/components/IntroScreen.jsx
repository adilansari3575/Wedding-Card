import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

const dustParticles = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.4 + 0.1,
  scale: Math.random() * 0.6 + 0.4,
  x: [0, Math.random() * 20 - 10, 0],
  duration: Math.random() * 8 + 6,
}));

const IntroScreen = ({ isOpen, setIsOpen }) => {
  const [isExploding, setIsExploding] = useState(false);
  const [fireworkSparks, setFireworkSparks] = useState([]);

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-100, 100], [18, -18]);
  const rotateY = useTransform(smoothX, [-100, 100], [-18, 18]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleTap = () => {
    const sparks = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * 360;
      const distance = Math.random() * 100 + 80;
      const colors = ["#D4AF37", "#FFFFFF", "#FFD700"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = [0, Math.random() * 1.5 + 0.8, 0];
      return {
        id: i,
        x: Math.cos(angle * (Math.PI / 180)) * distance,
        y: Math.sin(angle * (Math.PI / 180)) * distance + 40,
        scale,
        color,
      };
    });
    setFireworkSparks(sparks);
    setIsExploding(true);
    // Shockwave aur firework dikhane ke liye wait
    setTimeout(() => {
      setIsOpen(true);
    }, 800); // Thoda time badhaya for better animation feel
  };

  return (
    <>
      {/* Importing Premium Fonts directly into the component */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
          .font-royal { font-family: 'Cormorant Garamond', serif; }
          .font-modern { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      <AnimatePresence>
        {!isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none bg-[#0a0505]">
            {/* Ambient Gold Dust */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {dustParticles.map((dust) => (
                <motion.div
                  key={`dust-${dust.id}`}
                  initial={{
                    top: dust.top,
                    left: dust.left,
                    opacity: dust.opacity,
                    scale: dust.scale,
                  }}
                  animate={{
                    y: [0, -60, 0],
                    x: dust.x,
                    opacity: [0.1, 0.6, 0.1],
                  }}
                  transition={{
                    duration: dust.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-[2px] h-[2px] bg-[#D4AF37] rounded-full blur-[1px]"
                />
              ))}
            </div>

            {/* Left Door */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.2, 1] }}
              className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#0d0707] to-[#1a0b0d] border-r border-[#D4AF37]/30 flex justify-end overflow-hidden pointer-events-auto shadow-[30px_0_60px_rgba(0,0,0,0.8)]"
            >
              {/* Door Decorations */}
              <div className="absolute right-0 h-full flex opacity-60">
                <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-[8px]"></div>
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mx-[4px]"></div>
              </div>
              <svg className="absolute top-24 right-[-96px] w-48 h-48 stroke-[#D4AF37] fill-none stroke-[1.5px] opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                <path d="M 0 48 Q 96 48 96 0" />
                <circle cx="96" cy="48" r="4" fill="#D4AF37" />
              </svg>
              <svg className="absolute bottom-24 right-[-96px] w-48 h-48 stroke-[#D4AF37] fill-none stroke-[1.5px] opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                <path d="M 0 0 Q 96 0 96 48" />
                <circle cx="96" cy="0" r="4" fill="#D4AF37" />
              </svg>
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.2, 1] }}
              className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#0d0707] to-[#1a0b0d] border-l border-[#D4AF37]/30 flex justify-start overflow-hidden pointer-events-auto shadow-[-30px_0_60px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute left-0 h-full flex opacity-60">
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mx-[4px]"></div>
                <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-[8px]"></div>
              </div>
              <svg className="absolute top-24 left-[-96px] w-48 h-48 stroke-[#D4AF37] fill-none stroke-[1.5px] opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                <path d="M 192 48 Q 96 48 96 0" />
                <circle cx="96" cy="48" r="4" fill="#D4AF37" />
              </svg>
              <svg className="absolute bottom-24 left-[-96px] w-48 h-48 stroke-[#D4AF37] fill-none stroke-[1.5px] opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                <path d="M 192 0 Q 96 0 96 48" />
                <circle cx="96" cy="0" r="4" fill="#D4AF37" />
              </svg>
            </motion.div>

            {/* Central Content & Interactivity */}
            <div className="relative z-60 flex items-center justify-center pointer-events-auto perspective-[1200px]">
              {/* Shockwave Ring */}
              {isExploding && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 1, borderWidth: "6px" }}
                  animate={{ scale: 3.5, opacity: 0, borderWidth: "0px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-40 h-40 rounded-full border-[#D4AF37] shadow-[0_0_40px_#D4AF37]"
                />
              )}

              {/* Advanced Firework Particles */}
              {isExploding &&
                fireworkSparks.map((spark) => {
                  return (
                    <motion.div
                      key={`spark-${spark.id}`}
                      initial={{ x: 0, y: 0, scale: 0 }}
                      animate={{
                        x: spark.x,
                        y: spark.y,
                        scale: spark.scale,
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ backgroundColor: spark.color }}
                      className="absolute w-2 h-2 rounded-full shadow-[0_0_15px_2px_currentColor]"
                    />
                  );
                })}

              {/* 3D Interactive Medallion Button */}
              <motion.div
                style={{ rotateX, rotateY }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleTap}
                exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.6 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-48 h-48 flex items-center justify-center cursor-pointer group"
              >
                {/* Pulsing Outer Aura */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-[-20px] rounded-full bg-[#D4AF37] blur-2xl"
                />

                {/* Main Button Body - Velvet Red/Gold combo */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#4a111a] via-[#24050a] to-[#0a0102] border-[2px] border-[#D4AF37]/60 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(212,175,55,0.2)] relative overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]">
                  {/* Decorative Inner Rings */}
                  <div className="absolute inset-[6px] rounded-full border-[1px] border-dashed border-[#D4AF37]/40"></div>
                  <div className="absolute inset-[10px] rounded-full border-[0.5px] border-[#D4AF37]/20 group-hover:border-[#D4AF37]/60 transition-colors duration-500"></div>

                  {/* Monogram (Using elegant serif) */}
                  <span className="font-royal text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] to-[#D4AF37] relative z-10 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    S{" "}
                    <span className="text-3xl text-[#D4AF37] italic opacity-80">
                      &
                    </span>{" "}
                    Z
                  </span>

                  {/* Call to action (Using clean sans-serif) */}
                  <span className="font-modern text-[10px] tracking-[0.3em] text-[#D4AF37] font-medium relative z-10 mt-1">
                    TAP TO OPEN
                  </span>

                  {/* Dynamic Glass Shine */}
                  <motion.div
                    animate={{ x: ["-150%", "250%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                      repeatDelay: 2,
                    }}
                    className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntroScreen;

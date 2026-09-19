import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

/* -------------------------------------------------------
   Ambient particles
------------------------------------------------------- */
const dustParticles = Array.from({ length: 35 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.22 + 0.08,
  scale: Math.random() * 0.7 + 0.3,
  x: [0, Math.random() * 16 - 8, 0],
  duration: Math.random() * 7 + 7,
}));

/* -------------------------------------------------------
   Botanical Leaf
------------------------------------------------------- */
const BotanicalBranch = ({ className = "", flip = false }) => (
  <svg
    viewBox="0 0 180 300"
    className={`absolute pointer-events-none ${className}`}
    style={{
      transform: flip ? "scaleX(-1)" : undefined,
    }}
    fill="none"
  >
    <path
      d="M28 290 C34 225 48 158 92 100 C116 68 140 38 165 15"
      stroke="#D7D9C5"
      strokeWidth="1.4"
      opacity="0.48"
    />

    <path
      d="M53 207 C36 188 25 171 19 150"
      stroke="#D7D9C5"
      strokeWidth="1"
      opacity="0.42"
    />

    <path
      d="M70 177 C91 162 105 145 111 126"
      stroke="#D7D9C5"
      strokeWidth="1"
      opacity="0.42"
    />

    <path
      d="M91 139 C74 124 65 109 62 92"
      stroke="#D7D9C5"
      strokeWidth="1"
      opacity="0.42"
    />

    <path
      d="M111 111 C130 98 142 83 146 67"
      stroke="#D7D9C5"
      strokeWidth="1"
      opacity="0.42"
    />

    <path
      d="M129 87 C113 73 108 59 110 45"
      stroke="#D7D9C5"
      strokeWidth="1"
      opacity="0.38"
    />

    <path
      d="M47 221 C31 209 18 195 11 179 C29 181 43 191 47 221Z"
      fill="#AEB69A"
      opacity="0.32"
    />

    <path
      d="M59 193 C77 181 91 166 98 150 C80 151 67 164 59 193Z"
      fill="#AEB69A"
      opacity="0.28"
    />

    <path
      d="M76 160 C61 145 53 129 53 113 C68 120 77 135 76 160Z"
      fill="#AEB69A"
      opacity="0.30"
    />

    <path
      d="M99 132 C116 120 127 107 132 92 C116 95 104 108 99 132Z"
      fill="#AEB69A"
      opacity="0.28"
    />

    <path
      d="M119 101 C105 87 100 73 102 60 C116 69 122 82 119 101Z"
      fill="#AEB69A"
      opacity="0.25"
    />

    <path
      d="M138 76 C151 66 159 54 161 42 C148 46 140 58 138 76Z"
      fill="#AEB69A"
      opacity="0.28"
    />
  </svg>
);

/* -------------------------------------------------------
   Small Decorative Flower
------------------------------------------------------- */
const Flower = ({ className = "" }) => (
  <svg
    viewBox="0 0 80 80"
    className={`absolute pointer-events-none ${className}`}
  >
    <g fill="none" stroke="#D7D9C5" strokeWidth="1">
      <circle cx="40" cy="40" r="5" opacity=".7" />
      <ellipse cx="40" cy="26" rx="6" ry="13" opacity=".5" />
      <ellipse
        cx="40"
        cy="54"
        rx="6"
        ry="13"
        transform="rotate(180 40 54)"
        opacity=".5"
      />
      <ellipse
        cx="26"
        cy="40"
        rx="13"
        ry="6"
        transform="rotate(90 26 40)"
        opacity=".5"
      />
      <ellipse
        cx="54"
        cy="40"
        rx="13"
        ry="6"
        transform="rotate(90 54 40)"
        opacity=".5"
      />
    </g>
  </svg>
);

const IntroScreen = ({ isOpen, setIsOpen }) => {
  /*
    Gate only:
    closed -> initial gate
    gate   -> gate opens
    Hero   -> starts after the gate opens
  */
  const [openingStage, setOpeningStage] = useState("closed");
  const [isMuted, setIsMuted] = useState(false);

  /* -------------------------------------------------------
     3D Mouse Tilt
  ------------------------------------------------------- */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = {
    damping: 25,
    stiffness: 120,
  };

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-100, 100], [8, -8]);
  const rotateY = useTransform(smoothX, [-100, 100], [-8, 8]);

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

  /* -------------------------------------------------------
     OPEN SEQUENCE
     Gate opens here. The curtain animation now lives in Hero.
  ------------------------------------------------------- */
  const handleTap = () => {
    if (openingStage !== "closed") return;

    setOpeningStage("gate");

    // Let the gate finish opening, then hand control to Hero.
    setTimeout(() => {
      setIsOpen(true);
    }, 1450);
  };

  /* -------------------------------------------------------
     Safety cleanup / prevent scroll while intro exists
  ------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');

          .intro-royal {
            font-family: 'Cormorant Garamond', serif;
          }

          .intro-modern {
            font-family: 'Montserrat', sans-serif;
          }

          .intro-script {
            font-family: 'Great Vibes', cursive;
          }

          .curtain-fabric {
            background:
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,.32) 0px,
                rgba(255,255,255,.05) 5px,
                rgba(126,111,82,.08) 10px,
                rgba(255,255,255,.30) 16px
              ),
              linear-gradient(
                90deg,
                #e9e2d2 0%,
                #f8f4e9 18%,
                #ded5c2 45%,
                #f9f5eb 72%,
                #ded5c2 100%
              );
          }

          .olive-fabric {
            background:
              radial-gradient(
                ellipse at center,
                rgba(255,255,255,.08) 0%,
                transparent 55%
              ),
              repeating-linear-gradient(
                110deg,
                rgba(255,255,255,.025) 0px,
                rgba(255,255,255,.025) 2px,
                rgba(0,0,0,.025) 3px,
                rgba(0,0,0,.025) 5px
              ),
              linear-gradient(
                135deg,
                #39442f 0%,
                #566348 48%,
                #3e4934 100%
              );
          }

          .plaque-shadow {
            box-shadow:
              0 25px 50px rgba(20,25,15,.45),
              0 8px 18px rgba(20,25,15,.35),
              inset 0 0 18px rgba(255,255,255,.35);
          }

          .curtain-shadow {
            box-shadow:
              inset -18px 0 35px rgba(75,66,48,.15),
              inset 18px 0 35px rgba(255,255,255,.25),
              0 10px 35px rgba(42,38,28,.18);
          }

          .pearl-row {
            background:
              radial-gradient(
                circle at center,
                #fffdf6 0%,
                #d8cdb8 58%,
                #a99a7b 100%
              );
            box-shadow:
              0 1px 2px rgba(50,45,32,.25);
          }

          .gold-line {
            background:
              linear-gradient(
                90deg,
                transparent,
                #b9a46d,
                #f1e3ba,
                #b9a46d,
                transparent
              );
          }

          @keyframes fabricShimmer {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            25% {
              opacity: .18;
            }
            50% {
              opacity: .08;
            }
            100% {
              transform: translateX(120%);
              opacity: 0;
            }
          }

          .fabric-shimmer {
            animation: fabricShimmer 5s ease-in-out infinite;
          }
        `}
      </style>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] overflow-hidden bg-[#39442F]"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.7,
                delay: 0.1,
              },
            }}
          >
            {/* =====================================================
                BACKGROUND / FINAL INVITATION AREA
            ====================================================== */}
            <div className="absolute inset-0 overflow-hidden bg-[#EEE8DA]">

              {/* Cream inner wall */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#F7F3E8] via-[#EEE7D8] to-[#DDD3BF]" />

              {/* Subtle texture */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      rgba(80,70,50,.35) 0px,
                      rgba(80,70,50,.35) 1px,
                      transparent 1px,
                      transparent 4px
                    )
                  `,
                }}
              />

              {/* Final invitation decorative greenery */}
              <div className="absolute bottom-0 left-0 right-0 h-[28%] opacity-50">
                <div className="absolute left-[4%] bottom-[8%] w-24 h-32 bg-[#687750]/20 rounded-[50%] blur-xl" />
                <div className="absolute right-[4%] bottom-[8%] w-24 h-32 bg-[#687750]/20 rounded-[50%] blur-xl" />
              </div>

              {/* =================================================
                  FINAL INNER DECORATION
              ================================================== */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={
                    false
                      ? {
                          opacity: 1,
                          scale: 1,
                        }
                      : {
                          opacity: 0,
                          scale: 0.96,
                        }
                  }
                  transition={{ duration: 1 }}
                  className="relative w-full h-full"
                >
                  {/* Top draped decoration */}
                  <div className="absolute top-0 left-0 right-0 h-24 opacity-40">
                    <div className="absolute top-0 left-[8%] right-[8%] h-16 rounded-b-[50%] border-b border-[#B5A680]" />
                    <div className="absolute top-0 left-[18%] right-[18%] h-12 rounded-b-[50%] border-b border-[#B5A680]" />
                  </div>

                  {/* Botanical corners */}
                  <BotanicalBranch
                    className="w-44 h-64 left-0 top-12 opacity-50"
                  />

                  <BotanicalBranch
                    className="w-44 h-64 right-0 top-12 opacity-50"
                    flip
                  />

                  <Flower className="w-14 h-14 left-8 bottom-24 opacity-40" />
                  <Flower className="w-14 h-14 right-8 bottom-24 opacity-40" />
                </motion.div>
              </div>
            </div>

            {/* =====================================================
                AMBIENT PARTICLES
            ====================================================== */}
            <div className="absolute inset-0 z-[100] pointer-events-none">
              {dustParticles.map((dust) => (
                <motion.div
                  key={dust.id}
                  initial={{
                    top: dust.top,
                    left: dust.left,
                    opacity: dust.opacity,
                    scale: dust.scale,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    x: dust.x,
                    opacity: [0.05, 0.3, 0.05],
                  }}
                  transition={{
                    duration: dust.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-[2px] h-[2px] rounded-full bg-[#E7EBD9] blur-[1px]"
                />
              ))}
            </div>

            {/* =====================================================
                OLIVE GATE
            ====================================================== */}
            <AnimatePresence>
              {(openingStage === "closed" || openingStage === "gate") && (
                <>
                  {/* LEFT GATE */}
                  <motion.div
                    initial={{ x: 0 }}
                    animate={
                      openingStage === "gate"
                        ? { x: "-100%" }
                        : { x: 0 }
                    }
                    transition={{
                      duration: 1.45,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    className="absolute left-0 top-0 z-[200] w-1/2 h-full olive-fabric overflow-hidden border-r border-[#B7A675]/60 shadow-[20px_0_60px_rgba(20,25,15,.35)]"
                  >
                    {/* Leaves */}
                    <BotanicalBranch className="w-48 h-80 left-[-15px] top-[-10px] opacity-80" />
                    <BotanicalBranch className="w-48 h-80 left-[-30px] bottom-[-10px] opacity-60" />

                    {/* Subtle inner border */}
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#D4C28F] to-transparent opacity-60" />

                    {/* Texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/[0.12]" />

                    {/* Top corner decoration */}
                    <div className="absolute top-6 right-6 w-16 h-16 border-r border-t border-[#D7D9C5]/25 rounded-tr-3xl" />

                    {/* Bottom corner decoration */}
                    <div className="absolute bottom-6 right-6 w-16 h-16 border-r border-b border-[#D7D9C5]/25 rounded-br-3xl" />
                  </motion.div>

                  {/* RIGHT GATE */}
                  <motion.div
                    initial={{ x: 0 }}
                    animate={
                      openingStage === "gate"
                        ? { x: "100%" }
                        : { x: 0 }
                    }
                    transition={{
                      duration: 1.45,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    className="absolute right-0 top-0 z-[200] w-1/2 h-full olive-fabric overflow-hidden border-l border-[#B7A675]/60 shadow-[-20px_0_60px_rgba(20,25,15,.35)]"
                  >
                    <BotanicalBranch
                      className="w-48 h-80 right-[-15px] top-[-10px] opacity-80"
                      flip
                    />

                    <BotanicalBranch
                      className="w-48 h-80 right-[-30px] bottom-[-10px] opacity-60"
                      flip
                    />

                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#D4C28F] to-transparent opacity-60" />

                    <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.04] via-transparent to-black/[0.12]" />

                    <div className="absolute top-6 left-6 w-16 h-16 border-l border-t border-[#D7D9C5]/25 rounded-tl-3xl" />

                    <div className="absolute bottom-6 left-6 w-16 h-16 border-l border-b border-[#D7D9C5]/25 rounded-bl-3xl" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* =====================================================
                CENTRAL ROPE / SEAM
            ====================================================== */}
            {openingStage === "closed" && (
              <motion.div
                animate={{
                  opacity: [0.75, 1, 0.75],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-[230] left-1/2 top-0 -translate-x-1/2 h-full w-[3px] bg-gradient-to-b from-[#8C7950] via-[#E7D8B5] to-[#8C7950] shadow-[0_0_8px_rgba(0,0,0,.4)]"
              />
            )}

            {/* =====================================================
                CENTER ORNAMENTAL TAP CARD
            ====================================================== */}
            <AnimatePresence>
              {openingStage === "closed" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.85,
                    y: 10,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute z-[250] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    style={{
                      rotateX,
                      rotateY,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleTap}
                    whileHover={{
                      scale: 1.035,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="relative cursor-pointer"
                  >
                    {/* Aura */}
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.08, 0.2, 0.08],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-[-20px] rounded-[45%] bg-[#E8DDBE] blur-2xl"
                    />

                    {/* Hanging thread */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-28 w-[2px] h-28 bg-gradient-to-b from-transparent via-[#C4AE79] to-[#9C885B]" />

                    {/* Pearl top */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-[30px] w-7 h-7 rounded-full bg-gradient-to-br from-white via-[#E8DDC5] to-[#A79673] shadow-md border border-[#B7A67C]" />

                    {/* Card */}
                    <div
                      className="
                        relative
                        w-[205px]
                        h-[245px]
                        md:w-[225px]
                        md:h-[265px]
                        bg-gradient-to-br from-[#FBF7EB] via-[#F0E6CF] to-[#DED0B0]
                        rounded-[38%_38%_42%_42%]
                        border-[2px]
                        border-[#B6A271]
                        plaque-shadow
                        flex
                        flex-col
                        items-center
                        justify-center
                        overflow-hidden
                      "
                    >
                      {/* Inner border */}
                      <div className="absolute inset-[8px] rounded-[35%_35%_40%_40%] border border-[#B9A776]/70" />

                      <div className="absolute inset-[14px] rounded-[32%_32%_37%_37%] border border-[#B9A776]/30" />

                      {/* Ornamental corners */}
                      <div className="absolute top-4 left-5 text-[#A38D5E] text-xl">
                        ❦
                      </div>

                      <div className="absolute top-4 right-5 text-[#A38D5E] text-xl transform scale-x-[-1]">
                        ❦
                      </div>

                      <div className="absolute bottom-4 left-5 text-[#A38D5E] text-xl transform rotate-180">
                        ❦
                      </div>

                      <div className="absolute bottom-4 right-5 text-[#A38D5E] text-xl transform rotate-180 scale-x-[-1]">
                        ❦
                      </div>

                      {/* Top botanical mark */}
                      <div className="relative z-10 mb-3 text-[#69764F]">
                        <svg
                          width="38"
                          height="38"
                          viewBox="0 0 38 38"
                          fill="none"
                        >
                          <path
                            d="M19 31V8"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M19 17C14 13 11 9 12 5C17 7 19 11 19 17Z"
                            fill="currentColor"
                            opacity=".7"
                          />
                          <path
                            d="M19 22C24 18 27 14 26 10C21 12 19 16 19 22Z"
                            fill="currentColor"
                            opacity=".7"
                          />
                          <path
                            d="M19 27C14 24 11 21 12 18C16 19 19 22 19 27Z"
                            fill="currentColor"
                            opacity=".7"
                          />
                        </svg>
                      </div>

                      {/* Main text */}
                      <span className="relative z-10 intro-royal text-[#766743] text-[13px] md:text-[14px] tracking-[0.08em]">
                        TAP TO OPEN
                      </span>

                      {/* Divider */}
                      <div className="relative z-10 flex items-center gap-2 mt-3">
                        <div className="w-7 h-[1px] bg-[#B29D6D]" />
                        <span className="text-[#6A7650] text-xs">♥</span>
                        <div className="w-7 h-[1px] bg-[#B29D6D]" />
                      </div>

                      {/* Small text */}
                      <span className="relative z-10 intro-modern text-[7px] tracking-[0.22em] text-[#7D765E] mt-3">
                        A WEDDING INVITATION
                      </span>

                      {/* Shine */}
                      <motion.div
                        animate={{
                          x: ["-160%", "180%"],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "linear",
                        }}
                        className="absolute top-0 left-0 w-[35%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12"
                      />
                    </div>

                    {/* Pearl ornaments */}
                    <div className="absolute left-[22px] top-[45%] w-4 h-4 rounded-full bg-gradient-to-br from-white to-[#B8AA8C] shadow-md" />
                    <div className="absolute right-[22px] top-[45%] w-4 h-4 rounded-full bg-gradient-to-br from-white to-[#B8AA8C] shadow-md" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =====================================================
                SOUND BUTTON
            ====================================================== */}
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => setIsMuted((prev) => !prev)}
              className="absolute top-5 right-5 z-[500] w-11 h-11 rounded-xl bg-[#F5F1E6]/95 backdrop-blur-md border border-[#B5A77F]/40 shadow-[0_8px_25px_rgba(20,25,15,.18)] flex items-center justify-center text-[#536044]"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </motion.button>

            {/* =====================================================
                SMALL BOTTOM CENTER BRAND
            ====================================================== */}
            <AnimatePresence>
              {openingStage === "closed" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.55, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[450] intro-modern text-[7px] tracking-[0.35em] text-[#E4E5D6]"
                >
                  TAP THE INVITATION
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntroScreen;
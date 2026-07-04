import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = ({ isOpen }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000,
  );

  // Audio Ref
  const audioRef = useRef(null);

  // Scratch Card States & Refs
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const scratchCounter = useRef(0);

  // Window Resize Logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Audio Play Logic
  useEffect(() => {
    if (isOpen && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented. User interaction needed.");
        });
      }
    }
  }, [isOpen]);

  // 2. Mute/Unmute Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Canvas Initialization (Gold Foil Effect)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Metallic Gold Gradient for Scratch Layer
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#C59B27"); // Deep Gold
    gradient.addColorStop(0.3, "#FDF2A6"); // Bright Gold/Yellow
    gradient.addColorStop(0.5, "#D4AF37"); // Classic Gold
    gradient.addColorStop(0.8, "#FDF2A6"); // Bright Gold
    gradient.addColorStop(1, "#9E7B15"); // Dark Gold

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text on top of the foil
    ctx.font = 'italic 20px "Cormorant Garamond", serif';
    ctx.fillStyle = "#3A1115"; // Very dark maroon for contrast
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "✦ Scratch gently to reveal ✦",
      canvas.width / 2,
      canvas.height / 2,
    );
  }, []);

  const checkClearPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++;
    }

    const totalPixels = pixels.length / 4;
    const percentage = (transparentPixels / totalPixels) * 100;

    // Reveal at 55% to make it feel smoother
    if (percentage > 15) {
      setIsCleared(true);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (isCleared) return;
    setIsDrawing(true);
    scratch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const scratch = (e) => {
    if (!isDrawing || isCleared) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2); // Thoda bada brush size
    ctx.fill();

    scratchCounter.current += 1;
    if (scratchCounter.current % 8 === 0) {
      checkClearPercentage();
    }
  };

  const particles = Array.from({ length: 30 });
  const boomParticles = Array.from({ length: 180 });

  return (
    <>
      {/* Premium Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');
          .font-royal { font-family: 'Cormorant Garamond', serif; }
          .font-script { font-family: 'Great Vibes', cursive; }
          .font-modern { font-family: 'Montserrat', sans-serif; }
        `}
      </style>

      <div className="relative w-full text-[#f4ecd8] bg-gradient-to-b from-[#0a0304] via-[#1a080c] to-[#0a0304] min-h-screen overflow-hidden">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="/music/wedding-song.mp3"
          loop
          preload="auto"
        />

        {/* GLOBAL EFFECTS: Floating Particles */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {isOpen &&
            particles.map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{
                  x: Math.random() * windowWidth,
                  y:
                    typeof window !== "undefined"
                      ? window.innerHeight + 20
                      : 1000,
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: -100,
                  x: `calc(${Math.random() * windowWidth}px + ${Math.random() * 100 - 50}px)`,
                  opacity: [0, Math.random() * 0.6 + 0.2, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 12 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
                className="absolute text-[#D4AF37]/30 text-sm md:text-base select-none"
              >
                {i % 3 === 0 ? "✧" : "❀"}
              </motion.div>
            ))}
        </div>

        {/* AUDIO BUTTON */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isOpen ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.5 }}
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 w-10 h-10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center bg-[#2a0c14]/80 backdrop-blur-md hover:bg-[#4a111a] hover:border-[#D4AF37]/80 transition-all duration-300 z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <svg className="w-4 h-4 fill-[#D4AF37]" viewBox="0 0 24 24">
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
        </motion.button>

        {/* SECTION 1: HERO */}
        <section className="relative w-full h-screen mx-auto flex flex-col items-center justify-between px-6 py-12 z-10">
          {/* Top Decorative Corners */}
          <div className="w-full relative z-10 flex justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={isOpen ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 1, duration: 1 }}
              className="w-20 h-20 border-t-[1px] border-l-[1px] border-[#D4AF37]/40 rounded-tl-[60px]"
            />
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={isOpen ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 1, duration: 1 }}
              className="w-20 h-20 border-t-[1px] border-r-[1px] border-[#D4AF37]/40 rounded-tr-[60px]"
            />
          </div>

          {/* Main Title Area */}
          <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="font-modern text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#D4AF37] mb-8 font-light"
            >
              We're getting married
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isOpen ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="text-6xl md:text-8xl font-royal text-[#D4AF37] uppercase tracking-[0.1em] font-light drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                Soyal
              </h1>

              <div className="flex items-center justify-center w-full my-4">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/60 w-16"></div>
                <span className="font-script text-5xl md:text-6xl text-[#D4AF37] mx-6 -mt-2">
                  &
                </span>
                <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/60 w-16"></div>
              </div>

              <h1 className="text-6xl md:text-8xl font-royal text-[#D4AF37] uppercase tracking-[0.1em] font-light drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                Zeenat
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="font-royal text-sm md:text-lg text-[#D4AF37]/80 tracking-[0.15em] italic text-center mt-12 max-w-sm"
            >
              Request the honour of your presence to celebrate our new beginning
            </motion.p>
          </div>

          {/* Bottom Decorative Corners & Scroll Indicator */}
          <div className="w-full relative flex justify-between items-end h-24 z-10">
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={isOpen ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="w-20 h-20 border-b-[1px] border-l-[1px] border-[#D4AF37]/40 rounded-bl-[60px]"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={isOpen ? { opacity: 1 } : {}}
              transition={{ delay: 2.2, duration: 1 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() =>
                window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              <span className="font-modern text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] mb-3 group-hover:text-white transition-colors">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-[#D4AF37] rotate-45 mb-4 group-hover:border-white transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={isOpen ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="w-20 h-20 border-b-[1px] border-r-[1px] border-[#D4AF37]/40 rounded-br-[60px]"
            />
          </div>
        </section>

        {/* SECTION 2: MESSAGE & SCRATCH REVEAL */}
        <section className="relative w-full min-h-screen mx-auto flex flex-col items-center justify-center px-6 py-20 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1c080d] via-[#0a0304] to-[#0a0304]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-lg flex flex-col items-center mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#D4AF37]/40"></div>
              <span className="text-[#D4AF37] text-xl">✧</span>
              <div className="h-[1px] w-12 bg-[#D4AF37]/40"></div>
            </div>

            <p className="text-center text-lg md:text-2xl font-royal text-[#D4AF37]/90 leading-relaxed italic px-4">
              "With hearts full of love and joy, we warmly invite you to share
              in the celebration of our union. Your presence would mean the
              world to us as we begin this beautiful journey together."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 w-full"
          >
            <h2 className="text-5xl font-script text-[#D4AF37] mb-4">
              Reveal the Date
            </h2>
          </motion.div>

          {/* Interactive Scratch Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative w-full max-w-sm aspect-[1.6/1] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-[#D4AF37]/30 select-none bg-gradient-to-br from-[#2a0c14] to-[#120407] flex items-center justify-center overflow-hidden"
          >
            {/* The Hidden Content (Revealed Date) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
              <div className="absolute inset-[4px] border border-[#D4AF37]/20 rounded-lg pointer-events-none"></div>

              <p className="font-modern text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]/80 mb-3">
                Save the Date
              </p>

              <h3 className="text-4xl md:text-5xl font-royal text-transparent bg-clip-text bg-gradient-to-r from-[#FDF2A6] via-[#D4AF37] to-[#FDF2A6] font-semibold mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                26<sup className="text-xl md:text-2xl lowercase">th</sup>{" "}
                October
              </h3>

              <p className="font-royal text-xl text-[#D4AF37]/90 italic mt-1">
                2026
              </p>
            </div>

            {/* Celebration Boom */}
            <AnimatePresence>
              {isCleared && (
                <motion.div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
                  {boomParticles.map((_, i) => {
                    const colors = [
                      "#FFD700",
                      "#FDF2A6",
                      "#FFFFFF",
                      "#FF69B4",
                      "#6EC6FF",
                      "#7CFFB2",
                      "#FFA500",
                    ];

                    return (
                      <motion.div
                        key={i}
                        initial={{
                          x: Math.random() * window.innerWidth,
                          y: -80,
                          opacity: 1,
                          rotate: Math.random() * 360,
                        }}
                        animate={{
                          y: window.innerHeight + 150,
                          x:
                            Math.random() * window.innerWidth +
                            (Math.random() * 100 - 50),
                          rotate: Math.random() * 1080,
                          opacity: [1, 1, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          ease: "linear",
                          delay: Math.random() * 0.4,
                        }}
                        className="absolute rounded-sm"
                        style={{
                          width: `${3 + Math.random() * 3}px`,
                          height: `${12 + Math.random() * 10}px`,
                          background:
                            colors[Math.floor(Math.random() * colors.length)],
                        }}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Canvas for Scratch Layer */}
            <motion.canvas
              ref={canvasRef}
              animate={{ opacity: isCleared ? 0 : 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute inset-0 w-full h-full z-20 ${
                isCleared ? "pointer-events-none" : "cursor-crosshair"
              }`}
              style={{ touchAction: "none" }}
              onMouseDown={startDrawing}
              onMouseMove={scratch}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={scratch}
              onTouchEnd={stopDrawing}
            />
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Hero;

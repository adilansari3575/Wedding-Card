import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { weddingData } from "../data/weddingData";

const Hero = ({ isOpen }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);

  const audioRef = useRef(null);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const scratchCounter = useRef(0);

  const [ambientParticles] = useState(() => {
    const width =
      typeof window !== "undefined"
        ? window.innerWidth
        : 1000;

    const height =
      typeof window !== "undefined"
        ? window.innerHeight
        : 800;

    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      xInitial: Math.random() * width,
      yInitial: height + 20,
      scale: Math.random() * 0.5 + 0.5,
      xAnimate: Math.random() * width,
      xOffset: Math.random() * 100 - 50,
      opacityAnimate: Math.random() * 0.6 + 0.2,
      rotate: Math.random() * 360,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
    }));
  });

  const [confettiParticles, setConfettiParticles] =
    useState([]);

  // 1. Audio Play Logic
  useEffect(() => {
    if (isOpen && audioRef.current) {
      const playPromise =
        audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log(
            "Autoplay prevented. User interaction needed."
          );
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

  // Canvas Initialization
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Olive Gold Gradient for Scratch Layer
    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

    gradient.addColorStop(
      0,
      "#687750"
    );

    gradient.addColorStop(
      0.3,
      "#AAB59A"
    );

    gradient.addColorStop(
      0.5,
      "#7D896D"
    );

    gradient.addColorStop(
      0.8,
      "#AAB59A"
    );

    gradient.addColorStop(
      1,
      "#566346"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Text on top of the foil
    ctx.font =
      'italic 20px "Cormorant Garamond", serif';

    ctx.fillStyle = "#3F4A32";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
      "✦ Scratch gently to reveal ✦",
      canvas.width / 2,
      canvas.height / 2
    );
  }, []);

  const checkClearPercentage = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    const imageData =
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

    const pixels =
      imageData.data;

    let transparentPixels = 0;

    for (
      let i = 3;
      i < pixels.length;
      i += 4
    ) {
      if (pixels[i] < 128)
        transparentPixels++;
    }

    const totalPixels =
      pixels.length / 4;

    const percentage =
      (transparentPixels /
        totalPixels) *
      100;

    if (percentage > 15) {
      const colors = [
        "#7D896D",
        "#F5F1E6",
        "#FFFFFF",
        "#8B946B",
        "#A8B08A",
        "#AAB59A",
        "#687750",
      ];

      const generated =
        Array.from({ length: 180 }).map(
          (_, i) => {
            const width =
              3 + Math.random() * 3;

            const height =
              12 + Math.random() * 10;

            const color =
              colors[
                Math.floor(
                  Math.random() *
                    colors.length
                )
              ];

            return {
              id: i,
              xInitial:
                Math.random() *
                window.innerWidth,
              rotateInitial:
                Math.random() * 360,
              xAnimate:
                Math.random() *
                  window.innerWidth +
                (Math.random() *
                  100 -
                  50),
              rotateAnimate:
                Math.random() * 1080,
              duration:
                3 + Math.random() * 2,
              delay:
                Math.random() * 0.4,
              width,
              height,
              color,
            };
          }
        );

      setConfettiParticles(
        generated
      );

      setIsCleared(true);
    }
  };

  const getCoordinates = (e) => {
    const canvas =
      canvasRef.current;

    const rect =
      canvas.getBoundingClientRect();

    const clientX = e.touches
      ? e.touches[0].clientX
      : e.clientX;

    const clientY = e.touches
      ? e.touches[0].clientY
      : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
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
    if (
      !isDrawing ||
      isCleared
    )
      return;

    e.preventDefault();

    const canvas =
      canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    const { x, y } =
      getCoordinates(e);

    ctx.globalCompositeOperation =
      "destination-out";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      35,
      0,
      Math.PI * 2
    );

    ctx.fill();

    scratchCounter.current += 1;

    if (
      scratchCounter.current %
        8 ===
      0
    ) {
      checkClearPercentage();
    }
  };

  // The Hero starts with the curtain closed. It opens here after the gate has
  // handed control from IntroScreen to Hero.
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setCurtainOpen(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      {/* Premium Fonts Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');

          .font-royal {
            font-family: 'Cormorant Garamond', serif;
          }

          .font-script {
            font-family: 'Great Vibes', cursive;
          }

          .font-modern {
            font-family: 'Montserrat', sans-serif;
          }
        `}
      </style>

      <div className="relative w-full text-[#F5F1E6] bg-gradient-to-b from-[#273020] via-[#3F4A32] to-[#273020] min-h-screen overflow-hidden">

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
            ambientParticles.map((p) => (
              <motion.div
                key={`particle-${p.id}`}
                initial={{
                  x: p.xInitial,
                  y: p.yInitial,
                  opacity: 0,
                  scale: p.scale,
                }}
                animate={{
                  y: -100,
                  x: `calc(${p.xAnimate}px + ${p.xOffset}px)`,
                  opacity: [
                    0,
                    p.opacityAnimate,
                    0,
                  ],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: p.delay,
                }}
                className="absolute text-[#7D896D]/30 text-sm md:text-base select-none"
              >
                {p.id % 3 === 0
                  ? "✧"
                  : "❀"}
              </motion.div>
            ))}

        </div>

        {/* AUDIO BUTTON */}
        <motion.button
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={
            isOpen
              ? {
                  opacity: 1,
                  scale: 1,
                }
              : {}
          }
          transition={{
            delay: 1.5,
          }}
          onClick={() =>
            setIsMuted(!isMuted)
          }
          className="fixed top-6 right-6 w-10 h-10 border border-[#7D896D]/30 rounded-full flex items-center justify-center bg-[#3F4A32]/80 backdrop-blur-md hover:bg-[#55643E] hover:border-[#7D896D]/80 transition-all duration-300 z-50 shadow-[0_0_15px_rgba(0,0,0,0.35)]"
        >
          <svg
            className="w-4 h-4 fill-[#7D896D]"
            viewBox="0 0 24 24"
          >
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            )}
          </svg>
        </motion.button>

        {/* =====================================================
            SECTION 1: CURTAIN + WEDDING NAMES
            Gate is handled by IntroScreen. This Hero section
            starts with the premium cream curtain and opens it
            to reveal the wedding names.
        ===================================================== */}
        <section className="relative w-full min-h-screen mx-auto overflow-hidden bg-[#EEE8DA]">

          {/* Final invitation background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4E9] via-[#EEE7D8] to-[#DED3C0]" />

          {/* Soft fabric texture */}
          <div
            className="absolute inset-0 opacity-[0.13] pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(90,78,56,.28) 0px,
                  rgba(90,78,56,.28) 1px,
                  transparent 1px,
                  transparent 4px
                )
              `,
            }}
          />

          {/* =================================================
              NAMES BEHIND CURTAIN
          ================================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={curtainOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center"
          >
            <div className="relative flex flex-col items-center">

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={curtainOpen ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="flex items-center gap-5 mb-7"
              >
                <div className="h-px w-16 md:w-24 bg-[#687750]/35" />
                <span className="text-[#687750] text-xl">♥</span>
                <div className="h-px w-16 md:w-24 bg-[#687750]/35" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={curtainOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="font-modern text-[10px] md:text-xs tracking-[0.42em] uppercase text-[#687750] mb-5"
              >
                We're getting married
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 45, scale: 0.88 }}
                animate={curtainOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 45, scale: 0.88 }}
                transition={{ duration: 1.05, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="font-royal text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light uppercase tracking-[0.08em] text-[#4F5D42]"
              >
                {weddingData.groom}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={curtainOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex items-center justify-center gap-5 my-2"
              >
                <div className="h-px w-14 md:w-20 bg-[#687750]/35" />
                <span className="font-script text-5xl md:text-6xl text-[#687750] -mt-2">&</span>
                <div className="h-px w-14 md:w-20 bg-[#687750]/35" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 45, scale: 0.88 }}
                animate={curtainOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 45, scale: 0.88 }}
                transition={{ duration: 1.05, delay: 1.48, ease: [0.22, 1, 0.36, 1] }}
                className="font-royal text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light uppercase tracking-[0.08em] text-[#4F5D42]"
              >
                {weddingData.bride}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={curtainOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.9, delay: 1.9 }}
                className="font-royal text-base md:text-lg text-[#687750]/85 tracking-[0.12em] italic mt-6 max-w-lg"
              >
                Request the honour of your presence to celebrate our new beginning
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={curtainOpen ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.8, delay: 2.1 }}
                className="flex items-center gap-5 mt-8"
              >
                <div className="h-px w-16 md:w-24 bg-[#687750]/30" />
                <span className="text-[#687750] text-lg">♥</span>
                <div className="h-px w-16 md:w-24 bg-[#687750]/30" />
              </motion.div>
            </div>
          </motion.div>

          {/* =================================================
              CURTAIN OVERLAY
              IMPORTANT: keep mounted so the opening animation
              can actually be seen.
          ================================================== */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
          >
                {/* LEFT DRAPED CURTAIN */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: curtainOpen ? "-94%" : "0%" }}
                  transition={{ duration: 2.35, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute left-0 top-0 h-full w-[56%] overflow-hidden"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 91% 7%, 80% 18%, 70% 30%, 63% 41%, 60% 50%, 63% 60%, 70% 71%, 80% 83%, 91% 95%, 100% 100%, 0 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d8ceba] via-[#faf6eb] to-[#d2c7b1]" />
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0px, rgba(255,255,255,.12) 7px, rgba(124,108,78,.09) 13px, rgba(255,255,255,.35) 21px, rgba(255,255,255,.05) 28px)`,
                    }}
                  />

                  {/* Top folds */}
                  <div className="absolute top-0 left-0 right-0 h-28">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute top-0 h-36 w-[18px] rounded-b-full bg-gradient-to-r from-[#c6baa2] via-[#fffaf0] to-[#c7bba5] opacity-70"
                        style={{ left: `${i * 7.5}%` }}
                      />
                    ))}
                  </div>

                  {/* Pearl edge */}
                  <div className="absolute right-0 top-0 h-full w-[14px] flex flex-col items-center justify-between py-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span key={i} className="w-[7px] h-[7px] rounded-full bg-gradient-to-br from-white via-[#e9dfc9] to-[#a79570] shadow-[0_1px_2px_rgba(60,50,35,.25)]" />
                    ))}
                  </div>

                  {/* Tie-back */}
                  <div className="absolute right-[7%] top-[45%] flex flex-col items-center">
                    <div className="absolute top-[-55px] w-[2px] h-[65px] bg-gradient-to-b from-[#aa9363] to-[#e6d7b6]" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white via-[#ddd1b8] to-[#a18d68] border border-[#aa956d] shadow-md" />
                    <div className="w-[2px] h-3 bg-[#9b8459]" />
                    <div className="w-7 h-9 rounded-b-full bg-gradient-to-b from-[#d9c9a7] to-[#9d895f] shadow-md" />
                    <div className="absolute top-[31px] flex gap-[2px]">
                      <span className="w-[1px] h-7 bg-[#8f7952]" />
                      <span className="w-[1px] h-8 bg-[#b39b6d]" />
                      <span className="w-[1px] h-7 bg-[#8f7952]" />
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT DRAPED CURTAIN */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: curtainOpen ? "94%" : "0%" }}
                  transition={{ duration: 2.35, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute right-0 top-0 h-full w-[56%] overflow-hidden"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 9% 95%, 20% 83%, 30% 71%, 37% 60%, 40% 50%, 37% 41%, 30% 30%, 20% 18%, 9% 7%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-[#d8ceba] via-[#faf6eb] to-[#d2c7b1]" />
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0px, rgba(255,255,255,.12) 7px, rgba(124,108,78,.09) 13px, rgba(255,255,255,.35) 21px, rgba(255,255,255,.05) 28px)`,
                    }}
                  />

                  <div className="absolute top-0 left-0 right-0 h-28">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute top-0 h-36 w-[18px] rounded-b-full bg-gradient-to-r from-[#c6baa2] via-[#fffaf0] to-[#c7bba5] opacity-70"
                        style={{ right: `${i * 7.5}%` }}
                      />
                    ))}
                  </div>

                  <div className="absolute left-0 top-0 h-full w-[14px] flex flex-col items-center justify-between py-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <span key={i} className="w-[7px] h-[7px] rounded-full bg-gradient-to-br from-white via-[#e9dfc9] to-[#a79570] shadow-[0_1px_2px_rgba(60,50,35,.25)]" />
                    ))}
                  </div>

                  <div className="absolute left-[7%] top-[45%] flex flex-col items-center">
                    <div className="absolute top-[-55px] w-[2px] h-[65px] bg-gradient-to-b from-[#aa9363] to-[#e6d7b6]" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white via-[#ddd1b8] to-[#a18d68] border border-[#aa956d] shadow-md" />
                    <div className="w-[2px] h-3 bg-[#9b8459]" />
                    <div className="w-7 h-9 rounded-b-full bg-gradient-to-b from-[#d9c9a7] to-[#9d895f] shadow-md" />
                    <div className="absolute top-[31px] flex gap-[2px]">
                      <span className="w-[1px] h-7 bg-[#8f7952]" />
                      <span className="w-[1px] h-8 bg-[#b39b6d]" />
                      <span className="w-[1px] h-7 bg-[#8f7952]" />
                    </div>
                  </div>
                </motion.div>

                {/* Top pearl swag */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1.9 }}
                  className="absolute top-0 left-0 right-0 z-10 h-32 pointer-events-none"
                >
                  <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full">
                    <path
                      d="M0 0 C100 75 180 75 270 25 C350 -5 420 15 500 75 C580 15 650 -5 730 25 C820 75 900 75 1000 0 L1000 0 L0 0 Z"
                      fill="#F7F1E4"
                    />
                    <path
                      d="M0 6 C100 81 180 81 270 31 C350 1 420 21 500 81 C580 21 650 1 730 31 C820 81 900 81 1000 6"
                      fill="none"
                      stroke="#c2ae82"
                      strokeWidth="3"
                      opacity=".7"
                    />
                  </svg>

                  <div className="absolute top-[58px] left-1/2 -translate-x-1/2 w-[52%] flex justify-between">
                    {Array.from({ length: 34 }).map((_, i) => (
                      <span key={i} className="w-[6px] h-[6px] rounded-full bg-gradient-to-br from-white via-[#e9dfc9] to-[#a79570] shadow-sm" />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

          {/* Decorative bottom greenery */}
          <div className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none opacity-50">
            <div className="absolute left-[-20px] bottom-0 w-36 h-36 rounded-full bg-[#687750]/15 blur-2xl" />
            <div className="absolute right-[-20px] bottom-0 w-36 h-36 rounded-full bg-[#687750]/15 blur-2xl" />
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={curtainOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
          >
            <span className="font-modern text-[9px] tracking-[0.35em] uppercase text-[#687750]/70 mb-3">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-3 h-3 border-b border-r border-[#687750] rotate-45"
            />
          </motion.div>
        </section>

        {/* SECTION 2: MESSAGE & SCRATCH REVEAL */}
<section className="relative w-full mx-auto z-10 overflow-hidden">

  {/* MESSAGE SECTION */}
  <div className="relative w-full min-h-[520px] flex flex-col items-center justify-center px-6 py-20 bg-[#EEE5D3]">

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-md flex flex-col items-center"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="h-[1px] w-16 bg-[#687750]/50" />

        <span className="text-[#687750] text-xl">
          ♥
        </span>

        <div className="h-[1px] w-16 bg-[#687750]/50" />
      </div>

      <p className="text-center text-xl md:text-2xl font-royal text-[#4F5D42] leading-[1.9] italic px-3">
        We are honored to welcome you to the
        <br />
        Wedding ceremony of Sohel & Anjum
        <br />
        As they begin their journey together in
        <br />
        faith and love,
        <br />
        we thank you for being part of this
        <br />
        blessed occasion ♥
      </p>

      <div className="flex items-center gap-4 mt-10">
        <div className="h-[1px] w-16 bg-[#687750]/50" />

        <span className="text-[#687750] text-xl">
          ♥
        </span>

        <div className="h-[1px] w-16 bg-[#687750]/50" />
      </div>
    </motion.div>
  </div>


  {/* SCRATCH SECTION */}
  <div className="relative w-full min-h-[650px] flex flex-col items-center justify-center px-6 py-20 bg-[#FAF8F1]">

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-8 w-full"
    >
      <h2 className="text-5xl md:text-6xl font-script text-[#4F5D42] mb-6">
        Scratch to Reveal
      </h2>

      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] w-16 bg-[#687750]/40" />

        <span className="text-[#9BA58A] text-sm">
          ♥
        </span>

        <div className="h-[1px] w-16 bg-[#687750]/40" />
      </div>
    </motion.div>


    {/* HEART SCRATCH AREA */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-[330px] aspect-square flex items-center justify-center"
    >

      {/* Heart Clip Definition */}
      <svg
        width="0"
        height="0"
        className="absolute"
      >
        <defs>
          <clipPath
            id="heartClip"
            clipPathUnits="objectBoundingBox"
          >
            <path
              d="
                M .5 .94
                C .43 .87 .08 .63 .08 .30
                C .08 .13 .22 .05 .36 .05
                C .44 .05 .49 .10 .5 .20
                C .51 .10 .56 .05 .64 .05
                C .78 .05 .92 .13 .92 .30
                C .92 .63 .57 .87 .5 .94
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>


      {/* Hidden Date */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-0"
        style={{
          clipPath: "url(#heartClip)",
        }}
      >
        <p className="font-modern text-[10px] tracking-[0.4em] uppercase text-[#687750] mb-3">
          Save the Date
        </p>

        <h3 className="text-4xl md:text-5xl font-royal text-[#4F5D42] font-semibold">
          29
          <sup className="text-xl md:text-2xl lowercase">
            th
          </sup>{" "}
          October
        </h3>

        <p className="font-royal text-xl text-[#687750] italic mt-2">
          2026
        </p>
      </div>


      {/* Celebration Boom */}
      <AnimatePresence>
        {isCleared && (
          <motion.div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
            {confettiParticles.map((p) => {
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: p.xInitial,
                    y: -80,
                    opacity: 1,
                    rotate: p.rotateInitial,
                  }}
                  animate={{
                    y: window.innerHeight + 150,
                    x: p.xAnimate,
                    rotate: p.rotateAnimate,
                    opacity: [1, 1, 1, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    ease: "linear",
                    delay: p.delay,
                  }}
                  className="absolute rounded-sm"
                  style={{
                    width: `${p.width}px`,
                    height: `${p.height}px`,
                    background: p.color,
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Heart Scratch Layer */}
      <motion.canvas
        ref={canvasRef}
        animate={{
          opacity: isCleared ? 0 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className={`absolute inset-0 w-full h-full z-20 ${
          isCleared
            ? "pointer-events-none"
            : "cursor-crosshair"
        }`}
        style={{
          touchAction: "none",
          clipPath: "url(#heartClip)",
          filter:
            "drop-shadow(0px 18px 22px rgba(63,74,50,0.18))",
        }}
        onMouseDown={startDrawing}
        onMouseMove={scratch}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={scratch}
        onTouchEnd={stopDrawing}
      />
    </motion.div>


    {/* SAVE THE DATE BUTTON */}
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      type="button"
      className="mt-8 px-7 py-3 rounded-full bg-[#4F5D42] text-[#F7F3E8] font-modern text-[12px] font-medium tracking-[0.18em] uppercase flex items-center gap-3 shadow-[0_12px_25px_rgba(63,74,50,0.22)] hover:bg-[#3F4A32] transition-all duration-300"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="2"
        />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="12" y1="14" x2="12" y2="18" />
        <line x1="10" y1="16" x2="14" y2="16" />
      </svg>

      SAVE THE DATE
    </motion.button>

  </div>

</section>

      </div>
    </>
  );
};

export default Hero;
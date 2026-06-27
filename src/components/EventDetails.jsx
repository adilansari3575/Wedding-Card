import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EventDetails = () => {
  // Image Slider Logic
  const images = [
    "./wedding1.png",
    "/wedding2.png",
    "/wedding3.png",
  ];
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Countdown Timer Logic
  const targetDate = new Date("2026-11-25T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Timeline Data
  const timelineEvents = [
    { title: "Haldi Caremony", time: "Oct 25, 2026, 6:30 PM" },
    { title: "Wedding Ceremony", time: "Oct 26, 2026, 5:00 PM" },
    {
      title: "Dinner Reception  {Dawat-E-Walima}",
      time: "Oct 27, 2026, 7:00 PM",
    },
  ];

  const preWeddingEvents = [
    {
      title: "Haldi",
      time: "Oct 25, 2026, 10:00 AM",
      location: "at Groom's Home",
    },
    {
      title: "Sangeet",
      time: "Oct 25, 2026, 7:00 PM",
      location: "at Home ",
    },
  ];

  return (
    <section className="relative w-full flex flex-col items-center py-16 px-6 z-10">
      {/* 1. Photo Slider */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] mb-20 border border-wedding-gold/20"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImg}
            src={images[currentImg]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Wedding Moments"
          />
        </AnimatePresence>
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentImg === idx ? "w-6 bg-wedding-gold" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </motion.div>

      {/* 2. Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center mb-24"
      >
        <h2
          className="text-4xl text-wedding-gold mb-6"
          style={{ fontFamily: "'Great Vibes', cursive, serif" }}
        >
          Counting Down to Forever
        </h2>
        <div className="flex items-center justify-center w-full opacity-60 mb-10">
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
          <span className="mx-4 text-wedding-gold text-xs">♥</span>
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
        </div>
        <div className="flex justify-center gap-3 md:gap-5 w-full max-w-md">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINUTES", value: timeLeft.minutes },
            { label: "SECONDS", value: timeLeft.seconds },
          ].map((block, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-20 md:w-20 md:h-24 rounded-xl bg-[#1a090c] border border-wedding-gold/20 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] shadow-lg mb-4">
                <span className="text-3xl md:text-4xl font-heading text-wedding-light">
                  {block.value < 10 ? `0${block.value}` : block.value}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-wedding-gold/80 font-body">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. Program Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center mb-24"
      >
        <div className="mb-4 text-wedding-gold opacity-80">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h2
          className="text-4xl text-wedding-gold mb-6"
          style={{ fontFamily: "'Great Vibes', cursive, serif" }}
        >
          Program Timeline
        </h2>
        <div className="flex items-center justify-center w-full opacity-60 mb-12">
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
          <span className="mx-4 text-wedding-gold text-xs">♥</span>
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
        </div>
        <div className="w-full max-w-md flex flex-col items-start px-6 relative mt-4">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative pl-8 pb-12 last:pb-4 w-full group"
            >
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-[5.5px] top-4 w-[1px] h-full bg-wedding-gold/20 group-hover:bg-wedding-gold/50 transition-colors duration-500"></div>
              )}
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-wedding-gold shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:scale-125 transition-transform duration-300"></div>
              <h3 className="text-xl font-heading text-wedding-gold mb-1">
                {event.title}
              </h3>
              <p className="text-sm font-body text-wedding-light/80 tracking-wide">
                {event.time}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Pre-Wedding Events */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center mb-24 text-center"
      >
        <div className="mb-4 text-wedding-gold opacity-80">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.8 11.3 2 22l10.7-3.79"></path>
            <path d="M4 3h.01"></path>
            <path d="M22 8h.01"></path>
            <path d="M15 2h.01"></path>
            <path d="M22 20h.01"></path>
            <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
            <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
            <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
            <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
          </svg>
        </div>
        <h2
          className="text-4xl text-wedding-gold mb-6"
          style={{ fontFamily: "'Great Vibes', cursive, serif" }}
        >
          Pre-Wedding Events
        </h2>
        <div className="flex items-center justify-center w-full opacity-60 mb-12">
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
          <span className="mx-4 text-wedding-gold text-xs">♥</span>
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
        </div>
        <div className="flex flex-col gap-10">
          {preWeddingEvents.map((ev, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-2xl font-heading text-wedding-gold mb-2">
                {ev.title}
              </h3>
              <p className="text-sm font-body text-wedding-light/90 tracking-wide font-semibold mb-1">
                {ev.time}
              </p>
              <p className="text-sm font-body text-wedding-light/60">
                {ev.location}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Venue */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center mb-24 text-center"
      >
        <div className="mb-4 text-wedding-gold opacity-80">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <h2
          className="text-4xl text-wedding-gold mb-6"
          style={{ fontFamily: "'Great Vibes', cursive, serif" }}
        >
          Venue
        </h2>
        <div className="flex items-center justify-center w-full opacity-60 mb-10">
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
          <span className="mx-4 text-wedding-gold text-xs">♥</span>
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
        </div>
        <h3 className="text-2xl font-heading text-wedding-light mb-2">
          At Home
        </h3>
        <p className="text-sm font-body text-wedding-light/70 mb-10">
          Bissau, Jhunjhunu - Rajasthan
        </p>
        <div className="w-full max-w-[280px] mb-10 opacity-30">
          <svg
            viewBox="0 0 200 60"
            className="w-full h-full stroke-wedding-gold fill-none stroke-[0.5px]"
          >
            <path d="M80,60 L80,20 Q100,-10 120,20 L120,60" />
            <path d="M95,60 L95,45 Q100,40 105,45 L105,60" />
            <path d="M40,60 L40,30 Q60,10 80,30" />
            <path d="M160,60 L160,30 Q140,10 120,30" />
            <path d="M30,60 L30,25 M35,60 L35,25 M25,25 L40,25 L32.5,15 Z" />
            <path d="M170,60 L170,25 M165,60 L165,25 M160,25 L175,25 L167.5,15 Z" />
            <line x1="20" y1="60" x2="180" y2="60" />
            <line x1="25" y1="62" x2="175" y2="62" />
          </svg>
        </div>
        <a
          href="https://www.google.com/maps/place/Safiya+Mosque/@28.2439304,75.0694299,16.67z/data=!4m15!1m8!3m7!1s0x391367392d4ccd63:0x154b1bbe9368162b!2sBissau,+Rajasthan+331027!3b1!8m2!3d28.2467886!4d75.0755284!16zL20vMGYwanRk!3m5!1s0x39136735fd703533:0xd9a139351d9014c3!8m2!3d28.2415405!4d75.0669354!16s%2Fg%2F11gfdk6884?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-3 bg-gradient-to-r from-[#e6c27a] via-[#d4af37] to-[#aa7c11] text-[#1a090c] font-body text-sm font-semibold rounded hover:scale-105 transition-transform duration-300 shadow-[0_5px_15px_rgba(212,175,55,0.2)]"
        >
          View on Google Maps
        </a>
      </motion.div>

      {/* 9. Gifts */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full flex flex-col items-center mb-24 text-center px-4"
      >
        <div className="mb-4 text-wedding-gold opacity-80">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
        </div>
        <h2
          className="text-4xl text-wedding-gold mb-6"
          style={{ fontFamily: "'Great Vibes', cursive, serif" }}
        >
          Gifts
        </h2>
        <div className="flex items-center justify-center w-full opacity-60 mb-10">
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
          <span className="mx-4 text-wedding-gold text-xs">♥</span>
          <div className="h-[1px] bg-wedding-gold/40 w-16"></div>
        </div>
        <p className="text-sm md:text-base font-body text-wedding-light/80 max-w-[280px] leading-relaxed italic">
          Your love, blessings, and presence are the greatest gifts we could
          ever ask for.
        </p>

        {/* Footer Typography & Wavy Dividers */}
        <div className="mt-24 mb-10 flex flex-col items-center w-full">
          {/* Top Wavy Line */}
          <div className="w-full max-w-[250px] mb-8 opacity-60">
            <svg
              viewBox="0 0 200 20"
              className="w-full h-8 stroke-wedding-gold/50 fill-none stroke-[1px]"
            >
              <path d="M0,10 Q50,0 100,10 T200,10" />
            </svg>
          </div>

          <p
            className="text-4xl text-wedding-gold mb-6"
            style={{ fontFamily: "'Great Vibes', cursive, serif" }}
          >
            We can't wait to celebrate with you!
          </p>
          <p className="font-heading italic text-lg text-wedding-gold/70 mb-8">
            Soyal & Zeenat
          </p>

          {/* Bottom Wavy Line */}
          <div className="w-full max-w-[250px] mb-20 opacity-60">
            <svg
              viewBox="0 0 200 20"
              className="w-full h-8 stroke-wedding-gold/50 fill-none stroke-[1px]"
            >
              <path d="M0,10 Q50,20 100,10 T200,10" />
            </svg>
          </div>

          {/* Brand Credit Footer */}
          <div className="flex flex-col items-center gap-4 border-t border-wedding-gold/10 pt-8 w-full">
            {/* Brand Credit Footer */}
            <div className="flex flex-col items-center gap-4 border-t border-wedding-gold/10 pt-8 w-full">
              <p className="font-heading italic text-sm text-wedding-gold/70">
                Soyal & Zeenat
              </p>

              <p className="text-[10px] font-body text-wedding-light/50 flex flex-wrap items-center justify-center gap-1.5">
                Designed & Developed by {/* Company Link */}
                <a
                  href="https://primecoretechworks.vercel.app/" // Yahan apni company ki website ka link daalein
                  target="_blank"
                  rel="noreferrer"
                  className="text-wedding-gold font-semibold hover:underline"
                >
                  PrimeCore TechWorks
                </a>
                <span className="opacity-50 mx-1">•</span>
                {/* Instagram Link */}
                <a
                  href="https://www.instagram.com/primecore_techworks?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" // Yahan apna Insta ID ka link daalein
                  target="_blank"
                  rel="noreferrer"
                  className="text-wedding-gold cursor-pointer hover:underline flex items-center gap-1"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Connect on Instagram
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EventDetails;

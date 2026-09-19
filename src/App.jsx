import { useState } from "react";
import IntroScreen from "./components/IntroScreen";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative w-full bg-[#F7F3E8] text-[#3F4A32] font-body selection:bg-[#C6A96B]/30 ${
        !isOpen
          ? "h-screen overflow-hidden"
          : "min-h-screen overflow-x-hidden"
      }`}
    >
      {/* Main Scrollable Content */}
      <div
        className={`transition-opacity duration-1000 ${
          isOpen
            ? "opacity-100"
            : "opacity-0 h-screen overflow-hidden"
        }`}
      >
        <Hero isOpen={isOpen} />

        {isOpen && <EventDetails />}
      </div>

      <IntroScreen isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default App;
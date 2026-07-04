import { useState } from "react";
import IntroScreen from "./components/IntroScreen";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails"; // Naya import

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative w-full bg-wedding-dark text-wedding-light font-body selection:bg-wedding-gold/30 ${!isOpen ? "h-screen overflow-hidden" : "min-h-screen overflow-x-hidden"}`}
    >
      {/* Main Scrollable Content */}
      <div
        className={`transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}
      >
        <Hero isOpen={isOpen} />

        {/* Naya component yahan add kiya hai */}
        {isOpen && <EventDetails />}
      </div>

      <IntroScreen isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default App;

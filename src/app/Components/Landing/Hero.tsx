"use client";

import { Playfair_Display, Lora } from "next/font/google";
import { useEffect, useState } from "react";

// Import fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1543248939-4296e1fea89b?auto=format&fit=crop&q=80&w=1174",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1174",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1174",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen pt-24 overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          ></div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end justify-start px-10 pb-20">
        <div className="text-left max-w-4xl">
          <h1
            className={`text-5xl md:text-7xl font-bold text-white mb-2 ${playfair.className}`}
          >
            You Can{" "}
            <span
              className={`text-orange-400 italic drop-shadow-md ${playfair.className}`}
            >
              Read
            </span>
          </h1>
          <h2
            className={`text-5xl md:text-7xl font-bold text-orange-400 mb-4 ${playfair.className}`}
          >
            Anything
          </h2>
          <p
            className={`text-xl text-gray-200 tracking-wide mb-8 ${lora.className}`}
          >
            For Free. For Everyone.
          </p>

          {/* 🌟 Read Now Button */}
          <button
            className={`px-8 py-3 bg-orange-400 text-white font-semibold rounded-full shadow-lg hover:bg-orange-500 transition duration-300 transform hover:scale-105 ${lora.className}`}
          >
            Read Now
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentImage
                ? "bg-orange-400 scale-110"
                : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}

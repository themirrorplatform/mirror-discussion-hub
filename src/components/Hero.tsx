import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Figma assets
import mirrorLogo from "figma:asset/423df436ef7f34d0eab0991e8cec015203a2a8a2.png";
import templeReflection from "figma:asset/c98b00ecf50d3e11fcabdea89fdec89b82201a80.png";
import poolReflection from "figma:asset/b7a74227da296baa89495e889922a231db381c4e.png";

interface HeroProps {
  onOpenComposer: () => void;
}

export function Hero({ onOpenComposer }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: templeReflection, alt: "Temple reflection" },
    { image: poolReflection, alt: "Pool reflection" },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#D6AF36] transition-all duration-200"
        aria-label="Previous background"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-[#D6AF36] transition-all duration-200"
        aria-label="Next background"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-[#D6AF36] w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <img
          src={mirrorLogo}
          alt="The Mirror"
          className="w-32 h-32 mb-8 animate-pulse"
        />
        <h1 className="mb-4 max-w-4xl">
          Welcome to The Mirror Discussions
        </h1>
        <p className="text-xl text-[#BDBDBD] mb-8 max-w-2xl">
          A space for reflection, dialogue, and evolution.
        </p>
        <button
          type="button"
          onClick={onOpenComposer}
          className="px-8 py-4 bg-gradient-to-r from-[#D6AF36] to-[#FFD700] text-black rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-[0_6px_20px_rgba(214,175,54,0.3)]"
        >
          Join the Talk on The Mirror
        </button>
      </div>
    </section>
  );
}

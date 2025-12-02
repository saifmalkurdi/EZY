import { useState, useEffect, useMemo, useCallback } from "react";
import { aiImages } from "../../constants/aiImages";
import dots from "../../assets/illustrations/dots.svg";

export default function AILearningSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aiImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const currentImage = useMemo(() => aiImages[currentSlide], [currentSlide]);

  return (
    <section className="py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Decorative dots - left - Hidden on mobile */}
      <div className="absolute left-[-102px] bottom-8 w-[300px] md:w-[350px] lg:w-[401.88px] h-[38px] md:h-[45px] lg:h-[50.21px] hidden md:block">
        <img src={dots} alt="Decorative Dots" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-5 lg:mb-6">
              <span className="text-[#003D7A]">World's</span>
              <br />
              <span className="text-[#003D7A]"> First AI Based</span>
              <br />
              <span className="text-[#FF914C]">
                Online Learning
                <br />
                Platform
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="p-6 md:p-10 lg:p-12 min-h-[350px] md:min-h-[450px] lg:min-h-[500px] flex items-center justify-center">
              <div className="text-center relative w-full">
                {/* Slide Image */}
                <div className="overflow-hidden">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    loading="lazy"
                    className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px] mx-auto transition-opacity duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
              {aiImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-10 md:w-12 bg-[#FF6B35]"
                      : "w-3 bg-gray-300 hover:bg-[#FF6B35]"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

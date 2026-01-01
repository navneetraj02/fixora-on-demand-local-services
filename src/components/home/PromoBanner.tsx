import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { banners } from '@/data/mockData';

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const goTo = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };
  
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };
  
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            to={banner.link}
            className="relative w-full flex-shrink-0 aspect-[2.5/1] md:aspect-[3/1]"
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-90",
              banner.color
            )} />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
              <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                {banner.title}
              </h2>
              <p className="text-sm md:text-lg text-white/90">
                {banner.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}

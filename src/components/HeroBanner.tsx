'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

type HeroBannerProps = {
  activeTab: 'ALL' | 'WOMEN' | 'MEN';
  setActiveTab: (tab: 'ALL' | 'WOMEN' | 'MEN') => void;
};

const SLIDES = [
  {
    id: 1,
    title: 'BỘ SƯU TẬP MỚI NHẤT',
    subtitle: 'Thời trang thanh lịch & hiện đại cho cả Nam và Nữ',
    imageUrl: 'https://theme.hstatic.net/200001016175/1001381733/14/slider_1.jpg?v=44',
    gender: 'ALL' as const,
    cta: 'Khám phá ngay',
  },
  {
    id: 2,
    title: 'THỜI TRANG NỮ THANH LỊCH',
    subtitle: 'Đầm xòe, váy chữ A, áo kiểu che khuyết điểm tôn dáng',
    imageUrl: 'https://theme.hstatic.net/200001016175/1001381733/14/banner_slide_1_img_1_img.jpg?v=44',
    gender: 'WOMEN' as const,
    cta: 'Xem đồ nữ',
  },
  {
    id: 3,
    title: 'THỜI TRANG NAM HIỆN ĐẠI',
    subtitle: 'Polo co giãn 4 chiều, sơ mi sợi tre chống nhăn và quần âu lịch lãm',
    imageUrl: 'https://theme.hstatic.net/200001016175/1001381733/14/banner_slide_1_img_2_img.jpg?v=44',
    gender: 'MEN' as const,
    cta: 'Xem đồ nam',
  },
];

export default function HeroBanner({ activeTab, setActiveTab }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 group">
      {/* SLIDER WRAPPER */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide, idx) => (
          <div key={slide.id} className="w-full shrink-0 relative min-h-[360px] sm:min-h-[480px] lg:min-h-[580px] flex items-center">
            {/* Background Image */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

            {/* Content overlay */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-white">
              <div className="max-w-xl space-y-4">
                <span className="inline-block bg-[#080808]/80 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-white/20">
                  BU COLLECTION 2026
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-neutral-200 leading-relaxed max-w-md">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('MEN')}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                      activeTab === 'MEN'
                        ? 'bg-white text-black'
                        : 'bg-black/80 hover:bg-black text-white border border-white/30'
                    }`}
                  >
                    <span>Quần áo nam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('WOMEN')}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                      activeTab === 'WOMEN'
                        ? 'bg-[#e5677d] text-white'
                        : 'bg-black/80 hover:bg-[#e5677d] text-white border border-white/30'
                    }`}
                  >
                    <span>Quần áo nữ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

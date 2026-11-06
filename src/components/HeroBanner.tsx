'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, CalendarHeart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type HeroBannerProps = {
  activeTab: 'WOMEN' | 'MEN';
  setActiveTab: (tab: 'WOMEN' | 'MEN') => void;
};

const SLIDES = [
  {
    id: 1,
    tag: 'DỊCH VỤ THỜI TRANG MỚI 2026',
    title: 'CHO THUÊ ĐỒ DỰ TIỆC & BÁN BIGSIZE',
    subtitle: 'Tự tin toả sáng trong mọi dịp quan trọng: Ăn cưới, dạ hội, kỷ yếu, công sở. Hỗ trợ Thuê 3 - 5 ngày tiết kiệm 70% hoặc Mua đứt.',
    primaryImage: '/images/products/women_set_pleated_gray.webp',
    secondaryImage: '/images/products/men_shirt_navy_formal.webp',
    gender: 'WOMEN' as const,
    highlights: ['Cho thuê từ 90k/lượt 3 ngày', 'Giặt hấp thơm tho, hoàn cọc 100%', 'Gói Makeup đi tiệc giảm 15%'],
  },
  {
    id: 2,
    tag: 'BST THỜI TRANG NỮ BIGSIZE',
    title: 'ĐẦM VÁY & SET BỘ TÔN DÁNG',
    subtitle: 'Thiết kế phom chuẩn cho nàng từ 55kg đến 105kg. Chiết eo giấu bụng, chất liệu mềm rủ tự nhiên.',
    primaryImage: '/images/products/women_set_pleated_gray.webp',
    secondaryImage: '/images/products/women_top_croptop_jeans.webp',
    gender: 'WOMEN' as const,
    highlights: ['Thiết kế chiết eo giấu bụng', 'Chất liệu lụa tơ tuyết mềm mát', 'Size L đến 4XL (55-105kg)'],
  },
  {
    id: 3,
    tag: 'BST THỜI TRANG NAM BIGSIZE',
    title: 'SƠ MI & POLO NAM LỊCH LÃM',
    subtitle: 'Polo raglan thể thao, sơ mi modal chống nhăn và quần âu cạp chun ẩn nam tính cho chàng từ 70kg đến 140kg.',
    primaryImage: '/images/products/men_shirt_blue_pattern.webp',
    secondaryImage: '/images/products/men_tshirt_danise_red.webp',
    gender: 'MEN' as const,
    highlights: ['Vải sợi modal & cotton cao cấp', 'Cạp chun ẩn co giãn thông minh', 'Size XL đến 5XL (70-140kg)'],
  },
];

export default function HeroBanner({ activeTab, setActiveTab }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openMakeupModal } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const scrollToOccasion = () => {
    const el = document.getElementById('occasion-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0c] group">
      {/* SLIDER TRACK */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div 
            key={slide.id} 
            className="w-full shrink-0 relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center overflow-hidden"
          >
            {/* 1. NỀN AMBIENT BLUR NGHỆ THUẬT PHÍA SAU */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src={slide.primaryImage}
                alt=""
                className="w-full h-full object-cover object-top filter blur-3xl opacity-15 scale-125"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/90 to-[#0a0a0c]/60" />
            </div>

            {/* 2. KHU VỰC HIỂN THỊ CHÍNH */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
              
              {/* CỘT TRÁI: TIÊU ĐỀ & NỘI DUNG */}
              <div className="lg:col-span-7 space-y-4 text-white text-center lg:text-left">
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-bold uppercase tracking-wider text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5677d]" />
                  <span>{slide.tag}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm lg:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {slide.subtitle}
                </p>

                {/* Highlights bullets */}
                <div className="pt-1 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-neutral-300">
                  {slide.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#e5677d]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-3">
                  <button
                    onClick={scrollToOccasion}
                    className="px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg bg-[#e5677d] hover:bg-[#d4566c] text-white"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Gợi ý theo dịp & Thuê đồ</span>
                  </button>

                  <button
                    onClick={() => openMakeupModal()}
                    className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white text-white hover:text-black border border-white/20"
                  >
                    <CalendarHeart className="w-4 h-4 text-[#e5677d]" />
                    <span>Đặt lịch Make Up</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('WOMEN')}
                    className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'WOMEN'
                        ? 'bg-white text-black'
                        : 'bg-white/5 hover:bg-white/15 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <span>Đồ nữ</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('MEN')}
                    className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'MEN'
                        ? 'bg-white text-black'
                        : 'bg-white/5 hover:bg-white/15 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <span>Đồ nam</span>
                  </button>
                </div>
              </div>

              {/* CỘT PHẢI: ẢNH NGƯỜI MẪU */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end items-center gap-3 sm:gap-4">
                
                {/* Ảnh chính */}
                <div className="relative w-44 sm:w-56 lg:w-60 h-[320px] sm:h-[400px] lg:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900 group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={slide.primaryImage}
                    alt={slide.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

                {/* Ảnh phụ cạnh bên */}
                <div className="hidden sm:block relative w-36 sm:w-44 lg:w-48 h-[270px] sm:h-[340px] lg:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/10 bg-neutral-900 opacity-90 hover:opacity-100 transition-opacity">
                  <img
                    src={slide.secondaryImage}
                    alt={slide.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-md border border-white/10 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-md border border-white/10 z-20"
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
              currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

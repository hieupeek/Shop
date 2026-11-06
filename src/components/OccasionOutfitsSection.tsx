'use client';

import React, { useState, useMemo } from 'react';
import { OCCASIONS, PRODUCTS } from '@/data/mockData';
import { OccasionSlug, Product } from '@/types';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  ShoppingBag,
  PartyPopper,
  Heart,
  Camera,
  Briefcase,
  Coffee
} from 'lucide-react';

export default function OccasionOutfitsSection() {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionSlug>('tiec-tung');
  const { setQuickViewProduct, openMakeupModal } = useCart();

  const currentOccasionData = OCCASIONS.find((o) => o.slug === selectedOccasion) || OCCASIONS[0];

  // Lọc sản phẩm theo dịp
  const occasionProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.occasions?.includes(selectedOccasion));
  }, [selectedOccasion]);

  const getOccasionIcon = (slug: OccasionSlug) => {
    switch (slug) {
      case 'tiec-tung':
        return <PartyPopper className="w-4 h-4" />;
      case 'dam-cuoi':
        return <Heart className="w-4 h-4" />;
      case 'chup-anh':
        return <Camera className="w-4 h-4" />;
      case 'cong-so':
        return <Briefcase className="w-4 h-4" />;
      case 'hen-ho':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="occasion-section" className="py-12 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-[#e5677d] rounded-full text-xs font-black uppercase mb-2 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> GỢI Ý CHỌN ĐỒ THEO DỊP & CHO THUÊ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
              OUTFIT CHUẨN DÁNG CHO TỪNG SỰ KIỆN
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
              Không còn lo lắng mặc gì khi đi tiệc, đi cưới hay chụp ảnh. Chọn dịp bạn tham dự & nhận ngay set đồ bigsize che bụng tôn dáng, hỗ trợ <strong>Thuê 3 - 5 ngày</strong> hoặc <strong>Mua đứt</strong>.
            </p>
          </div>

          {/* Nút đặt Makeup nhanh */}
          <button
            onClick={() => openMakeupModal()}
            className="self-start md:self-auto px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-xl border border-neutral-300 shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:border-black shrink-0"
          >
            <span>💄 Đặt lịch Make Up</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#e5677d]" />
          </button>
        </div>

        {/* OCCASION TABS BAR */}
        <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
          {OCCASIONS.map((occ) => {
            const isSelected = occ.slug === selectedOccasion;
            return (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.slug)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-md scale-102'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <span className={isSelected ? 'text-[#e5677d]' : 'text-neutral-500'}>
                  {getOccasionIcon(occ.slug)}
                </span>
                <span>{occ.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {PRODUCTS.filter(p => p.occasions?.includes(occ.slug)).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* OCCASION HIGHLIGHT BANNER & STYLIST NOTE */}
        <div className="mb-8 p-4 sm:p-6 bg-white rounded-3xl border border-neutral-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e5677d] bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100">
              {currentOccasionData.badge}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 mt-2">
              {currentOccasionData.name}: {currentOccasionData.subtitle}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
              {currentOccasionData.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 font-black text-neutral-900 mb-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cam kết dịch vụ thuê:
              </div>
              <p className="text-[11px] text-neutral-500">Giặt là cao cấp • Hoàn cọc 100% sau 24h</p>
            </div>

            <button
              onClick={() => openMakeupModal()}
              className="w-full sm:w-auto px-4 py-3 bg-[#e5677d] hover:bg-[#d4566c] text-white font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Combo Makeup + Giảm 15%</span>
            </button>
          </div>
        </div>

        {/* PRODUCT GRID FOR CURRENT OCCASION */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {occasionProducts.map((product) => {
            const isRentable = product.isRentable !== false;
            const rentalPrice = product.rentalPrice || Math.round(product.basePrice * 0.28);

            return (
              <div
                key={product.id}
                onClick={() => setQuickViewProduct(product)}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-black/40 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {isRentable && (
                      <span className="bg-[#e5677d] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Thuê: {formatVND(rentalPrice)}/3N
                      </span>
                    )}
                    {product.discountPercent && (
                      <span className="bg-neutral-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        -{product.discountPercent}% Mua
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-neutral-800 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">
                      {product.categoryName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </h4>

                    {/* Stylist snippet */}
                    {product.stylistTip && (
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1 italic">
                        💡 {product.stylistTip}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-black text-black">
                        Mua: {formatVND(product.basePrice)}
                      </div>
                      {isRentable && (
                        <div className="text-[11px] font-extrabold text-[#e5677d]">
                          Thuê: {formatVND(rentalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="px-2.5 py-1.5 bg-neutral-900 hover:bg-[#e5677d] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
                      <span>Chọn</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


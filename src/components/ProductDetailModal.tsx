'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { CartItemType } from '@/types';
import { 
  X, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck,
  Calendar,
  Sparkles,
  Info,
  BadgeCheck
} from 'lucide-react';

export default function ProductDetailModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, openMakeupModal } = useCart();
  const [activeMode, setActiveMode] = useState<CartItemType>('BUY');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Rental state
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [rentalStartDate, setRentalStartDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // mặc định ngày mai nhận đồ
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes[0] || '');
      setQuantity(1);
      // Nếu sản phẩm cho thuê, mặc định nếu không có thì chuyển sang BUY
      setActiveMode('BUY');
      setRentalDays(3);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants.find(
    (v) => v.size === selectedSize && v.colorName.toLowerCase() === selectedColor.toLowerCase()
  ) || quickViewProduct.variants[0];

  const currentImage =
    quickViewProduct.images.find((img) => img.colorName === selectedColor)?.url ||
    quickViewProduct.images[0]?.url;

  // Tính giá thuê
  const isRentable = quickViewProduct.isRentable !== false;
  const baseRentalPrice = quickViewProduct.rentalPrice || Math.round(quickViewProduct.basePrice * 0.28);
  const currentRentalPrice = rentalDays === 5 ? baseRentalPrice + 40000 : baseRentalPrice;
  const currentDeposit = quickViewProduct.rentalDeposit || Math.round(quickViewProduct.basePrice * 0.6);

  // Tính ngày trả dự kiến
  const getCalculatedEndDate = () => {
    if (!rentalStartDate) return '';
    const date = new Date(rentalStartDate);
    date.setDate(date.getDate() + rentalDays);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleAction = () => {
    if (activeMode === 'RENT') {
      addToCart(quickViewProduct, selectedSize, selectedColor, quantity, 'RENT', rentalDays, rentalStartDate);
    } else {
      addToCart(quickViewProduct, selectedSize, selectedColor, quantity, 'BUY');
    }
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* LEFT: IMAGE */}
          <div>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={currentImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {activeMode === 'RENT' && (
                <div className="absolute top-3 left-3 bg-[#e5677d] text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  GÓI CHO THUÊ
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (img.colorName) setSelectedColor(img.colorName);
                  }}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    img.url === currentImage ? 'border-black ring-2 ring-black/20' : 'border-neutral-200 opacity-60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Stylist Tip */}
            {quickViewProduct.stylistTip && (
              <div className="mt-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs">
                <span className="font-black text-neutral-900 flex items-center gap-1.5 text-[11px] uppercase text-[#e5677d] mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Gợi ý phối đồ Big Size:
                </span>
                <p className="text-neutral-600 leading-relaxed italic">
                  &ldquo;{quickViewProduct.stylistTip}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-md">
                    {quickViewProduct.categoryName}
                  </span>
                  {isRentable && (
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Có cho thuê
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-neutral-900 mt-1 leading-snug">
                  {quickViewProduct.name}
                </h2>
                
                <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-600">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-neutral-900">{quickViewProduct.rating}</span>
                  <span>({quickViewProduct.reviewCount} đánh giá)</span>
                </div>
              </div>

              {/* TOGGLE MUA ĐỨT HOẶC THUÊ TRANG PHỤC */}
              {isRentable && (
                <div className="p-1 bg-neutral-100 rounded-2xl flex items-center gap-1">
                  <button
                    onClick={() => setActiveMode('BUY')}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      activeMode === 'BUY'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    🛍️ MUA SẢN PHẨM
                  </button>
                  <button
                    onClick={() => setActiveMode('RENT')}
                    className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      activeMode === 'RENT'
                        ? 'bg-[#e5677d] text-white shadow-sm'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    ✨ THUÊ TRANG PHỤC
                  </button>
                </div>
              )}

              {/* BẢNG GIÁ THEO CHẾ ĐỘ MUA HOẶC THUÊ */}
              {activeMode === 'BUY' ? (
                <div className="flex items-baseline gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-2xl font-black text-black">
                    {formatVND(quickViewProduct.basePrice)}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.basePrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {formatVND(quickViewProduct.originalPrice)}
                    </span>
                  )}
                  {quickViewProduct.discountPercent && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      -{quickViewProduct.discountPercent}%
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-500 block uppercase">Giá thuê ({rentalDays} ngày):</span>
                      <span className="text-2xl font-black text-[#e5677d]">
                        {formatVND(currentRentalPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-neutral-500 block">Cọc giữ đồ (hoàn trả 100%):</span>
                      <span className="text-sm font-black text-neutral-800">
                        {formatVND(currentDeposit)}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-600 bg-white/80 p-2 rounded-xl border border-rose-100 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#e5677d] shrink-0 mt-0.5" />
                    <span>Trang phục được giặt là cao cấp, khử khuẩn thơm tho. Hoàn cọc 100% trong 24h khi shop nhận lại đồ.</span>
                  </div>
                </div>
              )}

              {/* THÔNG TIN TÙY CHỌN KHI THUÊ */}
              {activeMode === 'RENT' && (
                <div className="space-y-3 pt-1 border-t border-neutral-100">
                  {/* Chọn số ngày thuê */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                      Thời gian thuê:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRentalDays(3)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                          rentalDays === 3
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div>Gói 3 Ngày (Chuẩn)</div>
                        <div className={`text-[10px] font-normal ${rentalDays === 3 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {formatVND(baseRentalPrice)}
                        </div>
                      </button>

                      <button
                        onClick={() => setRentalDays(5)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                          rentalDays === 5
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <div>Gói 5 Ngày (+40k)</div>
                        <div className={`text-[10px] font-normal ${rentalDays === 5 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {formatVND(baseRentalPrice + 40000)} (Thoải mái đi xa)
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Chọn ngày nhận đồ */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1 uppercase flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#e5677d]" /> Ngày nhận đồ:
                      </label>
                      <input
                        type="date"
                        value={rentalStartDate}
                        onChange={(e) => setRentalStartDate(e.target.value)}
                        className="w-full text-xs font-bold bg-neutral-50 border border-neutral-300 rounded-xl px-2.5 py-1.5 text-neutral-800 focus:outline-hidden focus:border-black cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1 uppercase">
                        Ngày trả dự kiến:
                      </label>
                      <div className="text-xs font-bold bg-neutral-100 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-neutral-700 flex items-center h-[34px]">
                        {getCalculatedEndDate()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COLOR SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  Màu sắc: <strong className="text-black">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-neutral-400" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZE SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  Kích cỡ: <strong className="text-black">{selectedSize}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-black bg-black text-white shadow-xs'
                          : 'border-neutral-200 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-neutral-700 uppercase">Số lượng:</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-neutral-400">
                  (Còn {currentVariant?.stock || 20} sản phẩm)
                </span>
              </div>
            </div>

            {/* ACTION BUTTON & COMBO MAKEUP */}
            <div className="mt-5 pt-4 border-t border-neutral-200 space-y-2.5">
              
              {/* Nút chính */}
              {activeMode === 'RENT' ? (
                <button
                  onClick={handleAction}
                  className="w-full bg-[#e5677d] hover:bg-[#d4566c] text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>THÊM VÀO GIỎ THUÊ • {formatVND(currentRentalPrice * quantity)}</span>
                </button>
              ) : (
                <button
                  onClick={handleAction}
                  className="w-full bg-[#080808] hover:bg-neutral-800 text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>THÊM VÀO GIỎ MUA • {formatVND(quickViewProduct.basePrice * quantity)}</span>
                </button>
              )}

              {/* Gợi ý đặt kèm Makeup nếu đang thuê đồ đi tiệc */}
              {activeMode === 'RENT' && (
                <button
                  type="button"
                  onClick={() => {
                    setQuickViewProduct(null);
                    openMakeupModal();
                  }}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>💄 Đặt kèm gói Make Up đi tiệc nhận ưu đãi giảm 15%</span>
                  <span className="underline">Xem bảng giá &rarr;</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 text-center pt-1">
                <div className="flex items-center justify-center gap-1 bg-neutral-50 py-1.5 rounded-lg">
                  <Truck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Giao tận nơi đúng hẹn</span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-neutral-50 py-1.5 rounded-lg">
                  <BadgeCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{activeMode === 'RENT' ? 'Giặt hấp sạch thơm 100%' : 'Đổi size trong 7 ngày'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

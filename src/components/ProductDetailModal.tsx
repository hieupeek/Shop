'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { 
  X, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';

export default function ProductDetailModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, setTryOnProduct } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes[0] || '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants.find(
    (v) => v.size === selectedSize && v.colorName.toLowerCase() === selectedColor.toLowerCase()
  ) || quickViewProduct.variants[0];

  const currentImage =
    quickViewProduct.images.find((img) => img.colorName === selectedColor)?.url ||
    quickViewProduct.images[0]?.url;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: IMAGE */}
          <div>
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={currentImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (img.colorName) setSelectedColor(img.colorName);
                  }}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    img.url === currentImage ? 'border-black ring-2 ring-black/20' : 'border-neutral-200 opacity-60'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-md">
                  {quickViewProduct.categoryName}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-neutral-900 mt-1 leading-snug">
                  {quickViewProduct.name}
                </h2>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-neutral-900">{quickViewProduct.rating}</span>
                  <span>({quickViewProduct.reviewCount} đánh giá)</span>
                </div>
              </div>

              {/* PRICE */}
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

              <p className="text-xs text-neutral-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

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
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-neutral-700 uppercase">Số lượng:</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-neutral-400">
                  (Còn {currentVariant?.stock || 20} sản phẩm)
                </span>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="sm:col-span-2 bg-[#080808] hover:bg-neutral-800 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>THÊM VÀO GIỎ</span>
                </button>

                <button
                  onClick={() => {
                    setTryOnProduct(quickViewProduct);
                  }}
                  className="sm:col-span-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs py-3.5 px-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  title="Thử đồ ảo bằng AI qua Webcam hoặc tải ảnh của bạn"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>Thử đồ AI</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 text-center">
                <div className="flex items-center justify-center gap-1 bg-neutral-50 py-1.5 rounded-lg">
                  <Truck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-neutral-50 py-1.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Đổi size trong 7 ngày</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

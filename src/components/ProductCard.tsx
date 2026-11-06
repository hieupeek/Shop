'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { setQuickViewProduct } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L');
  const [isHovered, setIsHovered] = useState(false);

  const colorImage = product.images.find((img) => img.colorName === selectedColor)?.url;
  const hoverImage = product.images[1]?.url || product.images[0]?.url;
  const currentImage = isHovered && product.images.length > 1 ? hoverImage : (colorImage || product.images[0]?.url);

  const isRentable = product.isRentable !== false;
  const rentalPrice = product.rentalPrice || Math.round(product.basePrice * 0.28);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-black/30 hover:shadow-lg transition-all duration-300 flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. IMAGE */}
      <div 
        className="relative aspect-3/4 overflow-hidden bg-neutral-100 cursor-pointer"
        onClick={() => setQuickViewProduct(product)}
      >
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.discountPercent && (
            <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {isRentable && (
            <span className="bg-[#e5677d] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Cho thuê
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-neutral-800 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer hover:scale-110"
          title="Xem chi tiết & Chọn mua / thuê"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* 2. DETAILS */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* COLOR SWATCHES */}
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === color.name
                    ? 'ring-2 ring-black ring-offset-1 scale-110'
                    : 'border-neutral-300 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* TITLE */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-neutral-600 line-clamp-2 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-neutral-800">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>

          {/* SIZES */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-neutral-400 px-1 py-0.5 font-bold">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* 3. PRICE & ADD BUTTON */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="text-sm sm:text-base font-black text-black">
              {formatVND(product.basePrice)}
            </div>
            {isRentable && (
              <div className="text-[11px] font-black text-[#e5677d]">
                Thuê: {formatVND(rentalPrice)}/3N
              </div>
            )}
          </div>

          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Chọn mua hoặc thuê"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chọn</span>
          </button>
        </div>
      </div>
    </div>
  );
}

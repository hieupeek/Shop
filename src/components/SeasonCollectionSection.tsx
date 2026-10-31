'use client';

import React from 'react';
import { Category } from '@/types';
import { ArrowRight, ChevronRight } from 'lucide-react';

type SeasonCollectionProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  activeGenderTab: 'ALL' | 'WOMEN' | 'MEN';
  setActiveGenderTab: (tab: 'ALL' | 'WOMEN' | 'MEN') => void;
};

export default function SeasonCollectionSection({
  categories,
  selectedCategory,
  onSelectCategory,
  activeGenderTab,
  setActiveGenderTab,
}: SeasonCollectionProps) {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER WITH GENDER TABS */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight">
              DANH MỤC SẢN PHẨM NỔI BẬT
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Chọn nhanh danh mục thời trang theo phong cách của bạn
            </p>
          </div>

          {/* Gender Switch Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => { setActiveGenderTab('ALL'); onSelectCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeGenderTab === 'ALL'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => { setActiveGenderTab('WOMEN'); onSelectCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeGenderTab === 'WOMEN'
                  ? 'bg-[#e5677d] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Đồ nữ
            </button>
            <button
              onClick={() => { setActiveGenderTab('MEN'); onSelectCategory('ALL'); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeGenderTab === 'MEN'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Đồ nam
            </button>
          </div>
        </div>

        {/* CIRCULAR / CARD CATEGORY ROW (EXACT LIKE BUBIGSIZE SS_COLLECTION) */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.slug)}
                className={`group flex flex-col items-center text-center p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-black bg-neutral-50 shadow-md ring-2 ring-black/10'
                    : 'border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-lg'
                }`}
              >
                {/* Rounded Image Container like bubigsize.vn */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center p-2 mb-3 border border-neutral-100 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3 className="text-sm font-extrabold text-neutral-900 group-hover:text-[#e5677d] transition-colors">
                  {cat.name}
                </h3>

                {/* Number of products */}
                <span className="text-[11px] text-neutral-400 mt-0.5">
                  {cat.itemCount} sản phẩm
                </span>

                {/* See more arrow circle */}
                <div className={`mt-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-black text-white' 
                    : 'bg-neutral-100 text-neutral-500 group-hover:bg-[#e5677d] group-hover:text-white'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


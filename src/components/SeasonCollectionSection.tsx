'use client';

import React from 'react';
import { Category } from '@/types';
import { CategoryFashionIcon } from '@/components/FashionCategoryIcons';

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

        {/* FASHION ICON CATEGORY CARDS (CHUẨN THEO ẢNH MẪU THAM KHẢO) */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.slug)}
                className={`group flex flex-col justify-between bg-white cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-black ring-2 ring-black shadow-md'
                    : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                }`}
              >
                {/* 1. KHU VỰC ICON & TÊN NGẮN (NỀN TRẮNG VUÔNG VỨC) */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[170px] sm:min-h-[190px]">
                  <div className="text-black transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                    <CategoryFashionIcon slug={cat.slug} className="w-16 h-16 sm:w-20 sm:h-20 text-black" />
                  </div>
                  <span className="mt-4 text-xs sm:text-sm font-medium text-neutral-800 tracking-wide text-center">
                    {cat.shortName || cat.name}
                  </span>
                </div>

                {/* 2. KHU VỰC THÔNG TIN DƯỚI (NỀN XÁM NHẠT VỚI TÊN ĐẦY ĐỦ VÀ SỐ LƯỢNG) */}
                <div className={`py-3 px-3 text-center border-t transition-colors ${
                  isSelected 
                    ? 'bg-neutral-100 border-neutral-300' 
                    : 'bg-[#fbfbfb] border-neutral-100 group-hover:bg-neutral-100'
                }`}>
                  <h4 className="text-[12px] sm:text-[13px] font-bold text-neutral-900 leading-tight">
                    {cat.fullName || cat.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">
                    {cat.itemCount} sản phẩm
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

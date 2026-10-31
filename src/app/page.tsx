'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import PoliciesBar from '@/components/PoliciesBar';
import SeasonCollectionSection from '@/components/SeasonCollectionSection';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import Footer from '@/components/Footer';
import { CATEGORIES, PRODUCTS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag
} from 'lucide-react';

export default function HomePage() {
  const { setIsCartOpen, totalCount } = useCart();
  const [activeGenderTab, setActiveGenderTab] = useState<'ALL' | 'WOMEN' | 'MEN'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEW'>('POPULAR');

  // Filter categories by selected gender
  const filteredCategories = useMemo(() => {
    if (activeGenderTab === 'ALL') return CATEGORIES;
    return CATEGORIES.filter((c) => c.gender === activeGenderTab);
  }, [activeGenderTab]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeGenderTab !== 'ALL') {
      result = result.filter((p) => p.gender === activeGenderTab || p.gender === 'UNISEX');
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedSizeFilter !== 'ALL') {
      result = result.filter((p) => 
        p.sizes.some((s) => s.toLowerCase() === selectedSizeFilter.toLowerCase())
      );
    }

    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'NEW') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [activeGenderTab, selectedCategory, selectedSizeFilter, sortBy]);

  const allAvailableSizes = ['ALL', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER */}
      <Header activeTab={activeGenderTab} setActiveTab={setActiveGenderTab} />

      {/* 2. BACKGROUND ĐẦU (HERO SLIDER BANNER GIỐNG BUBIGSIZE) */}
      <HeroBanner 
        activeTab={activeGenderTab} 
        setActiveTab={setActiveGenderTab} 
      />

      {/* 3. CÁC CAM KẾT (POLICIES BAR CHUẨN BUBIGSIZE) */}
      <PoliciesBar />

      {/* 4. LỰA CHỌN ĐẦM VÁY, ÁO, CHÂN VÁY, QUẦN,... (SEASON COLLECTIONS) */}
      <SeasonCollectionSection
        categories={filteredCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeGenderTab={activeGenderTab}
        setActiveGenderTab={setActiveGenderTab}
      />

      {/* 5. DANH SÁCH SẢN PHẨM & BỘ LỌC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Active category pill */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-neutral-900 uppercase">
                {selectedCategory === 'ALL' ? 'TẤT CẢ SẢN PHẨM' : `DANH MỤC: ${CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
              </span>
              <span className="text-xs text-neutral-400">({filteredProducts.length} sản phẩm)</span>
              
              {selectedCategory !== 'ALL' && (
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="ml-2 text-xs font-bold text-[#e5677d] underline hover:text-black cursor-pointer"
                >
                  Bỏ lọc danh mục
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-black cursor-pointer"
              >
                <option value="POPULAR">Bán chạy nhất</option>
                <option value="NEW">Mới nhất</option>
                <option value="PRICE_ASC">Giá tăng dần</option>
                <option value="PRICE_DESC">Giá giảm dần</option>
              </select>
            </div>

          </div>

          {/* Size Filter */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" />
              Chọn Size:
            </span>
            {allAvailableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSizeFilter(size)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedSizeFilter === size
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {size === 'ALL' ? 'Tất cả' : size}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-neutral-300 p-8">
            <p className="text-sm font-bold text-neutral-700">Không có sản phẩm nào phù hợp với bộ lọc</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedSizeFilter('ALL');
                setActiveGenderTab('ALL');
              }}
              className="mt-3 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Xem lại tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

      {/* 6. REVIEWS */}
      <ReviewSection />

      {/* 7. PHẦN FOOTER CHUẨN BUBIGSIZE */}
      <Footer />

      {/* 8. MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveGenderTab('ALL')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeGenderTab === 'ALL' ? 'text-black' : 'text-neutral-500'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => setActiveGenderTab('MEN')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeGenderTab === 'MEN' ? 'text-black' : 'text-neutral-500'
          }`}
        >
          <span className="text-base">👔</span>
          <span>Đồ nam</span>
        </button>

        <button
          onClick={() => setActiveGenderTab('WOMEN')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeGenderTab === 'WOMEN' ? 'text-black' : 'text-neutral-500'
          }`}
        >
          <span className="text-base">👗</span>
          <span>Đồ nữ</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-bold text-neutral-800"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </div>
          <span>Giỏ hàng</span>
        </button>
      </div>

    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import PoliciesBar from '@/components/PoliciesBar';
import OccasionOutfitsSection from '@/components/OccasionOutfitsSection';
import SeasonCollectionSection from '@/components/SeasonCollectionSection';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import Footer from '@/components/Footer';
import { CATEGORIES, PRODUCTS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag,
  Sparkles,
  CalendarHeart
} from 'lucide-react';

export default function HomePage() {
  const { setIsCartOpen, totalCount, openMakeupModal } = useCart();
  const [activeGenderTab, setActiveGenderTab] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const [selectedCategory, setSelectedCategory] = useState<string>('dam-vay');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEW'>('POPULAR');

  // Cập nhật selectedCategory tương ứng khi chuyển đổi Nam / Nữ
  const handleGenderTabChange = (newTab: 'WOMEN' | 'MEN') => {
    setActiveGenderTab(newTab);
    if (newTab === 'WOMEN') {
      setSelectedCategory('dam-vay');
    } else {
      setSelectedCategory('ao-polo-nam');
    }
    setSelectedSizeFilter('ALL');
  };

  // Filter categories by selected gender & calculate count
  const filteredCategories = useMemo(() => {
    const list = CATEGORIES.filter((c) => c.gender === activeGenderTab);
    return list.map((c) => ({
      ...c,
      itemCount: PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
    }));
  }, [activeGenderTab]);

  // Filter and sort products by category, gender & size
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => p.gender === activeGenderTab || p.gender === 'UNISEX');

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedSizeFilter !== 'ALL') {
      result = result.filter((p) => 
        p.sizes.some((s) => s.toLowerCase().includes(selectedSizeFilter.toLowerCase()))
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

  const allAvailableSizes = ['ALL', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  const scrollToOccasion = () => {
    const el = document.getElementById('occasion-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER (Đã bỏ tab Tất Cả Sản Phẩm) */}
      <Header activeTab={activeGenderTab} setActiveTab={handleGenderTabChange} />

      {/* 2. BANNER CHÍNH & DỊCH VỤ MỚI */}
      <HeroBanner 
        activeTab={activeGenderTab} 
        setActiveTab={handleGenderTabChange} 
      />

      {/* 3. CAM KẾT CHẤT LƯỢNG, CHO THUÊ VÀ MAKE UP */}
      <PoliciesBar />

      {/* 4. GỢI Ý CHỌN ĐỒ THEO DỊP & DỊCH VỤ CHO THUÊ (TIỆC, CƯỚI, KỶ YẾU, CÔNG SỞ, HẸN HÒ) */}
      <OccasionOutfitsSection />

      {/* 5. DANH MỤC PHÂN LOẠI ĐỒ NỮ & ĐỒ NAM */}
      <SeasonCollectionSection
        categories={filteredCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeGenderTab={activeGenderTab}
        setActiveGenderTab={handleGenderTabChange}
      />

      {/* 6. DANH SÁCH SẢN PHẨM THEO DANH MỤC ĐƯỢC CHỌN (ĐÃ LOẠI BỎ 'TẤT CẢ SẢN PHẨM') */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Filter bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Active category Title */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-neutral-900 uppercase">
                DANH MỤC: {currentCategoryObj?.name || 'Sản phẩm nổi bật'} ({activeGenderTab === 'WOMEN' ? 'ĐỒ NỮ' : 'ĐỒ NAM'})
              </span>
              <span className="text-xs text-neutral-400">({filteredProducts.length} mẫu)</span>
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
              Lọc theo Size cân nặng:
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
                {size === 'ALL' ? 'Tất cả size' : size}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-neutral-300 p-8">
            <p className="text-sm font-bold text-neutral-700">Chưa có sản phẩm nào phù hợp với bộ lọc size đã chọn</p>
            <button
              onClick={() => setSelectedSizeFilter('ALL')}
              className="mt-3 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Bỏ lọc size
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

      {/* 7. ĐÁNH GIÁ THỰC TẾ CỦA KHÁCH MUA & THUÊ */}
      <ReviewSection />

      {/* 8. FOOTER */}
      <Footer />

      {/* 9. MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleGenderTabChange('WOMEN')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeGenderTab === 'WOMEN' ? 'text-[#e5677d]' : 'text-neutral-500'
          }`}
        >
          <span className="text-base">👗</span>
          <span>Đồ nữ</span>
        </button>

        <button
          onClick={() => handleGenderTabChange('MEN')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeGenderTab === 'MEN' ? 'text-black' : 'text-neutral-500'
          }`}
        >
          <span className="text-base">👔</span>
          <span>Đồ nam</span>
        </button>

        <button
          onClick={scrollToOccasion}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-neutral-600 hover:text-[#e5677d]"
        >
          <Sparkles className="w-4 h-4 text-[#e5677d]" />
          <span>Theo dịp</span>
        </button>

        <button
          onClick={() => openMakeupModal()}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-neutral-600 hover:text-[#e5677d]"
        >
          <CalendarHeart className="w-4 h-4 text-[#e5677d]" />
          <span>Make Up</span>
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

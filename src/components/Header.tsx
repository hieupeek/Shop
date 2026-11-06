'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  UserCog,
  Sparkles,
  CalendarHeart
} from 'lucide-react';

type HeaderProps = {
  activeTab: 'WOMEN' | 'MEN';
  setActiveTab: (tab: 'WOMEN' | 'MEN') => void;
};

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { totalCount, setIsCartOpen, openMakeupModal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const scrollToOccasion = () => {
    const el = document.getElementById('occasion-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-800 hover:text-black focus:outline-hidden cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* BRAND LOGO */}
            <div className="flex items-center">
              <Link 
                href="/" 
                onClick={() => setActiveTab('WOMEN')}
                className="flex items-baseline gap-1 group cursor-pointer"
              >
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#080808]">
                  PLUX<span className="text-[#e5677d]">XL</span>
                </span>
                <span className="hidden sm:inline text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
                  Bigsize Fashion & Rental
                </span>
              </Link>
            </div>

            {/* DESKTOP NAVIGATION: Nữ, Nam, Gợi ý theo dịp & Thuê đồ, Đặt lịch Make Up */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-bold tracking-wide">
              <button
                onClick={() => setActiveTab('WOMEN')}
                className={`transition-colors py-2 relative uppercase cursor-pointer ${
                  activeTab === 'WOMEN' ? 'text-black' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Quần áo nữ
                {activeTab === 'WOMEN' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e5677d]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('MEN')}
                className={`transition-colors py-2 relative uppercase cursor-pointer ${
                  activeTab === 'MEN' ? 'text-black' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Quần áo nam
                {activeTab === 'MEN' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>

              <button
                onClick={scrollToOccasion}
                className="transition-colors py-2 text-neutral-600 hover:text-[#e5677d] uppercase flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Sparkles className="w-4 h-4 text-[#e5677d]" />
                <span>Gợi ý theo dịp & Thuê đồ</span>
              </button>

              <button
                onClick={() => openMakeupModal()}
                className="transition-all py-1.5 px-3 bg-pink-50 hover:bg-pink-100 text-[#e5677d] border border-pink-200 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102"
              >
                <CalendarHeart className="w-4 h-4" />
                <span>Đặt Lịch Make Up</span>
              </button>
            </nav>

            {/* HEADER RIGHT ACTIONS: Admin link, Search & Giỏ hàng */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-100 cursor-pointer"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Link vào Admin */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-xs font-bold transition-all"
                title="Truy cập Trang quản trị Admin"
              >
                <UserCog className="w-4 h-4" />
                <span>Admin</span>
              </Link>

              {/* Giỏ hàng */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-[#080808] text-white rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer shadow-sm group"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-2">
            <button
              onClick={() => { setActiveTab('WOMEN'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl ${
                activeTab === 'WOMEN' ? 'bg-pink-50 text-[#e5677d]' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              👗 Quần áo nữ Bigsize
            </button>
            <button
              onClick={() => { setActiveTab('MEN'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl ${
                activeTab === 'MEN' ? 'bg-neutral-100 text-black' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              👔 Quần áo nam Bigsize
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToOccasion();
              }}
              className="w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#e5677d]" />
              <span>Gợi ý theo dịp & Thuê trang phục</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openMakeupModal();
              }}
              className="w-full text-left py-2.5 px-3 text-sm font-bold rounded-xl bg-pink-50 text-[#e5677d] flex items-center gap-2"
            >
              <CalendarHeart className="w-4 h-4" />
              <span>Đặt lịch Make Up chuyên nghiệp</span>
            </button>
            <div className="pt-2 border-t border-neutral-200">
              <Link
                href="/admin"
                className="flex items-center gap-2 py-2 px-3 text-sm font-bold text-neutral-800 hover:text-black"
              >
                <UserCog className="w-4 h-4" />
                <span>Trang quản trị (Admin Portal)</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-base text-neutral-900">Tìm kiếm trang phục & Dịch vụ</h3>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên áo, quần, đầm váy, đồ thuê dự tiệc..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-black text-sm"
                autoFocus
              />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-neutral-400 mb-2">GỢI Ý TÌM NHANH:</p>
              <div className="flex flex-wrap gap-2">
                {['Đầm dự tiệc thuê', 'Make up cô dâu', 'Sơ mi nam công sở', 'Áo cổ sen chân váy xếp ly', 'Quần jean cạp chun'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

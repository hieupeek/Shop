import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white pt-14 pb-10 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
          
          {/* COL 1: CONTACT & STORES (span 5) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-black tracking-wider text-white">PLUX<span className="text-[#e5677d]">XL</span></span>
            </div>

            <div className="flex items-start gap-2 text-neutral-300 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#e5677d] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-1">Hệ thống showroom & Studio Make up:</p>
                <ul className="space-y-1 text-neutral-400 text-[11px]">
                  <li>• <strong>Studio CS1:</strong> 0911 544 468 - Số 83 Nguyễn Hy Quang, Đống Đa, Hà Nội</li>
                  <li>• <strong>Studio CS2:</strong> 0962 046 608 - Số 48A Dịch Vọng Hậu, Cầu Giấy, Hà Nội</li>
                  <li>• <strong>Showroom CS3:</strong> 0383 544 468 - Số 338 Nguyễn Trãi, Hà Đông, Hà Nội</li>
                  <li>• <strong>Showroom CS4:</strong> 0396 736 028 - Số 177 Quang Trung, Gò Vấp, TP.HCM</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-300">
              <Phone className="w-4 h-4 text-[#e5677d] shrink-0" />
              <span>Hotline & Zalo: <a href="tel:0963511933" className="text-white font-bold hover:underline">0963 511 933</a></span>
            </div>

            <div className="flex items-center gap-2 text-neutral-300">
              <Mail className="w-4 h-4 text-[#e5677d] shrink-0" />
              <span>Email: <a href="mailto:contact@pluxxl.vn" className="text-white hover:underline">contact@pluxxl.vn</a></span>
            </div>
          </div>

          {/* COL 2: DỊCH VỤ NỔI BẬT (span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              DỊCH VỤ CỦA CHÚNG TÔI
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link href="#occasion-section" className="hover:text-white transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e5677d]" />
                  <span>Thuê đồ dự tiệc</span>
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Make Up tiệc & sự kiện</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Make Up cô dâu & ăn hỏi</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Stylist tư vấn phối đồ</span>
              </li>
            </ul>
          </div>

          {/* COL 3: CHÍNH SÁCH (span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              CHÍNH SÁCH & CAM KẾT
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <span className="hover:text-white transition-colors">Quy trình thuê & hoàn cọc</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Chính sách đổi size 7 ngày</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">Giao nhận 2 chiều toàn quốc</span>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#e5677d] transition-colors font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kênh quản trị (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: CHỨNG NHẬN & THANH TOÁN (span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              KẾT NỐI & CHỨNG NHẬN
            </h4>
            
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Nhận voucher 50.000₫ cho đơn thuê hoặc mua đồ đầu tiên:
            </p>

            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="bg-neutral-900 border border-neutral-700 text-xs px-3 py-2 rounded-lg text-white focus:outline-hidden focus:border-[#e5677d] flex-1"
              />
              <button className="bg-[#e5677d] hover:bg-pink-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer">
                Đăng ký
              </button>
            </div>

            {/* TRUST BADGE */}
            <div className="pt-2">
              <img
                src="https://theme.hstatic.net/200001016175/1001381733/14/footer_trustbadge.png?v=44"
                alt="Chứng nhận thanh toán an toàn"
                className="h-8 object-contain"
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
          <p>© Bản quyền thuộc về PLUXXL | Bigsize Fashion, Rental & Make Up Platform</p>
          <p>Thương hiệu thời trang & dịch vụ làm đẹp ngoại cỡ hàng đầu</p>
        </div>

      </div>
    </footer>
  );
}

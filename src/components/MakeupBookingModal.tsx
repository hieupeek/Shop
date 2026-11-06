'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MAKEUP_PACKAGES } from '@/data/mockData';
import { formatVND } from '@/lib/utils';
import { MakeupPackage } from '@/types';
import { 
  X, 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Phone, 
  User, 
  Scissors,
  HeartHandshake
} from 'lucide-react';

export default function MakeupBookingModal() {
  const { isMakeupModalOpen, setIsMakeupModalOpen, selectedMakeupPackage, setSelectedMakeupPackage } = useCart();

  const [activePackageId, setActivePackageId] = useState<string>(
    selectedMakeupPackage?.id || MAKEUP_PACKAGES[0].id
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('09:00');
  const [locationType, setLocationType] = useState<'STUDIO' | 'AT_HOME'>('STUDIO');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isMakeupModalOpen) return null;

  const currentPkg = MAKEUP_PACKAGES.find((p) => p.id === activePackageId) || MAKEUP_PACKAGES[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Vui lòng điền họ tên và số điện thoại liên hệ.');
      return;
    }
    if (locationType === 'AT_HOME' && !address) {
      alert('Vui lòng nhập địa chỉ nhà riêng để chuyên viên đến makeup.');
      return;
    }
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsMakeupModalOpen(false);
    setIsSuccess(false);
    setSelectedMakeupPackage(null);
  };

  const timeSlots = [
    '06:30', '08:00', '09:30', '11:00', 
    '13:30', '15:00', '16:30', '18:00', '19:30'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center max-w-md mx-auto space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-pink-100 text-[#e5677d] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900">ĐẶT LỊCH THÀNH CÔNG!</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Cảm ơn <strong>{customerName}</strong>! Stylist chuyên nghiệp của PLUXXL đã tiếp nhận lịch hẹn gói <strong>{currentPkg.name}</strong> vào ngày <strong>{bookingDate}</strong> lúc <strong>{bookingTime}</strong>.
            </p>
            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 text-xs text-left space-y-1.5 text-neutral-700">
              <p>📍 Địa điểm: <strong>{locationType === 'STUDIO' ? 'Tại Studio PLUXXL (Tầng 2, 48 Dịch Vọng Hậu)' : address}</strong></p>
              <p>📞 SĐT liên hệ: <strong>{customerPhone}</strong></p>
              <p>💰 Chi phí dự kiến: <strong className="text-[#e5677d]">{formatVND(currentPkg.price)}</strong> (Thanh toán tại buổi make up)</p>
            </div>
            <p className="text-[11px] text-neutral-400">
              Chúng tôi sẽ gọi lại trong 10 phút để tư vấn tone makeup phù hợp với màu trang phục của bạn.
            </p>
            <button
              onClick={handleClose}
              className="mt-3 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 text-[#e5677d] rounded-full text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> DỊCH VỤ TRANG ĐIỂM CHUYÊN NGHIỆP
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                ĐẶT LỊCH MAKE UP THEO DỊP
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Makeup artist giàu kinh nghiệm, thấu hiểu dáng mặt & tone da, tạo khối thon gọn tự nhiên, nền trong suốt bền màu 12h.
              </p>
            </div>

            {/* Content: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              
              {/* LEFT: Chọn gói dịch vụ (5 Cột) */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-black uppercase text-neutral-900 tracking-wider">
                  1. Chọn gói dịch vụ phù hợp:
                </h4>

                <div className="space-y-2.5">
                  {MAKEUP_PACKAGES.map((pkg) => {
                    const isSelected = pkg.id === activePackageId;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setActivePackageId(pkg.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#e5677d] bg-pink-50/40 ring-2 ring-[#e5677d]/20 shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        {pkg.tag && (
                          <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase bg-[#e5677d] text-white px-2 py-0.5 rounded-md">
                            {pkg.tag}
                          </span>
                        )}

                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-neutral-900">{pkg.name}</h5>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-black text-[#e5677d]">{formatVND(pkg.price)}</span>
                          {pkg.originalPrice && (
                            <span className="text-[11px] text-neutral-400 line-through">
                              {formatVND(pkg.originalPrice)}
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-500 flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3 text-neutral-400" /> {pkg.duration}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>

                        {isSelected && (
                          <div className="mt-2.5 pt-2 border-t border-pink-100 text-[10px] space-y-1 text-neutral-700">
                            {pkg.features.map((feat, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="text-pink-500 font-bold">✓</span>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: Form điền thông tin (7 Cột) */}
              <div className="lg:col-span-7 bg-neutral-50/80 p-4 sm:p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between">
                <form onSubmit={handleBooking} className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-neutral-900 tracking-wider">
                    2. Thông tin lịch hẹn:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#e5677d]" /> Họ và tên:
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ví dụ: Lê Lan Anh"
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#e5677d]" /> Số điện thoại:
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ví dụ: 0912..."
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Địa điểm */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#e5677d]" /> Địa điểm make up:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLocationType('STUDIO')}
                        className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          locationType === 'STUDIO'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        🏢 Tại Studio PLUXXL
                      </button>

                      <button
                        type="button"
                        onClick={() => setLocationType('AT_HOME')}
                        className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          locationType === 'AT_HOME'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        🏠 Tại Nhà Riêng (+50k)
                      </button>
                    </div>

                    {locationType === 'AT_HOME' && (
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nhập địa chỉ nhà riêng của bạn..."
                        className="w-full mt-2 text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                      />
                    )}
                  </div>

                  {/* Ngày & Khung giờ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#e5677d]" /> Ngày trang điểm:
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#e5677d]" /> Giờ hẹn mong muốn:
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden cursor-pointer"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Ghi chú thêm (Tone makeup mong muốn, màu váy, loại da nhạy cảm...):
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ví dụ: Mình thuê đầm xám phối chân váy dạ của shop, muốn makeup tone cam đào ngọt ngào..."
                      className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#e5677d] hover:bg-[#d4566c] text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>XÁC NHẬN ĐẶT LỊCH • {formatVND(currentPkg.price)}</span>
                    </button>
                    <p className="text-[11px] text-center text-neutral-400 mt-2">
                      * Không cần đặt cọc trước. Bạn thanh toán trực tiếp sau khi hoàn tất buổi make up.
                    </p>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}


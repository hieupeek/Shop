'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Truck,
  Calendar,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    totalDeposit,
    freeShippingThreshold 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [bankRefundInfo, setBankRefundInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR'>('COD');

  if (!isCartOpen) return null;

  const hasRentalItems = cart.some((i) => i.itemType === 'RENT');
  const rentalItemCount = cart.filter((i) => i.itemType === 'RENT').reduce((s, i) => s + i.quantity, 0);
  const buyItemCount = cart.filter((i) => i.itemType === 'BUY').reduce((s, i) => s + i.quantity, 0);

  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingFee = freeShippingLeft === 0 ? 0 : 30000;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'BU50K') {
      if (subtotal >= 499000) {
        setAppliedDiscount(50000);
        setCouponMessage('Đã áp dụng giảm 50.000₫!');
      } else {
        setCouponMessage('Đơn hàng chưa đạt mức 499.000₫ để dùng mã này.');
      }
    } else if (code === 'BU100K') {
      if (subtotal >= 899000) {
        setAppliedDiscount(100000);
        setCouponMessage('Đã áp dụng giảm 100.000₫!');
      } else {
        setCouponMessage('Đơn hàng chưa đạt mức 899.000₫ để dùng mã này.');
      }
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(30000);
      setCouponMessage('Đã áp dụng mã Miễn Phí Vận Chuyển (-30.000₫)!');
    } else {
      setCouponMessage('Mã giảm giá không hợp lệ.');
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount) + shippingFee + totalDeposit;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }
    setCheckoutComplete(true);
    // Lưu lịch sử đơn nếu cần
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* 1. DRAWER HEADER */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h3 className="font-black text-neutral-900 uppercase text-sm tracking-wide">
              Giỏ Hàng Của Bạn ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setCheckoutComplete(false);
            }}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. FREESHIP PROGRESS BAR */}
        <div className="bg-pink-50/60 p-3 border-b border-pink-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-neutral-700 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#e5677d]" />
              {freeShippingLeft === 0 ? (
                <span className="text-emerald-700 font-black">🎉 BẠN ĐÃ ĐƯỢC MIỄN PHÍ VẬN CHUYỂN!</span>
              ) : (
                <span>
                  Mua/thuê thêm <strong className="text-[#e5677d]">{formatVND(freeShippingLeft)}</strong> để được <strong className="text-black">FREESHIP</strong>
                </span>
              )}
            </span>
            <span className="font-extrabold text-[#e5677d] text-[11px]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 to-[#e5677d] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 3. CART CONTENT OR CHECKOUT FORM */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {checkoutComplete ? (
            <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-neutral-900">ĐẶT HÀNG THÀNH CÔNG!</h4>
              
              <div className="p-3.5 bg-neutral-50 rounded-2xl text-xs text-neutral-600 border border-neutral-200 text-left space-y-1.5">
                <p>Khách hàng: <strong className="text-black">{customerName}</strong></p>
                <p>Số điện thoại: <strong className="text-black">{customerPhone}</strong></p>
                <p>Địa chỉ: <span className="text-black">{customerAddress}</span></p>
                <p>Tổng thanh toán: <strong className="text-[#e5677d] text-sm">{formatVND(finalTotal)}</strong></p>
                {totalDeposit > 0 && (
                  <p className="text-emerald-700 font-semibold pt-1 border-t border-neutral-200">
                    * Trong đó đã bao gồm <strong>{formatVND(totalDeposit)}</strong> tiền cọc giữ đồ (hoàn trả 100% khi shop nhận lại trang phục).
                  </p>
                )}
              </div>

              <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                Chuyên viên PLUXXL sẽ gọi cho bạn qua số <strong>{customerPhone}</strong> để xác nhận số đo và thời gian giao nhận trong 15 phút.
              </p>

              <button
                onClick={() => {
                  clearCart();
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                  setCheckoutComplete(false);
                }}
                className="mt-4 bg-black text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-neutral-800 cursor-pointer"
              >
                Hoàn tất & Tiếp tục
              </button>
            </div>
          ) : isCheckingOut ? (
            /* CHECKOUT FORM */
            <form onSubmit={handleFinishOrder} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h4 className="text-sm font-black text-neutral-900 uppercase">Thông tin nhận hàng</h4>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-neutral-500 underline cursor-pointer"
                >
                  Quay lại giỏ
                </button>
              </div>

              {hasRentalItems && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#e5677d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Đơn hàng có {rentalItemCount} sản phẩm thuê:</span>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Tiền cọc giữ đồ ({formatVND(totalDeposit)}) sẽ được hoàn trả 100% qua số tài khoản sau khi shop nhận lại đồ.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Họ và tên của bạn:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Số điện thoại nhận hàng:</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Địa chỉ nhận hàng chi tiết:</label>
                <textarea
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ví dụ: Số 25 ngõ 102 Trần Phú, Hà Đông, Hà Nội"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              {hasRentalItems && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    STK nhận hoàn tiền cọc (Tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={bankRefundInfo}
                    onChange={(e) => setBankRefundInfo(e.target.value)}
                    placeholder="Ví dụ: 1903... Techcombank - NGUYEN THI MAI"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Hình thức thanh toán:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 border border-neutral-200 rounded-xl text-xs font-medium cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-black"
                    />
                    <span>Thanh toán tiền mặt khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border border-neutral-200 rounded-xl text-xs font-medium cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'VIETQR'}
                      onChange={() => setPaymentMethod('VIETQR')}
                      className="accent-black"
                    />
                    <span>Quét mã VietQR chuyển khoản (Nhanh chóng & bảo mật)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#080808] hover:bg-[#e5677d] text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                XÁC NHẬN ĐẶT ĐƠN - {formatVND(finalTotal)}
              </button>
            </form>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-neutral-400">Hãy thêm đồ mua hoặc đồ thuê vào giỏ nhé!</p>
            </div>
          ) : (
            /* CART ITEMS LIST */
            <div className="space-y-3">
              {/* Phân loại nhanh */}
              <div className="flex items-center justify-between text-xs font-bold px-1 text-neutral-600">
                <span>{buyItemCount > 0 && `${buyItemCount} món mua`} {hasRentalItems && buyItemCount > 0 && '•'} {hasRentalItems && `${rentalItemCount} món thuê`}</span>
                <span className="text-[11px] text-neutral-400">Vuốt để xem hết</span>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-2xl border transition-all ${
                    item.itemType === 'RENT'
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-neutral-50 border-neutral-200/80'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-26 object-cover object-top rounded-xl bg-neutral-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          {item.itemType === 'RENT' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white bg-[#e5677d] px-2 py-0.5 rounded-md mb-1">
                              <Sparkles className="w-3 h-3" /> Thuê {item.rentalDays} Ngày
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-black uppercase text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-md mb-1">
                              Mua sản phẩm
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.name}</h4>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Màu: <span className="font-semibold text-neutral-800">{item.colorName}</span> | Size: <span className="font-black text-black">{item.size}</span>
                      </p>

                      {/* Chi tiết thuê nếu có */}
                      {item.itemType === 'RENT' && (
                        <div className="mt-1 text-[10px] text-neutral-600 bg-white/70 p-1.5 rounded-lg border border-rose-100">
                          {item.rentalStartDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#e5677d]" />
                              <span>Nhận: {item.rentalStartDate} &rarr; Trả: {item.rentalEndDate}</span>
                            </div>
                          )}
                          <div className="text-rose-700 font-semibold mt-0.5">
                            Cọc giữ đồ: {formatVND((item.deposit || 0) * item.quantity)} (hoàn lại)
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-neutral-200/60">
                      <div>
                        <span className="text-xs font-black text-black">
                          {formatVND(item.price * item.quantity)}
                        </span>
                        {item.itemType === 'RENT' && (
                          <span className="text-[10px] text-neutral-400 block">
                            (Phí thuê)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-neutral-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-neutral-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* VOUCHER INPUT BOX */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Mã: BU50K, BU100K, FREESHIP..."
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xl uppercase font-semibold focus:outline-hidden focus:border-black"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] mt-1 font-semibold ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 4. DRAWER FOOTER */}
        {!checkoutComplete && !isCheckingOut && cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Tiền hàng & phí thuê:</span>
                <span className="font-semibold text-neutral-900">{formatVND(subtotal)}</span>
              </div>

              {totalDeposit > 0 && (
                <div className="flex justify-between text-rose-700 bg-rose-50 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Tiền cọc giữ đồ (hoàn trả 100%):
                  </span>
                  <span className="font-black">+{formatVND(totalDeposit)}</span>
                </div>
              )}

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Khuyến mãi voucher:</span>
                  <span>-{formatVND(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Phí vận chuyển 2 chiều:</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? 'MIỄN PHÍ' : '30.000₫'}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-neutral-100">
                <span>Tổng cần thanh toán:</span>
                <span className="text-base text-[#e5677d]">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-[#080808] hover:bg-[#e5677d] text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>TIẾN HÀNH ĐẶT ĐƠN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

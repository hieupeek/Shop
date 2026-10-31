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
  Truck
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR'>('COD');

  if (!isCartOpen) return null;

  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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
      setAppliedDiscount(35000);
      setCouponMessage('Đã áp dụng mã Miễn Phí Vận Chuyển (-35.000₫)!');
    } else {
      setCouponMessage('Mã giảm giá không hợp lệ.');
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }
    setCheckoutComplete(true);
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
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-200 rounded-lg transition-colors"
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
                  Mua thêm <strong className="text-[#e5677d]">{formatVND(freeShippingLeft)}</strong> để được <strong className="text-black">FREESHIP</strong>
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
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-neutral-900">ĐẶT HÀNG THÀNH CÔNG!</h4>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                Cảm ơn <strong>{customerName}</strong>. Nhân viên PLUXXL sẽ liên hệ số <strong>{customerPhone}</strong> để xác nhận số đo và đơn hàng trong vòng 15 phút.
              </p>
              <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-500 border border-neutral-200">
                Phương thức: <strong>{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Quét mã VietQR khi nhận'}</strong>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                  setCheckoutComplete(false);
                }}
                className="mt-4 bg-black text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-neutral-800"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : isCheckingOut ? (
            /* CHECKOUT FORM */
            <form onSubmit={handleFinishOrder} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h4 className="text-sm font-black text-neutral-900 uppercase">Thông tin giao hàng</h4>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-neutral-500 underline"
                >
                  Quay lại giỏ
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Họ và tên của bạn:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
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
                  placeholder="Ví dụ: 0912345678"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Địa chỉ chi tiết (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh):</label>
                <textarea
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ví dụ: 48A Dịch Vọng Hậu, Cầu Giấy, Hà Nội"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

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
                    <span>Quét mã VietQR chuyển khoản (Miễn phí)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#080808] hover:bg-[#e5677d] text-white font-black text-sm py-3.5 rounded-xl transition-all shadow-md"
              >
                XÁC NHẬN ĐẶT HÀNG - {formatVND(finalTotal)}
              </button>
            </form>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-700">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-neutral-400">Hãy thêm sản phẩm yêu thích vào giỏ nhé!</p>
            </div>
          ) : (
            /* CART ITEMS LIST */
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-24 object-cover object-top rounded-xl bg-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Màu: <span className="font-semibold text-neutral-800">{item.colorName}</span> | Size: <span className="font-black text-[#e5677d]">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-black text-black">{formatVND(item.price)}</span>
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-neutral-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-neutral-100 font-bold"
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
                    placeholder="Nhập mã: BU50K, BU100K..."
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xl uppercase font-semibold focus:outline-hidden focus:border-black"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
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
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Tạm tính:</span>
                <span className="font-semibold text-neutral-900">{formatVND(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Khuyến mãi:</span>
                  <span>-{formatVND(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Vận chuyển:</span>
                <span className="font-semibold text-neutral-900">
                  {freeShippingLeft === 0 ? 'MIỄN PHÍ' : '30.000₫'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-neutral-100">
                <span>Tổng thanh toán:</span>
                <span className="text-base text-[#e5677d]">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-[#080808] hover:bg-[#e5677d] text-white font-black text-sm py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>TIẾN HÀNH ĐẶT HÀNG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


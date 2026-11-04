import React from 'react';
import { REVIEWS } from '@/data/mockData';
import { Star, CheckCircle2 } from 'lucide-react';

export default function ReviewSection() {
  return (
    <div className="bg-neutral-100/70 py-12 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            ĐÁNH GIÁ TỪ KHÁCH HÀNG
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Cảm nhận thực tế của khách hàng khi trải nghiệm sản phẩm
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-5 shadow-2xs border border-neutral-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400">{r.date}</span>
                </div>

                <p className="text-xs text-neutral-700 mt-3 leading-relaxed">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{r.customerName}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">{r.productName}</p>
                </div>
                <div className="flex items-center text-[10px] text-emerald-600 font-semibold gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã mua</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

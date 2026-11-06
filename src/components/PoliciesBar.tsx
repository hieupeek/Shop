import React from 'react';

export default function PoliciesBar() {
  const policies = [
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_1.png?v=44',
      title: 'Cho thuê tiết kiệm 70%',
      desc: 'Hỗ trợ thuê 3 - 5 ngày đi tiệc, giặt hấp sạch thơm, hoàn cọc nhanh trong 24h',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_3.png?v=44',
      title: 'Make up chuyên nghiệp',
      desc: 'Artist thấu hiểu tone da, tạo khối thon gọn mặt tròn, bền màu suốt 12 tiếng',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_4.png?v=44',
      title: 'Giao nhận toàn quốc',
      desc: 'Giao tận nhà đúng hẹn, kiểm tra thử đồ thoải mái trước khi nhận hàng',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_1.png?v=44',
      title: 'Đủ size L - 5XL (55-140kg)',
      desc: 'Bảo hành form dáng, hỗ trợ đổi size miễn phí trong 7 ngày nếu không vừa',
    },
  ];

  return (
    <div className="bg-white border-y border-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((p, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-3">
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <img
                  src={p.icon}
                  alt={p.title}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                {p.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

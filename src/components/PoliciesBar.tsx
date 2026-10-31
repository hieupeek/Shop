import React from 'react';

export default function PoliciesBar() {
  const policies = [
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_1.png?v=44',
      title: 'Đổi hàng miễn phí',
      desc: 'Đổi hàng miễn phí trong vòng 7 ngày đối với sản phẩm nguyên giá',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_3.png?v=44',
      title: 'Bảo đảm chất lượng',
      desc: 'Sản phẩm đã được kiểm định nghiêm ngặt về chất liệu và đường may',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_4.png?v=44',
      title: 'Giao hàng toàn quốc',
      desc: 'Vận chuyển nhanh chóng, khách được kiểm tra trước khi nhận hàng',
    },
    {
      icon: 'https://theme.hstatic.net/200001016175/1001381733/14/policies_icon_1.png?v=44',
      title: 'Hỗ trợ tư vấn 24/7',
      desc: 'Hotline 0963.511.933 luôn sẵn sàng giải đáp và tư vấn chọn size',
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

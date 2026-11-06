import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import MakeupBookingModal from '@/components/MakeupBookingModal';

export const metadata: Metadata = {
  title: 'PLUXXL - Thời Trang Bigsize & Cho Thuê Đồ Dự Tiệc, Đặt Lịch Make Up',
  description: 'Trang mua sắm và cho thuê đồ thời trang bigsize nam nữ. Đầy đủ gói đặt lịch make up chuyên nghiệp, gợi ý chọn đồ theo dịp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-[#f8f8f8]">
        <CartProvider>
          {children}
          <CartDrawer />
          <ProductDetailModal />
          <MakeupBookingModal />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';

export const metadata: Metadata = {
  title: 'PLUXXL - Thời Trang Bigsize Nam & Nữ',
  description: 'Trang mua sắm quần áo thời trang nam và nữ. Đa dạng mẫu mã áo polo, sơ mi, đầm váy, quần âu.',
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
        </CartProvider>
      </body>
    </html>
  );
}

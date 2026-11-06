'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartItemType, Product, MakeupPackage } from '@/types';

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: Product,
    size: string,
    colorName: string,
    quantity?: number,
    itemType?: CartItemType,
    rentalDays?: number,
    rentalStartDate?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  totalDeposit: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  freeShippingThreshold: number;
  // Makeup Modal
  isMakeupModalOpen: boolean;
  setIsMakeupModalOpen: (open: boolean) => void;
  selectedMakeupPackage: MakeupPackage | null;
  setSelectedMakeupPackage: (pkg: MakeupPackage | null) => void;
  openMakeupModal: (pkg?: MakeupPackage) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Makeup booking modal state
  const [isMakeupModalOpen, setIsMakeupModalOpen] = useState(false);
  const [selectedMakeupPackage, setSelectedMakeupPackage] = useState<MakeupPackage | null>(null);

  const freeShippingThreshold = 500000;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bu_cart_v2');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bu_cart_v2', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    size: string,
    colorName: string,
    quantity = 1,
    itemType: CartItemType = 'BUY',
    rentalDays = 3,
    rentalStartDate?: string
  ) => {
    const variant = product.variants.find(
      (v) => v.size === size && v.colorName.toLowerCase() === colorName.toLowerCase()
    ) || product.variants[0];

    const baseVariantKey = variant?.id || `${product.id}-${size}-${colorName}`;
    // Phân biệt item giỏ hàng theo Mua hoặc Thuê (kèm ngày)
    const cartItemId = itemType === 'RENT' 
      ? `RENT-${baseVariantKey}-${rentalDays}d-${rentalStartDate || 'now'}`
      : `BUY-${baseVariantKey}`;

    const selectedImage =
      product.images.find((img) => img.colorName === colorName)?.url ||
      product.images[0]?.url ||
      '';

    // Giá: nếu thuê thì lấy giá thuê (tính thêm nếu 5 ngày), nếu mua lấy giá mua
    let unitPrice = product.basePrice;
    let deposit = 0;

    if (itemType === 'RENT') {
      const baseRent = product.rentalPrice || Math.round(product.basePrice * 0.28);
      // Thuê 5 ngày thì cộng thêm phụ phí ưu đãi 40.000₫
      unitPrice = rentalDays === 5 ? baseRent + 40000 : baseRent;
      deposit = product.rentalDeposit || Math.round(product.basePrice * 0.6);
    } else {
      unitPrice = variant?.price || product.basePrice;
    }

    // Tính ngày trả dự kiến nếu thuê
    let calculatedEndDate = '';
    if (itemType === 'RENT' && rentalStartDate) {
      const start = new Date(rentalStartDate);
      start.setDate(start.getDate() + rentalDays);
      calculatedEndDate = start.toISOString().split('T')[0];
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          variantId: baseVariantKey,
          name: product.name,
          price: unitPrice,
          colorName,
          size,
          image: selectedImage,
          quantity,
          itemType,
          rentalDays: itemType === 'RENT' ? rentalDays : undefined,
          rentalStartDate: itemType === 'RENT' ? rentalStartDate : undefined,
          rentalEndDate: itemType === 'RENT' ? calculatedEndDate : undefined,
          deposit: itemType === 'RENT' ? deposit : 0,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const openMakeupModal = (pkg?: MakeupPackage) => {
    if (pkg) {
      setSelectedMakeupPackage(pkg);
    }
    setIsMakeupModalOpen(true);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + (item.deposit || 0) * item.quantity, 0);
  const grandTotal = subtotal + totalDeposit;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        totalDeposit,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        freeShippingThreshold,
        isMakeupModalOpen,
        setIsMakeupModalOpen,
        selectedMakeupPackage,
        setSelectedMakeupPackage,
        openMakeupModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

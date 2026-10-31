'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { Product } from '@/types';
import { formatVND } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  Eye,
  Store,
  ArrowUpRight
} from 'lucide-react';

type MockOrder = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; size: string; color: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: 'COD' | 'VIETQR';
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  date: string;
};

const INITIAL_ORDERS: MockOrder[] = [
  {
    id: 'o-1',
    code: 'ORD-20261031-01',
    customerName: 'Nguyễn Văn Minh',
    phone: '0988 123 456',
    address: '48A Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    items: [
      { name: 'Áo Polo Phối Tay Raglan Xanh Rêu Phom Regular Bigsize', size: 'L', color: 'Xanh Navy', qty: 2, price: 420000 }
    ],
    totalAmount: 840000,
    paymentMethod: 'COD',
    status: 'PENDING',
    date: '31/10/2026 16:45',
  },
  {
    id: 'o-2',
    code: 'ORD-20261031-02',
    customerName: 'Trần Thị Thu Hà',
    phone: '0912 888 999',
    address: '177 Quang Trung, Gò Vấp, TP.HCM',
    items: [
      { name: 'Set Bộ Áo Cổ Sen Phối Chân Váy Xếp Ly Công Sở 24YBD53', size: 'M', color: 'Đỏ Rượu', qty: 1, price: 585000 },
      { name: 'Áo Sơ Mi Nữ Kẻ Sọc Hồng Pastel Dáng Rộng 24YSM64', size: 'M', color: 'Trắng Sữa', qty: 1, price: 395000 }
    ],
    totalAmount: 980000,
    paymentMethod: 'VIETQR',
    status: 'SHIPPING',
    date: '31/10/2026 14:20',
  },
  {
    id: 'o-3',
    code: 'ORD-20261030-03',
    customerName: 'Lê Hoàng Long',
    phone: '0977 456 789',
    address: '83 Nguyễn Hy Quang, Đống Đa, Hà Nội',
    items: [
      { name: 'Quần Jean Nam Ống Suông Co Giãn Cao Cấp Cạp Chun Ẩn', size: '31', color: 'Đen', qty: 1, price: 520000 },
      { name: 'Áo Sơ Mi Nam Dài Tay Cao Cấp Vải Sợi Tre Chống Nhăn PLUXXL', size: 'XL', color: 'Trắng', qty: 1, price: 480000 }
    ],
    totalAmount: 1000000,
    paymentMethod: 'VIETQR',
    status: 'COMPLETED',
    date: '30/10/2026 10:15',
  },
  {
    id: 'o-4',
    code: 'ORD-20261029-04',
    customerName: 'Phạm Thuỳ Dung',
    phone: '0933 111 222',
    address: '24 Tuệ Tĩnh, Hai Bà Trưng, Hà Nội',
    items: [
      { name: 'Set Bộ Thể Thao Thun Nữ Bigsize Áo Phông Quần Suông', size: 'L', color: 'Be', qty: 1, price: 650000 }
    ],
    totalAmount: 650000,
    paymentMethod: 'COD',
    status: 'CANCELLED',
    date: '29/10/2026 18:30',
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'CUSTOMERS'>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<MockOrder[]>(INITIAL_ORDERS);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL');

  // Modal Add Product State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductGender, setNewProductGender] = useState<'MEN' | 'WOMEN'>('MEN');
  const [newProductPrice, setNewProductPrice] = useState('450000');
  const [newProductCategory, setNewProductCategory] = useState(CATEGORIES[0]?.name || 'Áo Polo Nam');
  const [newProductImage, setNewProductImage] = useState('');

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

  // Statistics
  const totalRevenue = orders
    .filter((o) => o.status === 'COMPLETED' || o.status === 'SHIPPING')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const totalProductsCount = products.length;

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: MockOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/\s+/g, '-'),
      gender: newProductGender,
      categorySlug: newProductGender === 'MEN' ? 'ao-polo-nam' : 'dam-vay-nu',
      categoryName: newProductCategory,
      basePrice: Number(newProductPrice) || 350000,
      originalPrice: (Number(newProductPrice) || 350000) * 1.25,
      description: 'Sản phẩm thời trang cao cấp với chất liệu thoáng mát và kiểu dáng hiện đại.',
      images: [{ url: newProductImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', isPrimary: true }],
      colors: [
        { name: 'Đen', hex: '#111111' },
        { name: 'Trắng', hex: '#ffffff' }
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      variants: [],
      rating: 5.0,
      reviewCount: 0,
      isNew: true,
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    setNewProductName('');
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchProductQuery.toLowerCase());
    const matchGender = genderFilter === 'ALL' || p.gender === genderFilter;
    return matchName && matchGender;
  });

  const filteredOrders = orders.filter((o) => {
    const matchQuery = 
      o.code.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      o.phone.includes(searchOrderQuery);
    return matchQuery;
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#080808] text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Link back to store */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">PLUX<span className="text-[#e5677d]">XL</span></span>
                <span className="text-xl font-bold text-neutral-400">ADMIN</span>
              </div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                Hệ Thống Quản Trị Shop
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'DASHBOARD'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'PRODUCTS'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Quản lý Sản phẩm</span>
              </div>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ORDERS'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Quản lý Đơn hàng</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('CUSTOMERS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CUSTOMERS'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Khách hàng</span>
            </button>
          </nav>
        </div>

        {/* Back to Storefront Link */}
        <div className="pt-6 border-t border-neutral-800">
          <Link
            href="/"
            className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>Xem trang cửa hàng</span>
            </div>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h1 className="text-2xl font-black text-neutral-900">Bảng Điều Khiển Quản Trị</h1>
                <p className="text-xs text-neutral-500">Xem tóm tắt tình hình kinh doanh của shop</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('PRODUCTS');
                  setIsAddProductOpen(true);
                }}
                className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs font-bold uppercase">Doanh thu ghi nhận</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900">{formatVND(totalRevenue)}</div>
                <p className="text-[11px] text-emerald-600 font-medium">Tăng 18% so với tuần trước</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs font-bold uppercase">Đơn chờ xử lý</span>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900">{pendingOrdersCount}</div>
                <p className="text-[11px] text-amber-600 font-medium">Cần xác nhận sớm</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs font-bold uppercase">Tổng số sản phẩm</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900">{totalProductsCount}</div>
                <p className="text-[11px] text-neutral-500 font-medium">Bao gồm quần áo nam & nữ</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs font-bold uppercase">Tổng đơn hàng</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900">{orders.length}</div>
                <p className="text-[11px] text-neutral-500 font-medium">Tỷ lệ hoàn tất 75%</p>
              </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-neutral-900 uppercase">Đơn hàng mới nhất</h3>
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                >
                  Xem tất cả đơn
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-bold border-y border-neutral-200">
                    <tr>
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Tổng tiền</th>
                      <th className="p-3">Phương thức</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.slice(0, 3).map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50/70">
                        <td className="p-3 font-bold text-neutral-900">{o.code}</td>
                        <td className="p-3">
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-neutral-400 text-[10px]">{o.phone}</div>
                        </td>
                        <td className="p-3 font-black text-black">{formatVND(o.totalAmount)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3">
                          {o.status === 'PENDING' && (
                            <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              Chờ xác nhận
                            </span>
                          )}
                          {o.status === 'SHIPPING' && (
                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              Đang giao
                            </span>
                          )}
                          {o.status === 'COMPLETED' && (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              Hoàn thành
                            </span>
                          )}
                          {o.status === 'CANCELLED' && (
                            <span className="bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                              Đã hủy
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-black text-neutral-900">Quản Lý Sản Phẩm</h1>
                <p className="text-xs text-neutral-500">Thêm, sửa giá, đổi ảnh hoặc cập nhật trạng thái quần áo</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setGenderFilter('ALL')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    genderFilter === 'ALL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Tất cả ({products.length})
                </button>
                <button
                  onClick={() => setGenderFilter('MEN')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    genderFilter === 'MEN' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Đồ nam ({products.filter((p) => p.gender === 'MEN').length})
                </button>
                <button
                  onClick={() => setGenderFilter('WOMEN')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    genderFilter === 'WOMEN' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Đồ nữ ({products.filter((p) => p.gender === 'WOMEN').length})
                </button>
              </div>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">Phân loại</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3">Giá bán</th>
                      <th className="p-3">Kích cỡ</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/70">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]?.url}
                              alt=""
                              className="w-12 h-14 object-cover object-top rounded-lg bg-neutral-100 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-neutral-900 line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-neutral-400">Đánh giá: ⭐ {p.rating} ({p.reviewCount})</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            p.gender === 'MEN' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                          }`}>
                            {p.gender === 'MEN' ? 'Đồ nam' : 'Đồ nữ'}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-neutral-600">{p.categoryName}</td>
                        <td className="p-3 font-black text-black">{formatVND(p.basePrice)}</td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {p.sizes.map((s) => (
                              <span key={s} className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => alert(`Tính năng sửa sản phẩm: ${p.name}`)}
                              className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-neutral-900">Quản Lý Đơn Hàng</h1>
                <p className="text-xs text-neutral-500">Xem thông tin giao hàng, cập nhật trạng thái đơn</p>
              </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>
            </div>

            {/* ORDERS TABLE */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Địa chỉ nhận</th>
                      <th className="p-3">Tổng tiền</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50/70">
                        <td className="p-3 font-bold text-neutral-900">{o.code}</td>
                        <td className="p-3 text-neutral-500">{o.date}</td>
                        <td className="p-3">
                          <div className="font-semibold text-neutral-900">{o.customerName}</div>
                          <div className="text-[10px] text-neutral-500">{o.phone}</div>
                        </td>
                        <td className="p-3 text-neutral-600 max-w-xs truncate" title={o.address}>
                          {o.address}
                        </td>
                        <td className="p-3 font-black text-black">{formatVND(o.totalAmount)}</td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className="text-xs p-1 rounded-lg border border-neutral-200 font-semibold cursor-pointer bg-white"
                          >
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="SHIPPING">Đang giao</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 bg-neutral-100 hover:bg-black hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'CUSTOMERS' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-neutral-900">Danh Sách Khách Hàng</h1>
              <p className="text-xs text-neutral-500">Khách hàng đã từng đặt đơn tại cửa hàng</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">Số điện thoại</th>
                    <th className="p-3">Địa chỉ thường nhận</th>
                    <th className="p-3">Số đơn đã đặt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/70">
                      <td className="p-3 font-bold text-neutral-900">{o.customerName}</td>
                      <td className="p-3 text-neutral-600">{o.phone}</td>
                      <td className="p-3 text-neutral-600">{o.address}</td>
                      <td className="p-3 font-semibold text-emerald-700">1 đơn hàng</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-black text-lg text-neutral-900 pb-3 border-b border-neutral-200">
              Thêm Sản Phẩm Mới
            </h3>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tên sản phẩm:</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Ví dụ: Áo Sơ Mi Nam Oxford Dài Tay"
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Phân loại giới tính:</label>
                  <select
                    value={newProductGender}
                    onChange={(e) => setNewProductGender(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden cursor-pointer"
                  >
                    <option value="MEN">Quần áo nam</option>
                    <option value="WOMEN">Quần áo nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Giá bán (VND):</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Danh mục sản phẩm:</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:border-black focus:outline-hidden cursor-pointer"
                >
                  <option value="Áo Polo Nam">Áo Polo Nam</option>
                  <option value="Áo Sơ Mi Nam">Áo Sơ Mi Nam</option>
                  <option value="Quần Âu & Kaki Nam">Quần Âu & Kaki Nam</option>
                  <option value="Đầm & Váy Nữ">Đầm & Váy Nữ</option>
                  <option value="Áo Kiểu Nữ">Áo Kiểu Nữ</option>
                  <option value="Set Trang Phục Nữ">Set Trang Phục Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Hình ảnh sản phẩm (Tải lên Cloud Storage):
                </label>
                <ImageUploader
                  value={newProductImage}
                  onChange={setNewProductImage}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white font-bold text-xs rounded-xl hover:bg-neutral-800 cursor-pointer"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <div>
                <h3 className="font-black text-base text-neutral-900">Chi Tiết Đơn Hàng</h3>
                <p className="text-xs text-neutral-400">Mã đơn: <strong>{selectedOrder.code}</strong></p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-black cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Khách hàng:</strong> {selectedOrder.customerName} - {selectedOrder.phone}</p>
              <p><strong>Địa chỉ nhận:</strong> {selectedOrder.address}</p>
              <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận (COD)' : 'Chuyển khoản VietQR'}</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-50 space-y-2">
              <h4 className="text-xs font-bold text-neutral-800 uppercase">Sản phẩm trong đơn:</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-[10px] text-neutral-500">Màu: {item.color} | Size: {item.size} x {item.qty}</p>
                  </div>
                  <span className="font-bold">{formatVND(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-black text-sm">
                <span>Tổng tiền:</span>
                <span>{formatVND(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold">Cập nhật trạng thái:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)}
                className="text-xs p-2 border border-neutral-300 rounded-xl font-bold bg-white cursor-pointer"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


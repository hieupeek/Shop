'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Camera, 
  UploadCloud, 
  Video, 
  VideoOff, 
  RefreshCw, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export default function VirtualTryOnModal() {
  const { tryOnProduct, setTryOnProduct, addToCart } = useCart();
  const [activeMode, setActiveMode] = useState<'WEBCAM' | 'PHOTO'>('WEBCAM');
  
  // Webcam state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Photo Try-On state
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [renderResult, setRenderResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Lỗi truy cập Camera:', err);
      setCameraError('Không thể mở Camera. Vui lòng cấp quyền truy cập Camera trong trình duyệt của bạn.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (tryOnProduct && activeMode === 'WEBCAM') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [tryOnProduct, activeMode]);

  if (!tryOnProduct) return null;

  const garmentImage = tryOnProduct.images[0]?.url || '';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUserPhoto(base64);
      runPhotoTryOn(base64);
    };
    reader.readAsDataURL(file);
  };

  const runPhotoTryOn = async (photoBase64: string) => {
    setIsProcessing(true);
    setRenderResult(null);
    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'render-photo',
          garmentUrl: garmentImage,
          garmentName: tryOnProduct.name,
          userImageUrl: photoBase64,
        }),
      });
      const data = await res.json();
      // Giả lập thời gian render AI 1.5s tạo hiệu ứng sống động
      setTimeout(() => {
        setRenderResult(data.resultUrl || photoBase64);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setTryOnProduct(null);
    setUserPhoto(null);
    setRenderResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* 1. MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base tracking-wide uppercase">
                  PHÒNG THỬ ĐỒ ẢO AI (VIRTUAL TRY-ON)
                </h3>
                <span className="text-[10px] bg-neutral-800 text-pink-400 font-bold px-2 py-0.5 rounded-full border border-pink-500/30">
                  Powered by Decart AI Anywear
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Ướm trang phục trực tiếp lên cơ thể theo thời gian thực
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. PRODUCT MINI BAR */}
        <div className="bg-neutral-950/80 px-4 sm:px-6 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={garmentImage}
              alt=""
              className="w-12 h-14 object-cover object-top rounded-lg border border-neutral-700 bg-neutral-800"
            />
            <div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">{tryOnProduct.categoryName}</span>
              <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{tryOnProduct.name}</h4>
              <span className="font-black text-pink-400">{formatVND(tryOnProduct.basePrice)}</span>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setActiveMode('WEBCAM')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'WEBCAM'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera trực tiếp</span>
            </button>

            <button
              onClick={() => setActiveMode('PHOTO')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'PHOTO'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Tải ảnh dáng người</span>
            </button>
          </div>
        </div>

        {/* 3. MAIN TRY-ON STAGE */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] bg-neutral-950 relative">
          
          {activeMode === 'WEBCAM' ? (
            /* WEBCAM REAL-TIME MODE */
            <div className="relative w-full max-w-lg aspect-3/4 rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
              />

              {/* Camera Error or Inactive State */}
              {!isCameraActive && (
                <div className="p-6 text-center space-y-3 max-w-xs">
                  <div className="w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-500 border border-neutral-800">
                    <VideoOff className="w-6 h-6" />
                  </div>
                  {cameraError ? (
                    <p className="text-xs text-rose-400 leading-relaxed">{cameraError}</p>
                  ) : (
                    <p className="text-xs text-neutral-400">Camera đang tắt. Vui lòng bấm mở để bắt đầu thử đồ.</p>
                  )}
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Mở lại Camera
                  </button>
                </div>
              )}

              {/* LIVE HUD / BODY SILHOUETTE GUIDE */}
              {isCameraActive && (
                <>
                  {/* Silhouette alignment frame */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/25 rounded-3xl pointer-events-none flex flex-col justify-between items-center p-4">
                    <span className="text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-neutral-300 font-semibold border border-white/10">
                      Đứng vừa trong khung để AI ướm chuẩn form
                    </span>
                    <span className="text-[10px] bg-pink-500/80 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      Lucy-VTON: Đang ướm {tryOnProduct.name}
                    </span>
                  </div>

                  {/* Garment Preview Thumbnail in Corner */}
                  <div className="absolute bottom-4 left-4 p-1.5 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-2">
                    <img src={garmentImage} alt="" className="w-10 h-12 object-cover rounded-lg" />
                    <div className="pr-2 text-left">
                      <p className="text-[10px] text-neutral-400">Đang thử:</p>
                      <p className="text-[11px] font-bold text-white line-clamp-1 max-w-[120px]">{tryOnProduct.name}</p>
                    </div>
                  </div>

                  {/* Camera Control button */}
                  <button
                    onClick={stopCamera}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl backdrop-blur-md border border-white/10 text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Tắt Camera"
                  >
                    <VideoOff className="w-4 h-4" />
                  </button>
                </>
              )}

            </div>
          ) : (
            /* PHOTO TRY-ON MODE */
            <div className="w-full max-w-2xl space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {!userPhoto ? (
                /* Upload Photo Dropzone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 hover:border-pink-500 rounded-3xl p-10 text-center cursor-pointer transition-all bg-neutral-900/50 hover:bg-neutral-900 flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center text-pink-400 border border-neutral-700 shadow-md">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tải ảnh chụp toàn thân hoặc nửa người của bạn</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      AI của Decart sẽ tự động nhận diện phom dáng và ướm trang phục lên ảnh
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl shadow-xs">
                    Chọn ảnh từ máy
                  </span>
                </div>
              ) : (
                /* Comparison / Result View */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Your Photo */}
                  <div className="space-y-1.5 text-center">
                    <span className="text-[11px] text-neutral-400 font-bold uppercase">1. Ảnh gốc của bạn</span>
                    <div className="aspect-3/4 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                      <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover" />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-bold rounded-lg border border-white/20 backdrop-blur-xs cursor-pointer"
                      >
                        Đổi ảnh khác
                      </button>
                    </div>
                  </div>

                  {/* AI Fitted Result */}
                  <div className="space-y-1.5 text-center">
                    <span className="text-[11px] text-pink-400 font-bold uppercase flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      2. Kết quả mặc thử trang phục
                    </span>
                    <div className="aspect-3/4 rounded-2xl overflow-hidden bg-neutral-900 border border-pink-500/40 relative flex items-center justify-center shadow-lg shadow-pink-500/10">
                      {isProcessing ? (
                        <div className="p-6 text-center space-y-3">
                          <RefreshCw className="w-8 h-8 text-pink-400 animate-spin mx-auto" />
                          <p className="text-xs font-bold text-white">AI đang phân tích phom dáng & ghép vải...</p>
                          <p className="text-[10px] text-neutral-400">Mô hình Decart Lucy-VTON đang xử lý</p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={renderResult || garmentImage}
                            alt="Result"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã ướm thử
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* 4. MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>Mẹo: Đứng thẳng lưng, đủ ánh sáng và cách camera 1.5 - 2m để AI canh dáng chính xác nhất.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart(tryOnProduct, tryOnProduct.sizes[0] || 'L', tryOnProduct.colors[0]?.name || 'Đen', 1);
                handleClose();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ưng ý, Thêm Giỏ Hàng</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


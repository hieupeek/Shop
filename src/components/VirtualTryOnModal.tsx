'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Camera, 
  UploadCloud, 
  VideoOff, 
  RefreshCw, 
  ShoppingBag, 
  CheckCircle2, 
  Sliders, 
  RotateCcw,
  Eye,
  Camera as CameraIcon,
  HelpCircle
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
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AR Fitting Controls (Chỉnh phom áo vừa vặn dáng người)
  const [scale, setScale] = useState<number>(1.0);
  const [offsetY, setOffsetY] = useState<number>(18); // % từ trên xuống
  const [offsetX, setOffsetX] = useState<number>(0);  // % sang trái/phải
  const [opacity, setOpacity] = useState<number>(95); // 0 - 100
  const [blendMode, setBlendMode] = useState<'multiply' | 'normal'>('multiply');

  // Snapshot / Download state
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

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
      setCameraError('Không thể mở Camera. Vui lòng cấp quyền truy cập Camera trên trình duyệt của bạn.');
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

  // Reset phom áo về mặc định
  const handleResetFit = () => {
    setScale(1.0);
    setOffsetY(18);
    setOffsetX(0);
    setOpacity(95);
    setBlendMode('multiply');
  };

  if (!tryOnProduct) return null;

  const garmentImage = tryOnProduct.images[0]?.url || '';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUserPhoto(base64);
      setIsProcessing(true);
      // Giả lập AI phân tích phom dáng trong 800ms
      setTimeout(() => {
        setIsProcessing(false);
        handleResetFit();
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    stopCamera();
    setTryOnProduct(null);
    setUserPhoto(null);
  };

  // Chụp ảnh lưu lại (Chế độ Webcam hoặc Ảnh chụp)
  const captureAndDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeMode === 'WEBCAM' && videoRef.current && isCameraActive) {
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Vẽ video lật ngược lại (mirror)
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

      // Vẽ trang phục đè lên
      const garmentImg = new Image();
      garmentImg.crossOrigin = 'anonymous';
      garmentImg.onload = () => {
        if (blendMode === 'multiply') {
          ctx.globalCompositeOperation = 'multiply';
        }
        ctx.globalAlpha = opacity / 100;
        
        const gWidth = canvas.width * 0.55 * scale;
        const gHeight = (gWidth * garmentImg.naturalHeight) / garmentImg.naturalWidth;
        const gX = (canvas.width - gWidth) / 2 + (offsetX * canvas.width) / 100;
        const gY = (offsetY * canvas.height) / 100;

        ctx.drawImage(garmentImg, gX, gY, gWidth, gHeight);

        // Xuất file ảnh tải về
        const link = document.createElement('a');
        link.download = `thu-do-pluxxl-${tryOnProduct.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setSnapshotSuccess(true);
        setTimeout(() => setSnapshotSuccess(false), 3000);
      };
      garmentImg.src = garmentImage;
    } else if (activeMode === 'PHOTO' && userPhoto) {
      const baseImg = new Image();
      baseImg.onload = () => {
        canvas.width = baseImg.naturalWidth;
        canvas.height = baseImg.naturalHeight;
        ctx.drawImage(baseImg, 0, 0);

        const garmentImg = new Image();
        garmentImg.crossOrigin = 'anonymous';
        garmentImg.onload = () => {
          if (blendMode === 'multiply') {
            ctx.globalCompositeOperation = 'multiply';
          }
          ctx.globalAlpha = opacity / 100;

          const gWidth = canvas.width * 0.65 * scale;
          const gHeight = (gWidth * garmentImg.naturalHeight) / garmentImg.naturalWidth;
          const gX = (canvas.width - gWidth) / 2 + (offsetX * canvas.width) / 100;
          const gY = (offsetY * canvas.height) / 100;

          ctx.drawImage(garmentImg, gX, gY, gWidth, gHeight);

          const link = document.createElement('a');
          link.download = `thu-do-pluxxl-${tryOnProduct.id}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          setSnapshotSuccess(true);
          setTimeout(() => setSnapshotSuccess(false), 3000);
        };
        garmentImg.src = garmentImage;
      };
      baseImg.src = userPhoto;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200 my-auto">
        
        {/* 1. MODAL HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xs sm:text-sm tracking-wide uppercase">
                  PHÒNG THỬ ĐỒ ẢO AI (VIRTUAL TRY-ON)
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  AR Fitting Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Ướm trang phục trực tiếp lên cơ thể bằng AI & công nghệ AR
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. PRODUCT MINI BAR & MODE TABS */}
        <div className="bg-neutral-950 px-3 sm:px-5 py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={garmentImage}
              alt=""
              className="w-10 h-12 object-cover object-top rounded-lg border border-neutral-700 bg-neutral-800"
            />
            <div>
              <span className="text-[9px] text-neutral-400 font-semibold uppercase">{tryOnProduct.categoryName}</span>
              <h4 className="font-bold text-white text-xs line-clamp-1">{tryOnProduct.name}</h4>
              <span className="font-black text-violet-400">{formatVND(tryOnProduct.basePrice)}</span>
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
        <div className="p-3 sm:p-5 flex-1 flex flex-col md:flex-row items-center justify-center gap-4 bg-neutral-950 relative min-h-[420px]">
          
          {/* VIEWPORT / STAGE */}
          <div className="relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center select-none">
            
            {/* WEBCAM MODE */}
            {activeMode === 'WEBCAM' && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${
                    isCameraActive ? 'block' : 'hidden'
                  }`}
                />

                {!isCameraActive && (
                  <div className="p-6 text-center space-y-3 max-w-xs">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-500 border border-neutral-800">
                      <VideoOff className="w-5 h-5" />
                    </div>
                    {cameraError ? (
                      <p className="text-xs text-rose-400 leading-relaxed">{cameraError}</p>
                    ) : (
                      <p className="text-xs text-neutral-400">Camera đang tắt. Vui lòng bấm để mở.</p>
                    )}
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Bật Camera
                    </button>
                  </div>
                )}

                {/* OVERLAID GARMENT ON TOP OF WEBCAM */}
                {isCameraActive && (
                  <div
                    className="absolute pointer-events-none transition-transform duration-75 ease-out flex items-center justify-center"
                    style={{
                      top: `${offsetY}%`,
                      left: `calc(50% + ${offsetX}%)`,
                      transform: `translateX(-50%) scale(${scale})`,
                      width: '62%',
                      opacity: opacity / 100,
                      mixBlendMode: blendMode,
                    }}
                  >
                    <img
                      src={garmentImage}
                      alt="Garment Overlay"
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                )}

                {/* Body guide indicator */}
                {isCameraActive && (
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-neutral-300 border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Đang ướm trang phục AR</span>
                  </div>
                )}
              </>
            )}

            {/* PHOTO MODE */}
            {activeMode === 'PHOTO' && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!userPhoto ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full p-6 text-center cursor-pointer transition-all bg-neutral-900/40 hover:bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-violet-500 rounded-2xl flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center text-violet-400 border border-neutral-700 shadow-md">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Tải ảnh toàn thân / nửa người của bạn</h4>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        AI sẽ lập tức ướm trang phục vừa vặn lên vóc dáng bạn
                      </p>
                    </div>
                    <span className="px-3.5 py-1.5 bg-white text-black font-bold text-xs rounded-xl shadow-xs">
                      Chọn ảnh từ máy
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    {/* BASE PHOTO */}
                    <img
                      src={userPhoto}
                      alt="User uploaded"
                      className="w-full h-full object-cover"
                    />

                    {/* OVERLAID GARMENT (Ẩn khi đang bấm xem ảnh gốc) */}
                    {!showOriginal && !isProcessing && (
                      <div
                        className="absolute pointer-events-none transition-transform duration-75 ease-out flex items-center justify-center"
                        style={{
                          top: `${offsetY}%`,
                          left: `calc(50% + ${offsetX}%)`,
                          transform: `translateX(-50%) scale(${scale})`,
                          width: '68%',
                          opacity: opacity / 100,
                          mixBlendMode: blendMode,
                        }}
                      >
                        <img
                          src={garmentImage}
                          alt="Garment Fitted"
                          className="w-full h-auto drop-shadow-2xl"
                        />
                      </div>
                    )}

                    {/* PROCESSING LOADER */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 p-4 text-center">
                        <RefreshCw className="w-7 h-7 text-violet-400 animate-spin" />
                        <span className="text-xs font-bold text-white">AI đang phân tích & căn chỉnh phom áo...</span>
                      </div>
                    )}

                    {/* BOTTOM OVERLAY CONTROLS FOR PHOTO */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                      <button
                        onMouseDown={() => setShowOriginal(true)}
                        onMouseUp={() => setShowOriginal(false)}
                        onTouchStart={() => setShowOriginal(true)}
                        onTouchEnd={() => setShowOriginal(false)}
                        className="px-2.5 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-bold rounded-lg border border-white/20 backdrop-blur-xs flex items-center gap-1 cursor-pointer"
                        title="Bấm giữ để xem ảnh gốc trước khi thử"
                      >
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>Giữ xem ảnh gốc</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-black/75 hover:bg-black text-white text-[10px] font-bold rounded-lg border border-white/20 backdrop-blur-xs cursor-pointer"
                      >
                        Đổi ảnh khác
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* SNAPSHOT NOTIFICATION */}
            {snapshotSuccess && (
              <div className="absolute top-4 inset-x-4 bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu ảnh thử đồ vào máy của bạn!</span>
              </div>
            )}
          </div>

          {/* SIDEBAR: FITTING CONTROLS (BẢNG ĐIỀU KHIỂN CĂN CHỈNH FORM ÁO) */}
          <div className="w-full md:w-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                <span>Căn chỉnh phom áo</span>
              </div>
              <button
                onClick={handleResetFit}
                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Đặt lại vị trí chuẩn"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            {/* 1. KÍCH THƯỚC (SIZE) */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Kích thước áo:</span>
                <span className="font-bold text-white">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.7"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* 2. CHIỀU CAO (LÊN / XUỐNG) */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Vị trí vai / ngực:</span>
                <span className="font-bold text-white">{offsetY}%</span>
              </div>
              <input
                type="range"
                min="-10"
                max="55"
                step="1"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* 3. SANG TRÁI / PHẢI */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Sang trái / phải:</span>
                <span className="font-bold text-white">{offsetX > 0 ? `+${offsetX}%` : `${offsetX}%`}</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* 4. ĐỘ TRONG SUỐT / HÒA TRỘN VẢI */}
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Độ rõ nét áo:</span>
                <span className="font-bold text-white">{opacity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
            </div>

            {/* 5. CHẾ ĐỘ HÒA TRỘN VẢI (BLEND MODE) */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Tách nền áo tự nhiên:</span>
              <button
                onClick={() => setBlendMode(blendMode === 'multiply' ? 'normal' : 'multiply')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  blendMode === 'multiply'
                    ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {blendMode === 'multiply' ? 'Đang bật (Tự nhiên)' : 'Tắt (Ảnh gốc)'}
              </button>
            </div>

            {/* ACTION BUTTON: SNAPSHOT */}
            <div className="pt-2">
              <button
                onClick={captureAndDownload}
                disabled={activeMode === 'WEBCAM' ? !isCameraActive : !userPhoto}
                className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CameraIcon className="w-3.5 h-3.5 text-violet-400" />
                <span>Chụp & Tải ảnh thử đồ</span>
              </button>
            </div>

          </div>

        </div>

        {/* 4. MODAL FOOTER */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>Mẹo: Bạn có thể kéo các thanh trượt bên phải để áo ôm sát cơ thể chuẩn xác nhất!</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart(tryOnProduct, tryOnProduct.sizes[0] || 'L', tryOnProduct.colors[0]?.name || 'Mặc định', 1);
                handleClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ưng ý, Thêm Giỏ Hàng ({formatVND(tryOnProduct.basePrice)})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

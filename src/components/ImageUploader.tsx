'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, Image as ImageIcon, Loader2, CloudUpload } from 'lucide-react';

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một file hình ảnh (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('Đang tải ảnh lên Cloud Storage...');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Tải ảnh thất bại');
      }

      onChange(data.url);
      setUploadStatus(
        data.storage === 'CLOUDINARY_CDN'
          ? 'Đã tải lên Cloudinary thành công!'
          : 'Đã tải ảnh lên (Chế độ preview trực tiếp)'
      );
    } catch (err: any) {
      alert('Lỗi tải ảnh: ' + err.message);
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        /* PREVIEW CONTAINER */
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 p-2 flex items-center gap-4">
          <div className="w-20 h-24 rounded-xl overflow-hidden bg-white border border-neutral-200 shrink-0">
            <img
              src={value}
              alt="Preview sản phẩm"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ảnh đã sẵn sàng</span>
            </div>
            <p className="text-[11px] text-neutral-500 truncate" title={value}>
              {value}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-[#080808] underline hover:text-[#e5677d] cursor-pointer"
            >
              Chọn ảnh khác thay thế
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange('');
              setUploadStatus(null);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 cursor-pointer"
            title="Gỡ ảnh này"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* UPLOAD DROPZONE */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-6 text-center cursor-pointer transition-all bg-neutral-50 hover:bg-neutral-100/70 flex flex-col items-center justify-center ${
            isUploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-neutral-800 animate-spin mx-auto" />
              <p className="text-xs font-bold text-neutral-700">{uploadStatus}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-neutral-200 text-neutral-600">
                <CloudUpload className="w-6 h-6 text-[#080808]" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">
                  Bấm để chọn ảnh từ máy tính của bạn
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Hỗ trợ định dạng JPG, PNG, WEBP (Tự động nén tối ưu dung lượng)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadStatus && !isUploading && (
        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{uploadStatus}</span>
        </p>
      )}
    </div>
  );
}


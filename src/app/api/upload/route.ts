import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file ảnh tải lên' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Kiểm tra đã cấu hình Cloudinary trong .env chưa
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      // Tải trực tiếp lên Cloudinary CDN
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'shop_fashion/products',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }, // Tự động nén WebP/AVIF
              { width: 1200, crop: 'limit' },            // Giới hạn chiều rộng tối ưu
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        storage: 'CLOUDINARY_CDN',
      });
    } else {
      // Chế độ mô phỏng / preview ngay lập tức trước khi người dùng điền API Key
      const base64Data = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        publicId: `preview-${Date.now()}`,
        storage: 'PREVIEW_MODE',
        message: 'Bạn chưa cấu hình CLOUDINARY_API_KEY trong file .env. Hệ thống đang hiển thị ảnh dạng preview trực tiếp.',
      });
    }
  } catch (error: any) {
    console.error('Lỗi upload ảnh:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi tải ảnh lên.' },
      { status: 500 }
    );
  }
}


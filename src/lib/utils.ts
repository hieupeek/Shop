import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export type SizeRecommendationResult = {
  recommendedSize: string;
  alternativeSize?: string;
  fitAdvice: string;
  confidenceScore: number;
};

export function calculateRecommendedSize(
  gender: 'MEN' | 'WOMEN',
  heightCm: number,
  weightKg: number
): SizeRecommendationResult {
  if (gender === 'WOMEN') {
    if (weightKg < 55) {
      return {
        recommendedSize: 'L (hoặc FreeSize)',
        fitAdvice: 'Bạn có vóc dáng vừa vặn. Khuyên dùng size L hoặc form ôm nhẹ.',
        confidenceScore: 85,
      };
    } else if (weightKg <= 65) {
      return {
        recommendedSize: 'XL',
        alternativeSize: '2XL (nếu thích mặc rộng)',
        fitAdvice: 'Size XL vừa vặn tôn dáng, che nhẹ khuyết điểm eo và bắp tay.',
        confidenceScore: 95,
      };
    } else if (weightKg <= 75) {
      return {
        recommendedSize: '2XL',
        alternativeSize: '3XL',
        fitAdvice: 'Size 2XL chuẩn phom người từ 66 - 75kg, form suông giấu bụng.',
        confidenceScore: 95,
      };
    } else if (weightKg <= 85) {
      return {
        recommendedSize: '3XL',
        alternativeSize: '4XL',
        fitAdvice: 'Size 3XL thiết kế mở rộng vòng bụng và nách, cử động cực kỳ thoải mái.',
        confidenceScore: 95,
      };
    } else {
      return {
        recommendedSize: '4XL',
        alternativeSize: '5XL (đặt may/liên hệ tư vấn)',
        fitAdvice: 'Khuyên dùng 4XL dòng phom xòe chữ A hoặc set bộ cạp chun co giãn.',
        confidenceScore: 90,
      };
    }
  } else {
    // MEN
    if (weightKg < 65) {
      return {
        recommendedSize: 'XL',
        fitAdvice: 'Form rộng rãi, phong cách trẻ trung năng động.',
        confidenceScore: 85,
      };
    } else if (weightKg <= 75) {
      return {
        recommendedSize: '2XL',
        alternativeSize: '3XL',
        fitAdvice: 'Size 2XL chuẩn phom cho nam 65 - 75kg, vừa vặn vai và ngực.',
        confidenceScore: 95,
      };
    } else if (weightKg <= 88) {
      return {
        recommendedSize: '3XL',
        alternativeSize: '4XL',
        fitAdvice: 'Size 3XL giấu bụng bia hiệu quả, tay áo rộng rãi không kích nách.',
        confidenceScore: 95,
      };
    } else if (weightKg <= 105) {
      return {
        recommendedSize: '4XL',
        alternativeSize: '5XL',
        fitAdvice: 'Size 4XL rộng rãi thoải mái cho các quý ông từ 89 - 105kg.',
        confidenceScore: 95,
      };
    } else if (weightKg <= 120) {
      return {
        recommendedSize: '5XL',
        alternativeSize: '6XL',
        fitAdvice: 'Size 5XL phom đại, chất vải co giãn 4 chiều hỗ trợ tối đa khi ngồi.',
        confidenceScore: 92,
      };
    } else {
      return {
        recommendedSize: '6XL',
        fitAdvice: 'Size 6XL (120kg - 135kg+), thiết kế chuyên biệt cho thể hình ngoại cỡ cao to.',
        confidenceScore: 90,
      };
    }
  }
}


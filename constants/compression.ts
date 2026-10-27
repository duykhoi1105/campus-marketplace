/**
 * Cấu hình nén ảnh theo tham số sinh viên đề cương (chất lượng 63%, tối đa 800px)
 */
export const COMPRESSION_CONFIG = {
  MAX_DIMENSION: 800,
  JPEG_QUALITY: 0.63,
  FORMAT: 'jpeg' as const,
};

/**
 * Công thức tính tỷ lệ giảm dung lượng:
 * Tỷ lệ giảm (%) = (Dung lượng ban đầu - Dung lượng sau nén) / Dung lượng ban đầu × 100
 */
export function calculateCompressionRatio(originalBytes: number, compressedBytes: number): number {
  if (originalBytes <= 0) return 0;
  const ratio = ((originalBytes - compressedBytes) / originalBytes) * 100;
  return parseFloat(Math.max(0, Math.min(99.9, ratio)).toFixed(2));
}

/**
 * Tính toán kích thước co dãn tối ưu giữ nguyên tỷ lệ khung hình (Aspect Ratio)
 */
export function calculateTargetDimensions(
  width: number,
  height: number,
  maxDimension: number = COMPRESSION_CONFIG.MAX_DIMENSION
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  if (width >= height) {
    return {
      width: maxDimension,
      height: Math.round((height * maxDimension) / width),
    };
  }

  return {
    width: Math.round((width * maxDimension) / height),
    height: maxDimension,
  };
}


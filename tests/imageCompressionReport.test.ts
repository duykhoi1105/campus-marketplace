import { describe, it, expect } from 'vitest';
import {
  COMPRESSION_CONFIG,
  calculateCompressionRatio,
  calculateTargetDimensions,
} from '../constants/compression';

describe('Kiểm thử Quy Trình & Công Thức Nén Ảnh (REQ-03)', () => {
  it('cấu hình nén đúng chất lượng 63% và kích thước tối đa 800px theo đề cương', () => {
    expect(COMPRESSION_CONFIG.JPEG_QUALITY).toBe(0.63);
    expect(COMPRESSION_CONFIG.MAX_DIMENSION).toBe(800);
  });

  it('áp dụng đúng công thức tính tỷ lệ giảm dung lượng (%) = (Dung lượng ban đầu - Dung lượng sau nén) / Dung lượng ban đầu × 100', () => {
    const originalBytes = 2450000; // 2.45 MB ảnh chụp từ điện thoại
    const compressedBytes = 420000; // 420 KB sau khi resize và nén 63%

    const ratio = calculateCompressionRatio(originalBytes, compressedBytes);

    expect(ratio).toBe(82.86);
    expect(ratio).toBeGreaterThan(60); // Phải giảm ít nhất 60%
  });

  it('xử lý tỷ lệ co dãn giữ nguyên tỷ lệ khung hình (aspect ratio 4:3)', () => {
    const originalWidth = 4000;
    const originalHeight = 3000;

    const target = calculateTargetDimensions(originalWidth, originalHeight);

    expect(target.width).toBe(800);
    expect(target.height).toBe(600); // 4000x3000 -> 800x600 (chuẩn 4:3)
  });

  it('xử lý ảnh dọc (portrait) chính xác', () => {
    const originalWidth = 3000;
    const originalHeight = 4000;

    const target = calculateTargetDimensions(originalWidth, originalHeight);

    expect(target.width).toBe(600);
    expect(target.height).toBe(800);
  });

  it('giữ nguyên kích thước nếu ảnh đã nhỏ hơn 800px', () => {
    const target = calculateTargetDimensions(640, 480);
    expect(target.width).toBe(640);
    expect(target.height).toBe(480);
  });
});


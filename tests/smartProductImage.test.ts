import { describe, it, expect } from 'vitest';
import {
  getSmartImageByTitle,
  enrichListingWithSmartImage,
  autoAssignImagesToAllListings,
  PRODUCT_IMAGE_RULES,
  CATEGORY_DEFAULT_IMAGES,
} from '../utils/smartProductImage';
import { Listing } from '../types/marketplace';

describe('Smart Product Image Matcher (utils/smartProductImage.ts)', () => {
  it('khớp chính xác ảnh máy tính cầm tay Casio', () => {
    const result = getSmartImageByTitle('Máy tính cầm tay Casio fx-580VN X', 'electronics');
    expect(result.label).toBe('Máy tính cầm tay sinh viên');
    expect(result.url).toContain('photo-1587145820266');
    expect(result.compressedSizeBytes).toBeLessThan(result.originalSizeBytes);
  });

  it('khớp chính xác ảnh giáo trình & sách học tập dù có hoặc không có dấu tiếng Việt', () => {
    const resultWithAccent = getSmartImageByTitle('Giáo trình Cấu trúc dữ liệu & Giải thuật', 'textbooks');
    const resultNoAccent = getSmartImageByTitle('Giao trinh React Native', 'textbooks');

    expect(resultWithAccent.label).toBe('Sách & Giáo trình đại học');
    expect(resultNoAccent.label).toBe('Sách & Giáo trình đại học');
    expect(resultWithAccent.url).toBe(resultNoAccent.url);
  });

  it('khớp chính xác ảnh chuột máy tính Logitech', () => {
    const result = getSmartImageByTitle('Chuột không dây Logitech M331 Silent', 'electronics');
    expect(result.label).toBe('Chuột máy tính');
    expect(result.url).toContain('photo-1615663245857');
  });

  it('khớp chính xác ảnh bàn phím máy tính', () => {
    const result = getSmartImageByTitle('Bàn phím cơ Dareu EK87', 'electronics');
    expect(result.label).toBe('Bàn phím máy tính');
    expect(result.url).toContain('photo-1587829741301');
  });

  it('khớp chính xác ảnh áo đồng phục sinh viên DNTU', () => {
    const result = getSmartImageByTitle('Áo đồng phục thể dục DNTU size L', 'uniforms');
    expect(result.label).toBe('Áo đồng phục sinh viên');
    expect(result.url).toContain('photo-1521572267360');
  });

  it('khớp chính xác ảnh bình đun siêu tốc KTX', () => {
    const result = getSmartImageByTitle('Bình đun siêu tốc Sunhouse 1.8L', 'living');
    expect(result.label).toBe('Bình đun siêu tốc KTX');
    expect(result.url).toContain('photo-1574269909862');
  });

  it('khớp chính xác ảnh bình giữ nhiệt sinh viên', () => {
    const result = getSmartImageByTitle('Bình giữ nhiệt Lock&Lock 500ml', 'living');
    expect(result.label).toBe('Bình giữ nhiệt sinh viên');
    expect(result.url).toContain('photo-1602143407151');
  });

  it('khớp chính xác ảnh tập vở Campus', () => {
    const result = getSmartImageByTitle('Combo 5 cuốn vở kẻ ngang Campus 200 trang', 'stationery');
    expect(result.label).toBe('Tập vở & Sổ tay Campus');
    expect(result.url).toContain('photo-1589829085413');
  });

  it('khớp chính xác ảnh bút viết và dụng cụ học tập', () => {
    const result = getSmartImageByTitle('Hộp bút bi Thiên Long 20 cây', 'stationery');
    expect(result.label).toBe('Dụng cụ học tập');
    expect(result.url).toContain('photo-1585336261026');
  });

  it('khớp chính xác ảnh bàn học gấp gọn sinh viên', () => {
    const result = getSmartImageByTitle('Bàn học gấp gọn sinh viên chân chữ U', 'living');
    expect(result.label).toBe('Bàn học gấp gọn KTX');
    expect(result.url).toContain('photo-1518455027359');
  });

  it('khớp chính xác ảnh balo sinh viên', () => {
    const result = getSmartImageByTitle('Balo The North Face đựng laptop 15.6 inch', 'other');
    expect(result.label).toBe('Balo sinh viên đựng laptop');
    expect(result.url).toContain('photo-1553062407-98eeb64c6a62');
  });

  it('khớp chính xác ảnh thẻ nhớ SanDisk Ultra', () => {
    const result = getSmartImageByTitle('Thẻ nhớ microSD SanDisk Ultra 64GB', 'electronics');
    expect(result.label).toBe('Thẻ nhớ & Thiết bị lưu trữ');
    expect(result.url).toContain('photo-1597740985671');
  });

  it('khớp chính xác ảnh quạt mini để bàn KTX', () => {
    const result = getSmartImageByTitle('Quạt mini tích điện để bàn học', 'living');
    expect(result.label).toBe('Quạt mini để bàn KTX');
    expect(result.url).toContain('photo-1581092160607');
  });

  it('khớp chính xác ảnh đèn bàn học chống cận', () => {
    const result = getSmartImageByTitle('Đèn học LED chống cận thị KTX', 'living');
    expect(result.label).toBe('Đèn bàn học sinh viên');
    expect(result.url).toContain('photo-1507473885765');
  });

  it('khớp chính xác pin sạc dự phòng & dây cáp', () => {
    const result = getSmartImageByTitle('Pin sạc dự phòng Anker 10000mAh', 'electronics');
    expect(result.label).toBe('Pin sạc dự phòng & Dây cáp');
    expect(result.url).toContain('photo-1609592426868');
  });

  it('fallback về ảnh chuẩn của danh mục khi tiêu đề không khớp từ khóa đặc thù', () => {
    const fallbackTextbook = getSmartImageByTitle('Vật phẩm học phần bí ẩn XYZ', 'textbooks');
    expect(fallbackTextbook.url).toBe(CATEGORY_DEFAULT_IMAGES.textbooks.url);

    const fallbackElectronics = getSmartImageByTitle('Thiết bị chuyên ngành đặc biệt ABC', 'electronics');
    expect(fallbackElectronics.url).toBe(CATEGORY_DEFAULT_IMAGES.electronics.url);

    const fallbackEmpty = getSmartImageByTitle('', 'uniforms');
    expect(fallbackEmpty.url).toBe(CATEGORY_DEFAULT_IMAGES.uniforms.url);
  });

  it('enrichListingWithSmartImage giữ nguyên nếu đã có photoUri hợp lệ', () => {
    const existingListing: Listing = {
      id: 'LIST-TEST-01',
      sellerId: 'USR-01',
      sellerName: 'Nguyễn Duy Khôi',
      sellerPhone: '0901234567',
      title: 'Món đồ có ảnh sẵn',
      description: 'Mô tả',
      category: 'stationery',
      price: 20000,
      stock: 1,
      photoUri: 'https://example.com/custom-photo.jpg',
      createdAt: '2026-10-27T00:00:00.000Z',
      updatedAt: '2026-10-27T00:00:00.000Z',
      isAvailable: true,
      condition: 'new',
    };

    const enriched = enrichListingWithSmartImage(existingListing);
    expect(enriched.photoUri).toBe('https://example.com/custom-photo.jpg');
  });

  it('enrichListingWithSmartImage tự động điền photoUri theo tên nếu trống', () => {
    const noPhotoListing: Listing = {
      id: 'LIST-TEST-02',
      sellerId: 'USR-01',
      sellerName: 'Nguyễn Duy Khôi',
      sellerPhone: '0901234567',
      title: 'Máy tính Casio fx-580',
      description: 'Mô tả',
      category: 'electronics',
      price: 350000,
      stock: 1,
      photoUri: '',
      createdAt: '2026-10-27T00:00:00.000Z',
      updatedAt: '2026-10-27T00:00:00.000Z',
      isAvailable: true,
      condition: 'like-new',
    };

    const enriched = enrichListingWithSmartImage(noPhotoListing);
    expect(enriched.photoUri).toContain('photo-1587145820266');
    expect(enriched.originalPhotoSize).toBeGreaterThan(0);
    expect(enriched.compressedPhotoSize).toBeGreaterThan(0);
  });

  it('autoAssignImagesToAllListings tự động xử lý hàng loạt danh sách tin đăng', () => {
    const list: Listing[] = [
      {
        id: 'L1',
        sellerId: 'U1',
        sellerName: 'Seller',
        sellerPhone: '0901',
        title: 'Bàn phím cơ',
        description: '',
        category: 'electronics',
        price: 200000,
        stock: 2,
        photoUri: '',
        createdAt: '',
        updatedAt: '',
        isAvailable: true,
      },
      {
        id: 'L2',
        sellerId: 'U1',
        sellerName: 'Seller',
        sellerPhone: '0901',
        title: 'Giáo trình Toán cao cấp',
        description: '',
        category: 'textbooks',
        price: 40000,
        stock: 1,
        photoUri: '',
        createdAt: '',
        updatedAt: '',
        isAvailable: true,
      },
    ];

    const result = autoAssignImagesToAllListings(list);
    expect(result[0].photoUri).toContain('photo-1587829741301');
    expect(result[1].photoUri).toContain('photo-1532012164546');
  });

  it('tất cả quy tắc từ khóa đều có tỉ lệ nén hợp lệ (> 85%)', () => {
    PRODUCT_IMAGE_RULES.forEach(rule => {
      expect(rule.keywords.length).toBeGreaterThan(0);
      expect(rule.url).toMatch(/^https:\/\//);
      expect(rule.originalSizeBytes).toBeGreaterThan(rule.compressedSizeBytes);
      const ratio = ((rule.originalSizeBytes - rule.compressedSizeBytes) / rule.originalSizeBytes) * 100;
      expect(ratio).toBeGreaterThan(85);
    });
  });
});

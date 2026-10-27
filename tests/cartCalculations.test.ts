import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateOrderTotal,
  validateQuantityChange,
  validateCartBeforeCheckout,
  SHIPPING_RATES,
} from '../utils/cartCalculations';
import { CartItem, Listing } from '../types/marketplace';

const mockListingA: Listing = {
  id: 'LIST-01',
  sellerId: 'USR-02',
  sellerName: 'Duy Khôi',
  title: 'Giáo trình Cấu trúc dữ liệu DNTU',
  description: 'Sách mới',
  category: 'textbooks',
  price: 45000,
  stock: 4,
  photoUri: 'https://example.com/a.jpg',
  createdAt: '2026-10-20T08:00:00.000Z',
  isAvailable: true,
};

const mockListingB: Listing = {
  id: 'LIST-02',
  sellerId: 'USR-02',
  sellerName: 'Duy Khôi',
  title: 'Máy tính Casio fx-580VN X',
  description: 'Máy tốt',
  category: 'electronics',
  price: 320000,
  stock: 2,
  photoUri: 'https://example.com/b.jpg',
  createdAt: '2026-10-21T09:30:00.000Z',
  isAvailable: true,
};

const mockListingOutOfStock: Listing = {
  id: 'LIST-11',
  sellerId: 'USR-03',
  sellerName: 'CLB CNTT',
  title: 'Áo sơ mi đồng phục DNTU',
  description: 'Đã hết hàng',
  category: 'uniforms',
  price: 90000,
  stock: 0,
  photoUri: 'https://example.com/c.jpg',
  createdAt: '2026-10-27T11:00:00.000Z',
  isAvailable: false,
};

describe('1. Logic Tính Tạm Tính (calculateSubtotal)', () => {
  it('trả về 0 khi giỏ hàng rỗng', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('tính đúng tổng tiền khi có 1 mặt hàng', () => {
    const items: CartItem[] = [{ listingId: 'LIST-01', quantity: 2, listing: mockListingA }];
    expect(calculateSubtotal(items)).toBe(90000); // 45,000 * 2
  });

  it('tính đúng tổng tiền khi có nhiều mặt hàng', () => {
    const items: CartItem[] = [
      { listingId: 'LIST-01', quantity: 2, listing: mockListingA }, // 90,000
      { listingId: 'LIST-02', quantity: 1, listing: mockListingB }, // 320,000
    ];
    expect(calculateSubtotal(items)).toBe(410000);
  });
});

describe('2. Logic Phí Vận Chuyển Khuôn Viên (calculateShippingFee)', () => {
  it('giao nhận trực tiếp trong khuôn viên (CAMPUS_PICKUP) luôn có phí bằng 0', () => {
    expect(calculateShippingFee('CAMPUS_PICKUP', 50000)).toBe(0);
    expect(calculateShippingFee('CAMPUS_PICKUP', 500000)).toBe(0);
  });

  it('giao tận phòng Ký túc xá (DORM_DELIVERY) dưới 200.000đ thì phí là 10.000đ', () => {
    expect(calculateShippingFee('DORM_DELIVERY', 150000)).toBe(SHIPPING_RATES.DORM_DELIVERY_FEE);
    expect(calculateShippingFee('DORM_DELIVERY', 199000)).toBe(10000);
  });

  it('giao tận phòng Ký túc xá từ 200.000đ trở lên được miễn phí vận chuyển (0đ)', () => {
    expect(calculateShippingFee('DORM_DELIVERY', 200000)).toBe(0);
    expect(calculateShippingFee('DORM_DELIVERY', 350000)).toBe(0);
  });
});

describe('3. Logic Tính Tổng Thanh Toán (calculateOrderTotal)', () => {
  it('tổng tiền bằng subtotal cộng shippingFee', () => {
    expect(calculateOrderTotal(150000, 10000)).toBe(160000);
    expect(calculateOrderTotal(250000, 0)).toBe(250000);
  });
});

describe('4. Logic Kiểm Soát Tồn Kho (validateQuantityChange)', () => {
  it('chặn khi giảm số lượng xuống 0 hoặc số âm', () => {
    const res = validateQuantityChange(1, -1, 4);
    expect(res.valid).toBe(false);
    expect(res.newQty).toBe(1);
    expect(res.reason).toContain('tối thiểu là 1');
  });

  it('chặn khi tăng số lượng vượt quá tồn kho', () => {
    const res = validateQuantityChange(4, 1, 4);
    expect(res.valid).toBe(false);
    expect(res.newQty).toBe(4);
    expect(res.reason).toContain('vượt quá tồn kho');
  });

  it('chấp nhận thay đổi hợp lệ trong phạm vi tồn kho', () => {
    const res = validateQuantityChange(2, 1, 4);
    expect(res.valid).toBe(true);
    expect(res.newQty).toBe(3);
  });
});

describe('5. Kiểm Tra Giỏ Hàng Trước Checkout (validateCartBeforeCheckout)', () => {
  it('phát hiện giỏ hàng rỗng', () => {
    const check = validateCartBeforeCheckout([], [mockListingA]);
    expect(check.isValid).toBe(false);
    expect(check.issues[0]).toContain('trống');
  });

  it('phát hiện mặt hàng đã hết hàng trong giỏ', () => {
    const items: CartItem[] = [
      { listingId: mockListingOutOfStock.id, quantity: 1, listing: mockListingOutOfStock },
    ];
    const check = validateCartBeforeCheckout(items, [mockListingOutOfStock]);
    expect(check.isValid).toBe(false);
    expect(check.issues[0]).toContain('hết hàng');
  });

  it('phát hiện số lượng trong giỏ vượt quá tồn kho thực tế cập nhật', () => {
    const updatedListingA = { ...mockListingA, stock: 1 };
    const items: CartItem[] = [
      { listingId: mockListingA.id, quantity: 3, listing: mockListingA },
    ];
    const check = validateCartBeforeCheckout(items, [updatedListingA]);
    expect(check.isValid).toBe(false);
    expect(check.issues[0]).toContain('chỉ còn 1');
  });

  it('hợp lệ khi toàn bộ mặt hàng còn đủ tồn kho', () => {
    const items: CartItem[] = [
      { listingId: mockListingA.id, quantity: 2, listing: mockListingA },
      { listingId: mockListingB.id, quantity: 1, listing: mockListingB },
    ];
    const check = validateCartBeforeCheckout(items, [mockListingA, mockListingB]);
    expect(check.isValid).toBe(true);
    expect(check.issues).toHaveLength(0);
  });
});


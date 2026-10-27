import { describe, it, expect } from 'vitest';
import { Listing, CartItem, Order } from '../types/marketplace';
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateOrderTotal,
  validateCartBeforeCheckout,
} from '../utils/cartCalculations';

describe('Luồng Nghiệp Vụ Hoàn Chỉnh: Giỏ Hàng & Tồn Kho (E2E Business Flow)', () => {
  const catalog: Listing[] = [
    {
      id: 'LIST-01',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên)',
      title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật',
      description: 'Sách mới',
      category: 'textbooks',
      price: 45000,
      stock: 3,
      photoUri: 'https://example.com/1.jpg',
      createdAt: '2026-10-20T08:00:00.000Z',
      isAvailable: true,
    },
    {
      id: 'LIST-02',
      sellerId: 'USR-03',
      sellerName: 'CLB CNTT',
      title: 'Chuột không dây Logitech M331',
      description: 'Click êm',
      category: 'electronics',
      price: 180000,
      stock: 1,
      photoUri: 'https://example.com/2.jpg',
      createdAt: '2026-10-21T09:30:00.000Z',
      isAvailable: true,
    },
  ];

  it('thực hiện quy trình chọn món, kiểm tra khả dụng, tính tiền và tạo đơn hàng', () => {
    // Bước 1: Người mua chọn 2 cuốn giáo trình và 1 chuột không dây
    const cart: CartItem[] = [
      { listingId: catalog[0].id, quantity: 2, listing: catalog[0] },
      { listingId: catalog[1].id, quantity: 1, listing: catalog[1] },
    ];

    // Bước 2: Kiểm tra tồn kho trước khi thanh toán
    const preCheck = validateCartBeforeCheckout(cart, catalog);
    expect(preCheck.isValid).toBe(true);
    expect(preCheck.issues).toHaveLength(0);

    // Bước 3: Tính toán chi phí
    const subtotal = calculateSubtotal(cart);
    expect(subtotal).toBe(45000 * 2 + 180000 * 1); // 90,000 + 180,000 = 270,000đ

    // Bước 4: Chọn phương thức giao Ký túc xá (>= 200,000đ nên được freeship 0đ)
    const shippingFee = calculateShippingFee('DORM_DELIVERY', subtotal);
    expect(shippingFee).toBe(0); // Vì 270,000 >= 200,000

    const total = calculateOrderTotal(subtotal, shippingFee);
    expect(total).toBe(270000);

    // Bước 5: Tạo bản ghi đơn hàng cố định giá tại thời điểm xác nhận
    const order: Order = {
      id: 'ORD-TEST-001',
      buyerId: 'USR-01',
      buyerName: 'Nguyễn Duy Khôi',
      items: cart.map(c => ({
        listingId: c.listingId,
        title: c.listing.title,
        price: c.listing.price,
        quantity: c.quantity,
        photoUri: c.listing.photoUri,
      })),
      subtotal,
      shippingMethod: 'DORM_DELIVERY',
      shippingFee,
      total,
      pickupLocation: 'Phòng 302, Ký túc xá Khu B, DNTU',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    expect(order.id).toBe('ORD-TEST-001');
    expect(order.items).toHaveLength(2);
    expect(order.total).toBe(270000);
    expect(order.status).toBe('CONFIRMED');

    // Bước 6: Trừ tồn kho trong danh mục sau khi đặt hàng
    const updatedCatalog = catalog.map(item => {
      const ordered = cart.find(c => c.listingId === item.id);
      if (ordered) {
        const nextStock = item.stock - ordered.quantity;
        return {
          ...item,
          stock: nextStock,
          isAvailable: nextStock > 0,
        };
      }
      return item;
    });

    // Món 1 còn 3 - 2 = 1
    expect(updatedCatalog[0].stock).toBe(1);
    expect(updatedCatalog[0].isAvailable).toBe(true);

    // Món 2 còn 1 - 1 = 0 (hết hàng)
    expect(updatedCatalog[1].stock).toBe(0);
    expect(updatedCatalog[1].isAvailable).toBe(false);

    // Bước 7: Người mua khác thử mua lại món 2 đã hết hàng -> bị chặn
    const secondBuyerCart: CartItem[] = [
      { listingId: updatedCatalog[1].id, quantity: 1, listing: updatedCatalog[1] },
    ];
    const secondCheck = validateCartBeforeCheckout(secondBuyerCart, updatedCatalog);
    expect(secondCheck.isValid).toBe(false);
    expect(secondCheck.issues[0]).toContain('hết hàng');
  });
});


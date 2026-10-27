import { CartItem, Listing, ShippingMethod } from '@/types/marketplace';

// Quy tắc phí giao hàng trong khuôn viên trường Đại học Công nghệ Đồng Nai:
// 1. Nhận trực tiếp tại khuôn viên (Campus Pickup): 0 VNĐ (Miễn phí)
// 2. Giao tận phòng ký túc xá (Dorm Delivery): 10.000 VNĐ. Miễn phí nếu đơn hàng từ 200.000 VNĐ trở lên.
export const SHIPPING_RATES = {
  CAMPUS_PICKUP_FEE: 0,
  DORM_DELIVERY_FEE: 10000,
  FREE_DORM_THRESHOLD: 200000,
};

/**
 * Tính tạm tính (Subtotal) của các sản phẩm trong giỏ
 */
export function calculateSubtotal(items: CartItem[]): number {
  if (!items || !items.length) return 0;
  return items.reduce((acc, item) => {
    const price = Math.max(0, item.listing?.price || 0);
    const quantity = Math.max(0, item.quantity || 0);
    return acc + price * quantity;
  }, 0);
}

/**
 * Tính phí giao hàng theo quy tắc khuôn viên trường rõ ràng, nhất quán
 */
export function calculateShippingFee(method: ShippingMethod, subtotal: number): number {
  if (method === 'CAMPUS_PICKUP') {
    return SHIPPING_RATES.CAMPUS_PICKUP_FEE;
  }
  if (method === 'DORM_DELIVERY') {
    if (subtotal >= SHIPPING_RATES.FREE_DORM_THRESHOLD) {
      return 0;
    }
    return SHIPPING_RATES.DORM_DELIVERY_FEE;
  }
  return 0;
}

/**
 * Tính tổng thanh toán cuối cùng
 */
export function calculateOrderTotal(subtotal: number, shippingFee: number): number {
  return Math.max(0, subtotal + Math.max(0, shippingFee));
}

/**
 * Kiểm tra tính hợp lệ của số lượng khi thêm hoặc thay đổi trong giỏ
 */
export function validateQuantityChange(
  currentQty: number,
  change: number,
  stock: number
): {
  valid: boolean;
  newQty: number;
  reason?: string;
} {
  const targetQty = currentQty + change;

  if (targetQty <= 0) {
    return {
      valid: false,
      newQty: currentQty,
      reason: 'Số lượng tối thiểu là 1. Hãy dùng nút xóa nếu không muốn mua món này.',
    };
  }

  if (targetQty > stock) {
    return {
      valid: false,
      newQty: currentQty,
      reason: `Số lượng vượt quá tồn kho hiện có (${stock} sản phẩm).`,
    };
  }

  return {
    valid: true,
    newQty: targetQty,
  };
}

/**
 * Kiểm tra toàn bộ giỏ hàng trước khi đặt hàng
 */
export function validateCartBeforeCheckout(
  items: CartItem[],
  latestListings: Listing[]
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!items || items.length === 0) {
    return { isValid: false, issues: ['Giỏ hàng hiện đang trống.'] };
  }

  for (const item of items) {
    const liveListing = latestListings.find(l => l.id === item.listingId);
    if (!liveListing) {
      issues.push(`Món "${item.listing.title}" không còn khả dụng trên hệ thống.`);
      continue;
    }
    if (liveListing.stock <= 0) {
      issues.push(`Món "${liveListing.title}" đã hết hàng.`);
      continue;
    }
    if (item.quantity > liveListing.stock) {
      issues.push(
        `Món "${liveListing.title}" chỉ còn ${liveListing.stock} sản phẩm (bạn đang chọn ${item.quantity}).`
      );
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Định dạng tiền tệ VNĐ
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 đ';
  return `${amount.toLocaleString('vi-VN')} đ`;
}


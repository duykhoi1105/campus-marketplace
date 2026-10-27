import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Listing, ShippingMethod } from '@/types/marketplace';
import {
  calculateSubtotal,
  calculateShippingFee,
  calculateOrderTotal,
  validateQuantityChange,
} from '@/utils/cartCalculations';

const CART_STORAGE_KEY = 'campus_marketplace_cart_1923050528';

interface CartState {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  addToCart: (listing: Listing, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (listingId: string, quantity: number) => { success: boolean; message?: string };
  increment: (listingId: string) => { success: boolean; message?: string };
  decrement: (listingId: string) => { success: boolean; message?: string };
  removeFromCart: (listingId: string) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  clearCart: () => Promise<void>;
  syncWithListings: (latest: Listing[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  shippingMethod: 'CAMPUS_PICKUP',
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) {
          set({
            items: parsed.items,
            shippingMethod: parsed.shippingMethod || 'CAMPUS_PICKUP',
            isHydrated: true,
          });
          return;
        }
      }
      set({ isHydrated: true });
    } catch (e) {
      console.warn('Lỗi khôi phục giỏ hàng:', e);
      set({ isHydrated: true });
    }
  },

  addToCart: (listing: Listing, quantity = 1) => {
    if (listing.stock <= 0) {
      return { success: false, message: 'Mặt hàng này hiện đã hết hàng.' };
    }

    const { items } = get();
    const existingIndex = items.findIndex(item => item.listingId === listing.id);

    let nextItems: CartItem[];

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const validation = validateQuantityChange(existing.quantity, quantity, listing.stock);
      if (!validation.valid) {
        return { success: false, message: validation.reason || 'Không thể thêm số lượng này.' };
      }
      nextItems = [...items];
      nextItems[existingIndex] = {
        ...existing,
        quantity: validation.newQty,
        listing,
      };
    } else {
      if (quantity > listing.stock) {
        return {
          success: false,
          message: `Số lượng chọn vượt quá tồn kho hiện có (${listing.stock} sản phẩm).`,
        };
      }
      nextItems = [...items, { listingId: listing.id, quantity, listing }];
    }

    set({ items: nextItems });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
    ).catch(console.warn);

    return { success: true, message: 'Đã thêm vào giỏ hàng thành công!' };
  },

  updateQuantity: (listingId: string, quantity: number) => {
    const { items } = get();
    const target = items.find(i => i.listingId === listingId);
    if (!target) return { success: false, message: 'Mặt hàng không có trong giỏ.' };

    const validation = validateQuantityChange(0, quantity, target.listing.stock);
    if (!validation.valid) {
      return { success: false, message: validation.reason };
    }

    const nextItems = items.map(i =>
      i.listingId === listingId ? { ...i, quantity: validation.newQty } : i
    );
    set({ items: nextItems });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
    ).catch(console.warn);

    return { success: true };
  },

  increment: (listingId: string) => {
    const { items } = get();
    const target = items.find(i => i.listingId === listingId);
    if (!target) return { success: false };

    const validation = validateQuantityChange(target.quantity, 1, target.listing.stock);
    if (!validation.valid) {
      return { success: false, message: validation.reason };
    }

    const nextItems = items.map(i =>
      i.listingId === listingId ? { ...i, quantity: validation.newQty } : i
    );
    set({ items: nextItems });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
    ).catch(console.warn);

    return { success: true };
  },

  decrement: (listingId: string) => {
    const { items } = get();
    const target = items.find(i => i.listingId === listingId);
    if (!target) return { success: false };

    if (target.quantity <= 1) {
      // Giảm từ 1 trở xuống thì xóa khỏi giỏ
      get().removeFromCart(listingId);
      return { success: true, message: 'Đã xóa mặt hàng khỏi giỏ.' };
    }

    const validation = validateQuantityChange(target.quantity, -1, target.listing.stock);
    if (!validation.valid) {
      return { success: false, message: validation.reason };
    }

    const nextItems = items.map(i =>
      i.listingId === listingId ? { ...i, quantity: validation.newQty } : i
    );
    set({ items: nextItems });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
    ).catch(console.warn);

    return { success: true };
  },

  removeFromCart: (listingId: string) => {
    const nextItems = get().items.filter(item => item.listingId !== listingId);
    set({ items: nextItems });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
    ).catch(console.warn);
  },

  setShippingMethod: (method: ShippingMethod) => {
    set({ shippingMethod: method });
    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: get().items, shippingMethod: method })
    ).catch(console.warn);
  },

  clearCart: async () => {
    set({ items: [] });
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.warn('Lỗi khi xóa giỏ hàng:', e);
    }
  },

  syncWithListings: (latest: Listing[]) => {
    const { items } = get();
    if (!items.length) return;

    let changed = false;
    const nextItems = items.map(item => {
      const live = latest.find(l => l.id === item.listingId);
      if (live) {
        if (live.price !== item.listing.price || live.stock !== item.listing.stock) {
          changed = true;
          // Điều chỉnh số lượng nếu vượt quá tồn kho mới
          const adjustedQty = Math.min(item.quantity, Math.max(1, live.stock));
          return {
            ...item,
            quantity: adjustedQty,
            listing: live,
          };
        }
      }
      return item;
    });

    if (changed) {
      set({ items: nextItems });
      AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items: nextItems, shippingMethod: get().shippingMethod })
      ).catch(console.warn);
    }
  },
}));

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state: CartState) => calculateSubtotal(state.items);
export const selectCartShippingFee = (state: CartState) =>
  calculateShippingFee(state.shippingMethod, calculateSubtotal(state.items));
export const selectCartTotal = (state: CartState) => {
  const subtotal = calculateSubtotal(state.items);
  const fee = calculateShippingFee(state.shippingMethod, subtotal);
  return calculateOrderTotal(subtotal, fee);
};


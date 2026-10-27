import { Platform } from 'react-native';
import { Listing, Order, User } from '@/types/marketplace';
import { getCachedListings, saveCachedListings, FALLBACK_SEED_LISTINGS } from './offlineStorage';

// Cấu hình URL endpoint linh hoạt cho cả Web, Android Emulator, iOS Simulator và Thiết bị thật
function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 trỏ về localhost máy host của Android Emulator
    return 'http://10.0.2.2:3000/api';
  }
  // Web và iOS simulator
  return 'http://localhost:3000/api';
}

const API_BASE_URL = getApiBaseUrl();
const REQUEST_TIMEOUT_MS = 6000;

export interface FetchListingsResponse {
  items: Listing[];
  isOffline: boolean;
  lastSyncedAt: string | null;
  errorMessage?: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export const ApiService = {
  /**
   * Tải danh sách tin đăng từ API từ xa
   * Tự động lưu cache khi thành công. Khi mất mạng / API lỗi, trả về cache gần nhất kèm cờ isOffline.
   */
  async getListings(): Promise<FetchListingsResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/listings`);
      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi lỗi HTTP ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu API không đúng định dạng mảng.');
      }

      const listings = data as Listing[];
      const lastSyncedAt = await saveCachedListings(listings);

      return {
        items: listings,
        isOffline: false,
        lastSyncedAt,
      };
    } catch (err: unknown) {
      console.warn('[ApiService] Không thể kết nối API, chuyển sang chế độ Offline Cache:', err);
      const cached = await getCachedListings();
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối mạng';

      return {
        items: cached.items,
        isOffline: true,
        lastSyncedAt: cached.lastSyncedAt,
        errorMessage: errorMsg,
      };
    }
  },

  /**
   * Lấy chi tiết 1 tin đăng theo ID
   */
  async getListingById(id: string): Promise<Listing> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/listings/${id}`);
      if (response.ok) {
        const item: Listing = await response.json();
        return item;
      }
    } catch (err) {
      console.warn(`[ApiService] Không tải được item ${id} từ API, tìm trong cache:`, err);
    }

    // Fallback: Tìm trong cache gần nhất
    const cached = await getCachedListings();
    const found = cached.items.find(item => item.id === id);
    if (found) {
      return found;
    }

    // Fallback trong seed
    const seedFound = FALLBACK_SEED_LISTINGS.find(item => item.id === id);
    if (seedFound) {
      return seedFound;
    }

    throw new Error('Không tìm thấy tin đăng này trong hệ thống.');
  },

  /**
   * Tạo tin đăng mới
   */
  async createListing(payload: Omit<Listing, 'id' | 'createdAt' | 'isAvailable'>): Promise<Listing> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/listings`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Lỗi tạo tin đăng (HTTP ${response.status})`);
      }
      const created: Listing = await response.json();
      // Cập nhật lại cache offline
      const cached = await getCachedListings();
      await saveCachedListings([created, ...cached.items]);
      return created;
    } catch (error) {
      // Khi offline: Tạo cục bộ và lưu vào cache offline
      console.warn('[ApiService] Tạo tin đăng ở chế độ ngoại tuyến cục bộ:', error);
      const localListing: Listing = {
        ...payload,
        id: `LOCAL-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        isAvailable: payload.stock > 0,
      };
      const cached = await getCachedListings();
      await saveCachedListings([localListing, ...cached.items]);
      return localListing;
    }
  },

  /**
   * Cập nhật tin đăng
   */
  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updated: Listing = await response.json();
        const cached = await getCachedListings();
        const nextList = cached.items.map(item => (item.id === id ? updated : item));
        await saveCachedListings(nextList);
        return updated;
      }
    } catch (error) {
      console.warn('[ApiService] Cập nhật tin đăng ngoại tuyến cục bộ:', error);
    }

    // Fallback update trong cache
    const cached = await getCachedListings();
    let updatedItem: Listing | null = null;
    const nextList = cached.items.map(item => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });
    if (updatedItem) {
      await saveCachedListings(nextList);
      return updatedItem;
    }
    throw new Error('Không tìm thấy tin đăng để cập nhật.');
  },

  /**
   * Xóa tin đăng
   */
  async deleteListing(id: string, sellerId: string): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/listings/${id}?sellerId=${sellerId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const cached = await getCachedListings();
        await saveCachedListings(cached.items.filter(item => item.id !== id));
        return true;
      }
    } catch (error) {
      console.warn('[ApiService] Xóa tin đăng ngoại tuyến cục bộ:', error);
    }

    const cached = await getCachedListings();
    await saveCachedListings(cached.items.filter(item => item.id !== id));
    return true;
  },

  /**
   * Upload ảnh nén lên server
   */
  async uploadImage(base64DataUri: string): Promise<{ url: string; sizeBytes: number }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: JSON.stringify({ dataUri: base64DataUri }),
      });
      if (response.ok) {
        const result = await response.json();
        return {
          url: result.url,
          sizeBytes: result.sizeBytes,
        };
      }
    } catch (error) {
      console.warn('[ApiService] Không thể upload ảnh lên server, sử dụng local data URI:', error);
    }

    // Fallback: Nếu backend không reachable, sử dụng chính dataUri cục bộ để hiển thị
    return {
      url: base64DataUri,
      sizeBytes: Math.round((base64DataUri.length * 3) / 4),
    };
  },

  /**
   * Gửi đơn hàng
   */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        const result = await response.json();
        return result.order;
      }
    } catch (error) {
      console.warn('[ApiService] Không thể gửi đơn lên server, ghi nhận đơn offline:', error);
    }

    // Fallback order offline
    const localOrder: Order = {
      id: `ORD-LOCAL-${Date.now().toString().slice(-6)}`,
      buyerId: orderData.buyerId || 'USR-01',
      buyerName: orderData.buyerName || 'Nguyễn Duy Khôi',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingMethod: orderData.shippingMethod || 'CAMPUS_PICKUP',
      shippingFee: orderData.shippingFee || 0,
      total: orderData.total || 0,
      pickupLocation: orderData.pickupLocation || 'Cổng trường Đại học Công nghệ Đồng Nai',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    return localOrder;
  },

  /**
   * Đăng nhập
   */
  async login(emailOrId: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: emailOrId }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('[ApiService] Đăng nhập ngoại tuyến với tài khoản mẫu:', error);
    }

    // Demo user offline
    const isSeller = emailOrId.toLowerCase().includes('seller');
    const demoUser: User = isSeller
      ? {
          id: 'USR-02',
          name: 'Duy Khôi (Sinh Viên Bán Hàng)',
          email: 'duykhoi.seller@dntu.edu.vn',
          role: 'SELLER',
          phone: '0912345678',
          campusLocation: 'Giảng đường A3, DNTU',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          createdAt: '2026-10-14T08:30:00.000Z',
        }
      : {
          id: 'USR-01',
          name: 'Nguyễn Duy Khôi',
          email: '1923050528@dntu.edu.vn',
          role: 'BUYER',
          phone: '0901234567',
          campusLocation: 'Ký túc xá Khu B, DNTU',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          createdAt: '2026-10-14T08:00:00.000Z',
        };

    return {
      user: demoUser,
      token: `offline-token-${demoUser.id}-${Date.now()}`,
    };
  },
};


import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '@/types/marketplace';

const CACHE_KEY = 'campus_marketplace_listings_cache_1923050528';

export interface CachedData {
  items: Listing[];
  lastSyncedAt: string | null;
}

// Danh sách dự phòng khởi tạo (chỉ dùng nếu máy mới tinh chưa từng có cache và không có mạng)
export const FALLBACK_SEED_LISTINGS: Listing[] = [
  {
    id: 'LIST-01',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật DNTU',
    description: 'Sách photo bìa bóng kính, có sẵn note bài tập chương 3 và 4 thi giữa kỳ, tình trạng còn rất mới.',
    category: 'textbooks',
    price: 45000,
    stock: 4,
    photoUri: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600',
    createdAt: '2026-10-20T08:00:00.000Z',
    isAvailable: true,
    condition: 'like-new',
  },
  {
    id: 'LIST-02',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Máy tính cầm tay Casio fx-580VN X',
    description: 'Máy chính hãng Bitex còn tem bảo hành 1 năm, pin tốt, phục vụ thi toán cao cấp và xác suất thống kê.',
    category: 'electronics',
    price: 320000,
    stock: 2,
    photoUri: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600',
    createdAt: '2026-10-21T09:30:00.000Z',
    isAvailable: true,
    condition: 'used',
  },
  {
    id: 'LIST-03',
    sellerId: 'USR-03',
    sellerName: 'CLB Học Thuật CNTT DNTU',
    sellerPhone: '0987654321',
    title: 'Chuột không dây Logitech M331 Silent Đen',
    description: 'Chuột click êm không ồn trong thư viện và phòng học, dùng 1 pin AA dùng 12 tháng, kết nối USB receiver.',
    category: 'electronics',
    price: 180000,
    stock: 5,
    photoUri: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600',
    createdAt: '2026-10-22T10:15:00.000Z',
    isAvailable: true,
    condition: 'like-new',
  },
  {
    id: 'LIST-04',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Tài liệu Lập trình ứng dụng di động React Native',
    description: 'Tổng hợp bài tập thực hành Lab 01 đến Lab 08, kèm các ví dụ Expo Router, State Management, và AsyncStorage.',
    category: 'textbooks',
    price: 50000,
    stock: 3,
    photoUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    createdAt: '2026-10-23T11:00:00.000Z',
    isAvailable: true,
    condition: 'new',
  },
  {
    id: 'LIST-05',
    sellerId: 'USR-03',
    sellerName: 'CLB Học Thuật CNTT DNTU',
    sellerPhone: '0987654321',
    title: 'Áo đồng phục thể dục DNTU size L (Nam)',
    description: 'Áo chính quy trường Đại học Công nghệ Đồng Nai, vải thun mè thoáng mát, mới mặc 2 lần kỳ quân sự.',
    category: 'uniforms',
    price: 70000,
    stock: 2,
    photoUri: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
    createdAt: '2026-10-24T14:20:00.000Z',
    isAvailable: true,
    condition: 'like-new',
  },
  {
    id: 'LIST-06',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Bình đun siêu tốc Sunhouse 1.8L ký túc xá',
    description: 'Inox 304 an toàn, công suất 1500W sôi nhanh trong 4 phút, tự ngắt khi sôi, còn hoạt động hoàn hảo.',
    category: 'living',
    price: 110000,
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
    createdAt: '2026-10-25T08:45:00.000Z',
    isAvailable: true,
    condition: 'used',
  },
  {
    id: 'LIST-07',
    sellerId: 'USR-03',
    sellerName: 'CLB Học Thuật CNTT DNTU',
    sellerPhone: '0987654321',
    title: 'Combo 5 cuốn vở kẻ ngang Campus 200 trang',
    description: 'Giấy chống lóa, định lượng 70gsm, còn nguyên bọc màng co chưa bóc.',
    category: 'stationery',
    price: 55000,
    stock: 10,
    photoUri: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    createdAt: '2026-10-25T15:10:00.000Z',
    isAvailable: true,
    condition: 'new',
  },
  {
    id: 'LIST-08',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Bàn học gấp gọn sinh viên chân sắt chữ U',
    description: 'Mặt gỗ MDF phủ melamine chống trầy, có khe để iPad và khay cắm cốc nước tiện lợi.',
    category: 'living',
    price: 85000,
    stock: 3,
    photoUri: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
    createdAt: '2026-10-26T09:00:00.000Z',
    isAvailable: true,
    condition: 'used',
  },
  {
    id: 'LIST-09',
    sellerId: 'USR-03',
    sellerName: 'CLB Học Thuật CNTT DNTU',
    sellerPhone: '0987654321',
    title: 'Tai nghe chụp tai Sony WH-CH520 Wireless',
    description: 'Pin 50 tiếng, kết nối Bluetooth 5.2 đa điểm, âm thanh rõ nét, micro đàm thoại học online tốt.',
    category: 'electronics',
    price: 650000,
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    createdAt: '2026-10-26T16:30:00.000Z',
    isAvailable: true,
    condition: 'like-new',
  },
  {
    id: 'LIST-10',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
    sellerPhone: '0912345678',
    title: 'Thẻ nhớ SanDisk Ultra microSD 64GB Class 10',
    description: 'Tốc độ đọc lên tới 100MB/s, kèm khay adapter SD, dùng cho điện thoại, máy ảnh hoặc Raspberry Pi.',
    category: 'electronics',
    price: 95000,
    stock: 6,
    photoUri: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80532e?w=600',
    createdAt: '2026-10-27T10:00:00.000Z',
    isAvailable: true,
    condition: 'new',
  },
  {
    id: 'LIST-11',
    sellerId: 'USR-03',
    sellerName: 'CLB Học Thuật CNTT DNTU',
    sellerPhone: '0987654321',
    title: 'Áo sơ mi trắng đồng phục DNTU size M',
    description: 'Áo đồng phục lễ phục trường DNTU có thêu logo trước ngực. Mặt hàng hiện đã hết tồn kho để kiểm thử trạng thái hết hàng.',
    category: 'uniforms',
    price: 90000,
    stock: 0,
    photoUri: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    createdAt: '2026-10-27T11:00:00.000Z',
    isAvailable: false,
    condition: 'used',
  },
];

export async function saveCachedListings(items: Listing[]): Promise<string> {
  const lastSyncedAt = new Date().toISOString();
  const payload: CachedData = {
    items,
    lastSyncedAt,
  };
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Lỗi khi lưu cache offline:', error);
  }
  return lastSyncedAt;
}

export async function getCachedListings(): Promise<CachedData> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) {
      return {
        items: FALLBACK_SEED_LISTINGS,
        lastSyncedAt: null,
      };
    }
    const parsed = JSON.parse(raw) as CachedData;
    if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
      return parsed;
    }
    return {
      items: FALLBACK_SEED_LISTINGS,
      lastSyncedAt: null,
    };
  } catch (error) {
    console.warn('Lỗi khi đọc cache offline, sử dụng fallback seed:', error);
    return {
      items: FALLBACK_SEED_LISTINGS,
      lastSyncedAt: null,
    };
  }
}


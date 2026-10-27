import { removeVietnameseTones } from './filterListings';
import { MarketCategory, Listing } from '@/types/marketplace';

export interface SmartImageResult {
  url: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  label: string;
}

// Bộ từ khóa và hình ảnh tương ứng theo tên sản phẩm trường đại học
export const PRODUCT_IMAGE_RULES: {
  keywords: string[];
  url: string;
  label: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
}[] = [
  // 1. Máy tính cầm tay Casio / Vinacal
  {
    keywords: ['casio', 'may tinh cam tay', 'fx 580', 'fx580', 'fx 570', 'vinacal', 'bitex'],
    url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600',
    label: 'Máy tính cầm tay sinh viên',
    originalSizeBytes: 3120000,
    compressedSizeBytes: 89320,
  },
  // 2. Giáo trình, Sách, Tài liệu
  {
    keywords: [
      'giao trinh',
      'sach',
      'tai lieu',
      'cau truc du lieu',
      'giai thuat',
      'react native',
      'toan cao cap',
      'lap trinh',
      'tieng anh',
      'toeic',
      'triet hoc',
      'phap luat',
      'vat ly',
      'kinh te',
    ],
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600',
    label: 'Sách & Giáo trình đại học',
    originalSizeBytes: 2845690,
    compressedSizeBytes: 108450,
  },
  // 3. Chuột máy tính (Logitech, không dây, có dây)
  {
    keywords: ['chuot', 'mouse', 'logitech', 'm331', 'm220', 'chuot khong day', 'con chuot'],
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600',
    label: 'Chuột máy tính',
    originalSizeBytes: 2540000,
    compressedSizeBytes: 94100,
  },
  // 4. Bàn phím máy tính
  {
    keywords: ['ban phim', 'keyboard', 'ban phim co', 'keychron', 'dareu', 'ban phim bluetooth'],
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
    label: 'Bàn phím máy tính',
    originalSizeBytes: 2950000,
    compressedSizeBytes: 102300,
  },
  // 5. Laptop / Máy tính xách tay
  {
    keywords: ['laptop', 'may tinh xach tay', 'macbook', 'dell', 'thinkpad', 'asus', 'acer', 'hp'],
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
    label: 'Laptop sinh viên',
    originalSizeBytes: 3450000,
    compressedSizeBytes: 115000,
  },
  // 6. Tai nghe
  {
    keywords: ['tai nghe', 'headphone', 'airpods', 'sony', 'wh-ch520', 'bluetooth', 'earphone', 'headset'],
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    label: 'Tai nghe học tập',
    originalSizeBytes: 2680000,
    compressedSizeBytes: 98400,
  },
  // 7. Áo đồng phục trường, áo sơ mi, áo thể dục
  {
    keywords: [
      'ao dong phuc',
      'ao the duc',
      'ao so mi',
      'dong phuc dntu',
      'dong phuc',
      'ao khoac',
      'ao polo',
      'ao thun',
    ],
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
    label: 'Áo đồng phục sinh viên',
    originalSizeBytes: 1945200,
    compressedSizeBytes: 78560,
  },
  // 8. Bình đun siêu tốc, ấm đun
  {
    keywords: ['binh dun', 'am dun', 'sieu toc', 'sunhouse', 'am sieu toc', 'binh sieu toc'],
    url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
    label: 'Bình đun siêu tốc KTX',
    originalSizeBytes: 2210000,
    compressedSizeBytes: 86400,
  },
  // 9. Bình nước, bình giữ nhiệt
  {
    keywords: ['binh nuoc', 'binh giu nhiet', 'lock&lock', 'thermos', 'coc nuoc', 'ly giu nhiet'],
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    label: 'Bình giữ nhiệt sinh viên',
    originalSizeBytes: 2430000,
    compressedSizeBytes: 91200,
  },
  // 10. Vở ghi, tập kẻ ngang, sổ tay
  {
    keywords: ['vo', 'tap', 'so tay', 'campus', '200 trang', '120 trang', 'so lo xo', 'giay a4'],
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    label: 'Tập vở & Sổ tay Campus',
    originalSizeBytes: 2180000,
    compressedSizeBytes: 83700,
  },
  // 11. Bút viết, dụng cụ học tập
  {
    keywords: ['but', 'viet', 'but bi', 'but chi', 'hop but', 'thuoc ke', 'tay', 'deli', 'thien long'],
    url: 'https://images.unsplash.com/photo-1585336261026-7f4150537021?w=600',
    label: 'Dụng cụ học tập',
    originalSizeBytes: 1890000,
    compressedSizeBytes: 75400,
  },
  // 12. Bàn học, bàn gấp
  {
    keywords: ['ban hoc', 'ban gap', 'ban sinh vien', 'ban go', 'ban mini', 'ghe'],
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
    label: 'Bàn học gấp gọn KTX',
    originalSizeBytes: 2760000,
    compressedSizeBytes: 99800,
  },
  // 13. Balo, cặp xách, túi chống sốc
  {
    keywords: ['balo', 'cap sach', 'tui chong soc', 'tui xach', 'the north face', 'balotot', 'ba lo'],
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    label: 'Balo sinh viên đựng laptop',
    originalSizeBytes: 2890000,
    compressedSizeBytes: 104500,
  },
  // 14. Thẻ nhớ, USB, Ổ cứng
  {
    keywords: ['the nho', 'microsd', 'usb', 'o cung', 'sandisk', 'kingston', 'ssd', 'flash drive'],
    url: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80532e?w=600',
    label: 'Thẻ nhớ & Thiết bị lưu trữ',
    originalSizeBytes: 2150000,
    compressedSizeBytes: 82300,
  },
  // 15. Quạt mini, quạt để bàn
  {
    keywords: ['quat', 'quat mini', 'quat tich dien', 'quat de ban', 'quat usb'],
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
    label: 'Quạt mini để bàn KTX',
    originalSizeBytes: 2340000,
    compressedSizeBytes: 88700,
  },
  // 16. Đèn học để bàn
  {
    keywords: ['den hoc', 'den ban', 'den led', 'den chong can', 'den ktx'],
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    label: 'Đèn bàn học sinh viên',
    originalSizeBytes: 2510000,
    compressedSizeBytes: 93200,
  },
  // 17. Pin sạc dự phòng & Dây cáp
  {
    keywords: ['sac du phong', 'pin du phong', 'day sac', 'cap sac', 'anker', 'baseus', 'sac nhanh'],
    url: 'https://images.unsplash.com/photo-1609592426868-80e92225a666?w=600',
    label: 'Pin sạc dự phòng & Dây cáp',
    originalSizeBytes: 2420000,
    compressedSizeBytes: 91500,
  },
  // 18. Hộp cơm & Dụng cụ nấu ăn KTX
  {
    keywords: ['hop com', 'ca men', 'camen', 'noi com', 'hop dung com', 'chen dua', 'chao'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    label: 'Hộp cơm & Đồ dùng nấu ăn KTX',
    originalSizeBytes: 2650000,
    compressedSizeBytes: 97800,
  },
  // 19. Kệ để giày & Phụ kiện phòng trọ
  {
    keywords: ['ke giay', 'ke de giay', 'moc quan ao', 'gia sach', 'guong', 'ke do', 'phong tro'],
    url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600',
    label: 'Phụ kiện sinh hoạt phòng trọ',
    originalSizeBytes: 2580000,
    compressedSizeBytes: 96400,
  },
];

// Fallback theo danh mục nếu tên không khớp từ khóa cụ thể nào
export const CATEGORY_DEFAULT_IMAGES: Record<
  MarketCategory,
  { url: string; label: string; originalSizeBytes: number; compressedSizeBytes: number }
> = {
  textbooks: {
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600',
    label: 'Giáo trình & Sách học tập',
    originalSizeBytes: 2845690,
    compressedSizeBytes: 108450,
  },
  electronics: {
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    label: 'Thiết bị điện tử & Phụ kiện',
    originalSizeBytes: 2680000,
    compressedSizeBytes: 98400,
  },
  stationery: {
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    label: 'Vở & Dụng cụ học tập',
    originalSizeBytes: 2180000,
    compressedSizeBytes: 83700,
  },
  living: {
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
    label: 'Đồ dùng sinh hoạt KTX',
    originalSizeBytes: 2760000,
    compressedSizeBytes: 99800,
  },
  uniforms: {
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
    label: 'Đồng phục trường đại học',
    originalSizeBytes: 1945200,
    compressedSizeBytes: 78560,
  },
  other: {
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    label: 'Vật phẩm sinh viên',
    originalSizeBytes: 2500000,
    compressedSizeBytes: 95000,
  },
};

/**
 * Tự động tìm kiếm và gán hình ảnh chuẩn phù hợp theo tên sản phẩm
 * Sử dụng thuật toán chấm điểm ưu tiên:
 * 1. Từ khóa ở đầu tiêu đề (starts-with): +100 điểm (ví dụ: "Balo đựng laptop" ưu tiên Balo trước Laptop)
 * 2. Từ khóa đúng ranh giới từ (word boundary): +20 điểm
 * 3. Độ dài từ khóa (độ đặc thù cao hơn): +length điểm
 */
export function getSmartImageByTitle(
  title: string,
  category: MarketCategory = 'other'
): SmartImageResult {
  if (!title || !title.trim()) {
    return CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.other;
  }

  const normalizedTitle = removeVietnameseTones(title.toLowerCase()).trim();

  let bestRule: (typeof PRODUCT_IMAGE_RULES)[0] | null = null;
  let highestScore = 0;

  for (const rule of PRODUCT_IMAGE_RULES) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = removeVietnameseTones(keyword.toLowerCase()).trim();
      const matchIndex = normalizedTitle.indexOf(normalizedKeyword);

      if (matchIndex !== -1) {
        let score = normalizedKeyword.length;

        // Ưu tiên từ khóa xuất hiện ở đầu câu (chủ ngữ chính của món đồ)
        if (matchIndex === 0) {
          score += 100;
        }

        // Kiểm tra ranh giới từ (trước và sau là khoảng trắng, ký tự đặc biệt hoặc bắt đầu/kết thúc chuỗi)
        const charBefore = matchIndex > 0 ? normalizedTitle[matchIndex - 1] : ' ';
        const charAfter =
          matchIndex + normalizedKeyword.length < normalizedTitle.length
            ? normalizedTitle[matchIndex + normalizedKeyword.length]
            : ' ';

        const isWordBoundaryBefore = /[\s,.-]/.test(charBefore);
        const isWordBoundaryAfter = /[\s,.-]/.test(charAfter);

        if (isWordBoundaryBefore && isWordBoundaryAfter) {
          score += 20;
        }

        if (score > highestScore) {
          highestScore = score;
          bestRule = rule;
        }
      }
    }
  }

  if (bestRule) {
    return {
      url: bestRule.url,
      originalSizeBytes: bestRule.originalSizeBytes,
      compressedSizeBytes: bestRule.compressedSizeBytes,
      label: bestRule.label,
    };
  }

  // Nếu không khớp từ khóa cụ thể, dùng ảnh mặc định của danh mục
  return CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.other;
}

/**
 * Tự động bổ sung/cập nhật hình ảnh theo tên cho một tin đăng nếu thiếu hình hoặc cần đồng bộ
 */
export function enrichListingWithSmartImage(listing: Listing): Listing {
  if (listing.photoUri && listing.photoUri.trim()) {
    return listing;
  }

  const smartImage = getSmartImageByTitle(listing.title, listing.category);
  return {
    ...listing,
    photoUri: smartImage.url,
    originalPhotoSize: listing.originalPhotoSize || smartImage.originalSizeBytes,
    compressedPhotoSize: listing.compressedPhotoSize || smartImage.compressedSizeBytes,
  };
}

/**
 * Tự động gán hình ảnh chuẩn theo tên cho một danh sách các tin đăng
 */
export function autoAssignImagesToAllListings(listings: Listing[]): Listing[] {
  return listings.map(enrichListingWithSmartImage);
}

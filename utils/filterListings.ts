import { Listing, MarketCategory } from '@/types/marketplace';

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không dấu / có dấu linh hoạt
 */
export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Hàm tính toán thuần túy kết quả tìm kiếm và lọc danh mục trong quá trình render.
 * QUY TẮC BẮT BUỘC ĐỀ CƯƠNG:
 * Kết quả này là dữ liệu dẫn xuất (Derived Data), tuyệt đối không lưu vào useState riêng.
 */
export function filterAndSearchListings(
  listings: Listing[],
  searchText: string,
  selectedCategory: MarketCategory | 'all'
): Listing[] {
  if (!listings || !Array.isArray(listings)) return [];

  const trimmedSearch = searchText.trim().toLowerCase();
  const normalizedSearch = removeVietnameseTones(trimmedSearch);

  return listings.filter((item) => {
    // 1. Lọc theo danh mục
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // 2. Lọc theo từ khóa tìm kiếm (nếu không nhập từ khóa thì thỏa mãn)
    if (!trimmedSearch) {
      return true;
    }

    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    const titleNormalized = removeVietnameseTones(titleLower);
    const descNormalized = removeVietnameseTones(descLower);

    return (
      titleLower.includes(trimmedSearch) ||
      descLower.includes(trimmedSearch) ||
      titleNormalized.includes(normalizedSearch) ||
      descNormalized.includes(normalizedSearch)
    );
  });
}


import { describe, it, expect } from 'vitest';
import { filterAndSearchListings, removeVietnameseTones } from '../utils/filterListings';
import { Listing } from '../types/marketplace';

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: 'LIST-01',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi',
    title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật DNTU',
    description: 'Sách photo bìa bóng kính, ghi chú bài tập chương 3.',
    category: 'textbooks',
    price: 45000,
    stock: 4,
    photoUri: 'https://example.com/1.jpg',
    createdAt: '2026-10-20T08:00:00.000Z',
    isAvailable: true,
  },
  {
    id: 'LIST-02',
    sellerId: 'USR-02',
    sellerName: 'Duy Khôi',
    title: 'Máy tính cầm tay Casio fx-580VN X',
    description: 'Máy chính hãng Bitex còn tem bảo hành.',
    category: 'electronics',
    price: 320000,
    stock: 2,
    photoUri: 'https://example.com/2.jpg',
    createdAt: '2026-10-21T09:30:00.000Z',
    isAvailable: true,
  },
  {
    id: 'LIST-03',
    sellerId: 'USR-03',
    sellerName: 'CLB CNTT',
    title: 'Áo đồng phục thể dục DNTU size L',
    description: 'Áo trường Đại học Công nghệ Đồng Nai còn mới.',
    category: 'uniforms',
    price: 70000,
    stock: 2,
    photoUri: 'https://example.com/3.jpg',
    createdAt: '2026-10-24T14:20:00.000Z',
    isAvailable: true,
  },
];

describe('1. Hàm removeVietnameseTones', () => {
  it('loại bỏ đúng dấu tiếng Việt', () => {
    expect(removeVietnameseTones('Giáo trình Cấu trúc dữ liệu')).toBe(
      'Giao trinh Cau truc du lieu'
    );
    expect(removeVietnameseTones('Đại học Công nghệ Đồng Nai')).toBe(
      'Dai hoc Cong nghe Dong Nai'
    );
  });
});

describe('2. Hàm filterAndSearchListings (Tính toán khi render)', () => {
  it('trả về toàn bộ danh sách khi từ khóa rỗng và chọn danh mục "all"', () => {
    const result = filterAndSearchListings(SAMPLE_LISTINGS, '', 'all');
    expect(result).toHaveLength(3);
  });

  it('lọc chính xác theo danh mục sản phẩm', () => {
    const textbooks = filterAndSearchListings(SAMPLE_LISTINGS, '', 'textbooks');
    expect(textbooks).toHaveLength(1);
    expect(textbooks[0].id).toBe('LIST-01');

    const uniforms = filterAndSearchListings(SAMPLE_LISTINGS, '', 'uniforms');
    expect(uniforms).toHaveLength(1);
    expect(uniforms[0].id).toBe('LIST-03');
  });

  it('tìm kiếm văn bản có dấu tiếng Việt chính xác', () => {
    const result = filterAndSearchListings(SAMPLE_LISTINGS, 'giải thuật', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('Giải thuật');
  });

  it('tìm kiếm văn bản không dấu tiếng Việt vẫn khớp với văn bản có dấu', () => {
    const result = filterAndSearchListings(SAMPLE_LISTINGS, 'giao trinh', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('LIST-01');
  });

  it('tìm kiếm không phân biệt chữ hoa và chữ thường', () => {
    const resultUpper = filterAndSearchListings(SAMPLE_LISTINGS, 'CASIO', 'all');
    const resultLower = filterAndSearchListings(SAMPLE_LISTINGS, 'casio', 'all');
    expect(resultUpper).toHaveLength(1);
    expect(resultLower).toHaveLength(1);
    expect(resultUpper[0].id).toBe('LIST-02');
  });

  it('kết hợp vừa lọc danh mục vừa tìm kiếm từ khóa', () => {
    // Tìm 'DNTU' trong danh mục 'uniforms' -> có 1
    const match = filterAndSearchListings(SAMPLE_LISTINGS, 'DNTU', 'uniforms');
    expect(match).toHaveLength(1);
    expect(match[0].id).toBe('LIST-03');

    // Tìm 'Casio' trong danh mục 'textbooks' -> 0 (vì Casio thuộc electronics)
    const noMatch = filterAndSearchListings(SAMPLE_LISTINGS, 'Casio', 'textbooks');
    expect(noMatch).toHaveLength(0);
  });

  it('trả về mảng rỗng khi không có sản phẩm nào khớp', () => {
    const result = filterAndSearchListings(SAMPLE_LISTINGS, 'xe may', 'all');
    expect(result).toHaveLength(0);
  });
});


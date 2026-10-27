/**
 * Design Tokens - Hệ thống màu Semantic tập trung
 * QUY TẮC BẮT BUỘC ĐỀ CƯƠNG:
 * Đây là file DUY NHẤT trong toàn bộ mã nguồn ứng dụng được phép chứa mã màu Hex.
 * Mọi component, stylesheet và service PHẢI sử dụng token từ file này hoặc hook useThemeColor.
 */

export type ColorTheme = 'light' | 'dark';

export interface ThemeColors {
  // Nền
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  backgroundModal: string;
  backgroundInput: string;

  // Chữ
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textLink: string;

  // Đường viền & Phân cách
  borderDefault: string;
  borderLight: string;
  borderStrong: string;
  borderFocus: string;

  // Thương hiệu & Tương tác
  tint: string;
  tintActive: string;
  tintSubtle: string;
  onTint: string;
  tabIconDefault: string;
  tabIconSelected: string;

  // Trạng thái ngữ nghĩa (Semantic Status)
  success: string;
  successBg: string;
  onSuccess: string;

  warning: string;
  warningBg: string;
  onWarning: string;

  danger: string;
  dangerBg: string;
  onDanger: string;

  info: string;
  infoBg: string;
  onInfo: string;

  // Tồn kho & Nhãn (Badges)
  stockIn: string;
  stockInBg: string;
  stockLow: string;
  stockLowBg: string;
  stockOut: string;
  stockOutBg: string;

  // Yêu thích & Giỏ hàng
  favoriteActive: string;
  favoriteInactive: string;
  badgeCountBg: string;
  badgeCountText: string;

  // Hiệu ứng đổ bóng
  shadowColor: string;
}

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    // Nền
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    backgroundCard: '#FFFFFF',
    backgroundModal: '#FFFFFF',
    backgroundInput: '#FFFFFF',

    // Chữ
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
    textLink: '#2563EB',

    // Đường viền
    borderDefault: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderStrong: '#CBD5E1',
    borderFocus: '#3B82F6',

    // Thương hiệu
    tint: '#2563EB',
    tintActive: '#1D4ED8',
    tintSubtle: '#EFF6FF',
    onTint: '#FFFFFF',
    tabIconDefault: '#64748B',
    tabIconSelected: '#2563EB',

    // Trạng thái
    success: '#16A34A',
    successBg: '#DCFCE7',
    onSuccess: '#FFFFFF',

    warning: '#D97706',
    warningBg: '#FEF3C7',
    onWarning: '#FFFFFF',

    danger: '#DC2626',
    dangerBg: '#FEE2E2',
    onDanger: '#FFFFFF',

    info: '#0284C7',
    infoBg: '#E0F2FE',
    onInfo: '#FFFFFF',

    // Tồn kho
    stockIn: '#15803D',
    stockInBg: '#DCFCE7',
    stockLow: '#B45309',
    stockLowBg: '#FEF3C7',
    stockOut: '#B91C1C',
    stockOutBg: '#FEE2E2',

    // Yêu thích & Giỏ hàng
    favoriteActive: '#EF4444',
    favoriteInactive: '#94A3B8',
    badgeCountBg: '#EF4444',
    badgeCountText: '#FFFFFF',

    // Đổ bóng
    shadowColor: '#0F172A',
  },
  dark: {
    // Nền
    background: '#0B0F19',
    backgroundSecondary: '#111827',
    backgroundCard: '#1E293B',
    backgroundModal: '#1E293B',
    backgroundInput: '#0F172A',

    // Chữ
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    textInverse: '#0B0F19',
    textLink: '#60A5FA',

    // Đường viền
    borderDefault: '#334155',
    borderLight: '#1E293B',
    borderStrong: '#475569',
    borderFocus: '#60A5FA',

    // Thương hiệu
    tint: '#3B82F6',
    tintActive: '#60A5FA',
    tintSubtle: '#1E293B',
    onTint: '#FFFFFF',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',

    // Trạng thái
    success: '#22C55E',
    successBg: '#052E16',
    onSuccess: '#FFFFFF',

    warning: '#F59E0B',
    warningBg: '#451A03',
    onWarning: '#FFFFFF',

    danger: '#EF4444',
    dangerBg: '#450A0A',
    onDanger: '#FFFFFF',

    info: '#38BDF8',
    infoBg: '#082F49',
    onInfo: '#FFFFFF',

    // Tồn kho
    stockIn: '#4ADE80',
    stockInBg: '#052E16',
    stockLow: '#FBBF24',
    stockLowBg: '#451A03',
    stockOut: '#F87171',
    stockOutBg: '#450A0A',

    // Yêu thích & Giỏ hàng
    favoriteActive: '#F87171',
    favoriteInactive: '#64748B',
    badgeCountBg: '#EF4444',
    badgeCountText: '#FFFFFF',

    // Đổ bóng
    shadowColor: '#000000',
  },
};


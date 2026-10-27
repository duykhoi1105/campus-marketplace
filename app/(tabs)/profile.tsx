import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore, selectFavoriteCount } from '@/store/useFavoriteStore';
import { useCartStore, selectCartItemCount } from '@/store/useCartStore';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useAppTheme();

  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const switchRole = useAuthStore(state => state.switchRole);
  const loginAsDemo = useAuthStore(state => state.loginAsDemo);

  const favoriteCount = useFavoriteStore(selectFavoriteCount);
  const cartCount = useCartStore(selectCartItemCount);

  const isSeller = user?.role === 'SELLER';


const handleLogout = async () => {
  try {
    await logout();
    router.replace('/login');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    router.replace('/login');
  }
};


  const handleToggleRole = async () => {
    const nextRole = isSeller ? 'BUYER' : 'SELLER';
    await switchRole(nextRole);
    Alert.alert(
      'Chuyển đổi vai trò',
      `Bạn hiện đang hoạt động với vai trò: ${nextRole === 'SELLER' ? 'Người Bán Hàng (SELLER)' : 'Người Mua Hàng (BUYER)'}`
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. THẺ THÔNG TIN TÀI KHOẢN (ĐÃ ĐĂNG NHẬP / CHƯA ĐĂNG NHẬP) */}
      {!user ? (
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
              ]}
            >
              <Text style={{ fontSize: 36 }}>👤</Text>
            </View>

            <View style={styles.userMeta}>
              <Text style={[styles.userName, Typography.heading, { color: colors.textPrimary }]}>
                Chưa đăng nhập
              </Text>
              <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                Duyệt Chợ DNTU với tư cách Khách
              </Text>
            </View>
          </View>

          <Text
            style={[
              Typography.caption,
              { color: colors.textSecondary, marginTop: Spacing.sm, marginBottom: Spacing.md },
            ]}
          >
            Đăng nhập để đăng tin bán giáo trình, đặt hàng, quản lý tin đăng và lưu trữ sản phẩm yêu thích.
          </Text>

          {/* Nút Đăng nhập chính */}
          <TouchableOpacity
            style={[styles.loginActionBtn, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/login')}
            accessibilityRole="button"
            accessibilityLabel="Mở màn hình đăng nhập tài khoản DNTU"
          >
            <Text style={[Typography.title, { color: colors.onTint, fontWeight: '700' }]}>
              🔐 Đăng nhập tài khoản DNTU
            </Text>
          </TouchableOpacity>

          {/* Đăng nhập nhanh demo */}
          <View style={styles.demoRow}>
            <TouchableOpacity
              style={[
                styles.demoQuickBtn,
                { backgroundColor: colors.infoBg, borderColor: colors.info },
              ]}
              onPress={async () => {
                await loginAsDemo('BUYER');
                Alert.alert('Thành công', 'Đã đăng nhập tài khoản Người mua: Nguyễn Duy Khôi');
              }}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập nhanh Người Mua"
            >
              <Text style={[Typography.caption, { color: colors.info, fontWeight: '700' }]}>
                ⚡ Người Mua (Khôi)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.demoQuickBtn,
                { backgroundColor: colors.warningBg, borderColor: colors.warning },
              ]}
              onPress={async () => {
                await loginAsDemo('SELLER');
                Alert.alert('Thành công', 'Đã đăng nhập tài khoản Người bán: Store Sinh Viên DNTU');
              }}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập nhanh Người Bán"
            >
              <Text style={[Typography.caption, { color: colors.warning, fontWeight: '700' }]}>
                ⚡ Người Bán (Store)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: colors.tintSubtle, borderColor: colors.tint },
              ]}
            >
              <Text style={{ fontSize: 36 }}>🎓</Text>
            </View>

            <View style={styles.userMeta}>
              <Text style={[styles.userName, Typography.heading, { color: colors.textPrimary }]}>
                {user.name}
              </Text>
              <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                {user.email}
              </Text>

              <View style={styles.roleRow}>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor: isSeller ? colors.warningBg : colors.infoBg,
                      borderColor: isSeller ? colors.warning : colors.info,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      Typography.caption,
                      { color: isSeller ? colors.warning : colors.info },
                    ]}
                  >
                    {isSeller ? '🏷️ VAI TRÒ: NGƯỜI BÁN' : '🛒 VAI TRÒ: NGƯỜI MUA'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Nút chuyển nhanh vai trò phục vụ chấm thi */}
          <TouchableOpacity
            style={[
              styles.switchRoleBtn,
              { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
            ]}
            onPress={handleToggleRole}
            accessibilityRole="button"
            accessibilityLabel="Chuyển đổi vai trò Người mua và Người bán"
          >
            <Text style={[Typography.bodySmall, { color: colors.tint, fontWeight: '700' }]}>
              🔄 Chuyển sang vai trò: {isSeller ? 'Người mua (BUYER)' : 'Người bán (SELLER)'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. THỐNG KÊ NHANH */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[
            styles.statCard,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
          onPress={() => router.push('/(tabs)/favorites')}
        >
          <Text style={{ fontSize: 24 }}>❤️</Text>
          <Text
            style={[
              styles.statNumber,
              Typography.title,
              { color: colors.textPrimary, marginTop: Spacing.xs },
            ]}
          >
            {favoriteCount}
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Món yêu thích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Text style={{ fontSize: 24 }}>🛒</Text>
          <Text
            style={[
              styles.statNumber,
              Typography.title,
              { color: colors.textPrimary, marginTop: Spacing.xs },
            ]}
          >
            {cartCount}
          </Text>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            Món trong giỏ
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. TÙY CHỌN GIAO DIỆN SÁNG / TỐI (THEME TOKENS) */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionTitle, Typography.title, { color: colors.textPrimary }]}>
          🎨 Giao diện ứng dụng (Theme)
        </Text>
        <Text
          style={[
            Typography.caption,
            { color: colors.textSecondary, marginBottom: Spacing.sm },
          ]}
        >
          Hệ thống token màu chuẩn đề tài — Không sử dụng mã hex ngoài token.
        </Text>

        <View style={styles.themeButtonsRow}>
          {[
            { id: 'system', label: 'Theo máy', icon: '⚙️' },
            { id: 'light', label: 'Sáng', icon: '☀️' },
            { id: 'dark', label: 'Tối', icon: '🌙' },
          ].map(item => {
            const isSelected = mode === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: isSelected ? colors.tint : colors.backgroundSecondary,
                    borderColor: isSelected ? colors.tint : colors.borderDefault,
                  },
                ]}
                onPress={() => setMode(item.id as any)}
                accessibilityRole="button"
                accessibilityLabel={`Chuyển giao diện ${item.label}`}
              >
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text
                  style={[
                    styles.themeBtnText,
                    Typography.bodySmall,
                    {
                      color: isSelected ? colors.onTint : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 4. CHỨC NĂNG NGƯỜI BÁN */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionTitle, Typography.title, { color: colors.textPrimary }]}>
          🏪 Quản lý người bán
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
          onPress={() => {
            if (!user) {
              Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để đăng tin rao bán.', [
                { text: 'Đăng nhập', onPress: () => router.push('/login') },
                { text: 'Hủy' },
              ]);
            } else {
              router.push('/listing-form');
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Đăng tin rao bán món đồ mới"
        >
          <Text style={{ fontSize: 20 }}>➕</Text>
          <Text style={[styles.menuText, Typography.bodyLarge, { color: colors.textPrimary }]}>
            Đăng tin bán giáo trình / đồ dùng mới
          </Text>
          <Text style={{ color: colors.textMuted }}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)')}
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả tin đăng của bạn trên chợ"
        >
          <Text style={{ fontSize: 20 }}>📋</Text>
          <Text style={[styles.menuText, Typography.bodyLarge, { color: colors.textPrimary }]}>
            Tin đăng của tôi trên Chợ
          </Text>
          <Text style={{ color: colors.textMuted }}>➔</Text>
        </TouchableOpacity>
      </View>

      {/* 5. THÔNG TIN HỌC PHẦN & ĐỀ TÀI */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionTitle, Typography.title, { color: colors.textPrimary }]}>
          🏫 Thông tin học phần
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Trường: Đại học Công nghệ Đồng Nai (DNTU)
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Khoa: Công nghệ thông tin
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Đề tài 02: Chợ mua bán trong khuôn viên trường
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Mã lớp: TH7011101 — 23DTH1
        </Text>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Sinh viên: Nguyễn Duy Khôi (MSSV: 1923050528)
        </Text>
      </View>

      {/* 6. NÚT ĐĂNG XUẤT (CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP) */}
      {user ? (
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: colors.dangerBg, borderColor: colors.danger },
          ]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất khỏi ứng dụng an toàn"
        >
          <Text style={[styles.logoutText, Typography.bodyLarge, { color: colors.danger }]}>
            🚪 Đăng xuất hoàn toàn
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  profileCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: Spacing.md,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
  },
  roleRow: {
    marginTop: Spacing.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontWeight: '700',
  },
  switchRoleBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  loginActionBtn: {
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  demoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  demoQuickBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight - 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '700',
  },
  sectionBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  themeButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  themeBtnText: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontWeight: '600',
  },
  logoutBtn: {
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logoutText: {
    fontWeight: '700',
  },
});

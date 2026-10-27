import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useCartStore, selectCartSubtotal } from '@/store/useCartStore';
import { EmptyView, LoadingView } from '@/components/FeedbackStates';
import { StockBadge } from '@/components/StockBadge';
import { formatCurrency } from '@/utils/cartCalculations';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const isHydrated = useCartStore(state => state.isHydrated);
  const items = useCartStore(state => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const increment = useCartStore(state => state.increment);
  const decrement = useCartStore(state => state.decrement);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);

  if (!isHydrated) {
    return <LoadingView message="Đang nạp giỏ hàng của bạn..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyView
        title="Giỏ hàng đang trống"
        description="Bạn chưa chọn món đồ hoặc giáo trình nào. Hãy khám phá chợ sinh viên để tìm những món đồ ưng ý nhé!"
        actionText="Đi dạo Chợ DNTU"
        onAction={() => router.push('/(tabs)')}
      />
    );
  }

  const handleIncrement = (listingId: string) => {
    const res = increment(listingId);
    if (!res.success && res.message) {
      Alert.alert('Giới hạn tồn kho', res.message);
    }
  };

  const handleClearPrompt = () => {
    Alert.alert(
      'Xóa toàn bộ giỏ hàng',
      'Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa hết', style: 'destructive', onPress: () => clearCart() },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header giỏ hàng */}
      <View style={styles.topHeader}>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          {items.length} mặt hàng trong giỏ
        </Text>
        <TouchableOpacity
          onPress={handleClearPrompt}
          accessibilityRole="button"
          accessibilityLabel="Làm trống toàn bộ giỏ hàng"
        >
          <Text style={[Typography.bodySmall, { color: colors.danger, fontWeight: '600' }]}>
            Xóa hết
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.listingId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isOutOfStock = item.listing.stock <= 0;
          const exceedsStock = item.quantity > item.listing.stock;

          return (
            <View
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: exceedsStock ? colors.danger : colors.borderDefault,
                },
              ]}
            >
              <Image
                source={{ uri: item.listing.photoUri }}
                style={styles.thumbnail}
                contentFit="cover"
                accessibilityLabel={item.listing.title}
              />

              <View style={styles.infoCol}>
                <View style={styles.rowBetween}>
                  <StockBadge stock={item.listing.stock} />
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.listingId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Xóa ${item.listing.title} khỏi giỏ`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.removeIcon, { color: colors.textMuted }]}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.itemTitle,
                    Typography.bodyLarge,
                    { color: colors.textPrimary, marginTop: Spacing.xs },
                  ]}
                  numberOfLines={2}
                >
                  {item.listing.title}
                </Text>

                <Text
                  style={[
                    styles.itemPrice,
                    Typography.title,
                    { color: colors.tint, marginTop: Spacing.xxs },
                  ]}
                >
                  {formatCurrency(item.listing.price)}
                </Text>

                {/* Cảnh báo nếu số lượng vượt quá tồn kho hiện có */}
                {exceedsStock ? (
                  <Text style={[styles.warningText, Typography.caption, { color: colors.danger }]}>
                    ⚠️ Tồn kho chỉ còn {item.listing.stock}. Vui lòng giảm số lượng.
                  </Text>
                ) : null}

                {/* Bộ tăng giảm số lượng */}
                <View style={styles.qtyRow}>
                  <View
                    style={[
                      styles.stepper,
                      {
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.borderDefault,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => decrement(item.listingId)}
                      accessibilityRole="button"
                      accessibilityLabel="Giảm 1 sản phẩm"
                    >
                      <Text style={[styles.stepSymbol, { color: colors.textPrimary }]}>−</Text>
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.stepVal,
                        Typography.bodyLarge,
                        { color: colors.textPrimary, fontWeight: '700' },
                      ]}
                    >
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleIncrement(item.listingId)}
                      disabled={isOutOfStock || item.quantity >= item.listing.stock}
                      accessibilityRole="button"
                      accessibilityLabel="Tăng 1 sản phẩm"
                    >
                      <Text
                        style={[
                          styles.stepSymbol,
                          {
                            color:
                              isOutOfStock || item.quantity >= item.listing.stock
                                ? colors.textMuted
                                : colors.textPrimary,
                          },
                        ]}
                      >
                        ＋
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.rowTotal,
                      Typography.bodyLarge,
                      { color: colors.textPrimary, fontWeight: '700' },
                    ]}
                  >
                    = {formatCurrency(item.listing.price * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Thanh thanh toán phía dưới */}
      <View
        style={[
          styles.bottomSummary,
          {
            backgroundColor: colors.backgroundCard,
            borderTopColor: colors.borderDefault,
          },
        ]}
      >
        <View style={styles.subtotalRow}>
          <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
            Tạm tính giỏ hàng:
          </Text>
          <Text
            style={[
              Typography.heading,
              { color: colors.tint, fontWeight: '700' },
            ]}
          >
            {formatCurrency(subtotal)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            { backgroundColor: colors.tint },
          ]}
          onPress={() => router.push('/checkout')}
          accessibilityRole="button"
          accessibilityLabel="Chuyển đến màn hình Tóm tắt thanh toán"
        >
          <Text style={[styles.checkoutBtnText, Typography.title, { color: colors.onTint }]}>
            Tiến hành đặt hàng ➔
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 120,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 16,
    fontWeight: '700',
    padding: Spacing.xxs,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemPrice: {
    fontWeight: '700',
  },
  warningText: {
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 38,
  },
  stepBtn: {
    width: 36,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepSymbol: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepVal: {
    paddingHorizontal: Spacing.sm,
  },
  rowTotal: {},
  bottomSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  checkoutBtn: {
    minHeight: TouchTarget.minHeight + 6,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontWeight: '700',
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useCartStore, selectCartSubtotal } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiService } from '@/services/api';
import {
  calculateShippingFee,
  calculateOrderTotal,
  formatCurrency,
  SHIPPING_RATES,
} from '@/utils/cartCalculations';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const currentUser = useAuthStore(state => state.user);
  const items = useCartStore(state => state.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shippingMethod = useCartStore(state => state.shippingMethod);
  const setShippingMethod = useCartStore(state => state.setShippingMethod);
  const clearCart = useCartStore(state => state.clearCart);

  const [pickupLocation, setPickupLocation] = useState(
    'Cổng chính Trường ĐH Công nghệ Đồng Nai'
  );
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '0901234567');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = calculateShippingFee(shippingMethod, subtotal);
  const total = calculateOrderTotal(subtotal, shippingFee);

  if (items.length === 0) {
    return (
      <View style={[styles.emptyCenter, { backgroundColor: colors.background }]}>
        <Text style={[Typography.title, { color: colors.textPrimary }]}>
          Giỏ hàng của bạn đang trống!
        </Text>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.tint, marginTop: Spacing.md }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[Typography.bodyLarge, { color: colors.onTint, fontWeight: '700' }]}>
            Về Chợ mua sắm
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirmOrder = async () => {
    if (!currentUser) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập tài khoản sinh viên DNTU để xác nhận và lưu đơn hàng của bạn.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập ngay', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    if (!pickupLocation.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn hoặc nhập địa điểm nhận hàng trong trường.');
      return;
    }
    if (!buyerPhone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại để người bán liên hệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        buyerId: currentUser?.id || 'USR-01',
        buyerName: currentUser?.name || 'Nguyễn Duy Khôi',
        buyerPhone: buyerPhone.trim(),
        items: items.map(item => ({
          listingId: item.listingId,
          title: item.listing.title,
          price: item.listing.price,
          quantity: item.quantity,
          photoUri: item.listing.photoUri,
        })),
        subtotal,
        shippingMethod,
        shippingFee,
        total,
        pickupLocation: pickupLocation.trim(),
        note: note.trim(),
      };

      const result = await ApiService.createOrder(orderPayload);
      await clearCart();

      Alert.alert(
        '🎉 Đặt hàng thành công!',
        `Mã đơn hàng: ${result.id}\nTổng thanh toán: ${formatCurrency(result.total)}\nNgười bán sẽ liên hệ bạn qua SĐT ${buyerPhone} để giao nhận tại ${pickupLocation}.`,
        [
          {
            text: 'Về trang chủ Chợ',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Lỗi đặt hàng', e.message || 'Không thể hoàn tất đơn hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. DANH SÁCH MẶT HÀNG TÓM TẮT */}
        <View
          style={[
            styles.cardBox,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <Text style={[styles.boxTitle, Typography.title, { color: colors.textPrimary }]}>
            📦 Các mặt hàng ({items.length})
          </Text>

          {items.map(item => (
            <View
              key={item.listingId}
              style={[
                styles.itemRow,
                { borderBottomColor: colors.borderLight },
              ]}
            >
              <View style={styles.itemLeft}>
                <Text
                  style={[
                    styles.itemTitle,
                    Typography.body,
                    { color: colors.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {item.listing.title}
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  {formatCurrency(item.listing.price)} × {item.quantity}
                </Text>
              </View>

              <Text
                style={[
                  styles.itemTotal,
                  Typography.bodyLarge,
                  { color: colors.textPrimary, fontWeight: '700' },
                ]}
              >
                {formatCurrency(item.listing.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* 2. QUY TẮC VẬN CHUYỂN & GIAO NHẬN CAMPUS */}
        <View
          style={[
            styles.cardBox,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <Text style={[styles.boxTitle, Typography.title, { color: colors.textPrimary }]}>
            🚚 Phương thức giao nhận trong trường
          </Text>
          <Text
            style={[
              Typography.caption,
              { color: colors.textSecondary, marginBottom: Spacing.sm },
            ]}
          >
            Đề cương quy định rõ ràng: Giao nhận trực tiếp tại khuôn viên miễn phí 100%.
          </Text>

          {/* Option 1: Trực tiếp */}
          <TouchableOpacity
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  shippingMethod === 'CAMPUS_PICKUP' ? colors.tintSubtle : colors.backgroundInput,
                borderColor:
                  shippingMethod === 'CAMPUS_PICKUP' ? colors.tint : colors.borderDefault,
              },
            ]}
            onPress={() => setShippingMethod('CAMPUS_PICKUP')}
            accessibilityRole="radio"
            accessibilityLabel="Hẹn gặp trực tiếp trong trường, phí 0 đồng"
            accessibilityState={{ selected: shippingMethod === 'CAMPUS_PICKUP' }}
          >
            <View style={styles.radioRow}>
              <Text style={{ fontSize: 18 }}>🏫</Text>
              <View style={styles.methodInfo}>
                <Text style={[Typography.bodyLarge, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Hẹn gặp trực tiếp trong trường
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  Gặp tại giảng đường, thư viện hoặc căn tin DNTU
                </Text>
              </View>
              <Text style={[Typography.bodyLarge, { color: colors.success, fontWeight: '700' }]}>
                0 đ (Miễn phí)
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Giao tận KTX */}
          <TouchableOpacity
            style={[
              styles.methodOption,
              {
                backgroundColor:
                  shippingMethod === 'DORM_DELIVERY' ? colors.tintSubtle : colors.backgroundInput,
                borderColor:
                  shippingMethod === 'DORM_DELIVERY' ? colors.tint : colors.borderDefault,
              },
            ]}
            onPress={() => setShippingMethod('DORM_DELIVERY')}
            accessibilityRole="radio"
            accessibilityLabel="Giao tận phòng Ký túc xá DNTU"
            accessibilityState={{ selected: shippingMethod === 'DORM_DELIVERY' }}
          >
            <View style={styles.radioRow}>
              <Text style={{ fontSize: 18 }}>🏢</Text>
              <View style={styles.methodInfo}>
                <Text style={[Typography.bodyLarge, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Giao tận phòng Ký túc xá DNTU
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  Miễn phí nếu đơn hàng từ {formatCurrency(SHIPPING_RATES.FREE_DORM_THRESHOLD)}
                </Text>
              </View>
              <Text style={[Typography.bodyLarge, { color: colors.tint, fontWeight: '700' }]}>
                {subtotal >= SHIPPING_RATES.FREE_DORM_THRESHOLD
                  ? '0 đ (Freeship)'
                  : formatCurrency(SHIPPING_RATES.DORM_DELIVERY_FEE)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. ĐỊA ĐIỂM HẸN & LIÊN HỆ */}
        <View
          style={[
            styles.cardBox,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <Text style={[styles.boxTitle, Typography.title, { color: colors.textPrimary }]}>
            📍 Địa điểm nhận & Thông tin liên hệ
          </Text>

          <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
            Địa điểm nhận hàng cụ thể:
          </Text>
          <TextInput
            style={[
              styles.input,
              Typography.body,
              {
                backgroundColor: colors.backgroundInput,
                borderColor: colors.borderDefault,
                color: colors.textPrimary,
              },
            ]}
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="Ví dụ: Bàn tròn trước Thư viện DNTU, Sảnh A1..."
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Địa điểm nhận hàng"
          />

          <Text
            style={[
              styles.inputLabel,
              Typography.bodySmall,
              { color: colors.textSecondary, marginTop: Spacing.sm },
            ]}
          >
            Số điện thoại người nhận:
          </Text>
          <TextInput
            style={[
              styles.input,
              Typography.body,
              {
                backgroundColor: colors.backgroundInput,
                borderColor: colors.borderDefault,
                color: colors.textPrimary,
              },
            ]}
            value={buyerPhone}
            onChangeText={setBuyerPhone}
            placeholder="09xxxxxxxx"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            accessibilityLabel="Số điện thoại người nhận"
          />

          <Text
            style={[
              styles.inputLabel,
              Typography.bodySmall,
              { color: colors.textSecondary, marginTop: Spacing.sm },
            ]}
          >
            Ghi chú thêm cho người bán (tùy chọn):
          </Text>
          <TextInput
            style={[
              styles.input,
              Typography.body,
              {
                backgroundColor: colors.backgroundInput,
                borderColor: colors.borderDefault,
                color: colors.textPrimary,
              },
            ]}
            value={note}
            onChangeText={setNote}
            placeholder="Ví dụ: Gặp sau giờ học tiết 4 ca sáng..."
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Ghi chú đơn hàng"
          />
        </View>

        {/* 4. TỔNG KẾT TIỀN */}
        <View
          style={[
            styles.cardBox,
            { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
          ]}
        >
          <View style={styles.costRow}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>Tạm tính tiền hàng:</Text>
            <Text style={[Typography.bodyLarge, { color: colors.textPrimary, fontWeight: '600' }]}>
              {formatCurrency(subtotal)}
            </Text>
          </View>

          <View style={[styles.costRow, { marginTop: Spacing.xs }]}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>Phí vận chuyển:</Text>
            <Text
              style={[
                Typography.bodyLarge,
                { color: shippingFee === 0 ? colors.success : colors.textPrimary, fontWeight: '600' },
              ]}
            >
              {shippingFee === 0 ? '0 đ' : formatCurrency(shippingFee)}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.borderDefault, marginVertical: Spacing.sm },
            ]}
          />

          <View style={styles.costRow}>
            <Text style={[Typography.heading, { color: colors.textPrimary, fontWeight: '700' }]}>
              Tổng thanh toán:
            </Text>
            <Text style={[Typography.display, { color: colors.tint, fontWeight: '700' }]}>
              {formatCurrency(total)}
            </Text>
          </View>

          <Text
            style={[
              Typography.caption,
              { color: colors.textMuted, marginTop: Spacing.xs, textAlign: 'right' },
            ]}
          >
            *Thanh toán trực tiếp khi nhận hàng trong khuôn viên trường
          </Text>
        </View>
      </ScrollView>

      {/* Nút chốt đơn hàng */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.backgroundCard,
            borderTopColor: colors.borderDefault,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: colors.tint },
          ]}
          onPress={handleConfirmOrder}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={`Xác nhận đặt hàng với tổng tiền ${formatCurrency(total)}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onTint} />
          ) : (
            <Text style={[styles.confirmText, Typography.title, { color: colors.onTint }]}>
              ✓ Xác nhận đặt hàng ({formatCurrency(total)})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  backBtn: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 110,
  },
  cardBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  boxTitle: {
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemTotal: {},
  methodOption: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  confirmBtn: {
    minHeight: TouchTarget.minHeight + 6,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: '700',
  },
});

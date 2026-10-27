import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useAppTheme } from '@/hooks/useThemeColor';
import { ApiService } from '@/services/api';
import { Listing } from '@/types/marketplace';
import { FavoriteButton } from '@/components/FavoriteButton';
import { StockBadge } from '@/components/StockBadge';
import { LoadingView, ErrorView } from '@/components/FeedbackStates';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/utils/cartCalculations';
import { getSmartImageByTitle } from '@/utils/smartProductImage';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();

  const currentUser = useAuthStore(state => state.user);
  const addToCart = useCartStore(state => state.addToCart);

  const [quantity, setQuantity] = useState(1);

  // 1. Tải chi tiết theo ID từ API
  const {
    data: listing,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Listing>({
    queryKey: ['listing-detail', id],
    queryFn: () => ApiService.getListingById(id as string),
    enabled: Boolean(id),
  });

  // 2. Mutation xóa tin nếu là chính chủ
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!listing || !currentUser) return false;
      return await ApiService.deleteListing(listing.id, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campus-listings-1923050528'] });
      Alert.alert('Thành công', 'Đã xóa tin đăng khỏi Chợ Sinh Viên.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err: any) => {
      Alert.alert('Lỗi', err.message || 'Không thể xóa tin đăng này.');
    },
  });

  // 3. Xử lý trạng thái Loading và Error
  if (isLoading) {
    return <LoadingView message="Đang nạp chi tiết tin đăng..." />;
  }

  if (isError || !listing) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Tin đăng này không còn tồn tại.'}
        onRetry={() => refetch()}
        retryText="Thử tải lại"
      />
    );
  }

  // 4. Kiểm tra phân quyền và điều kiện nghiệp vụ
  const isOwner = currentUser?.id === listing.sellerId;
  const isOutOfStock = listing.stock <= 0;

  const handleAddToCart = () => {
    if (isOwner) {
      Alert.alert('Thông báo', 'Bạn không thể mua tin đăng của chính mình.');
      return;
    }
    if (isOutOfStock) {
      Alert.alert('Hết hàng', 'Mặt hàng này hiện đã hết hàng.');
      return;
    }

    const res = addToCart(listing, quantity);
    Alert.alert(res.success ? 'Thành công' : 'Không thể thêm', res.message, [
      { text: 'Tiếp tục xem' },
      { text: 'Xem giỏ hàng', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  const handleDeletePrompt = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa tin đăng "${listing.title}" không? Thao tác này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ảnh sản phẩm lớn */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                listing.photoUri && listing.photoUri.trim()
                  ? listing.photoUri
                  : getSmartImageByTitle(listing.title, listing.category).url,
            }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
            accessibilityLabel={`Ảnh chi tiết của ${listing.title}`}
          />
          <View style={styles.favFloating}>
            <FavoriteButton listing={listing} size={22} />
          </View>
        </View>

        {/* Thông tin chính */}
        <View style={[styles.cardSection, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.badgeRow}>
            <StockBadge stock={listing.stock} />
            {listing.condition ? (
              <View
                style={[
                  styles.conditionBadge,
                  { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
                ]}
              >
                <Text style={[styles.conditionText, Typography.caption, { color: colors.textSecondary }]}>
                  {listing.condition === 'new'
                    ? 'Mới 100%'
                    : listing.condition === 'like-new'
                    ? 'Như mới (95%)'
                    : 'Đã qua sử dụng'}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[
              styles.title,
              Typography.heading,
              { color: colors.textPrimary, marginTop: Spacing.xs },
            ]}
          >
            {listing.title}
          </Text>

          <Text
            style={[
              styles.price,
              Typography.display,
              { color: colors.tint, marginTop: Spacing.xs },
            ]}
          >
            {formatCurrency(listing.price)}
          </Text>
        </View>

        {/* Thông tin Người bán */}
        <View
          style={[
            styles.cardSection,
            { backgroundColor: colors.backgroundCard, marginTop: Spacing.sm },
          ]}
        >
          <Text style={[styles.sectionHeading, Typography.title, { color: colors.textPrimary }]}>
            Thông tin người bán
          </Text>
          <View style={styles.sellerRow}>
            <View
              style={[
                styles.sellerAvatar,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
              ]}
            >
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text
                style={[
                  styles.sellerName,
                  Typography.bodyLarge,
                  { color: colors.textPrimary, fontWeight: '700' },
                ]}
              >
                {listing.sellerName}
              </Text>
              <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                {isOwner ? '⭐ Đây là tin đăng của bạn' : 'Sinh viên Trường ĐH Công nghệ Đồng Nai'}
              </Text>
              {listing.sellerPhone ? (
                <Text style={[Typography.caption, { color: colors.textMuted, marginTop: Spacing.xxs }]}>
                  📞 Liên hệ: {listing.sellerPhone}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Mô tả chi tiết */}
        <View
          style={[
            styles.cardSection,
            { backgroundColor: colors.backgroundCard, marginTop: Spacing.sm },
          ]}
        >
          <Text style={[styles.sectionHeading, Typography.title, { color: colors.textPrimary }]}>
            Mô tả sản phẩm
          </Text>
          <Text
            style={[
              Typography.body,
              { color: colors.textSecondary, marginTop: Spacing.xs, lineHeight: 22 },
            ]}
          >
            {listing.description || 'Người bán chưa thêm mô tả chi tiết cho món đồ này.'}
          </Text>

          {/* Dữ liệu kiểm toán nén ảnh nếu có */}
          {listing.originalPhotoSize && listing.compressedPhotoSize ? (
            <View
              style={[
                styles.compressionNote,
                { backgroundColor: colors.infoBg, borderColor: colors.info },
              ]}
            >
              <Text style={[Typography.caption, { color: colors.info, fontWeight: '700' }]}>
                📸 Bằng chứng nén ảnh trước khi tải lên:
              </Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                Gốc: {(listing.originalPhotoSize / 1024).toFixed(1)} KB → Đã nén:{' '}
                {(listing.compressedPhotoSize / 1024).toFixed(1)} KB (Giảm{' '}
                {(
                  ((listing.originalPhotoSize - listing.compressedPhotoSize) /
                    listing.originalPhotoSize) *
                  100
                ).toFixed(1)}
                %)
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Thanh hành động phía dưới (Footer Action Bar) */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.backgroundCard,
            borderTopColor: colors.borderDefault,
          },
        ]}
      >
        {isOwner ? (
          // Thao tác cho người bán chính chủ
          <View style={styles.ownerActionsRow}>
            <TouchableOpacity
              style={[
                styles.editBtn,
                { backgroundColor: colors.tintSubtle, borderColor: colors.tint },
              ]}
              onPress={() => router.push(`/listing-form?editId=${listing.id}`)}
              accessibilityRole="button"
              accessibilityLabel="Sửa tin đăng của bạn"
            >
              <Text style={[styles.editBtnText, Typography.bodyLarge, { color: colors.tint }]}>
                ✏️ Chỉnh sửa tin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}
              onPress={handleDeletePrompt}
              disabled={deleteMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel="Xóa tin đăng của bạn"
            >
              <Text style={[styles.deleteBtnText, Typography.bodyLarge, { color: colors.danger }]}>
                {deleteMutation.isPending ? 'Đang xóa...' : '🗑️ Xóa tin'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Thao tác cho người mua
          <View style={styles.buyerActionsRow}>
            {/* Bộ chọn số lượng */}
            {!isOutOfStock ? (
              <View
                style={[
                  styles.qtySelector,
                  { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
                ]}
              >
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Giảm số lượng mua"
                >
                  <Text style={[styles.qtySymbol, { color: colors.textPrimary }]}>−</Text>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.qtyValue,
                    Typography.bodyLarge,
                    { color: colors.textPrimary, fontWeight: '700' },
                  ]}
                >
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(prev => Math.min(listing.stock, prev + 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Tăng số lượng mua"
                >
                  <Text style={[styles.qtySymbol, { color: colors.textPrimary }]}>＋</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Nút thêm vào giỏ */}
            <TouchableOpacity
              style={[
                styles.addToCartBtn,
                {
                  backgroundColor: isOutOfStock ? colors.borderDefault : colors.tint,
                  flex: isOutOfStock ? 1 : undefined,
                },
              ]}
              onPress={handleAddToCart}
              disabled={isOutOfStock}
              accessibilityRole="button"
              accessibilityLabel={isOutOfStock ? 'Hết hàng' : `Thêm ${quantity} sản phẩm vào giỏ`}
            >
              <Text
                style={[
                  styles.addToCartText,
                  Typography.title,
                  { color: isOutOfStock ? colors.textMuted : colors.onTint },
                ]}
              >
                {isOutOfStock ? 'Món đồ đã hết hàng' : `🛒 Thêm vào giỏ (${formatCurrency(listing.price * quantity)})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  favFloating: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  cardSection: {
    padding: Spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  conditionBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  conditionText: {
    fontWeight: '600',
  },
  title: {},
  price: {},
  sectionHeading: {
    marginBottom: Spacing.xs,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: Spacing.md,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {},
  compressionNote: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  editBtnText: {
    fontWeight: '700',
  },
  deleteBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  deleteBtnText: {
    fontWeight: '700',
  },
  buyerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: TouchTarget.minHeight,
  },
  qtyBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySymbol: {
    fontSize: 20,
    fontWeight: '700',
  },
  qtyValue: {
    paddingHorizontal: Spacing.sm,
  },
  addToCartBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  addToCartText: {},
});


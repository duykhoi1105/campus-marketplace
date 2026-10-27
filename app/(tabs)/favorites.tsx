import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useFavoriteStore, selectFavoriteSnapshots } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';
import { EmptyView, LoadingView } from '@/components/FeedbackStates';
import { StockBadge } from '@/components/StockBadge';
import { formatCurrency } from '@/utils/cartCalculations';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const isHydrated = useFavoriteStore(state => state.isHydrated);
  const snapshots = useFavoriteStore(selectFavoriteSnapshots);
  const removeFavorite = useFavoriteStore(state => state.removeFavorite);
  const addToCart = useCartStore(state => state.addToCart);

  if (!isHydrated) {
    return <LoadingView message="Đang nạp danh sách yêu thích..." />;
  }

  if (snapshots.length === 0) {
    return (
      <EmptyView
        title="Chưa có món đồ yêu thích"
        description="Khi lướt Chợ DNTU, hãy nhấn vào biểu tượng trái tim để lưu lại những món đồ, sách giáo trình bạn quan tâm."
        actionText="Khám phá Chợ ngay"
        onAction={() => router.push('/(tabs)')}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
          Bạn đang lưu {snapshots.length} món đồ yêu thích:
        </Text>
      </View>

      <FlatList
        data={snapshots}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isOutOfStock = item.stock <= 0;

          return (
            <TouchableOpacity
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.borderDefault,
                },
              ]}
              onPress={() => router.push(`/listing/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Món yêu thích ${item.title}, giá ${formatCurrency(item.price)}`}
            >
              <Image
                source={{ uri: item.photoUri }}
                style={styles.thumbnail}
                contentFit="cover"
                accessibilityLabel={item.title}
              />

              <View style={styles.itemInfo}>
                <StockBadge stock={item.stock} />
                <Text
                  style={[
                    styles.title,
                    Typography.bodyLarge,
                    { color: colors.textPrimary, marginTop: Spacing.xxs },
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.price,
                    Typography.title,
                    { color: colors.tint, marginTop: Spacing.xxs },
                  ]}
                >
                  {formatCurrency(item.price)}
                </Text>

                <View style={styles.actionRow}>
                  {/* Bỏ yêu thích */}
                  <TouchableOpacity
                    style={[
                      styles.removeBtn,
                      { borderColor: colors.borderDefault },
                    ]}
                    onPress={() => removeFavorite(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Bỏ yêu thích món ${item.title}`}
                  >
                    <Text style={[Typography.caption, { color: colors.danger }]}>
                      💔 Bỏ lưu
                    </Text>
                  </TouchableOpacity>

                  {/* Thêm vào giỏ hàng */}
                  <TouchableOpacity
                    style={[
                      styles.cartBtn,
                      {
                        backgroundColor: isOutOfStock ? colors.borderDefault : colors.tint,
                      },
                    ]}
                    onPress={() => {
                      if (isOutOfStock) return;
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        stock: item.stock,
                        photoUri: item.photoUri,
                        category: item.category as any,
                        sellerId: 'USR-02',
                        sellerName: 'Duy Khôi',
                        description: '',
                        createdAt: item.savedAt,
                        isAvailable: item.stock > 0,
                      });
                    }}
                    disabled={isOutOfStock}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isOutOfStock ? 'Hết hàng' : `Thêm ${item.title} vào giỏ hàng`
                    }
                  >
                    <Text
                      style={[
                        Typography.caption,
                        {
                          color: isOutOfStock ? colors.textMuted : colors.onTint,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {isOutOfStock ? 'Hết hàng' : '+ Giỏ hàng'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  listContent: {
    padding: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  price: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  removeBtn: {
    minHeight: TouchTarget.minHeight - 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    minHeight: TouchTarget.minHeight - 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


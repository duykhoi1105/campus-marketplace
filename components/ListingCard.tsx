import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Listing } from '@/types/marketplace';
import { FavoriteButton } from './FavoriteButton';
import { StockBadge } from './StockBadge';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/utils/cartCalculations';
import { getSmartImageByTitle } from '@/utils/smartProductImage';
import {
  Spacing,
  BorderRadius,
  Typography,
  TouchTarget,
} from '@/constants/layout';

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const currentUser = useAuthStore(state => state.user);
  const addToCart = useCartStore(state => state.addToCart);

  const isOwnListing = currentUser?.id === listing.sellerId;
  const isOutOfStock = listing.stock <= 0;

  const handleCardPress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push({
      pathname: '/listing/[id]',
      params: { id: listing.id },
    });
  };

  const handleQuickAdd = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (isOwnListing || isOutOfStock) return;

    addToCart(listing, 1);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.borderDefault,
        },
      ]}
    >
      {/* Ảnh sản phẩm: nhấn để xem chi tiết */}
      <View style={styles.imageWrapper}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleCardPress}
          accessibilityRole="button"
          accessibilityLabel={`Xem chi tiết ${listing.title}`}
        >
          <Image
            source={{
              uri:
                listing.photoUri && listing.photoUri.trim()
                  ? listing.photoUri
                  : getSmartImageByTitle(
                      listing.title,
                      listing.category
                    ).url,
            }}
            style={styles.image}
            contentFit="cover"
            transition={250}
            accessibilityLabel={`Ảnh sản phẩm ${listing.title}`}
          />
        </Pressable>

        {/* Nút yêu thích là phần tử độc lập với nút xem chi tiết */}
        <View style={styles.favoriteWrapper}>
          <FavoriteButton listing={listing} size={18} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.badgeRow}>
          <StockBadge stock={listing.stock} />
          {isOwnListing ? (
            <View
              style={[
                styles.ownBadge,
                {
                  backgroundColor: colors.tintSubtle,
                  borderColor: colors.tint,
                },
              ]}
            >
              <Text
                style={[
                  styles.ownBadgeText,
                  Typography.caption,
                  { color: colors.tint },
                ]}
              >
                Của bạn
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={handleCardPress}
          accessibilityRole="button"
          accessibilityLabel={`Xem chi tiết ${listing.title}`}
        >
          <Text
            style={[
              styles.title,
              Typography.bodyLarge,
              { color: colors.textPrimary },
            ]}
            numberOfLines={2}
          >
            {listing.title}
          </Text>

          <Text
            style={[
              styles.price,
              Typography.title,
              { color: colors.tint, marginTop: Spacing.xs },
            ]}
          >
            {formatCurrency(listing.price)}
          </Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text
            style={[
              styles.sellerText,
              Typography.caption,
              { color: colors.textMuted },
            ]}
            numberOfLines={1}
          >
            👤 {listing.sellerName}
          </Text>

          {!isOwnListing ? (
            <Pressable
              style={[
                styles.cartButton,
                {
                  backgroundColor:
                    isOutOfStock
                      ? colors.borderDefault
                      : colors.tint,
                },
              ]}
              onPress={handleQuickAdd}
              disabled={isOutOfStock}
              accessibilityRole="button"
              accessibilityLabel={
                isOutOfStock
                  ? 'Hết hàng, không thể thêm'
                  : !currentUser
                    ? 'Đăng nhập để thêm vào giỏ hàng'
                    : `Thêm ${listing.title} vào giỏ hàng`
              }
            >
              <Text
                style={[
                  styles.cartButtonText,
                  Typography.caption,
                  {
                    color: isOutOfStock
                      ? colors.textMuted
                      : colors.onTint,
                  },
                ]}
              >
                {isOutOfStock
                  ? 'Hết hàng'
                  : !currentUser
                    ? 'Đăng nhập'
                    : '+ Giỏ hàng'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteWrapper: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 2,
  },
  infoContainer: {
    padding: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  ownBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  ownBadgeText: {
    fontWeight: '700',
  },
  title: {
    fontWeight: '600',
  },
  price: {
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  sellerText: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cartButton: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    fontWeight: '700',
  },
});
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { Listing } from '@/types/marketplace';
import { TouchTarget, BorderRadius } from '@/constants/layout';

interface FavoriteButtonProps {
  listing: Listing;
  size?: number;
}

export function FavoriteButton({ listing, size = 20 }: FavoriteButtonProps) {
  const { colors } = useAppTheme();
  const isFav = useFavoriteStore(state => state.favoriteIds.includes(listing.id));
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);

  const handlePress = async (e: any) => {
    e?.stopPropagation?.();
    await toggleFavorite(listing);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFav ? colors.tintSubtle : colors.backgroundCard,
          borderColor: isFav ? colors.favoriteActive : colors.borderDefault,
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        isFav
          ? `Bỏ yêu thích món ${listing.title}`
          : `Thêm vào danh sách yêu thích món ${listing.title}`
      }
      accessibilityState={{ selected: isFav }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text
        style={{
          fontSize: size,
          color: isFav ? colors.favoriteActive : colors.favoriteInactive,
        }}
      >
        {isFav ? '❤️' : '🤍'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: TouchTarget.minWidth,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});


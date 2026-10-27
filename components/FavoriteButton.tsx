import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Listing } from '@/types/marketplace';
import { TouchTarget, BorderRadius } from '@/constants/layout';

interface FavoriteButtonProps {
  listing: Listing;
  size?: number;
}

export function FavoriteButton({ listing, size = 20 }: FavoriteButtonProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const user = useAuthStore(state => state.user);
  const isFav = useFavoriteStore(state =>
    state.favoriteIds.includes(listing.id)
  );
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);

  const handlePress = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    await toggleFavorite(listing);
  };

  return (
    <Pressable
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
        !user
          ? `Đăng nhập để yêu thích ${listing.title}`
          : isFav
            ? `Bỏ yêu thích món ${listing.title}`
            : `Thêm vào danh sách yêu thích món ${listing.title}`
      }
      accessibilityState={{ selected: isFav }}
      hitSlop={10}
    >
      <Text
        style={{
          fontSize: size,
          color: isFav ? colors.favoriteActive : colors.favoriteInactive,
        }}
      >
        {isFav ? '❤️' : '🤍'}
      </Text>
    </Pressable>
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
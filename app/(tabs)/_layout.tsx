import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useFavoriteStore, selectFavoriteCount } from '@/store/useFavoriteStore';
import { useCartStore, selectCartItemCount } from '@/store/useCartStore';

export default function TabLayout() {
  const { colors } = useAppTheme();
  const favoriteCount = useFavoriteStore(selectFavoriteCount);
  const cartCount = useCartStore(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopColor: colors.borderDefault,
        },
        headerStyle: {
          backgroundColor: colors.backgroundCard,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chợ DNTU',
          tabBarLabel: 'Chợ DNTU',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Biểu tượng Chợ">
              🛍️
            </Text>
          ),
          headerTitle: 'Chợ Khuôn Viên DNTU',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Yêu thích',
          tabBarLabel: 'Yêu thích',
          tabBarBadge: favoriteCount > 0 ? favoriteCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.badgeCountBg,
            color: colors.badgeCountText,
          },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Biểu tượng Yêu thích">
              ❤️
            </Text>
          ),
          headerTitle: 'Món Đồ Yêu Thích',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarLabel: 'Giỏ hàng',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.badgeCountBg,
            color: colors.badgeCountText,
          },
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Biểu tượng Giỏ hàng">
              🛒
            </Text>
          ),
          headerTitle: 'Giỏ Hàng Của Bạn',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }} accessibilityLabel="Biểu tượng Tài khoản">
              👤
            </Text>
          ),
          headerTitle: 'Hồ Sơ & Cài Đặt',
        }}
      />
    </Tabs>
  );
}


import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { ApiService, FetchListingsResponse } from '@/services/api';
import { MarketCategory } from '@/types/marketplace';
import { filterAndSearchListings } from '@/utils/filterListings';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ListingCard } from '@/components/ListingCard';
import { OfflineBanner } from '@/components/OfflineBanner';
import { LoadingView, EmptyView, ErrorView } from '@/components/FeedbackStates';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';
import { PriceNotificationService } from '@/services/priceNotificationService';
import { Spacing, BorderRadius, Typography } from '@/constants/layout';

export default function MarketScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const favoriteSnapshots = useFavoriteStore(state => state.snapshots);
  const syncWithListings = useCartStore(state => state.syncWithListings);

  // 1. Inputs từ người dùng (State thực sự)
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'all'>('all');

  // 2. Query dữ liệu từ API qua TanStack Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<FetchListingsResponse>({
    queryKey: ['campus-listings-1923050528'],
    queryFn: () => ApiService.getListings(),
  });

  const rawListings = useMemo(() => data?.items || [], [data?.items]);
  const isOffline = data?.isOffline || false;
  const lastSyncedAt = data?.lastSyncedAt || null;

  // 3. ĐỒNG BỘ GIỎ HÀNG VÀ PHÁT HIỆN BIẾN ĐỘNG GIÁ
  useEffect(() => {
    if (rawListings.length > 0) {
      syncWithListings(rawListings);
      PriceNotificationService.detectAndNotifyPriceChanges(favoriteSnapshots, rawListings);
    }
  }, [rawListings, favoriteSnapshots, syncWithListings]);

  // 4. TÍNH TOÁN DẪN XUẤT (DERIVED DATA) TRONG QUÁ TRÌNH RENDER
  // QUY TẮC BẮT BUỘC ĐỀ CƯƠNG: Không lưu filteredListings vào useState riêng!
  const filteredListings = useMemo(() => {
    return filterAndSearchListings(rawListings, searchText, selectedCategory);
  }, [rawListings, searchText, selectedCategory]);

  // 5. XỬ LÝ 4 TRẠNG THÁI CHUẨN: Loading, Error, Empty, Content
  if (isLoading && !data) {
    return <LoadingView message="Đang kết nối Chợ Sinh Viên DNTU..." />;
  }

  if (isError && !data) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Không thể tải tin đăng.'}
        onRetry={() => refetch()}
        retryText="Tải lại chợ"
      />
    );
  }

  const formattedLastUpdate = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Banner thông báo khi ở trạng thái ngoại tuyến */}
      <OfflineBanner
        isOffline={isOffline}
        lastSyncedAt={lastSyncedAt}
        onRetry={() => refetch()}
      />

      {/* Thanh tìm kiếm & Bộ lọc danh mục */}
      <View style={[styles.filterBar, { backgroundColor: colors.backgroundCard }]}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onClear={() => setSearchText('')}
          />
        </View>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Thanh trạng thái cập nhật & Số lượng tin đăng */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, Typography.caption, { color: colors.textSecondary }]}>
            {filteredListings.length} tin đăng phù hợp
          </Text>
          {formattedLastUpdate ? (
            <Text style={[styles.metaText, Typography.caption, { color: colors.textMuted }]}>
              🕒 Cập nhật: {formattedLastUpdate}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Danh sách tin đăng */}
      {filteredListings.length === 0 ? (
        <EmptyView
          title={searchText || selectedCategory !== 'all' ? 'Không tìm thấy tin đăng' : 'Chưa có tin đăng nào'}
          description={
            searchText || selectedCategory !== 'all'
              ? 'Hãy thử tìm bằng từ khóa khác hoặc chuyển sang danh mục "Tất cả".'
              : 'Hãy là người đầu tiên đăng bán giáo trình hoặc đồ dùng tại trường!'
          }
          actionText={searchText || selectedCategory !== 'all' ? 'Xóa bộ lọc' : '+ Đăng tin mới'}
          onAction={() => {
            if (searchText || selectedCategory !== 'all') {
              setSearchText('');
              setSelectedCategory('all');
            } else {
              router.push('/listing-form');
            }
          }}
        />
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.tint}
              colors={[colors.tint]}
            />
          }
        />
      )}

      {/* Nút Đăng Tin Nhanh (FAB) */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.tint,
            shadowColor: colors.shadowColor,
          },
        ]}
        onPress={() => router.push('/listing-form')}
        accessibilityRole="button"
        accessibilityLabel="Đăng tin bán đồ mới"
      >
        <Text style={[styles.fabIcon, { color: colors.onTint }]}>＋</Text>
        <Text style={[styles.fabText, Typography.bodySmall, { color: colors.onTint }]}>
          Đăng tin
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
  },
  metaText: {
    fontWeight: '500',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: BorderRadius.round,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: Spacing.xs,
  },
  fabText: {
    fontWeight: '700',
  },
});

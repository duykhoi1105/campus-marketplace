import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing, PriceAlert } from '@/types/marketplace';
import { FavoriteSnapshot } from '@/store/useFavoriteStore';
import { formatCurrency } from '@/utils/cartCalculations';

const ALERTS_STORAGE_KEY = 'campus_marketplace_price_alerts_1923050528';

export const PriceNotificationService = {
  /**
   * Xin quyền thông báo
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
      }
      return false;
    }

    try {
      // eslint-disable-next-line import/no-unresolved
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        return req.status === 'granted';
      }
      return true;
    } catch (e) {
      console.warn('Thiết bị không hỗ trợ module thông báo native:', e);
      return false;
    }
  },

  /**
   * Phát thông báo cục bộ (Local Notification)
   */
  async triggerLocalNotification(title: string, body: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.png' });
        return;
      }
      console.log(`[LOCAL NOTIFICATION - WEB]: ${title} - ${body}`);
      return;
    }

    try {
      // eslint-disable-next-line import/no-unresolved
      const Notifications = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: null, // Phát ngay lập tức
      });
    } catch (e) {
      console.warn('Không thể gửi thông báo cục bộ native:', e);
    }
  },

  /**
   * So sánh giá mới với snapshot cũ của các món yêu thích.
   * Phát hiện thay đổi giá và kích hoạt thông báo cục bộ nếu chưa từng thông báo.
   */
  async detectAndNotifyPriceChanges(
    favoriteSnapshots: Record<string, FavoriteSnapshot>,
    freshListings: Listing[]
  ): Promise<PriceAlert[]> {
    if (!favoriteSnapshots || !freshListings.length) return [];

    let notifiedHistory: Record<string, number> = {};
    try {
      const raw = await AsyncStorage.getItem(ALERTS_STORAGE_KEY);
      if (raw) {
        notifiedHistory = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Lỗi đọc lịch sử thông báo giá:', e);
    }

    const detectedAlerts: PriceAlert[] = [];

    for (const listing of freshListings) {
      const savedFavorite = favoriteSnapshots[listing.id];
      if (!savedFavorite) continue; // Chỉ theo dõi món nằm trong danh sách yêu thích

      const oldPrice = savedFavorite.price;
      const newPrice = listing.price;

      // Nếu giá thay đổi so với lúc người dùng bấm yêu thích
      if (oldPrice !== newPrice) {
        // Kiểm tra chống spam trùng lặp: nếu đã báo cho đúng mức newPrice này thì bỏ qua
        if (notifiedHistory[listing.id] === newPrice) {
          continue;
        }

        const isDrop = newPrice < oldPrice;
        const title = isDrop ? '🎉 Giảm giá món đồ yêu thích!' : '⚠️ Cập nhật giá sản phẩm';
        const body = isDrop
          ? `"${listing.title}" vừa giảm từ ${formatCurrency(oldPrice)} xuống còn ${formatCurrency(newPrice)}!`
          : `"${listing.title}" vừa được người bán cập nhật giá: ${formatCurrency(newPrice)}.`;

        // Gửi thông báo
        await this.triggerLocalNotification(title, body);

        notifiedHistory[listing.id] = newPrice;
        detectedAlerts.push({
          listingId: listing.id,
          listingTitle: listing.title,
          oldPrice,
          newPrice,
          changedAt: new Date().toISOString(),
          notified: true,
        });
      }
    }

    if (detectedAlerts.length > 0) {
      try {
        await AsyncStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(notifiedHistory));
      } catch (e) {
        console.warn('Lỗi lưu lịch sử thông báo:', e);
      }
    }

    return detectedAlerts;
  },
};

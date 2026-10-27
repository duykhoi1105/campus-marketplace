import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '@/types/marketplace';

const FAVORITES_STORAGE_KEY = 'campus_marketplace_favorites_1923050528';

export interface FavoriteSnapshot {
  id: string;
  title: string;
  price: number;
  photoUri: string;
  category: string;
  stock: number;
  savedAt: string;
}

interface FavoriteState {
  favoriteIds: string[];
  snapshots: Record<string, FavoriteSnapshot>;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  toggleFavorite: (listing: Listing) => Promise<boolean>;
  removeFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: [],
  snapshots: {},
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.favoriteIds)) {
          set({
            favoriteIds: parsed.favoriteIds,
            snapshots: parsed.snapshots || {},
            isHydrated: true,
          });
          return;
        }
      }
      set({ isHydrated: true });
    } catch (e) {
      console.warn('Lỗi khi khôi phục danh sách yêu thích:', e);
      set({ isHydrated: true });
    }
  },

  toggleFavorite: async (listing: Listing) => {
    const { favoriteIds, snapshots } = get();
    const id = listing.id;
    const exists = favoriteIds.includes(id);

    let nextIds: string[];
    const nextSnapshots = { ...snapshots };

    if (exists) {
      nextIds = favoriteIds.filter(item => item !== id);
      delete nextSnapshots[id];
    } else {
      nextIds = [id, ...favoriteIds];
      nextSnapshots[id] = {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        photoUri: listing.photoUri,
        category: listing.category,
        stock: listing.stock,
        savedAt: new Date().toISOString(),
      };
    }

    set({ favoriteIds: nextIds, snapshots: nextSnapshots });

    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify({ favoriteIds: nextIds, snapshots: nextSnapshots })
      );
    } catch (e) {
      console.warn('Lỗi lưu danh sách yêu thích vào bộ nhớ:', e);
    }

    return !exists;
  },

  removeFavorite: async (listingId: string) => {
    const { favoriteIds, snapshots } = get();
    const nextIds = favoriteIds.filter(id => id !== listingId);
    const nextSnapshots = { ...snapshots };
    delete nextSnapshots[listingId];

    set({ favoriteIds: nextIds, snapshots: nextSnapshots });

    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify({ favoriteIds: nextIds, snapshots: nextSnapshots })
      );
    } catch (e) {
      console.warn('Lỗi lưu sau khi xóa yêu thích:', e);
    }
  },

  isFavorite: (listingId: string) => {
    return get().favoriteIds.includes(listingId);
  },
}));

// Selectors
export const selectFavoriteIds = (state: FavoriteState) => state.favoriteIds;
export const selectFavoriteCount = (state: FavoriteState) => state.favoriteIds.length;
export const selectFavoriteSnapshots = (state: FavoriteState) => Object.values(state.snapshots);


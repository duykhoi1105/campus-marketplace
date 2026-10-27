import { create } from 'zustand';
import { User, UserRole } from '@/types/marketplace';
import { AuthStorage } from '@/services/authStorage';
import { ApiService } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  restoreSession: () => Promise<void>;
  login: (emailOrId: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const [token, user] = await Promise.all([
        AuthStorage.getToken(),
        AuthStorage.getUser(),
      ]);

      if (token && user) {
        set({ token, user, isInitialized: true, isLoading: false });
      } else {
        // Tự động đăng nhập tài khoản sinh viên mặc định cho buổi chấm đồ án nếu chưa có session
        const defaultUser: User = {
          id: 'USR-01',
          name: 'Nguyễn Duy Khôi',
          email: '1923050528@dntu.edu.vn',
          role: 'BUYER',
          phone: '0901234567',
          campusLocation: 'Ký túc xá Khu B, DNTU',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          createdAt: '2026-10-14T08:00:00.000Z',
        };
        const defaultToken = `init-token-${defaultUser.id}`;
        await Promise.all([
          AuthStorage.saveToken(defaultToken),
          AuthStorage.saveUser(defaultUser),
        ]);
        set({ user: defaultUser, token: defaultToken, isInitialized: true, isLoading: false });
      }
    } catch (e) {
      console.warn('Lỗi khôi phục phiên:', e);
      set({ user: null, token: null, isInitialized: true, isLoading: false });
    }
  },

  login: async (emailOrId: string) => {
    set({ isLoading: true });
    try {
      const { user, token } = await ApiService.login(emailOrId);
      await Promise.all([
        AuthStorage.saveToken(token),
        AuthStorage.saveUser(user),
      ]);
      set({ user, token, isLoading: false });
      return true;
    } catch (e) {
      console.warn('Đăng nhập thất bại:', e);
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        AuthStorage.deleteToken(),
        AuthStorage.deleteUser(),
      ]);
      set({ user: null, token: null, isLoading: false });
    } catch (e) {
      console.warn('Đăng xuất gặp lỗi:', e);
      set({ user: null, token: null, isLoading: false });
    }
  },

  switchRole: async (newRole: UserRole) => {
    const current = get().user;
    if (!current) return;
    const updatedUser: User = {
      ...current,
      role: newRole,
      id: newRole === 'SELLER' ? 'USR-02' : 'USR-01',
      name: newRole === 'SELLER' ? 'Duy Khôi (Sinh Viên Bán Hàng)' : 'Nguyễn Duy Khôi',
    };
    await AuthStorage.saveUser(updatedUser);
    set({ user: updatedUser });
  },

  updateUser: async (updated: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const nextUser = { ...current, ...updated };
    await AuthStorage.saveUser(nextUser);
    set({ user: nextUser });
  },
}));

// Selectors
export const selectIsAuthenticated = (state: AuthState) => Boolean(state.user && state.token);
export const selectCurrentUser = (state: AuthState) => state.user;
export const selectIsSeller = (state: AuthState) => state.user?.role === 'SELLER';
export const selectIsBuyer = (state: AuthState) => state.user?.role === 'BUYER';


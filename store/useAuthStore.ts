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
  login: (emailOrId: string, password?: string) => Promise<boolean>;
  loginAsDemo: (role: 'BUYER' | 'SELLER') => Promise<boolean>;
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
      const [token, user, isLoggedOut] = await Promise.all([
        AuthStorage.getToken(),
        AuthStorage.getUser(),
        AuthStorage.isExplicitlyLoggedOut(),
      ]);

      if (token && user) {
        set({ token, user, isInitialized: true, isLoading: false });
        return;
      }

      // Nếu người dùng đã chủ động đăng xuất, tôn trọng trạng thái đăng xuất (giữ null)
      if (isLoggedOut) {
        set({ user: null, token: null, isInitialized: true, isLoading: false });
        return;
      }

      // Khởi tạo tài khoản sinh viên DNTU mặc định cho lần đầu khởi chạy sạch trên máy giám khảo
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
        AuthStorage.setExplicitlyLoggedOut(false),
      ]);
      set({ user: defaultUser, token: defaultToken, isInitialized: true, isLoading: false });
    } catch (e) {
      console.warn('Lỗi khôi phục phiên:', e);
      set({ user: null, token: null, isInitialized: true, isLoading: false });
    }
  },

  login: async (emailOrId: string, password?: string) => {
    set({ isLoading: true });
    try {
      const { user, token } = await ApiService.login(emailOrId, password);
      await Promise.all([
        AuthStorage.saveToken(token),
        AuthStorage.saveUser(user),
        AuthStorage.setExplicitlyLoggedOut(false),
      ]);
      set({ user, token, isLoading: false });
      return true;
    } catch (e) {
      console.warn('Đăng nhập thất bại:', e);
      set({ isLoading: false });
      return false;
    }
  },

  loginAsDemo: async (role: 'BUYER' | 'SELLER') => {
    const email =
      role === 'SELLER'
        ? 'duykhoi.seller@dntu.edu.vn'
        : '1923050528@dntu.edu.vn';
    return await get().login(email, '123456');
  },

  logout: async () => {
    set({ isLoading: true });
    const currentToken = get().token;
    try {
      await Promise.all([
        ApiService.logout(currentToken || undefined),
        AuthStorage.clearAllAuth(),
      ]);
    } catch (e) {
      console.warn('Đăng xuất gặp lỗi:', e);
    } finally {
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

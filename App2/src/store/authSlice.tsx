import { apiStorage } from '../Utils/AsyncStorageManager';
import { networkManager } from '../Utils/NetworkManager';
import { create } from 'zustand';

interface User {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
  avatar: string | null;
  language: string | null;
  lastAccess: string | null;
  location: string | null;
  provider: string | null;
  description: string | null;
  tags: string | null;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  postAuthLogin: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  postAuthLogin: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const json = await networkManager.fetchCurrentUser(username, password);
      const userData = json?.data || {};

      await apiStorage.setItem('userId', userData.id || null);
      await apiStorage.setItem('firstName', userData.first_name || null);
      await apiStorage.setItem('lastName', userData.last_name || null);
      await apiStorage.setItem('email', userData.email || null);
      await apiStorage.setItem('role', userData.role || null);
      await apiStorage.setItem('status', userData.status || null);
      await apiStorage.setItem('avatar', userData.avatar || null);
      await apiStorage.setItem('language', userData.language || null);
      await apiStorage.setItem('lastAccess', userData.last_access || null);
      await apiStorage.setItem('location', userData.location || null);
      await apiStorage.setItem('provider', userData.provider || null);
      await apiStorage.setItem('description', userData.description || null);
      await apiStorage.setItem('tags', userData.tags || null);
      await apiStorage.setItem('token', userData.token || null);

      set({
        user: {
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
          avatar: userData.avatar,
          language: userData.language,
          lastAccess: userData.last_access,
          location: userData.location,
          provider: userData.provider,
          description: userData.description,
          tags: userData.tags,
        },
        token: userData.token,
        isLoading: false,
      });

      return userData;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  logout: () => {
    apiStorage.clear();
    set({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  },
}));

export default useAuthStore;

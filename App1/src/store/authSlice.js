import {apiStorage} from '../Utils/AsyncStorageManager';
import {networkManager} from '../Utils/NetworkManager';

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isLoading = false;
    this.error = null;
  }

  async postAuthLogin(username, password) {
    this.isLoading = true;
    this.error = null;

    try {
      const json = await networkManager.fetchCurrentUser(username, password);
      const userData = json?.data || {};

      const storeItem = async (key, value) => {
        if (value !== undefined && value !== null) {
          await apiStorage.setItem(key, value);
        }
      };

      await storeItem('userId', userData.id);
      await storeItem('firstName', userData.first_name);
      await storeItem('lastName', userData.last_name);
      await storeItem('email', userData.email);
      await storeItem('role', userData.role);
      await storeItem('status', userData.status);
      await storeItem('avatar', userData.avatar);
      await storeItem('language', userData.language);
      await storeItem('lastAccess', userData.last_access);
      await storeItem('location', userData.location);
      await storeItem('provider', userData.provider);
      await storeItem('description', userData.description);
      await storeItem('tags', userData.tags);
      await storeItem('token', userData.token);

      this.user = {
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
      };
      this.token = userData.token;
      this.isLoading = false;

      return userData;
    } catch (error) {
      this.user = null;
      this.token = null;
      this.isLoading = false;
      this.error = error.message || 'Login failed';
      throw error;
    }
  }

  async logout() {
    await apiStorage.clear();
    this.user = null;
    this.token = null;
    this.isLoading = false;
    this.error = null;
  }
}

const authService = new AuthService();
export default authService;

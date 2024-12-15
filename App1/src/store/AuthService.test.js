import authService from '../store/authSlice';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {networkManager} from '../Utils/NetworkManager';

jest.mock('../Utils/AsyncStorageManager', () => ({
  apiStorage: {
    setItem: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock('../Utils/NetworkManager', () => ({
  networkManager: {
    fetchCurrentUser: jest.fn(),
  },
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postAuthLogin', () => {
    it('should successfully log in a user and store their data', async () => {
      const mockUserData = {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        avatar: 'avatar_url',
        language: 'en',
        last_access: '2024-12-15T12:00:00Z',
        location: 'Earth',
        provider: 'email',
        description: 'Test User',
        tags: ['test', 'user'],
        token: 'fake_token_123',
      };

      networkManager.fetchCurrentUser.mockResolvedValue({data: mockUserData});

      const result = await authService.postAuthLogin('username', 'password');

      expect(result).toEqual(mockUserData);
      expect(apiStorage.setItem).toHaveBeenCalledWith(
        'userId',
        mockUserData.id,
      );
      expect(apiStorage.setItem).toHaveBeenCalledWith(
        'token',
        mockUserData.token,
      );
      expect(authService.user).toEqual({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        avatar: 'avatar_url',
        language: 'en',
        lastAccess: '2024-12-15T12:00:00Z',
        location: 'Earth',
        provider: 'email',
        description: 'Test User',
        tags: ['test', 'user'],
      });
      expect(authService.token).toBe('fake_token_123');
      expect(authService.error).toBeNull();
      expect(authService.isLoading).toBe(false);
    });

    it('should handle login failure and set error', async () => {
      const mockError = new Error('Invalid credentials');

      networkManager.fetchCurrentUser.mockRejectedValue(mockError);

      try {
        await authService.postAuthLogin('username', 'wrong_password');
      } catch (error) {
        expect(error).toEqual(mockError);
        expect(apiStorage.setItem).not.toHaveBeenCalled();
        expect(authService.user).toBeNull();
        expect(authService.token).toBeNull();
        expect(authService.error).toBe('Invalid credentials');
        expect(authService.isLoading).toBe(false);
      }
    });
  });

  describe('logout', () => {
    it('should clear user data and reset state on logout', async () => {
      authService.user = {id: '123', firstName: 'John'};
      authService.token = 'fake_token_123';
      authService.isLoading = false;
      authService.error = null;

      await authService.logout();

      expect(apiStorage.clear).toHaveBeenCalledTimes(1);
      expect(authService.user).toBeNull();
      expect(authService.token).toBeNull();
      expect(authService.isLoading).toBe(false);
      expect(authService.error).toBeNull();
    });
  });
});

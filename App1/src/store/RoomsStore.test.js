import {networkManager} from '../Utils/NetworkManager';
import {apiStorage} from '../Utils/AsyncStorageManager';
import roomsStore from './fetchRoomsSlice';

jest.mock('../Utils/NetworkManager', () => ({
  networkManager: {
    fetchRooms: jest.fn(),
  },
}));

jest.mock('../Utils/AsyncStorageManager', () => ({
  apiStorage: {
    getItem: jest.fn(),
  },
}));

describe('RoomsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRooms', () => {
    it('should fetch rooms and update state successfully', async () => {
      const mockRooms = [
        {id: '1', name: 'Room 1'},
        {id: '2', name: 'Room 2'},
      ];

      apiStorage.getItem.mockResolvedValue('123'); // Simulate userId in storage
      networkManager.fetchRooms.mockResolvedValue({data: mockRooms}); // Mock API response

      await roomsStore.fetchRooms();

      expect(apiStorage.getItem).toHaveBeenCalledWith('userId');
      expect(networkManager.fetchRooms).toHaveBeenCalledWith({fields: ['*']});
      expect(roomsStore.getState().rooms).toEqual(mockRooms);
      expect(roomsStore.getState().isLoading).toBe(false);
      expect(roomsStore.getState().error).toBeNull();
    });

    it('should handle missing userId and set error state', async () => {
      apiStorage.getItem.mockResolvedValue(null); // Simulate missing userId

      await roomsStore.fetchRooms();

      expect(apiStorage.getItem).toHaveBeenCalledWith('userId');
      expect(roomsStore.getState().error).toBe('No user ID found in storage.');
      expect(roomsStore.getState().isLoading).toBe(false);
    });

    it('should handle API errors and update state', async () => {
      const mockError = {response: {data: 'API Error'}};

      apiStorage.getItem.mockResolvedValue('123'); // Simulate userId in storage
      networkManager.fetchRooms.mockRejectedValue(mockError); // Simulate API error

      await roomsStore.fetchRooms();

      expect(apiStorage.getItem).toHaveBeenCalledWith('userId');
      expect(networkManager.fetchRooms).toHaveBeenCalledWith({fields: ['*']});
      expect(roomsStore.getState().error).toBe('API Error');
      expect(roomsStore.getState().isLoading).toBe(false);
    });

    it('should handle general errors and update state', async () => {
      const mockError = new Error('Network error');

      apiStorage.getItem.mockResolvedValue('123'); // Simulate userId in storage
      networkManager.fetchRooms.mockRejectedValue(mockError); // Simulate general error

      await roomsStore.fetchRooms();

      expect(apiStorage.getItem).toHaveBeenCalledWith('userId');
      expect(networkManager.fetchRooms).toHaveBeenCalledWith({fields: ['*']});
      expect(roomsStore.getState().error).toBe('Failed to fetch rooms.');
      expect(roomsStore.getState().isLoading).toBe(false);
    });
  });

  describe('getState', () => {
    it('should return the current state', () => {
      const state = roomsStore.getState();

      expect(state).toEqual({
        rooms: [],
        isLoading: false,
        error: null,
      });
    });
  });
});

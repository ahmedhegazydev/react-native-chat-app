import chatStore from './chatSlice';
import {networkManager} from '../Utils/NetworkManager';
import getDirectusClient from '../store/getDirectusClient';

jest.mock('../Utils/NetworkManager', () => ({
  networkManager: {
    setMessage: jest.fn(),
  },
}));

jest.mock('../store/getDirectusClient', () => jest.fn());

describe('ChatStore', () => {
  let mockDirectusClient;

  beforeEach(() => {
    mockDirectusClient = {
      items: jest.fn().mockReturnThis(),
      readMany: jest.fn(),
      subscribe: jest.fn(),
    };

    getDirectusClient.mockReturnValue(mockDirectusClient);
    jest.clearAllMocks();
    chatStore.setState({
      rooms: [],
      messages: [],
      loading: false,
      error: null,
    }); // Reset state
  });

  describe('fetchRooms', () => {
    it('should fetch rooms and update state successfully', async () => {
      const mockRooms = [
        {id: '1', name: 'Room 1'},
        {id: '2', name: 'Room 2'},
      ];

      mockDirectusClient.readMany.mockResolvedValue({data: mockRooms});

      await chatStore.fetchRooms();

      expect(mockDirectusClient.items).toHaveBeenCalledWith('room');
      expect(mockDirectusClient.readMany).toHaveBeenCalledWith({
        fields: ['id', 'name', 'last_message.*', 'members.*', 'date_created'],
      });
      expect(chatStore.getState().rooms).toEqual(mockRooms);
      expect(chatStore.getState().loading).toBe(false);
      expect(chatStore.getState().error).toBeNull();
    });

    it('should handle errors during fetchRooms', async () => {
      const mockError = new Error('Failed to fetch rooms');

      mockDirectusClient.readMany.mockRejectedValue(mockError);

      await chatStore.fetchRooms();

      expect(chatStore.getState().error).toBe('Failed to fetch rooms');
      expect(chatStore.getState().loading).toBe(false);
    });
  });

  describe('fetchMessages', () => {
    it('should fetch messages and update state successfully', async () => {
      const mockMessages = [
        {id: '1', content: 'Hello'},
        {id: '2', content: 'Hi'},
      ];

      mockDirectusClient.readMany.mockResolvedValue({data: mockMessages});

      await chatStore.fetchMessages('room-1');

      expect(mockDirectusClient.items).toHaveBeenCalledWith('message');
      expect(mockDirectusClient.readMany).toHaveBeenCalledWith({
        filter: {room: {_eq: 'room-1'}},
        fields: ['id', 'content', 'user_created.*', 'date_created'],
        sort: ['-date_created'],
      });
      expect(chatStore.getState().messages).toEqual(mockMessages);
      expect(chatStore.getState().loading).toBe(false);
      expect(chatStore.getState().error).toBeNull();
    });

    it('should handle errors during fetchMessages', async () => {
      const mockError = new Error('Failed to fetch messages');

      mockDirectusClient.readMany.mockRejectedValue(mockError);

      await chatStore.fetchMessages('room-1');

      expect(chatStore.getState().error).toBe('Failed to fetch messages');
      expect(chatStore.getState().loading).toBe(false);
    });
  });

  describe('sendMessageToRoom', () => {
    it('should send a message successfully', async () => {
      const mockResponse = {id: '123', content: 'New message'};

      networkManager.setMessage.mockResolvedValue(mockResponse);

      const result = await chatStore.sendMessageToRoom('room-1', 'Hello');

      expect(networkManager.setMessage).toHaveBeenCalledWith('room-1', 'Hello');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors during sendMessageToRoom', async () => {
      const mockError = new Error('Failed to send message');

      networkManager.setMessage.mockRejectedValue(mockError);

      await chatStore.sendMessageToRoom('room-1', 'Hello');

      expect(chatStore.getState().error).toBe('Failed to send message');
    });
  });

  describe('subscribeToMessages', () => {
    // it('should subscribe to new messages and update state', async () => {
    //   const mockSubscription = {
    //     data: [
    //       {id: '1', content: 'New message 1'},
    //       {id: '2', content: 'New message 2'},
    //     ],
    //   };

    //   const mockAsyncIterator = (async function* () {
    //     yield mockSubscription;
    //   })();

    //   mockDirectusClient.subscribe.mockResolvedValue({
    //     subscription: mockAsyncIterator,
    //   });

    //   await chatStore.subscribeToMessages('room-1');

    //   expect(mockDirectusClient.subscribe).toHaveBeenCalledWith('message', {
    //     event: 'create',
    //     query: {
    //       filter: {room: {_eq: 'room-1'}},
    //       fields: ['id', 'content', 'user_created.*', 'date_created'],
    //     },
    //   });
    //   expect(chatStore.getState().messages).toEqual(mockSubscription.data);
    // });

    it('should handle errors during subscribeToMessages', async () => {
      const mockError = new Error('Subscription failed');

      mockDirectusClient.subscribe.mockRejectedValue(mockError);

      await chatStore.subscribeToMessages('room-1');

      expect(chatStore.getState().error).toBe('Subscription failed');
    });
  });
});

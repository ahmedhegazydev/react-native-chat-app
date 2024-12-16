import roomMessagesStore from './fetchRoomMessagesSlice';
import {wosolApi} from '../api/ChatApi';

jest.mock('../api/ChatApi', () => ({
  wosolApi: {
    get: jest.fn(),
  },
}));

describe('RoomMessagesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    roomMessagesStore.setState({
      messages: [],
      loading: false,
      error: null,
      hasMore: true,
    });
  });

  describe('fetchMessagesForRoom', () => {
    it('should fetch messages and update state successfully', async () => {
      const mockMessages = [
        {id: '1', content: 'Hello'},
        {id: '2', content: 'Hi'},
      ];

      wosolApi.get.mockResolvedValue({
        data: {
          data: mockMessages,
        },
      });

      await roomMessagesStore.fetchMessagesForRoom({roomId: 'room-1', page: 1});

      expect(wosolApi.get).toHaveBeenCalledWith('items/message', {
        params: {
          filter: {room: {_eq: 'room-1'}},
          sort: ['-date_created'],
          limit: 10,
          offset: 0,
          fields: ['id', 'content', 'user_created.*', 'date_created'],
        },
      });

      expect(roomMessagesStore.getState().messages).toEqual(mockMessages);
      expect(roomMessagesStore.getState().loading).toBe(false);
      expect(roomMessagesStore.getState().error).toBeNull();
    });

    it('should set hasMore to false when fewer messages are returned', async () => {
      const mockMessages = [{id: '1', content: 'Hello'}];

      wosolApi.get.mockResolvedValue({
        data: {
          data: mockMessages,
        },
      });

      await roomMessagesStore.fetchMessagesForRoom({roomId: 'room-1', page: 2});

      expect(roomMessagesStore.getState().messages).toEqual(mockMessages);
      expect(roomMessagesStore.getState().hasMore).toBe(false);
      expect(roomMessagesStore.getState().loading).toBe(false);
    });

    it('should handle errors and update state accordingly', async () => {
      const mockError = new Error('Failed to fetch messages');

      wosolApi.get.mockRejectedValue(mockError);

      await roomMessagesStore.fetchMessagesForRoom({roomId: 'room-1', page: 1});

      expect(roomMessagesStore.getState().error).toBe(
        'Failed to fetch messages',
      );
      expect(roomMessagesStore.getState().loading).toBe(false);
      expect(roomMessagesStore.getState().messages).toEqual([]);
    });
  });

  describe('appendMessage', () => {
    it('should append a new message if it is not a duplicate', () => {
      const initialMessages = [{id: '1', content: 'Hello'}];
      const newMessage = {id: '2', content: 'Hi'};

      roomMessagesStore.setState({messages: initialMessages});

      roomMessagesStore.appendMessage(newMessage);

      expect(roomMessagesStore.getState().messages).toEqual([
        newMessage,
        ...initialMessages,
      ]);
    });

    it('should not append a duplicate message', () => {
      const initialMessages = [{id: '1', content: 'Hello'}];
      const duplicateMessage = {id: '1', content: 'Hello'};

      roomMessagesStore.setState({messages: initialMessages});

      roomMessagesStore.appendMessage(duplicateMessage);

      expect(roomMessagesStore.getState().messages).toEqual(initialMessages);
    });
  });

  describe('getState', () => {
    it('should return the current state', () => {
      const currentState = roomMessagesStore.getState();

      expect(currentState).toEqual({
        messages: [],
        loading: false,
        error: null,
        hasMore: true,
      });
    });
  });
});

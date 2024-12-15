import {create} from 'zustand';
import {wosolApi} from '../api/ChatApi';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  user_created: User;
  date_created: string;
}

interface RoomMessagesStore {
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;

  fetchMessagesForRoom: ({
    roomId,
    page,
  }: {
    roomId: string;
    page?: number;
  }) => Promise<void>;
  appendMessage: (newMessage: Message) => void;
}

const useRoomMessagesStore = create<RoomMessagesStore>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  hasMore: true,

  fetchMessagesForRoom: async ({roomId, page = 1}) => {
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      set({loading: true, error: null});

      const response = await wosolApi.get('items/message', {
        params: {
          filter: {room: {_eq: roomId}},
          sort: ['-date_created'],
          limit,
          offset,
          fields: ['id', 'content', 'user_created.*', 'date_created'],
        },
      });

      const newMessages: Message[] = response.data.data;
      const hasMore = newMessages.length === limit;

      set(state => ({
        messages: [...state.messages, ...newMessages],
        hasMore,
        loading: false,
      }));
    } catch (error: any) {
      set({error: error.message, loading: false});
    }
  },

  appendMessage: (newMessage: Message) => {
    set(state => {
      const isDuplicate = state.messages.some(msg => msg.id === newMessage.id);
      return isDuplicate ? {} : {messages: [newMessage, ...state.messages]};
    });
  },
}));

export default useRoomMessagesStore;

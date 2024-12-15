import {create} from 'zustand';
import {createDirectus, rest, realtime, staticToken} from '@directus/sdk';
import {networkManager} from '../Utils/NetworkManager';

interface Message {
  id: string;
  content: string;
  user_created: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
  date_created: string;
}

interface Room {
  id: string;
  name: string;
  last_message: {
    content: string;
  };
  members: {
    id: string;
  }[];
  date_created: string;
}

interface ChatStore {
  rooms: Room[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  appendedMessageIds: Set<string>;

  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessageToRoom: (roomId: string, messageContent: string) => Promise<any>;
  subscribeToMessages: (roomId: string) => Promise<void>;
}

const AUTH_TOKENS = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};
const WEBSOCKET_URL = 'wss://cms.tetaman.app/websocket';
const currentUser = 'user1';

let directusClient: any = null;

function getDirectusClient() {
  if (!directusClient) {
    directusClient = createDirectus(WEBSOCKET_URL)
      .with(rest())
      .with(realtime())
      .with(staticToken(AUTH_TOKENS[currentUser]));
  }
  return directusClient;
}

const useChatStore = create<ChatStore>((set, get) => ({
  rooms: [],
  messages: [],
  loading: false,
  error: null,
  appendedMessageIds: new Set(),

  fetchRooms: async () => {
    const client = getDirectusClient();
    try {
      set({loading: true});
      const response = await client.items('room').readMany({
        fields: [
          'id',
          'name',
          'last_message.content',
          'members.id',
          'date_created',
        ],
      });
      set({rooms: response.data, loading: false});
    } catch (error: any) {
      set({error: error.message, loading: false});
    }
  },

  fetchMessages: async (roomId: string) => {
    const client = getDirectusClient();
    try {
      set({loading: true});
      const response = await client.items('message').readMany({
        filter: {room: {_eq: roomId}},
        fields: ['id', 'content', 'user_created.*', 'date_created'],
        sort: ['-date_created'],
      });
      set({messages: response.data, loading: false});
    } catch (error: any) {
      set({error: error.message, loading: false});
    }
  },

  sendMessageToRoom: async (roomId: string, messageContent: string) => {
    try {
      const result = await networkManager.setMessage(roomId, messageContent);
      return result;
    } catch (error: any) {
      set({error: error.message});
    }
  },

  subscribeToMessages: async (roomId: string) => {
    const client = getDirectusClient();
    const {appendedMessageIds} = get();

    try {
      const {subscription} = await client.subscribe('message', {
        event: 'create',
        query: {
          filter: {room: {_eq: roomId}},
          fields: ['id', 'content', 'user_created.*', 'date_created'],
        },
      });

      for await (const message of subscription) {
        if (message?.data && Array.isArray(message.data)) {
          message.data.forEach((msg: Message) => {
            if (!appendedMessageIds.has(msg.id)) {
              appendedMessageIds.add(msg.id);
              set(state => ({messages: [...state.messages, msg]}));
            }
          });
        }
      }
    } catch (error: any) {
      set({error: error.message});
    }
  },
}));

export default useChatStore;

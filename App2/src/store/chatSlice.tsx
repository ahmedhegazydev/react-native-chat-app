import {create} from 'zustand';
import {createDirectus, graphql, realtime, staticToken} from '@directus/sdk';
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
      .with(graphql())
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

      const query = `
        query {
          rooms {
            id
            name
            last_message {
              content
            }
            members {
              id
            }
            date_created
          }
        }
      `;

      const response = await client.query(query);
      set({rooms: response.data.rooms, loading: false});
    } catch (error: any) {
      set({error: error.message, loading: false});
    }
  },

  fetchMessages: async (roomId: string) => {
    const client = getDirectusClient();
    try {
      set({loading: true});

      const query = `
        query($roomId: String!) {
          messages(filter: { room: { _eq: $roomId } }) {
            id
            content
            user_created {
              id
              first_name
              last_name
              email
              avatar
            }
            date_created
          }
        }
      `;

      const variables = {roomId};

      const response = await client.query(query, variables);
      set({messages: response.data.messages, loading: false});
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
      const query = `
        subscription($roomId: String!) {
          message(event: "create", filter: { room: { _eq: $roomId } }) {
            id
            content
            user_created {
              id
              first_name
              last_name
              email
              avatar
            }
            date_created
          }
        }
      `;

      const variables = {roomId};

      const {subscription} = await client.subscribe(query, variables);

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

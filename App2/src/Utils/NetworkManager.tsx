import {wosolApi} from '../api/ChatApi';

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

interface Message {
  id: string;
  content: string;
  room: string;
  date_created: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
}

class NetworkManager {
  constructor() {}

  async fetchRooms(params: Record<string, any> = {}): Promise<Room[]> {
    try {
      const response = await wosolApi.get('items/room', {params});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setMessage(roomId: string, messageContent: string): Promise<Message> {
    try {
      const response = await wosolApi.post('items/message', {
        room: roomId,
        content: messageContent,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async fetchCurrentUser(params: Record<string, any> = {}): Promise<User> {
    try {
      const response = await wosolApi.get('users/me', {params});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const networkManager = new NetworkManager();

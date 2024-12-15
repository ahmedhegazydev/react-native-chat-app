import { wosolApi } from '../api/ChatApi';

// Define types for the network responses
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

// NetworkManager class with type-safe methods
class NetworkManager {
  constructor() {}

  // Fetch rooms with optional params, returns a promise of an array of Room objects
  async fetchRooms(params: Record<string, any> = {}): Promise<Room[]> {
    try {
      const response = await wosolApi.get('items/room', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Send a message to a room, returns the response data as Message
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

  // Fetch current user data, returns a Promise with User object
  async fetchCurrentUser(params: Record<string, any> = {}): Promise<User> {
    try {
      const response = await wosolApi.get('users/me', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Instantiate the network manager
export const networkManager = new NetworkManager();

import {wosolApi} from '../api/ChatApi';

class NetworkManager {
  constructor() {}

  async fetchRooms(params = {}) {
    try {
      const response = await wosolApi.get('items/room', {params});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setMessage(roomId, messageContent) {
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

  async fetchCurrentUser(params = {}) {
    try {
      const response = await wosolApi.get('users/me', {params});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const networkManager = new NetworkManager();

import {networkManager} from '../Utils/NetworkManager';
import {apiStorage} from '../Utils/AsyncStorageManager';

class RoomsStore {
  constructor() {
    this.state = {
      rooms: [],
      isLoading: false,
      error: null,
    };
  }

  setState(newState) {
    this.state = {...this.state, ...newState};
  }

  async fetchRooms() {
    try {
      const currentUserId = await apiStorage.getItem('userId');
      if (!currentUserId) throw new Error('No user ID found in storage.');

      const params = {fields: ['*']};

      this.setState({isLoading: true, error: null});

      const response = await networkManager.fetchRooms(params);

      this.setState({rooms: response.data || [], isLoading: false});
    } catch (error) {
      const errorMessage =
        error.message === 'No user ID found in storage.'
          ? error.message
          : error.response?.data || 'Failed to fetch rooms.';

      this.setState({error: errorMessage, isLoading: false});
    }
  }

  getState() {
    return this.state;
  }
}

const roomsStore = new RoomsStore();
export default roomsStore;

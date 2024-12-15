import {create} from 'zustand';
import {networkManager} from '../Utils/NetworkManager';
import {apiStorage} from '../Utils/AsyncStorageManager';

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

interface RoomsStore {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;

  fetchRooms: () => Promise<void>;
}

const useRoomsStore = create<RoomsStore>(set => ({
  rooms: [],
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    try {
      const currentUserId = await apiStorage.getItem('userId');
      if (!currentUserId) throw new Error('No user ID found in storage.');

      const params = {
        fields: ['*'],
      };

      set({isLoading: true, error: null});

      const response = await networkManager.fetchRooms(params);

      set({rooms: response.data || [], isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data || 'Failed to fetch rooms.',
        isLoading: false,
      });
    }
  },
}));

export default useRoomsStore;

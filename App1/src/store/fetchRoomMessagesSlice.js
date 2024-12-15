import {wosolApi} from '../api/ChatApi';

class RoomMessagesStore {
  constructor() {
    this.state = {
      messages: [],
      loading: false,
      error: null,
      hasMore: true,
    };
    this.listeners = [];
  }

  setState(newState) {
    this.state = {...this.state, ...newState};
    this.notifyListeners();
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(newState) {
    if (!this.state) {
      return;
    }

    this.state =
      typeof newState === 'function'
        ? newState(this.state)
        : {...this.state, ...newState};
  }

  async fetchMessagesForRoom({roomId, page = 1}) {
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      this.setState({loading: true, error: null});

      const response = await wosolApi.get('items/message', {
        params: {
          filter: {room: {_eq: roomId}},
          sort: ['-date_created'],
          limit,
          offset,
          fields: ['id', 'content', 'user_created.*', 'date_created'],
        },
      });

      const newMessages = response.data?.data || [];

      if (!newMessages || newMessages.length === 0) {
        this.setState({loading: false});
        return;
      }

      const hasMore = newMessages.length === limit;

      this.setState(state => {
        const updatedState = {
          messages: [...state.messages, ...newMessages],
          hasMore,
          loading: false,
        };
        return updatedState;
      });
    } catch (error) {
      this.setState({error: error.message, loading: false});
    }
  }

  appendMessage(newMessage) {
    this.setState(state => {
      const isDuplicate = state.messages.some(msg => msg.id === newMessage.id);
      if (isDuplicate) {
        return {};
      } else {
        return {messages: [newMessage, ...state.messages]};
      }
    });
  }

  getState() {
    return this.state;
  }
}

const roomMessagesStore = new RoomMessagesStore();
export default roomMessagesStore;

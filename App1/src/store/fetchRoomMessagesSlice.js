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
    if (!this.state) return;
    this.state =
      typeof newState === 'function'
        ? newState(this.state)
        : {...this.state, ...newState};
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

  fetchMessagesForRoom = async ({roomId, page}) => {
    try {
      this.setState({loading: true, error: null});

      const response = await wosolApi.get('items/message', {
        params: {
          filter: {room: {_eq: roomId}},
          sort: ['-date_created'],
          limit: 10,
          offset: (page - 1) * 10,
          fields: ['id', 'content', 'user_created.*', 'date_created'],
        },
      });

      const messages = response.data.data;

      this.setState({
        messages:
          page === 1 ? messages : [...this.getState().messages, ...messages],
        loading: false,
        hasMore: messages.length === 10,
      });
    } catch (error) {
      this.setState({
        error: error.message || 'Failed to fetch messages',
        loading: false,
        messages: [],
      });
    }
  };

  appendMessage = newMessage => {
    const {messages} = this.getState();
    if (!messages.some(msg => msg.id === newMessage.id)) {
      this.setState({messages: [newMessage, ...messages]});
    }
  };

  getState() {
    return this.state;
  }
}

const roomMessagesStore = new RoomMessagesStore();
export default roomMessagesStore;

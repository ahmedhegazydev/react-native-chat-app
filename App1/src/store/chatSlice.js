import {networkManager} from '../Utils/NetworkManager';
import getDirectusClient from './getDirectusClient';

class ChatStore {
  constructor() {
    this.state = {
      rooms: [],
      messages: [],
      loading: false,
      error: null,
      appendedMessageIds: new Set(),
    };
  }

  setState(newState) {
    this.state = {...this.state, ...newState};
  }

  async fetchRooms() {
    const client = getDirectusClient();
    try {
      this.setState({loading: true});
      const response = await client.items('room').readMany({
        fields: ['id', 'name', 'last_message.*', 'members.*', 'date_created'],
      });
      this.setState({rooms: response.data, loading: false});
    } catch (error) {
      this.setState({error: error.message, loading: false});
    }
  }

  async fetchMessages(roomId) {
    const client = getDirectusClient();
    try {
      this.setState({loading: true});
      const response = await client.items('message').readMany({
        filter: {room: {_eq: roomId}},
        fields: ['id', 'content', 'user_created.*', 'date_created'],
        sort: ['-date_created'],
      });
      this.setState({messages: response.data, loading: false});
    } catch (error) {
      console.error(error.message);
      this.setState({error: error.message, loading: false});
    }
  }

  async sendMessageToRoom(roomId, messageContent) {
    try {
      const result = await networkManager.setMessage(roomId, messageContent);
      return result;
    } catch (error) {
      this.setState({error: error.message});
    }
  }

  async subscribeToMessages(roomId) {
    const client = getDirectusClient();
    const {appendedMessageIds} = this.state;

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
          message.data.forEach(msg => {
            if (!appendedMessageIds.has(msg.id)) {
              appendedMessageIds.add(msg.id);
              this.setState(state => ({
                messages: [...state.messages, msg],
              }));
            }
          });
        }
      }
    } catch (error) {
      this.setState({error: error.message});
    }
  }

  getState() {
    return this.state;
  }
}

const chatStore = new ChatStore();
export default chatStore;

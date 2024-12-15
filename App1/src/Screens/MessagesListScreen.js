import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  FlatList,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useTheme} from '@react-navigation/native';
import Header from '../Utils/Views/Header';
import LabeledTextInput from '../Utils/Views/LabeledTextInput';
import {light} from '../styles/colors';
import CustomButton from '../Utils/Views/CustomButton';
import chatStore from '../store/chatSlice';
import roomMessagesStore from '../store/fetchRoomMessagesSlice';

const AUTH_TOKENS = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};

let currentUser = 'user2';

const withTheme = WrappedComponent => props => {
  const theme = useTheme();
  return <WrappedComponent {...props} theme={theme} />;
};

class MessagesListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
      page: 1,
      loadingMore: false,
      messages: [],
    };
    this.flatListRef = React.createRef();
    this.chatStore = chatStore;
    this.roomMessagesStore = roomMessagesStore;
  }

  componentDidMount() {
    const {room} = this.props.route.params;
    if (room?.id) {
      this.fetchMessagesForRoom(room.id);
      this.subscribeToMessages(room.id);
    }
  }

  subscribeToStore = () => {
    this.unsubscribe = roomMessagesStore.subscribe(() => {
      const {messages} = roomMessagesStore.getState();
      this.setState({messages});
    });
  };

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.messages?.length > 0 &&
      prevProps.messages?.length !== this.props.messages?.length
    ) {
      this.flatListRef.current?.scrollToIndex({index: 0, animated: true});
    }
  }

  fetchMessagesForRoom = async roomId => {
    try {
      await this.roomMessagesStore.fetchMessagesForRoom({roomId, page: 1});
      const {messages = [], error} = this.roomMessagesStore.getState();
      if (error) {
        Alert.alert('Error', error);
      } else {
        this.setState(prevState => ({
          messages: [...prevState.messages, ...messages],
        }));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  loadMoreMessages = async () => {
    const {room} = this.props.route.params;
    const {hasMore, loading} = this.roomMessagesStore.getState();
    const {page} = this.state;

    if (!hasMore || loading) {
      return;
    }

    this.setState({loadingMore: true});
    try {
      await this.roomMessagesStore.fetchMessagesForRoom({
        roomId: room.id,
        page: page + 1,
      });
      this.setState(prevState => ({
        page: prevState.page + 1,
        messages: [
          ...prevState.messages,
          ...this.roomMessagesStore.getState().messages,
        ],
      }));
    } catch (error) {
    } finally {
      this.setState({loadingMore: false});
    }
  };

  handleSendMessage = async () => {
    if (!this.state.newMessage.trim()) {
      Alert.alert('Validation', 'Message cannot be empty.');
      return;
    }

    const {room} = this.props.route.params;
    const messageContent = this.state.newMessage;
    try {
      await this.chatStore.sendMessageToRoom(room.id, messageContent);
      this.setState({newMessage: ''});
    } catch (error) {
      Alert.alert('Error', 'Failed to send the message. Please try again.');
    }
  };

  subscribeToMessages = roomId => {
    this.chatStore.subscribeToMessages(roomId);
  };

  renderMessage = ({item}) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageSender}>
        Sent by: {item.user_created?.first_name || 'Unknown'}
      </Text>
    </View>
  );

  render() {
    const {room} = this.props.route.params;
    const {newMessage, loadingMore} = this.state;

    const {messages, loading, error} = this.roomMessagesStore.getState();

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background_images/ig_background.png')}
          resizeMode="cover"
          style={styles.background}>
          <Header
            navigation={this.props.navigation}
            headerName={room?.name || 'Messages'}
            colors={this.props.theme}
          />
          <View style={styles.content}>
            {loading && this.state.page === 1 && (
              <Text>Loading messages...</Text>
            )}
            {error && <Text>Error: {error}</Text>}
            <FlatList
              ref={this.flatListRef}
              data={this.state.messages || []}
              keyExtractor={item => item?.id?.toString()}
              renderItem={this.renderMessage}
              inverted={true}
              onEndReached={this.loadMoreMessages}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                this.state.loadingMore && (
                  <View style={styles.footer}>
                    <ActivityIndicator size="small" color="#666" />
                    <Text style={styles.footerText}>
                      Loading more messages...
                    </Text>
                  </View>
                )
              }
            />

            <View style={styles.inputContainer}>
              <LabeledTextInput
                containerStyle={styles.inputField}
                value={newMessage}
                onChangeText={text => this.setState({newMessage: text})}
                placeholder="Type a message"
                borderColor="#303056"
                inputStyle={styles.inputStyle}
              />
              <CustomButton
                style={[
                  {
                    backgroundColor: light.primary,
                  },
                ]}
                title="Send"
                onPress={this.handleSendMessage}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: ms(16),
    paddingBottom: ms(10),
  },
  messageItem: {
    marginBottom: ms(12),
    padding: ms(16),
    backgroundColor: '#fff',
    borderRadius: ms(8),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 3,
  },
  messageContent: {
    fontSize: ms(16),
    color: '#333',
  },
  messageSender: {
    fontSize: ms(14),
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(10),
    paddingVertical: ms(10),
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  inputField: {
    flex: 1,
    marginVertical: ms(5),
    marginRight: ms(10),
    borderColor: light.neutral2,
  },
  inputStyle: {
    marginTop: ms(5),
  },
  header: {
    paddingVertical: ms(10),
    alignItems: 'center',
  },
  headerText: {
    marginTop: ms(5),
    fontSize: ms(14),
    color: '#666',
  },
};

export default withTheme(MessagesListScreen);

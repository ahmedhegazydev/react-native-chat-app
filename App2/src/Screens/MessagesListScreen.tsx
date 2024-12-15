import React, {useEffect, useState, useRef} from 'react';
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
import useChatStore from '../store/chatSlice';
import LabeledTextInput from '../Utils/Views/LabeledTextInput';
import {light} from '../styles/colors';
import CustomButton from '../Utils/Views/CustomButton';
import useRoomMessagesStore, {
  appendMessage,
} from '../store/fetchRoomMessagesSlice';

const AUTH_TOKENS = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};

let currentUser = 'user1';

interface Message {
  id: number;
  content: string;
  user_created: {first_name: string | null};
  date_created: string;
}

interface Room {
  id: string;
  name: string;
}

interface MessagesListScreenProps {
  navigation: any;
  route: {params: Room};
  theme: any;
}

const MessagesListScreen: React.FC<MessagesListScreenProps> = props => {
  const color = props.theme;
  const room = props.route.params;
  const [newMessage, setNewMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const {subscribeToMessages, sendMessageToRoom} = useChatStore();
  const {messages, loading, hasMore, error, fetchMessagesForRoom} =
    useRoomMessagesStore();

  useEffect(() => {
    if (room?.id) {
      fetchMessagesForRoom({roomId: room.id, page});
      subscribeToMessages(room?.id);
    }
  }, [room?.id]);

  useEffect(() => {
    if (messages?.length > 0) {
      flatListRef.current?.scrollToIndex({index: 0, animated: true});
    }
  }, [messages]);

  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchMessagesForRoom({roomId: room.id, page: page + 1});
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Validation', 'Message cannot be empty.');
      return;
    }

    const simulatedMessage = {
      id: Date.now(),
      content: newMessage,
      user_created: {id: AUTH_TOKENS[currentUser], name: 'You'},
      date_created: new Date().toISOString(),
    };

    try {
      console.log('Sending message to room:', {
        roomId: room.id,
        messageContent: newMessage,
      });

      await sendMessageToRoom({roomId: room.id, messageContent: newMessage});

      console.log('Message sent successfully:', {
        roomId: room.id,
        messageContent: newMessage,
      });

      // appendMessage(simulatedMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send the message. Please try again.');
    }
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageSender}>
        Sent by: {item.user_created?.first_name || 'Unknown'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background_images/ig_background.png')}
        resizeMode="cover"
        style={styles.background}>
        <Header
          navigation={props.navigation}
          headerName={room?.name || 'Messages'}
          colors={color}
        />
        <View style={styles.content}>
          {loading && page === 1 && <Text>Loading messages...</Text>}
          {error && <Text>Error: {error}</Text>}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item?.id?.toString() || ''}
            renderItem={renderMessage}
            inverted={true}
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              loadingMore && (
                <View style={styles.header}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.headerText}>Loading more...</Text>
                </View>
              )
            }
          />
          <View style={styles.inputContainer}>
            <LabeledTextInput
              containerStyle={styles.inputField}
              value={newMessage}
              onChangeText={setNewMessage}
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
              onPress={handleSendMessage}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

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

export default function (props: any) {
  const theme = useTheme();
  return <MessagesListScreen {...props} theme={theme.colors} />;
}

import React, {useEffect} from 'react';
import {
  View,
  ImageBackground,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Header from '../Utils/Views/Header';
import useRoomsStore from '../store/fetchRoomsSlice';
import {FlashList} from '@shopify/flash-list';
import {ScaledSheet} from 'react-native-size-matters';

interface Room {
  id: string;
  name: string;
  date_created: string;
  members: string[];
  last_message: string | null;
}

interface RoomListScreenProps {
  navigation: any;
  theme: any;
}

const RoomListScreen: React.FC<RoomListScreenProps> = props => {
  const color = props.theme;
  const {rooms, loading, error, fetchRooms} = useRoomsStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const renderRoomItem = ({item}: {item: Room}) => {
    const members = item.members
      ? item.members.map(member => `User-${member}`).join(', ')
      : 'No members';
    const lastMessage = item.last_message || 'No messages yet';
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(item.date_created));

    return (
      <TouchableOpacity
        style={styles.roomItem}
        onPress={() => props.navigation.navigate('MessagesListScreen', item)}>
        <Text style={styles.roomTitle}>Name: {item.name}</Text>
        <Text style={styles.roomDescription}>ID: {item.id}</Text>
        <Text style={styles.roomDescription}>Created: {formattedDate}</Text>
        <Text style={styles.roomDescription}>Members: {members}</Text>
        <Text style={styles.roomDescription}>Last Message: {lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background_images/ig_background.png')}
        resizeMode="cover"
        style={styles.background}>
        <Header navigation={props.navigation} colors={color} />
        <View style={styles.content}>
          {loading && <ActivityIndicator size="large" />}
          {!loading && rooms?.length === 0 && (
            <Text style={styles.noRoomsText}>No rooms available.</Text>
          )}
          {!loading && rooms?.length > 0 && (
            <View style={styles.flashListWrapper}>
              <FlashList
                data={rooms}
                keyExtractor={item => item.id.toString()}
                renderItem={renderRoomItem}
                contentContainerStyle={styles.flashListContent}
                estimatedItemSize={100}
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = ScaledSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16@s',
  },
  roomItem: {
    width: '100%',
    padding: '16@s',
    marginVertical: '8@vs',
    backgroundColor: '#fff',
    borderRadius: '8@s',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: '4@s',
    elevation: 3,
  },
  roomTitle: {
    fontSize: '18@s',
    fontWeight: 'bold',
    color: '#333',
  },
  roomDescription: {
    fontSize: '14@s',
    color: '#666',
  },
  errorText: {
    fontSize: '16@s',
    color: 'red',
    textAlign: 'center',
  },
  noRoomsText: {
    fontSize: '16@s',
    color: '#333',
    textAlign: 'center',
  },
  flashListWrapper: {
    flex: 1,
    width: '100%',
  },
  flashListContent: {
    paddingBottom: '16@vs',
  },
});

class ErrorBoundary extends React.Component {
  state = {hasError: false, errorMessage: ''};

  static getDerivedStateFromError(error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught in boundary:', error, errorInfo);
    this.setState({errorMessage: error.message});
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={{color: 'red'}}>
            Something went wrong: {this.state.errorMessage}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function (props: any) {
  const theme = useTheme();
  return (
    <ErrorBoundary>
      <RoomListScreen {...props} theme={theme.colors} />
    </ErrorBoundary>
  );
}

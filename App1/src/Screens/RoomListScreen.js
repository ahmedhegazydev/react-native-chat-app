import React, {Component} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Header from '../Utils/Views/Header';
import roomsStore from '../store/fetchRoomsSlice';
import {FlashList} from '@shopify/flash-list';

const withTheme = WrappedComponent => props => {
  const theme = useTheme();
  return <WrappedComponent {...props} theme={theme} />;
};

class RoomListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      loading: false,
      error: null,
    };
    this.roomsStore = roomsStore;
  }

  componentDidMount() {
    this.fetchRooms();
  }

  fetchRooms = async () => {
    this.setState({loading: true, error: null});
    try {
      await this.roomsStore.fetchRooms();
      const {rooms, error} = this.roomsStore.getState();
      if (error) {
        this.setState({error, loading: false});
      } else {
        this.setState({rooms, loading: false});
      }
    } catch (error) {
      this.setState({error: error.message, loading: false});
    }
  };

  renderRoomItem = ({item}) => {
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
        onPress={() =>
          this.props.navigation.navigate('MessagesListScreen', {room: item})
        }>
        <Text style={styles.roomTitle}>Name: {item.name}</Text>
        <Text style={styles.roomDescription}>ID: {item.id}</Text>
        <Text style={styles.roomDescription}>Created: {formattedDate}</Text>
        <Text style={styles.roomDescription}>Members: {members}</Text>
        <Text style={styles.roomDescription}>Last Message: {lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {theme} = this.props;
    const {rooms, loading, error} = this.state;

    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} colors={theme} />
        <View style={styles.content}>
          {loading && <ActivityIndicator size="large" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading && rooms && rooms.length === 0 && (
            <Text style={styles.noRoomsText}>No rooms available.</Text>
          )}
          {!loading && rooms && rooms.length > 0 && (
            <View style={styles.flashListContainer}>
              <FlashList
                data={rooms}
                keyExtractor={item => item?.id?.toString()}
                renderItem={this.renderRoomItem}
                estimatedItemSize={156}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  roomItem: {
    width: '100%',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  roomDescription: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noRoomsText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  flashListContainer: {
    width: '100%',
    height: '80%',
    marginTop: 16,
  },
};

export default withTheme(RoomListScreen);

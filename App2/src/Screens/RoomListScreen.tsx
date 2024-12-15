import React, { useEffect } from 'react';
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { ScreenName } from '../Constants/Constants';
import Header from '../Utils/Views/Header';
import useRoomsStore from '../store/fetchRoomsSlice';

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

const RoomListScreen: React.FC<RoomListScreenProps> = (props) => {
  const color = props.theme;
  const { rooms, loading, error, fetchRooms } = useRoomsStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const renderRoomItem = ({ item }: { item: Room }) => {
    const members = item.members
      ? item.members.map((member) => `User-${member}`).join(', ')
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
        onPress={() => props.navigation.navigate('MessagesListScreen', item)}
      >
        <Text style={styles.roomTitle}>Name: {item.name}</Text>
        <Text style={styles.roomDescription}>ID: {item.id}</Text>
        <Text style={styles.roomDescription}>Created: {formattedDate}</Text>
        <Text style={styles.roomDescription}>Members: {members}</Text>
        <Text style={styles.roomDescription}>Last Message: {lastMessage}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background_images/ig_background.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <Header navigation={props.navigation} colors={color} />
        <View style={styles.content}>
          {loading && <ActivityIndicator size="large" />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading && rooms?.length === 0 && (
            <Text style={styles.noRoomsText}>No rooms available.</Text>
          )}
          {!loading && rooms?.length > 0 && (
            <FlatList
              data={rooms}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRoomItem}
              contentContainerStyle={styles.flatListContent}
            />
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
  flatListContent: {
    paddingBottom: '16@vs',
  },
});

export default function (props: any) {
  const theme = useTheme();
  return <RoomListScreen {...props} theme={theme.colors} />;
}

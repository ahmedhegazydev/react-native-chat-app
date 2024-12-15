import React, {Component} from 'react';
import {View, Text, StatusBar, Platform, StyleSheet} from 'react-native';
import {ms} from 'react-native-size-matters';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {light} from '../styles/colors';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null,
      isAppUpdateNeeded: null,
    };
  }

  async componentDidMount() {
    // Set the status bar properties
    StatusBar.setBackgroundColor(light.primary);
    StatusBar.setBarStyle(
      Platform.OS === 'android' ? 'light-content' : 'dark-content',
    );

    try {
      const [isAppUpdateNeeded, isLoggedIn] = await Promise.all([
        apiStorage.getItem('appNeedUpdate'),
        apiStorage.getItem('auth'),
      ]);

      // Update state with the fetched values
      this.setState({
        isAppUpdateNeeded,
        isLoggedIn,
      });

      // Navigate after a delay based on the fetched values
      setTimeout(() => {
        const {isLoggedIn, isAppUpdateNeeded} = this.state;
        if (isLoggedIn === 'logedin' && isAppUpdateNeeded === 'false') {
          this.props.navigation.replace('Tab');
        } else {
          this.props.navigation.replace('Login');
        }
      }, 3000);
    } catch (error) {
      console.error('Error in componentDidMount:', error);
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.background}>
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Chat - App 1</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignContent: 'space-between',
    paddingVertical: ms(30),
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default SplashScreen;

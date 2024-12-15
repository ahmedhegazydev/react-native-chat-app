import React, {useEffect} from 'react';
import {View, Text, StatusBar, Platform} from 'react-native';
import {ms} from 'react-native-size-matters';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {light} from '../styles/colors';
import {StyleSheet} from 'react-native';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = props => {
  useEffect(() => {
    const show = async () => {
      try {
        const [isAppUpdateNeeded, isLoggedIn] = await Promise.all([
          apiStorage.getItem('appNeedUpdate'),
          apiStorage.getItem('auth'),
        ]);

        const timer = setTimeout(() => {
          if (isLoggedIn === 'logedin' && isAppUpdateNeeded === 'false') {
            props.navigation.replace('Tab');
          } else {
            props.navigation.replace('Login');
          }
        }, 3000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error in show function:', error);
      }
    };

    show();
  }, [props.navigation]);

  useEffect(() => {
    StatusBar.setBackgroundColor(light.primary);
    StatusBar.setBarStyle(
      Platform.OS === 'android' ? 'light-content' : 'dark-content',
    );
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Chat - App 2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
        <View style={styles.root}>
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
  return (
    <ErrorBoundary>
      <SplashScreen {...props} />
    </ErrorBoundary>
  );
}

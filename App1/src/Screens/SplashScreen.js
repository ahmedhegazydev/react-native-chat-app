import React, {Component} from 'react';
import {View, Text, StatusBar, Platform} from 'react-native';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {light} from '../styles/colors';
import ErrorBoundary from 'react-native-error-boundary';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    console.log(this.props); // Check if navigation is passed

    StatusBar.setBackgroundColor(light.primary);
    StatusBar.setBarStyle(
      Platform.OS === 'android' ? 'light-content' : 'dark-content',
    );

    try {
      this.setState({});

      setTimeout(() => {
        if (this.props.navigation) {
          this.props.navigation.replace('Login');
        } else {
          console.error('Navigation prop is undefined');
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

const styles = {
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
    paddingVertical: 30,
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
};

const ErrorScreenWithBoundary = ({error, resetErrorBoundary}) => (
  <View>
    <Text>Something went wrong.</Text>
    <Text onPress={resetErrorBoundary}>Try again</Text>
  </View>
);

export default ({...props}) => (
  <ErrorBoundary FallbackComponent={ErrorScreenWithBoundary}>
    <SplashScreen {...props} />
  </ErrorBoundary>
);

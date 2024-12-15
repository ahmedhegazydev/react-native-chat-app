import React, {Component} from 'react';
import {View, ImageBackground, Text, Image} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useTheme} from '@react-navigation/native';
import {withTranslation} from 'react-i18next';
import CheckInternetConnection from '../assets/images/check_internet_connection.png';
import Header from '../Utils/Views/Header';
import {light} from '../styles/colors';
import ErrorBoundary from 'react-native-error-boundary';

// Higher-Order Component to Inject Theme
const withTheme = WrappedComponent => props => {
  const theme = useTheme();
  return <WrappedComponent {...props} theme={theme} />;
};

class ErrorScreen extends Component {
  render() {
    const {theme, navigation, t} = this.props;
    const color = theme.colors;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/background_images/ig_background.png')}
          resizeMode="cover"
          style={styles.background}>
          <Header navigation={navigation} colors={color} />
          <View style={styles.errorContainer}>
            <Image
              source={CheckInternetConnection}
              resizeMode="contain"
              style={styles.errorImage}
            />
            <Text style={styles.errorText}>{t('checkConnection')}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorImage: {
    width: 150,
    height: 150,
  },
  errorText: {
    color: light.primary,
    marginVertical: ms(16),
  },
};

const ErrorScreenWithHOC = withTranslation()(withTheme(ErrorScreen));

export default function ErrorScreenWithBoundary(props) {
  return (
    <ErrorBoundary>
      <ErrorScreenWithHOC {...props} />
    </ErrorBoundary>
  );
}

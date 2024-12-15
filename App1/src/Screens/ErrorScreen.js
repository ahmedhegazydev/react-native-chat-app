import React, {Component} from 'react';
import {View, ImageBackground, Text, Image} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useTheme} from '@react-navigation/native'; // Use the hook here
import {withTranslation} from 'react-i18next';
import CheckInternetConnection from '../assets/images/check_internet_connection.png';
import Header from '../Utils/Views/Header';
import {fonts} from '../styles/fonts';
import {light} from '../styles/colors';

// Higher-Order Component to Inject Theme
const withTheme = WrappedComponent => props => {
  const theme = useTheme(); // Retrieve theme using the hook
  return <WrappedComponent {...props} theme={theme} />;
};

class ErrorScreen extends Component {
  render() {
    const {theme, navigation, t} = this.props; // Access theme and translation
    const color = theme.colors; // Get color from theme

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
    ...fonts.subTitleSemiBold20,
  },
};

// Wrap ErrorScreen with both withTheme and withTranslation
export default withTranslation()(withTheme(ErrorScreen));

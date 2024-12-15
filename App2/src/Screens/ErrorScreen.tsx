import React from 'react';
import {View, ImageBackground, Text, Image, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ErrorBoundary from 'react-native-error-boundary';
import CheckInternetConnection from '../assets/images/check_internet_connection.png';
import Header from '../Utils/Views/Header';
import {light} from '../styles/colors';
import {fonts} from '../styles/fonts';

interface ErrorScreenProps {
  navigation: any;
  theme: any;
  t: any;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({navigation, theme}) => {
  const color = theme;

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
          <Text style={styles.errorText}>تحقق من الاتصال!</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginVertical: 16,
    ...fonts.subTitleSemiBold20,
  },
});

export default function (props: any) {
  const theme = useTheme();
  const t = useTranslation();
  return (
    <ErrorBoundary FallbackComponent={() => <Text>Something went wrong.</Text>}>
      <ErrorScreen {...props} theme={theme.colors} t={t} />
    </ErrorBoundary>
  );
}

import React, {useEffect} from 'react';
import {View, ImageBackground, Text, Image, StyleSheet} from 'react-native';
import {ms} from 'react-native-size-matters';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import CheckInternetConnection from '../assets/images/check_internet_connection.png';
import Header from '../Utils/Views/Header';
import {fonts} from '../styles/fonts';
import {light} from '../styles/colors';

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
    marginVertical: ms(16),
    ...fonts.subTitleSemiBold20,
  },
});

export default function (props: any) {
  const theme = useTheme();
  const t = useTranslation();
  return <ErrorScreen {...props} theme={theme.colors} t={t} />;
}

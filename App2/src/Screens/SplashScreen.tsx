import React, { useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar, Platform } from 'react-native';
import { ms } from 'react-native-size-matters';
import { apiStorage } from '../Utils/AsyncStorageManager';
import { light } from '../styles/colors';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = (props) => {
  useEffect(() => {
    const show = async () => {
      try {
        const [
          first,
          isAppUpdateNeeded,
          appData,
          isLoggedIn,
          testEnvironment,
          FaceIDPermission,
        ] = await Promise.all([
          apiStorage.getItem('firstLaunch'),
          apiStorage.getItem('appNeedUpdate'),
          apiStorage.getItem('appLaunched'),
          apiStorage.getItem('auth'),
          apiStorage.getItem('testEnvironment'),
          apiStorage.getItem('biometricStatus'),
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
    StatusBar.setBarStyle(Platform.OS === 'android' ? 'light-content' : 'dark-content');
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.background}>
        <View style={styles.centeredContent}>
          <Text style={styles.title}>Chat - App 2</Text>
        </View>
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

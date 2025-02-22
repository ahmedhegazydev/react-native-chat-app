import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {I18nManager, View, Text, Modal, Image, Platform} from 'react-native';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Toast, {BaseToast} from 'react-native-toast-message';
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './src/Screens/SplashScreen';
import TabNavigator, {TabProvider} from './src/Navigation/TabNavigator';
import LoginScreen from './src/Screens/LoginScreen';
import ErrorScreen from './src/Screens/ErrorScreen';
import {navigationRef} from './src/Utils/Common';
import i18n from './src/Localization/i18n';
import CheckInternetConnection from './src/assets/images/check_internet_connection.png';
import CustomButton from './src/Utils/Views/CustomButton';
import {light} from './src/styles/colors';
import {fonts} from './src/styles/fonts';
import {ms, ScaledSheet} from 'react-native-size-matters';
import {I18nextProvider} from 'react-i18next';
import {apiStorage} from './src/Utils/AsyncStorageManager';

const Stack = createStackNavigator();

const NETWORK_ERROR_MESSAGE =
  'يبدو أنك غير متصل بالإنترنت، يرجى الاتصال بالإنترنت والمحاولة مرة أخرى';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [hideModal, setHideModal] = useState(true);

  useEffect(() => {
    async function checkAndSetRTL() {
      const rtlApplied = await apiStorage.getItem('rtlApplied');
      if (!rtlApplied) {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
        i18n.changeLanguage('ar');
        await apiStorage.setItem('rtlApplied', 'true');
        if (Platform.OS === 'android') RNRestart.Restart();
      }
    }
    checkAndSetRTL();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setHideModal(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const toggleWifiPopup = () => {
    setHideModal(isConnected);
    setIsConnected(prev => !prev);
  };

  const toastConfig = {
    failuer: (props: any) => (
      <BaseToast
        {...props}
        style={styles.toastFailure}
        contentContainerStyle={styles.toastContent}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
    Success: (props: any) => (
      <BaseToast
        {...props}
        style={styles.toastSuccess}
        contentContainerStyle={styles.toastContent}
        text1Style={styles.toastTextSuccess}
      />
    ),
  };

  return (
    <I18nextProvider i18n={i18n}>
      <View style={styles.container}>
        {!isConnected && (
          <Modal onRequestClose={toggleWifiPopup} transparent visible>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Image
                  source={CheckInternetConnection}
                  resizeMode="contain"
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>{NETWORK_ERROR_MESSAGE}</Text>
                <CustomButton
                  style={styles.customButton}
                  textStyle={styles.customButtonText}
                  title="فهمت"
                  onPress={toggleWifiPopup}
                />
              </View>
            </View>
          </Modal>
        )}
        <TabProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
              <Stack.Screen
                name="splash"
                component={SplashScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Tab"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ErrorScreen"
                component={ErrorScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            <Toast config={toastConfig} />
          </NavigationContainer>
        </TabProvider>
      </View>
    </I18nextProvider>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: light.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: light.white,
    padding: '20@s',
    borderRadius: '20@s',
    alignItems: 'center',
  },
  modalImage: {
    width: '100@s',
    height: '100@s',
  },
  modalText: {
    color: light.primary,
    fontFamily: fonts.IBMPlexSansArabicSemiBold,
    fontWeight: '600',
    fontSize: '20@s',
    lineHeight: '28@s',
    textAlign: 'center',
    marginVertical: '10@s',
  },
  customButton: {
    flex: 1,
    marginTop: '20@s',
    marginRight: '5@s',
    backgroundColor: '#4C3C8D',
  },
  customButtonText: {
    color: '#fff',
    fontFamily: fonts.IBMPlexSansArabicMedium,
    fontSize: '16@s',
  },
  toastFailure: {
    borderLeftColor: light.warning,
    backgroundColor: light.warning,
    width: '100%',
    justifyContent: 'center',
  },
  toastSuccess: {
    borderLeftColor: light.sucessToast,
    backgroundColor: light.sucessToast,
    width: '100%',
    justifyContent: 'center',
  },
  toastContent: {
    paddingHorizontal: 0,
  },
  toastText1: {
    textAlign: 'center',
    fontSize: '12@s',
    fontFamily: fonts.IBMPlexSansArabicBold,
    fontWeight: '600',
    color: light.white,
  },
  toastText2: {
    fontFamily: fonts.IBMPlexSansArabicBold,
    textAlign: 'center',
    fontSize: '12@s',
    fontWeight: '400',
    color: light.white,
  },
  toastTextSuccess: {
    textAlign: 'center',
    fontSize: '14@s',
    fontFamily: fonts.IBMPlexSansArabicBold,
    fontWeight: '400',
    color: light.sucessToastMsg,
  },
});

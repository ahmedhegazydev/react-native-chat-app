import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {I18nManager, View, Modal, Image, Platform, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Toast, {BaseToast} from 'react-native-toast-message';
import RNRestart from 'react-native-restart';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './src/Screens/SplashScreen';
import TabNavigatorWithErrorBoundary, {
  TabProvider,
} from './src/Navigation/TabNavigator';
import LoginScreen from './src/Screens/LoginScreen';
import ErrorScreenWithBoundary from './src/Screens/ErrorScreen';
import {navigationRef} from './src/Utils/Common';
import i18n from './src/Localization/i18n';
import CheckInternetConnection from './src/assets/images/check_internet_connection.png';
import CustomButton from './src/Utils/Views/CustomButton';
import {light} from './src/styles/colors';
import {I18nextProvider} from 'react-i18next';
import {apiStorage} from './src/Utils/AsyncStorageManager';

const Stack = createStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      hideModal: true,
    };
    this.unsubscribe = null;
  }

  async componentDidMount() {
    await this.checkAndSetRTL();

    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({
        isConnected: state.isConnected,
        hideModal: state.isConnected,
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  checkAndSetRTL = async () => {
    const rtlApplied = await apiStorage.getItem('rtlApplied');
    if (!rtlApplied) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      i18n.changeLanguage('ar');
      await apiStorage.setItem('rtlApplied', 'true');
      if (Platform.OS === 'android') RNRestart.Restart();
    }
  };

  toggleWifiPopup = () => {
    this.setState(prevState => ({
      hideModal: prevState.isConnected,
      isConnected: !prevState.isConnected,
    }));
  };

  renderToastConfig = () => ({
    failure: props => (
      <BaseToast
        {...props}
        style={{backgroundColor: light.warning, width: '100%'}}
        text1Style={{color: light.white}}
        text2Style={{color: light.white}}
      />
    ),
    Success: props => (
      <BaseToast
        {...props}
        style={{backgroundColor: light.sucessToast, width: '100%'}}
        text1Style={{color: light.sucessToastMsg}}
      />
    ),
  });

  render() {
    const {isConnected, hideModal} = this.state;

    return (
      <I18nextProvider i18n={i18n}>
        <View style={{flex: 1, backgroundColor: light.white}}>
          {!isConnected && (
            <Modal
              onRequestClose={this.toggleWifiPopup}
              transparent
              visible={!hideModal}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                  style={{
                    backgroundColor: light.white,
                    padding: 20,
                    borderRadius: 20,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={CheckInternetConnection}
                    resizeMode="contain"
                    style={{width: 100, height: 100}}
                  />
                  <Text
                    style={{
                      color: light.primary,
                      fontFamily: 'IBM Plex Sans',
                      fontWeight: '600',
                      fontSize: 20,
                      textAlign: 'center',
                      marginVertical: 10,
                    }}>
                    يبدو أنك غير متصل بالإنترنت، يرجى الاتصال بالإنترنت
                    والمحاولة مرة أخرى
                  </Text>
                  <CustomButton
                    style={{
                      flex: 1,
                      marginTop: 20,
                      marginRight: 5,
                      backgroundColor: '#4C3C8D',
                    }}
                    textStyle={{color: '#fff', fontSize: 16}}
                    title="فهمت"
                    onPress={this.toggleWifiPopup}
                  />
                </View>
              </View>
            </Modal>
          )}
          <TabProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator>
                <Stack.Screen
                  name="SplashScreen"
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
                  component={TabNavigatorWithErrorBoundary}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="ErrorScreen"
                  component={ErrorScreenWithBoundary}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
              <Toast config={this.renderToastConfig()} />
            </NavigationContainer>
          </TabProvider>
        </View>
      </I18nextProvider>
    );
  }
}

export default App;

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {View, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from '@pietile-native-kit/keyboard-aware-scrollview';
import {ms} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {light} from '../styles/colors';
import {ScreenName} from '../Constants/Constants';
import CustomButton from '../Utils/Views/CustomButton';
import useAuthStore from '../store/authSlice';

interface LoginScreenProps {
  navigation: any;
  theme: any;
  t: any;
}

const LoginScreen: React.FC<LoginScreenProps> = props => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [buttonTriggered, setButtonTriggered] = useState<string>('Login');
  const [isLoginBtnPressed, setIsLoginBtnPressed] = useState<boolean>(false);
  const {postAuthLogin} = useAuthStore();

  const postLogin = async () => {
    try {
      const result = await postAuthLogin(username, password);
      if (result) {
        setTimeout(() => {
          setIsLoginBtnPressed(false);
          apiStorage.setItem('userNameDevOrPrd', username);
          props.navigation.navigate('Tab');
        }, 2000);
      }
    } catch (error) {
      setIsLoginBtnPressed(false);
      Toast.show({
        type: 'failuer',
        text1: 'اسم المستخدم أو كلمة المرور غير صحيحة  ، يرجى',
        text2: 'المحاولة مرة أخرى أو إختر "نسيت كلمة المرور"',
      });
    }
  };

  const handleLoginPress = () => {
    setIsLoginBtnPressed(true);
    postLogin();
  };

  const errorHandler = (error: Error, stackTrace: string) => {
    console.log(error, stackTrace);
  };

  return (
    <ErrorBoundary onError={errorHandler}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <CustomButton
            loading={isLoginBtnPressed}
            title="Go To Chatting"
            style={[
              styles.loginButton,
              {
                backgroundColor:
                  buttonTriggered === 'Login' ? light.primary : light.neutral2,
              },
            ]}
            onPress={() => {
              handleLoginPress();
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: ms(20),
  },
  loginButton: {
    marginBottom: 30,
  },
});

export default function (props: any) {
  const theme = useTheme();
  const t = useTranslation();
  return <LoginScreen {...props} theme={theme.colors} t={t} />;
}

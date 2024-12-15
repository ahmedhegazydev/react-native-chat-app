import 'react-native-gesture-handler';
import React, {Component} from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from '@pietile-native-kit/keyboard-aware-scrollview';
import Toast from 'react-native-toast-message';
import {useTheme} from '@react-navigation/native';
import {withTranslation} from 'react-i18next';
import {apiStorage} from '../Utils/AsyncStorageManager';
import {light} from '../styles/colors';
import CustomButton from '../Utils/Views/CustomButton';
import authService from '../store/authSlice';
import ErrorScreenWithBoundary from './ErrorScreen';

const withTheme = WrappedComponent => props => {
  const theme = useTheme();
  return <WrappedComponent {...props} theme={theme} />;
};

const toastConfig = {
  failure: ({text1, text2}) => (
    <View style={customToastStyles.container}>
      <Text style={customToastStyles.text1}>{text1}</Text>
      <Text style={customToastStyles.text2}>{text2}</Text>
    </View>
  ),
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonTriggered: 'Login',
      isLoginBtnPressed: false,
    };
  }

  postLogin = async () => {
    const {username, password} = this.state;
    try {
      const result = await authService.postAuthLogin(username, password);
      if (result) {
        setTimeout(() => {
          this.setState({isLoginBtnPressed: false});
          apiStorage.setItem('userNameDevOrPrd', username);
          this.props.navigation.navigate('Tab');
        }, 2000);
      }
    } catch (error) {
      this.setState({isLoginBtnPressed: false});
      Toast.show({
        type: 'failure',
        text1: 'Invalid username or password.',
        text2: 'Please try again or click "Forgot Password."',
      });
    }
  };

  handleLoginPress = () => {
    this.setState({isLoginBtnPressed: true});
    this.postLogin();
  };

  errorHandler = (error, stackTrace) => {
    console.error('Error caught by ErrorBoundary:', error, stackTrace);
  };

  render() {
    const {theme} = this.props;
    const {isLoginBtnPressed, buttonTriggered} = this.state;

    return (
      <ErrorBoundary
        FallbackComponent={ErrorScreenWithBoundary}
        onError={this.errorHandler}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.innerContainer}>
            <CustomButton
              loading={isLoginBtnPressed}
              title="Go To Chatting"
              style={[
                styles.loginButton,
                {
                  backgroundColor:
                    buttonTriggered === 'Login'
                      ? light.primary
                      : light.neutral2,
                },
              ]}
              onPress={this.handleLoginPress}
            />
          </View>
        </KeyboardAwareScrollView>
        <Toast config={toastConfig} />
      </ErrorBoundary>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: 20,
  },
  loginButton: {
    marginBottom: 30,
  },
};

const customToastStyles = {
  container: {
    height: 60,
    width: '90%',
    backgroundColor: '#FF4F4F',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  text2: {
    fontSize: 14,
    color: '#fff',
  },
};

export default withTranslation()(withTheme(LoginScreen));

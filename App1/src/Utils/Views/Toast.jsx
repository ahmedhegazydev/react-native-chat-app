import React, {Component} from 'react';
import {Animated, Text, StyleSheet, View, Dimensions} from 'react-native';
import Verified from '../../assets/icons/verifiedIcon.svg';
import ErrorIcon from '../../assets/icons/toast_error_icon.svg';
import {ms} from 'react-native-size-matters';

class Toast extends Component {
  static toastTimeout;
  static staticSetState;

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      toastMessage: '',
      toastType: 'success',
    };
    this.translateY = new Animated.Value(-100);
  }

  static showToastSuccess = message => {
    if (Toast.staticSetState) {
      Toast.staticSetState({message, type: 'success'});
    }
  };

  static showToastError = message => {
    if (Toast.staticSetState) {
      Toast.staticSetState({message, type: 'error'});
    }
  };

  componentDidMount() {
    Toast.staticSetState = this.setToastState;
  }

  componentWillUnmount() {
    clearTimeout(Toast.toastTimeout);
  }

  setToastState = ({message, type = 'success'}) => {
    this.setState(
      {toastMessage: message, toastType: type, isVisible: true},
      () => {
        Animated.timing(this.translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();

        Toast.toastTimeout = setTimeout(() => {
          Animated.timing(this.translateY, {
            toValue: -150,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            this.setState({isVisible: false});
          });
        }, this.props.duration || 3000);
      },
    );
  };

  render() {
    const {isVisible, toastMessage, toastType} = this.state;

    if (!isVisible) return null;

    const isSuccess = toastType === 'success';

    return (
      <Animated.View
        style={[
          styles.toastContainer,
          {
            backgroundColor: isSuccess ? '#F4FBF6' : '#FFF8F7',
            borderColor: isSuccess ? '#C1E9D0' : '#FFCCC4',
            transform: [{translateY: this.translateY}],
          },
        ]}>
        <View style={styles.toastContent}>
          {isSuccess ? (
            <Verified style={styles.toastIcon} />
          ) : (
            <ErrorIcon style={styles.toastIcon} />
          )}
          <Text
            style={[
              styles.toastText,
              {color: isSuccess ? '#3FA670' : '#CC0615'},
            ]}>
            {toastMessage}
          </Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    height: 50,
    top: 70,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    zIndex: 1000,
    width: Dimensions.get('window').width - ms(60),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {
    marginHorizontal: ms(5),
  },
  toastText: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default Toast;

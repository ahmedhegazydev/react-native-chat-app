import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View, Dimensions } from 'react-native';
import Verified from '../../assets/icons/verifiedIcon.svg';
import ErrorIcon from '../../assets/icons/toast_error_icon.svg';
import { ms } from 'react-native-size-matters';

// Define types for the Toast component's props
interface ToastProps {
  duration?: number; // duration is optional with default value 3000
}

interface ToastStatic {
  showToastSuccess: (message: string) => void;
  showToastError: (message: string) => void;
}

const Toast = (() => {
  let staticSetState: ({ message, type }: { message: string; type: 'success' | 'error' }) => void;
  let toastTimeout: NodeJS.Timeout;

  const ToastComponent: React.FC<ToastProps> = ({ duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const translateY = useRef(new Animated.Value(-100)).current;

    staticSetState = ({ message, type = 'success' }: { message: string; type: 'success' | 'error' }) => {
      setToastMessage(message);
      setToastType(type);
      setIsVisible(true);
    };

    useEffect(() => {
      if (isVisible) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();

        toastTimeout = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -150,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setIsVisible(false);
          });
        }, duration);
      }

      return () => clearTimeout(toastTimeout);
    }, [isVisible, duration, translateY]);

    if (!isVisible) return null;

    const isSuccess = toastType === 'success';

    return (
      <Animated.View
        style={[
          styles.toastContainer,
          {
            backgroundColor: isSuccess ? '#F4FBF6' : '#FFF8F7',
            borderColor: isSuccess ? '#C1E9D0' : '#FFCCC4',
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.toastContent}>
          {isSuccess ? (
            <Verified style={styles.toastIcon} />
          ) : (
            <ErrorIcon style={styles.toastIcon} />
          )}
          <Text
            style={[
              styles.toastText,
              { color: isSuccess ? '#3FA670' : '#CC0615' },
            ]}
          >
            {toastMessage}
          </Text>
        </View>
      </Animated.View>
    );
  };

  ToastComponent.showToastSuccess = (message: string) => {
    if (staticSetState) {
      staticSetState({ message, type: 'success' });
    }
  };

  ToastComponent.showToastError = (message: string) => {
    if (staticSetState) {
      staticSetState({ message, type: 'error' });
    }
  };

  return ToastComponent as React.FC<ToastProps> & ToastStatic;
})();

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
    shadowOffset: { width: 0, height: 2 },
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

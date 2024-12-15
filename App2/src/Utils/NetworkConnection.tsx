import React, {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

const CheckInternetConnection: React.FC = () => {
  const internetState = useNetInfo();

  useEffect(() => {
    if (internetState.isConnected === false) {
      Snackbar.show({
        text: 'Network connection is unavailable',
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: 'RETRY',
          textColor: 'green',
          onPress: () => {},
        },
      });
    }
  }, [internetState.isConnected]);

  return null;
};

export default CheckInternetConnection;

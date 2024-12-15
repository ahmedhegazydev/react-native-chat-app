import React, {createContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View} from 'react-native';
import styles from './styles';

export const NetworkContext = createContext();

export const NetworkProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{isConnected}}>
      <View style={{flex: 1}}>
        {!isConnected && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
          </View>
        )}
        {children}
      </View>
    </NetworkContext.Provider>
  );
};

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  offlineText: {color: '#fff'},
});

export default styles;

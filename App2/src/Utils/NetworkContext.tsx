import React, { createContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

// Define types for the context value
interface NetworkContextType {
  isConnected: boolean;
}

// Create a context with the defined type
export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected || false);  // Guarding against `undefined` state
    });

    return () => unsubscribe();  // Cleanup the listener on unmount
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      <View style={{ flex: 1 }}>
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

// Define styles
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
  offlineText: {
    color: '#fff',
  },
});

export default styles;

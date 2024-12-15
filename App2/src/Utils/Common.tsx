import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { createNavigationContainerRef } from '@react-navigation/native';
import { useTabVisibility } from '../Navigation/TabNavigator';
import CommingSoonImg from '../assets/images/commingSoon.svg';

// Define the type for route params
type WebViewScreenRouteParams = {
  url: string;
};

type WebViewScreenProps = {
  route: { params: WebViewScreenRouteParams };
};

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#0000ff"
        />
      )}
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Dimensions.get('window').height / 9,
  },
  comingSoonText: {
    color: '#6C609D',
    fontSize: 20,
    fontWeight: '600',
  },
});

// Hook to manage tab visibility
export const useTabBarVisibility = () => {
  const { hideTabBar, showTabBar } = useTabVisibility();

  useEffect(() => {
    hideTabBar();
    return showTabBar;
  }, [hideTabBar, showTabBar]);
};

// Coming soon view
export const comingSoonView = () => (
  <View style={styles.comingSoonContainer}>
    <CommingSoonImg />
    <Text style={styles.comingSoonText}>سيتم التحديث قريبًا..</Text>
  </View>
);

// Navigation reference
export const navigationRef = createNavigationContainerRef();

// Navigation helper function
export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export default WebViewScreen;

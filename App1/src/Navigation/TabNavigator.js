import React, {createContext, useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ms} from 'react-native-size-matters';
import {StyleSheet, Text, View} from 'react-native';
import HomeIcone from '../SVGs/HomeIcone';
import ErrorScreenWithBoundary from '../Screens/ErrorScreen';
import Zoomable from '../Utils/Views/Zoomable';
import RoomListScreen from '../Screens/RoomListScreen';
import MessagesListScreen from '../Screens/MessagesListScreen';
import ErrorBoundary from 'react-native-error-boundary';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TabContext = createContext();

export const TabProvider = ({children}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  return (
    <TabContext.Provider
      value={{selectedTabIndex, setSelectedTabIndex, isVisible, setIsVisible}}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => useContext(TabContext);

const CustomTabBar = ({state, descriptors, navigation}) => {
  const {selectedTabIndex, setSelectedTabIndex, isVisible} = useTabContext();

  if (!isVisible) return null;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = selectedTabIndex === index;

        const onPress = () => {
          const isFocusedTab = state.index === index;

          if (isFocusedTab) {
            const tabState = navigation.getState();
            const tabStackRoutes =
              tabState?.routes?.[index]?.state?.routes || [];

            if (tabStackRoutes.length > 1) {
              navigation.popToTop();
            }
          } else {
            setSelectedTabIndex(index);
            navigation.navigate(route.name);
          }
        };

        const IconComponent = () =>
          route.name === 'الرئيسية' ? (
            <HomeIcone width={22} height={22} />
          ) : null;

        return (
          <Zoomable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.tabButtonFocused]}>
            <View style={styles.iconContainer}>
              <IconComponent />
            </View>
            <Text style={styles.tabLabel}>{label}</Text>
          </Zoomable>
        );
      })}
    </View>
  );
};

const TabNavigator = () => {
  const tabOptions = {
    tabBarActiveBackgroundColor: '#F1F1FD',
    tabBarShowLabel: true,
    tabBarActiveTintColor: 'red',
    tabBarStyle: styles.tabBarStyle,
    tabBarItemStyle: styles.tabBarItemStyle,
    headerShown: false,
  };

  return (
    <Tab.Navigator
      initialRouteName="الرئيسية"
      backBehaviour="initialRoute"
      screenOptions={tabOptions}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="الرئيسية"
        component={HomeTab}
        options={{tabBarIcon: () => <HomeIcone width={22} height={22} />}}
      />
    </Tab.Navigator>
  );
};

const HomeTab = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RoomListScreen"
      component={RoomListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MessagesListScreen"
      component={MessagesListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ErrorScreen"
      component={ErrorScreenWithBoundary}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: ms(100),
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  tabButtonFocused: {
    backgroundColor: '#F1F1FD',
    borderRadius: ms(6),
    padding: ms(8),
  },
  tabLabel: {
    fontSize: ms(12),
    fontFamily: 'IBM Plex Sans Arabic',
    fontWeight: '500',
    color: '#4C3D8F',
    marginTop: ms(10),
  },
  tabBarStyle: {
    height: ms(90),
    paddingBottom: ms(10),
  },
  tabBarItemStyle: {
    margin: ms(8),
    padding: ms(8),
    borderRadius: ms(6),
  },
  iconContainer: {
    marginTop: ms(10),
  },
});

export default function TabNavigatorWithErrorBoundary(props) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorScreenWithBoundary}
      onError={(error, info) => {
        console.error('Error boundary caught an error:', error);
        console.log(info);
      }}>
      <TabNavigator {...props} />
    </ErrorBoundary>
  );
}

export const useTabVisibility = () => {
  const {setIsVisible} = useTabContext();
  const showTabBar = () => setIsVisible(true);
  const hideTabBar = () => setIsVisible(false);
  return {showTabBar, hideTabBar};
};

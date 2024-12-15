import React, {createContext, useContext, useState, ReactNode} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureResponderEvent, Text, View} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import HomeIcon from '../SVGs/HomeIcone';
import Zoomable from '../Utils/Views/Zoomable';
import RoomListScreen from '../Screens/RoomListScreen';
import MessagesListScreen from '../Screens/MessagesListScreen';
import ErrorScreen from '../Screens/ErrorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface TabContextProps {
  selectedTabIndex: number;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number>>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabContext = createContext<TabContextProps | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;
}

export const TabProvider: React.FC<TabProviderProps> = ({children}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <TabContext.Provider
      value={{selectedTabIndex, setSelectedTabIndex, isVisible, setIsVisible}}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContextProps => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const {selectedTabIndex, setSelectedTabIndex, isVisible} = useTabContext();

  if (!isVisible) return null;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = selectedTabIndex === index;

        const onPress = (event: GestureResponderEvent) => {
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

        const IconComponent =
          route.name === 'الرئيسية' ? (
            <HomeIcon width={22} height={22} />
          ) : null;

        return (
          <Zoomable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.tabButtonFocused]}>
            <View style={styles.iconContainer}>{IconComponent}</View>
            <Text style={styles.tabLabel}>{label}</Text>
          </Zoomable>
        );
      })}
    </View>
  );
};

const TabNavigator: React.FC = () => {
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
        options={{tabBarIcon: () => <HomeIcon width={22} height={22} />}}
      />
    </Tab.Navigator>
  );
};

const HomeTab: React.FC = () => (
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
  </Stack.Navigator>
);

const styles = {
  tabBarContainer: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabButtonFocused: {
    backgroundColor: '#F1F1FD',
    borderRadius: 6,
    padding: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'IBM Plex Sans Arabic',
    fontWeight: '500',
    color: '#4C3D8F',
    marginTop: 10,
  },
  tabBarStyle: {
    height: 90,
    paddingBottom: 10,
  },
  tabBarItemStyle: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
  },
  iconContainer: {
    marginTop: 10,
  },
};

export default () => (
  <ErrorBoundary FallbackComponent={ErrorScreen}>
    <TabNavigator />
  </ErrorBoundary>
);

export const useTabVisibility = () => {
  const {setIsVisible} = useTabContext();
  const showTabBar = () => setIsVisible(true);
  const hideTabBar = () => setIsVisible(false);
  return {showTabBar, hideTabBar};
};

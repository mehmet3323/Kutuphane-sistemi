import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

// Screens
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Social from './src/screens/Social';
import AdminPanel from './src/screens/AdminPanel';
import Login from './src/screens/Login';
import Favorites from './src/screens/Favorites';
import BottomNavigation from './src/components/BottomNavigation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ route }) => {
  const initialTab = route?.params?.screen || 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      tabBar={props => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Admin" component={AdminPanel} />
    </Tab.Navigator>
  );
};

const App = () => (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
    </NavigationContainer>
  );

export default App;
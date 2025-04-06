import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Register, ForgotPassword, Home, Profile, Search, Favorites} from '../screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomNavigation from '../components/BottomNavigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigation {...props} />}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Tab.Navigator>
  );
};

const StackRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Favorites">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default StackRoutes;

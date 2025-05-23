import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Register, ForgotPassword, Home, Profile, Favorites, AdminPanel} from '../screens';
import Social from '../screens/Social/Social';
import Statistics from '../screens/Statistics';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomNavigation from '../components/BottomNavigation';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigation {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
    </Stack.Navigator>
  );
};

export default StackRoutes;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screen/SplashScreen';
import LoginScreen from '../screen/LoginScreen';
import MainScreen from '../screen/MainScreen';
import OrderMenu from '../screen/Pages/OrderMenu';
import {Button, Text} from 'react-native';
import {Header} from '../components';

const Stack = createStackNavigator();
const Router = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      {/* <Stack.Navigator initialRouteName="MainApp"> */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Order Menu"
        component={OrderMenu}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default Router;

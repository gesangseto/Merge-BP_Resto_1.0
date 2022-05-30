import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import DineIn from './MainScreenPages/DineIn';
import {CustomDrawer} from '../components';

const Drawer = createDrawerNavigator();

function Component(props) {
  return (
    <>
      <Text mt="12" fontSize="18">
        This is {props.route.name} page.
      </Text>
    </>
  );
}
export default function MainScreen() {
  return (
    <SafeAreaView flex={1}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          drawerType: 'back',
          drawerStyle: {
            backgroundColor: 'white',
          },
        }}>
        <Drawer.Screen name="Dine In" component={DineIn} />
        <Drawer.Screen name="Take Away" component={Component} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

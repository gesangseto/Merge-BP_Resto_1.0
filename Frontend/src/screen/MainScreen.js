import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import DineIn from './MainScreenPages/DineIn';

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
        screenOptions={{
          drawerType: 'back',
          drawerStyle: {
            backgroundColor: 'white',
          },
        }}
        drawerContent={props => (
          <View>
            <View
              style={{
                backgroundColor: '#f50057',
                height: 140,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 30}}>Header</Text>
            </View>
            {/* <DrawerItems {...props} /> */}
          </View>
        )}>
        <Drawer.Screen name="Dine In" component={DineIn} />
        <Drawer.Screen name="Take Away" component={Component} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

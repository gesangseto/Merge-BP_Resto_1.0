import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import DineIn from './MainScreenPages/DineIn';
import {CustomDrawer} from '../components';
import ConfigurationScreen from './MainScreenPages/ConfigurationScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [profile, setProfile] = useState({});

  useEffect(() => {
    (async function () {
      let prfl = await AsyncStorage.getItem('profile');
      setProfile({...JSON.parse(prfl)});
    })();
  }, []);

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

        {profile.hasOwnProperty('is_superadmin') && (
          <Drawer.Screen name="Configuration" component={ConfigurationScreen} />
        )}
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

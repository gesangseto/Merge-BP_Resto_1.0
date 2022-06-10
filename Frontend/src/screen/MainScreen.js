import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {CustomDrawer, PrintBill} from '../components';
import DineInScreen from './MainScreenPages/DineInScreen';
import ConfigurationScreen from './MainScreenPages/ConfigurationScreen';
import TakeAwayScreen from './MainScreenPages/TakeAwayScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

function Component(props) {
  return (
    <>
      <PrintBill />
    </>
  );
}
export default function MainScreen(props) {
  const {name} = props;
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
        <Drawer.Screen name="Dine In" component={DineInScreen} />
        <Drawer.Screen name="Take Away" component={TakeAwayScreen} />

        {profile.hasOwnProperty('is_superadmin') && (
          <Drawer.Screen name="Configuration" component={ConfigurationScreen} />
        )}
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

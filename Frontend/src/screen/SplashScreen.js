import React, {useEffect} from 'react';
import {Text} from 'react-native';
import * as RootNavigation from '../helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  useEffect(() => {
    (async function () {
      await AsyncStorage.setItem('ENDPOINT_API', 'https://192.168.3.146:5000');
      let profile = await AsyncStorage.getItem('profile');
      if (profile) {
        setTimeout(() => {
          RootNavigation.navigateReplace('MainScreen');
        }, 500);
      } else {
        setTimeout(() => {
          RootNavigation.navigateReplace('LoginScreen');
        }, 500);
      }
    })();
  }, []);

  return <Text>HALLO</Text>;
};
export default SplashScreen;

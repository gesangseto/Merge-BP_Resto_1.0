import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {banner_menu, home_logo, splash_image} from '../../assets';
import * as RootNavigation from '../../helper';

const CustomDrawer = props => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    (async function () {
      let prfl = await AsyncStorage.getItem('profile');
      setProfile({...JSON.parse(prfl)});
    })();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('profile');
    RootNavigation.navigateReplace('LoginScreen');
  };
  const handlePressConfiguration = () => {
    RootNavigation.navigate('ConfigurationScreen');
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#8200d6'}}>
        <ImageBackground
          source={banner_menu}
          style={{padding: 20, marginTop: -10}}>
          <Image
            source={home_logo}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {profile.srepname}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto-Regular',
                marginRight: 5,
              }}>
              {profile.email}
            </Text>
            <FontAwesome5 name="coins" size={14} color="#fff" />
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        {/* {profile.hasOwnProperty('is_superadmin') && (
          <TouchableOpacity
            onPress={() => {
              handlePressConfiguration();
            }}
            style={{paddingVertical: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MatComIcon name="cellphone-cog" size={22} />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Roboto-Medium',
                  marginLeft: 5,
                }}>
                Configuration
              </Text>
            </View>
          </TouchableOpacity>
        )} */}
        <TouchableOpacity
          onPress={() => {
            handleSignOut();
          }}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MatComIcon name="logout" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

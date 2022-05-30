import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {splash_image} from '../assets';
import * as RootNavigation from '../helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Portal} from '@gorhom/portal';
import {Modalize} from 'react-native-modalize';
import {ButtonFooterModal, InputText} from '../components';
import {colors} from '../constants';
// import {TouchableOpacity} from 'react-native-gesture-handler';

const SplashScreen = () => {
  const modalAddApi = useRef(null);
  const [endpoint, setEndpoint] = useState('http://192.168.3.146:5000');

  const openModal = () => {
    modalAddApi.current?.open();
  };

  const closeModal = () => {
    modalAddApi.current?.close();
  };

  useEffect(() => {
    (async function () {
      let endpointApi = await AsyncStorage.getItem('ENDPOINT_API');
      console.log('endpointApi', endpointApi);
      if (!endpointApi) {
        modalAddApi.current?.open();
      } else {
        await checkProfile();
      }
    })();
  }, []);

  const checkProfile = async () => {
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
  };
  const handleSubmitEndpoint = async () => {
    await AsyncStorage.setItem('ENDPOINT_API', endpoint);
    await checkProfile();
  };

  return (
    <>
      <View>
        <ImageBackground
          source={splash_image}
          style={{width: '100%', height: '100%'}}
        />
      </View>

      <Portal>
        <Modalize
          ref={modalAddApi}
          closeOnOverlayTap={false}
          closeSnapPointStraightEnabled={false}
          // modalHeight={isKeyboardOpen ? 400 : 225}
          modalHeight={200}
          FooterComponent={
            <ButtonFooterModal
              buttonTittle="Set Endpoint"
              buttonColor={colors.success}
              useTotal={false}
              onClickSubmit={() => handleSubmitEndpoint()}
            />
          }>
          <InputText
            max={100}
            required
            value={endpoint}
            title="Endpoind Api"
            onChange={val => setEndpoint(val)}
            onSubmitEditing={() => handleSubmitEndpoint()}
          />
        </Modalize>
      </Portal>
    </>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bottom: {
    zIndex: -1,
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'flex-end',
    flex: 1,
  },
  button: {},
  text: {
    fontSize: 18,
    color: 'white',
  },
});

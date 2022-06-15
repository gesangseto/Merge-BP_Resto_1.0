import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RequiredText} from '../components';
import * as RootNavigation from '../helper';
import {Toaster} from '../helper';
import {loginSales} from '../models';
import {login_image} from '../assets';
import {colors} from '../constants';
const req = {
  mobile: false,
  password: false,
};

const LoginScreen = ({}) => {
  const [data, setData] = React.useState({
    mobile: '',
    password: '',
  });
  const [err, setErr] = React.useState(req);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!initialLoad) {
      validation();
    }
  }, [data]);

  const validation = () => {
    let rq = JSON.parse(JSON.stringify(req));
    let _ret = true;
    if (!validatePhone(data.mobile)) {
      rq.mobile = true;
      _ret = false;
    }
    if (!data.password) {
      rq.password = true;
      _ret = false;
    }
    setErr({...rq});
    return _ret;
  };

  const loginHandle = async () => {
    setInitialLoad(false);
    let body = {
      mobile: data.mobile,
      password: data.password,
    };
    if (!validation()) {
      return;
    }
    let check = await loginSales(body);
    if (!check) {
      return;
    }
    Toaster({message: 'Login success', type: 'success'});
    await AsyncStorage.setItem('profile', JSON.stringify(check[0]));
    RootNavigation.navigateReplace('MainScreen');
    return;
  };

  const validatePhone = mobile => {
    if (mobile)
      if (
        mobile.match(/\d/g).length <= 15 &&
        mobile.match(/\d/g).length >= 10
      ) {
        return String(mobile).match(
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/im,
        );
      } else {
        return null;
      }
  };
  return (
    <ImageBackground source={login_image} style={styles.container}>
      <View
        style={{
          marginTop: -70,
          backgroundColor: colors.lightGrey,
          paddingHorizontal: 40,
          paddingVertical: 20,
          borderRadius: 15,
        }}>
        <Text style={styles.inputext}>Welcome</Text>
        <TextInput
          keyboardType="numeric"
          value={data.mobile}
          onChangeText={val => setData({...data, mobile: val})}
          placeholder="Nomor HP"
          style={styles.input}
          maxLength={14}
        />
        <RequiredText show={err.mobile} message={'Nomor HP salah'} />

        <TextInput
          value={data.password}
          onChangeText={val => setData({...data, password: val})}
          placeholder="Kata sandi"
          secureTextEntry={true}
          style={styles.input}
        />
        <RequiredText show={err.password} title={'Kata sandi'} />

        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => loginHandle()}>
          <Text style={{color: 'white', fontSize: 18}}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  input: {
    width: 200,
    height: 44,
    paddingBottom: 10,
    // borderBottomWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginTop: 10,
  },
  buttonLogin: {
    width: 200,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    marginTop: 25,
  },
  inputext: {
    width: 200,
    height: 44,
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    // borderWidth: 1,
    borderColor: 'black',
    marginBottom: 25,
  },
});

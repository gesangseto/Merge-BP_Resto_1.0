import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as RootNavigation from '../helper';
import {Toaster} from '../helper';
import {loginSales} from '../models';

const req = {
  email: false,
  password: false,
};

const LoginScreen = ({}) => {
  const [data, setData] = React.useState({
    email: '',
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
    if (!validateEmail(data.email)) {
      rq.email = true;
      _ret = false;
    }
    setErr({...rq});
    return _ret;
  };

  const loginHandle = async () => {
    setInitialLoad(false);
    let body = {
      email: data.email,
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

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.inputext}>Welcome</Text>
      <TextInput
        value={data.email}
        onChangeText={val => setData({...data, email: val})}
        placeholder="Email"
        style={styles.input}
      />
      {err.email && (
        <Text style={{fontSize: 8, color: 'red'}}>
          Please input valid email
        </Text>
      )}

      <TextInput
        keyboardType="numeric"
        value={data.password}
        onChangeText={val => setData({...data, password: val})}
        placeholder="Password"
        secureTextEntry={true}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={() => loginHandle()}>
        <Text style={{color: 'white', fontSize: 18}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  input: {
    width: 200,
    height: 44,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'black',
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

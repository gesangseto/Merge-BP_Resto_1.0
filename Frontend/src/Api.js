import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const $axios = axios.create();
$axios.defaults.timeout = 5000;
$axios.interceptors.request.use(
  async config => {
    let url = `${await AsyncStorage.getItem('ENDPOINT_API')}`;
    config.baseURL = url;
    config.headers = {
      'Content-Type': 'application/json',
      Token: `c71d88f3-e144-49c9-91df-d9a6bd0e3414`,
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// $axios.interceptors.response.use(
//   async (response) => {
//     let res = response.data;
//     if (res && res.StatusCode && res.StatusCode == "401") {
//       Toaster(error.unathorized);
//       await AsyncStorage.removeItem("profile");
//       await AsyncStorage.setItem("time_out", `-1`);
//       RootNavigation.navigateReplace("login");
//       return Promise.resolve(response);
//     }
//     return Promise.resolve(response);
//   },
//   function(error) {
//     return Promise.reject(error);
//   }
// );

export default $axios;

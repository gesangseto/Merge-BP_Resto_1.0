import $axios from '../Api';
import {Toaster} from '../helper';

/*
 VERSI 2 API
Ini adalah kumpulan api versi 2 yang digunakan android untuk auto fill header 
dan juga akan auto update timmer logout (Update token)
*/

export const loginSales = async (property = {}, use_alert = true) => {
  let url = `/api/authentication/login-sales`;
  return new Promise(resolve => {
    $axios
      .post(url, JSON.stringify(property))
      .then(result => {
        result = result.data;
        if (result.error) {
          Toaster({message: result.message, type: 'error'});
          return resolve(false);
        } else {
          return resolve(result.data);
        }
      })
      .catch(e => {
        Toaster({message: JSON.stringify(e), type: 'error'});
        return resolve(false);
      });
  });
};

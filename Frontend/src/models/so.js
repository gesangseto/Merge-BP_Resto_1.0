import $axios from '../Api';
import {Toaster} from '../helper';

/*
 VERSI 2 API
Ini adalah kumpulan api versi 2 yang digunakan android untuk auto fill header 
dan juga akan auto update timmer logout (Update token)
*/

export const createSo = async (property = {}, use_alert = true) => {
  console.log(property);
  let url = `/api/transaction/so`;
  return new Promise(resolve => {
    $axios
      .put(url, JSON.stringify(property))
      .then(result => {
        result = result.data;
        if (result.error) {
          if (use_alert) Toaster({message: result.message, type: 'error'});
          return resolve(false);
        } else {
          return resolve(result.data);
        }
      })
      .catch(e => {
        if (use_alert) Toaster({message: result.message, type: 'error'});
        return resolve(false);
      });
  });
};

export const cancelSo = async (property = {}, use_alert = true) => {
  console.log(property);
  let url = `/api/transaction/so`;
  return new Promise(resolve => {
    $axios
      .delete(url, {data: property})
      .then(result => {
        result = result.data;
        console.log(result);
        if (result.error) {
          if (use_alert) Toaster({message: result.message, type: 'error'});
          return resolve(false);
        } else {
          return resolve(result.data);
        }
      })
      .catch(e => {
        if (use_alert) Toaster({message: result.message, type: 'error'});
        return resolve(false);
      });
  });
};

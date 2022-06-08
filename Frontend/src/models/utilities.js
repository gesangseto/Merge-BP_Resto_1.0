import $axios from '../Api';
import {Toaster} from '../helper';

/*
 VERSI 2 API
Ini adalah kumpulan api versi 2 yang digunakan android untuk auto fill header 
dan juga akan auto update timmer logout (Update token)
*/

export const getPrint = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/utilities/print-bill?${query_string}`;
  console.log(url);
  return new Promise(resolve => {
    $axios
      .get(url, JSON.stringify(property))
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

export const getKasirStatus = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/utilities/kasir-status?${query_string}`;
  return new Promise(resolve => {
    $axios
      .get(url, JSON.stringify(property))
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

export const getKitchen = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/utilities/kitchen?${query_string}`;
  return new Promise(resolve => {
    $axios
      .get(url, JSON.stringify(property))
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

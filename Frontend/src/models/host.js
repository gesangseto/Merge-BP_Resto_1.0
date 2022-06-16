import $axios from '../Api';
import {Toaster} from '../helper';
/*
 VERSI 2 API
Ini adalah kumpulan api versi 2 yang digunakan android untuk auto fill header 
dan juga akan auto update timmer logout (Update token)
*/

export const getHost = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/master/host?${query_string}`;
  return new Promise(resolve => {
    $axios
      .get(url)
      .then(result => {
        result = result.data;
        if (result.error) {
          return resolve(false);
        } else {
          return resolve(result.data);
        }
      })
      .catch(e => {
        if (use_alert) Toaster({message: e.message, type: 'error'});
        return resolve(false);
      });
  });
};

export const getHostStatus = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/master/host-status?${query_string}`;
  return new Promise(resolve => {
    $axios
      .get(url)
      .then(result => {
        result = result.data;
        if (result.error) {
          return resolve(false);
        } else {
          return resolve(result.data);
        }
      })
      .catch(e => {
        if (use_alert) Toaster({message: e.message, type: 'error'});
        return resolve(false);
      });
  });
};

export const updateHostStatus = async (property = {}, use_alert = true) => {
  let url = `/api/master/host-status`;
  console.log(property);
  return new Promise(resolve => {
    $axios
      .post(url, JSON.stringify(property))
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
        if (use_alert) Toaster({message: e.message, type: 'error'});
        return resolve(false);
      });
  });
};

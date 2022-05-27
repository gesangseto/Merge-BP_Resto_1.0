import $axios from '../Api';

/*
 VERSI 2 API
Ini adalah kumpulan api versi 2 yang digunakan android untuk auto fill header 
dan juga akan auto update timmer logout (Update token)
*/

export const getHost = async (property = {}, use_alert = true) => {
  var query_string = new URLSearchParams(property).toString();
  let url = `/api/master/host?${query_string}`;
  console.log(url);
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
        console.log(e);
        return resolve(false);
      });
  });
};

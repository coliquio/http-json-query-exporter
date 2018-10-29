const axios = require('axios');

module.exports = async (options) => {
  return axios.request(Object.assign({
    timeout: 2000
  }, options))
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      throw new Error(`httpQuery failed ${err.message} with options=${JSON.stringify(options).replace(/\\n/g, '')}`);
    });
};
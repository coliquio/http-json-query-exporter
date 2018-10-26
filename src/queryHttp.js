const axios = require('axios');

module.exports = async (options) => {
  return axios.request(Object.assign({
    timeout: 2000
  }, options))
    .then(res => {
      return res.data;
    })
    .catch((err) => {
      console.error(err.stack, err.response.data)
      throw err
    })
};
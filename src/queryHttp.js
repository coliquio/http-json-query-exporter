const axios = require('axios');

module.exports = async (options) => {
  try {
    const { data } = await axios.request(Object.assign({
      timeout: 2000
    }, options));
    return data;
  } catch (err) {
    throw new Error(`httpQuery failed ${err.message} with options=${JSON.stringify(options).replace(/\\n/g, '')}`);
  }
};
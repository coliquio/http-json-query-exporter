const yaml = require('js-yaml');
const fs = require('fs');

module.exports = async (path) => {
  return new Promise((resolve, reject) => {
    try {
      var doc = yaml.load(fs.readFileSync(path, 'utf8'));
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
};
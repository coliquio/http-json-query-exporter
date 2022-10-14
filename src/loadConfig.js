const yaml = require('js-yaml');
const fs = require('fs');

module.exports = (path) => {
  try {
    var doc = yaml.load(fs.readFileSync(path, 'utf8'));
    return Promise.resolve(doc);
  } catch (e) {
    return Promise.reject(e);
  }
};
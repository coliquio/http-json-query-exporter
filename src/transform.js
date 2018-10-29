// http://try.jsonata.org/
const jsonata = require('jsonata');
const transform = (expression, json) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(jsonata(expression).evaluate(json) || []);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = transform;

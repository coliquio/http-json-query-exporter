// http://try.jsonata.org/
const jsonata = require('jsonata');
const transform = (expression, json) => {
  let transformed;
  try {
    transformed = jsonata(expression).evaluate(json) || [];
  } catch (e) {
    throw new Error(`transform failed for ${expression} with json=${JSON.stringify(json).replace(/\\n/g, '')}`);
  }
  if (typeof transformed == 'object' && transformed !== null && !Array.isArray(transformed)) {
    transformed = [ transformed ]
  }
  if (!Array.isArray(transformed)) {
    throw new Error(`transform did not return array for ${expression} with json=${JSON.stringify(json).replace(/\\n/g, '')}`);
  }
  return transformed;  
};
module.exports = transform;

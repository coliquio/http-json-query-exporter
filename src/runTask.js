const queryHttp = require('./queryHttp');
const transform = require('./transform');
const renderPrometheusMetric = require('./renderPrometheusMetric');

module.exports = async ({query, transformation, prometheusMetric}) => {
  const data = await queryHttp(query);
  const transformed = await transform(transformation, data);
  if (typeof transformed !== 'object' || transformed === null) {
    throw new Error(`Transformation failed for ${JSON.stringify(query).replace(/\\n/g, '')} with result ${JSON.stringify(data).replace(/\\n/g, '')}`);
  }
  const renderedPrometheusMetric = renderPrometheusMetric(prometheusMetric, transformed);
  return renderedPrometheusMetric;
};
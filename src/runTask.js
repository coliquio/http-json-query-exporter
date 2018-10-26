const queryHttp = require('./queryHttp');
const transform = require('./transform');
const renderPrometheusMetric = require('./renderPrometheusMetric');

module.exports = async ({query, transformation, prometheusMetric}) => {
  const data = await queryHttp(query);
  const transformed = await transform(transformation, data);
  if (typeof transformed !== 'object' || transformed === null) throw new Error(`Transformation failed for ${JSON.stringify(query)} with result ${JSON.stringify(data)}`);
  const renderedPrometheusMetric = renderPrometheusMetric(prometheusMetric, transformed);
  return renderedPrometheusMetric;
};
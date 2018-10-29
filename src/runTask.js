const queryHttp = require('./queryHttp');
const transform = require('./transform');
const renderPrometheusMetric = require('./renderPrometheusMetric');

module.exports = async ({query, transformation, prometheusMetric}) => {
  const data = await queryHttp(query);
  const transformed = transform(transformation, data);
  const renderedPrometheusMetric = renderPrometheusMetric(prometheusMetric, transformed);
  return renderedPrometheusMetric;
};
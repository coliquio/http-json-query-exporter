const express = require('express');
const runTask = require('./runTask');
const loadConfig = require('./loadConfig');
const internalMetricCounter = require('./internalMetricCounter');
const renderPrometheusMetric = require('./renderPrometheusMetric');

module.exports = (config) => {
  const app = express();
  
  app.get('/', (req, res) => {
    res.send(`
    <a href="/metrics">/metrics</a> (internal)<br/>
    <a href="/all/metrics">/all/metrics</a><br/>
    `);
  });

  app.get('/metrics', (req, res) => {
    res.set({'Content-Type': 'text/plain'});
    const measures = internalMetricCounter.getLabels().map(labels => {
      return Object.assign({value: internalMetricCounter.get(labels)}, labels)
    })
    res.send(renderPrometheusMetric({
      name: 'http_json_query_exporter_error_count',
      description: 'Number of errors in http json query exporter',
      type: 'counter'
    }, measures))
  })

  app.get('/all/metrics', (req, res) => {
    loadConfig(config.configPath).then(config => {
      Promise.all(config.tasks.map(runTask))
        .then(lines => {
          internalMetricCounter.increment({metric: 'all', state: 'success'})
          res.set({'Content-Type': 'text/plain'});
          res.send(lines.join('\n'));
        })
        .catch(e => {
          internalMetricCounter.increment({metric: 'all', state: 'error'})
          res.status(500).send(e.stack);
        });
    })
      .catch(e => {
        internalMetricCounter.increment({metric: 'all', state: 'error'})
        res.status(500).send(e.stack);
      });
  });
  
  return app;
};

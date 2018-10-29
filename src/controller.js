const express = require('express');
const runTask = require('./runTask');
const loadConfig = require('./loadConfig');

module.exports = (config) => {
  const app = express();
  
  app.get('/', (req, res) => {
    res.send('<a href="/all/metrics">/all/metrics</a>')
  })
  
  app.get('/all/metrics', (req, res) => {
    loadConfig(config.configPath).then(config => {
      Promise.all(config.tasks.map(runTask))
        .then(lines => {
          res.set({'Content-Type': 'text/plain'});
          res.send(lines.join('\n'));
        })
        .catch(e => {
          res.status(500).send(e.stack);
        });
    })
      .catch(e => {
        res.status(500).send(e.stack);
      });
  });
  
  return app;
};

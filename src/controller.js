const express = require('express');
const app = express();
const runTask = require('./runTask');
const loadConfig = require('./loadConfig');

const CONFIG_PATH = process.env.CONFIG_PATH || './example/config.yml';

app.get('/all/metrics', (req, res) => {
  loadConfig(CONFIG_PATH).then(config => {
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

module.exports = app;

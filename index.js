/* eslint-disable no-console */

const controller = require('./src/controller');

const server = controller.listen(8000, () => {
  console.log('Listening on port 8000');
});

const shutdown = (signal, value) => {
  console.log('shutdown!');
  server.close(() => {
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  });
};

// NOTE: SIGKILL signal (9) cannot be intercepted and handled
var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});

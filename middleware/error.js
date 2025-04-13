const logger = require('../startup/logger');

module.exports = function (err, req, res, next) {
  const errorMessage = `
    Error Message: ${err.message}
    Stack Trace: ${err.stack}
    Request: ${req.method} ${req.originalUrl}`;

  logger.error(errorMessage);
  res.status(500).send('Something went wrong.');
};
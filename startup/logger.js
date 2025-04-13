const fs = require('fs');
const path = require('path');
require('express-async-errors');

const logFilePath = path.join(__dirname, '../logfile.log');
const exceptionLogPath = path.join(__dirname, '../uncaughtExceptions.log');

function ensureLogFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }
}
ensureLogFile(logFilePath);
ensureLogFile(exceptionLogPath);

function logToFile(filePath, message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) console.error(`Failed to write to ${filePath}`, err);
  });
}

const logger = {
  info: (message) => {
    console.log(`\x1b[32m[INFO]\x1b[0m ${message}`);
    logToFile(logFilePath, `[INFO] ${message}`);
  },
  error: (message) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
    logToFile(logFilePath, `[ERROR] ${message}`);
  }
};

process.on('uncaughtException', (err) => {
  const message = `Uncaught Exception: ${err.message}\n${err.stack}`;
  logger.error(message);
  logToFile(exceptionLogPath, message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const message = `Unhandled Rejection: ${reason}\n${reason.stack || ''}`;
  logger.error(message);
  throw reason; 
});

module.exports = logger;


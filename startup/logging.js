process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    console.error(err);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    console.error(err);
    process.exit(1);
  });
  
  module.exports = function () {
    console.log('Basic logging initialized...');
  };
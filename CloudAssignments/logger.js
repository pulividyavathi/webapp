const winston = require('winston');
var appRoot = require('app-root-path');
const { createLogger, format, transports } = winston;
 

const logger = createLogger({
  level:'info',
  format: format.json(),
  transports: [
    new transports.File({
 
      filename: "/opt/csyeLogger.log",  
 
    }),
  ],
});

module.exports = logger;

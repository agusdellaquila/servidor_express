const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    transports: [
      new transports.Console({
        level: 'info'
      }),
      new transports.File({
        filename: '../../logs/warn.log',
        level: 'warn'
      }),
      new transports.File({
        filename: '../../logs/error.log',
        level: 'error'
      })
    ],
    format: combine(
      label({
        label: `Label`
      }),
      timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss'
      }),
      prettyPrint()
    )
  })

module.exports = logger
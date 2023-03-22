var log4js = require('log4js')
log4js.configure({
  appenders: {
    all: { type: 'dateFile', filename: 'logs/log', pattern: 'yyyy-MM-dd.log', alwaysIncludePattern: true },
    out: { type: 'console' }
  },
  categories: {
    default: { appenders: ['all', 'out'], level: 'ALL' },
  },
})
module.exports = log4js.getLogger('global')
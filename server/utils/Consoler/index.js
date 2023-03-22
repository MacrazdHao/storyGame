const path = require('path')
var autoLoadFiles = require('../autoLoad')

module.exports = autoLoadFiles({
  dir: path.join(__dirname, '/'),
  useSubDir: true,
  extList: ['.js'],
  iterator: (item, index, pathInfo) => {
    return require(item)
  },
  ignoreFiles: ['index'],
}).js
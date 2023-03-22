
var Consoler = require('../Consoler/index').global
var { devBaseUrl,
  sitBaseUrl,
  uatBaseUrl, testUrl, onlineUrl } = require('./config')

function getService(env) {
  var axios = require('axios')
  let baseURL = ''
  switch (env) {
    case 'dev': baseURL = devBaseUrl; break
    case 'sit': baseURL = sitBaseUrl; break
    case 'uat': baseURL = uatBaseUrl; break
    case 'test': baseURL = testUrl; break
    default: baseURL = onlineUrl; break
  }

  const service = axios.create({
    baseURL,
    timeout: 50000 // request timeout
  })

  service.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  service.interceptors.response.use(
    response => {
      Consoler.info(`${devBaseUrl}：Request Success\n${response}`)
      return Promise.resolve(response)
    },
    error => {
      Consoler.info(`${devBaseUrl}：Request Error\n${error}`)
      return Promise.reject(error)
    }
  )
  return service
}
module.exports = getService

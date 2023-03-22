const path = require('path')
const fs = require('fs')

const Consoler = require('../utils/Consoler')
const webpack = require('webpack')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const webpackConfig = require('@vue/cli-service/webpack.config')
const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

const clientHost = 'localhost'
const clientPort = 9529
const clientPublicPath = '/'

let serverBundle = null
// 监听serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(error => console.error('ERROR:', error))
  stats.warnings.forEach(warn => console.warn('WARN:', warn))
  try {
    const bundlePath = path.join(webpackConfig.output.path, 'vue-ssr-server-bundle.json')
    serverBundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    console.log('vue-ssr-server-bundle.json updated')
  } catch (err) {
    Consoler.global.info(err)
    Consoler.global.info(`path: ${webpackConfig.output.path}`)
  }
})

const { createBundleRenderer } = require('vue-server-renderer')

async function renderToString(context) {
  const clientRes = await axios.get(`http://${clientHost}:${clientPort}${clientPublicPath}vue-ssr-client-manifest.json`)
  // const serverBundle = serverBundle
  const clientManifest = clientRes.data
  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(
      path.resolve(__dirname, '../../src/index.template.html'),
      'utf-8'
    ),
    clientManifest,
    basedir: process.env.PWD
  })
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

const main = async(ctx, next) => {
  if (!serverBundle) {
    ctx.body = 'Wait Compiling...'
    return
  }
  ctx.set('content-type', 'text/html')
  ctx.set('x-powered-by', 'koa/development')
  const context = {
    title: 'ssr mode',
    url: ctx.url
  }
  const html = await renderToString(context)
  ctx.body = html
}

module.exports = main

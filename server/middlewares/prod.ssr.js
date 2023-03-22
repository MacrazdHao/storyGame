const path = require('path')
const fs = require('fs')
const HTTP = require('../utils/request/index')

const { createBundleRenderer } = require('vue-server-renderer')

// 开放dist目录
// app.use(koaStatic(resolve('../../cct/dist/client')))
async function renderToString(context) {
  const serverRes = await HTTP('dev').get('/server')
  const clientRes = await HTTP('dev').get('/client')
  const serverBundle = serverRes.data
  const clientManifest = clientRes.data
  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(
      path.resolve(__dirname, '../../src/index.template.html'),
      'utf-8'
    ),
    clientManifest
  })
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

const main = async(ctx, next) => {
  ctx.set('content-type', 'text/html')
  const context = {
    title: 'ssr mode',
    url: ctx.url
  }
  const html = await renderToString(context)
  ctx.body = html
}

module.exports = main

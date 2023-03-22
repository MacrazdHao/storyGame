const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const HTTP = require('./utils/request/index')
// const webpack = require('webpack')
// const koaWebpack = require('koa-webpack')
// const config = {}
// const complier = webpack(config)
// const middleware = await koaWebpack(complier)
const app = new Koa()
const router = new Router()

// app.use(middleware)

router.get('/test', async ctx => {
  ctx.body = 'this is ssr-server'
})

const resolve = (file) => path.resolve(__dirname, file)
// 开放dist目录
app.use(koaStatic(resolve('../../cct/dist/client')))

// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-renderer')
// const serverBundle = require('../dist/server/vue-ssr-server-bundle.json')
// const clientManifest = require('../dist/client/vue-ssr-client-manifest.json')
// console.log(clientManifest)

async function renderToString(context) {
  const serverRes = await HTTP('dev').get('/server')
  const clientRes = await HTTP('dev').get('/client')
  const serverBundle = serverRes.data
  const clientManifest = clientRes.data
  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(
      path.resolve(__dirname, '../src/index.template.html'),
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

router.get('/', async(ctx, next) => {
  const context = {
    title: 'Hello SSR',
    url: ctx.url
  }
  // 将 context 数据渲染为 HTML
  const html = await renderToString(context)
  ctx.body = html
})

// 第 3 步：添加一个中间件来处理所有请求
// app.use(async(ctx, next) => {
//   console.log(ctx.URL)
//   const context = {
//     title: 'Hello SSR',
//     url: ctx.url
//   }
//   // 将 context 数据渲染为 HTML
//   const html = await renderToString(context)
//   ctx.body = html
// })

// 启用router
app.use(router.routes()).use(router.allowedMethods())
/* 服务启动*/
const port = 3000
app.listen(port, function() {
  console.log(`server started at localhost:${port}`)
})

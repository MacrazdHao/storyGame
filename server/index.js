const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const Consoler = require('./utils/Consoler')
const app = new Koa()
const router = new Router()

// app.use(middleware)

router.get('/test', async ctx => {
  ctx.body = 'this is ssr-server'
})

const resolve = (file) => path.resolve(__dirname, file)
// 开放dist目录
app.use(koaStatic(resolve('../../cct/dist/client')))

Consoler.global.info(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  app.use(require('./middlewares/prod.ssr.js'))
} else {
  app.use(require('./middlewares/static.ssr.js'))
  app.use(require('./middlewares/dev.ssr.js'))
}

// 启用router
app.use(router.routes()).use(router.allowedMethods())
/* 服务启动*/
const port = 3000
app.listen(port, function() {
  console.log(`server started at localhost:${port}`)
})

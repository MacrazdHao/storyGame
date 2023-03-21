1. node koa
2. vue-ssr，及路由管理
3. node与api接口的对接
4. node的数据管理及与页面之间的通讯
5. webpack打包的魔改，生成的文件名需要带上版本号（hash），方便通过config中心发放更新过版本的文件，以此压缩文件加载量
  - 所拉取的文件包括更新过的新版本文件，及新的bundle和mainfest
6. CDN缓存（仅适合静态或较为固定的页面）
7. 服务上的缓存，通过文件落地
8. webpack.config.js 重写，公用部分整合，然后私有的分开写成多个，通过package.json里面来多配置几个script
9. ssr开发的热更新
10. 降级方案：保留index.html，重新运行asyncData方法
11. 日志中心、配置中心的连接方法封装为npm包
12. 将client部分独立出来，并生成简易的本地调试用server.js
13. 开发对应的脚手架，方便创建项目，并封装好webpack和package.json配置
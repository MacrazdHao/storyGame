'use strict'
const path = require('path')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const env = process.env
const isServer = env.RUN_ENV === 'server'

module.exports = {
  publicPath: './',
  outputDir: `dist/${env.RUN_ENV}`,
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 配置跨域
      '/[a-z_]+_login': {
        target: 'http://127.0.0.1:8911', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,
        pathRewrite: {
          '^/[a-z_]+_login': '/'
        }
        //,
        // headers: {
        //   referer: 'https://sit-user-chairside.heygears.com/'
        // }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },

    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/entry-${env.RUN_ENV}.js`,
    devtool: 'eval',
    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
    // 并且还会在编译 Vue 组件时，
    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
    target: isServer ? 'node' : 'web',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    output: {
      libraryTarget: isServer ? 'commonjs2' : undefined
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: isServer
      ? nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。
        // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        allowlist: /\.css$/
      })
      : undefined,
    optimization: { splitChunks: isServer ? false : undefined },
    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 服务端默认文件名为 `vue-ssr-server-bundle.json`
    // 客户端默认文件名为 `vue-ssr-client-manifest.json`
    plugins: [isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  },

  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI',
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}

'use strict'
const path = require('path')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const TimeStamp = new Date().getTime()

const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const env = process.env
const isServer = env.RUN_ENV === 'server'
const isDevEnv = process.env.NODE_ENV === 'development'
const outputDir = !process.env.NODE_ENV || isDevEnv ? 'dist' : `../cct/dist/${env.RUN_ENV}`
console.log(process.env.NODE_ENV, env.RUN_ENV, outputDir)

module.exports = {
  publicPath: './',
  outputDir,
  assetsDir: 'static',
  lintOnSave: isDevEnv,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    // },
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },

    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/entry-${env.RUN_ENV || 'client'}.js`,
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
    optimization: {
      splitChunks: isServer ? false : undefined
    },
    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 服务端默认文件名为 `vue-ssr-server-bundle.json`
    // 客户端默认文件名为 `vue-ssr-client-manifest.json`
    plugins: [
      isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()
    ]
  },

  chainWebpack(config) {
    if (isDevEnv) {
      config.devServer.headers({ 'Access-Control-Allow-Origin': '*' })
    }

    config.output.filename(`static/js/[hash].[name].${TimeStamp}.js`).end()
    config.output.chunkFilename(`static/js/[hash].[name].${TimeStamp}.js`).end()
    const miniCssExtraPlugin = new MiniCssExtractPlugin({
      filename: `static/css/[hash].[name].${TimeStamp}.css`,
      chunkFilename: `static/css/[hash].[name].${TimeStamp}.css`
    })
    config.plugin('mini-css-extract-plugin').use(miniCssExtraPlugin).end()
    config.module.rule('images').use('url-loader').tap(options => {
      options.name = `static/img/[hash].[name].${TimeStamp}.[ext]`
      options.fallback = {
        loader: 'file-loader',
        options: {
          name: `static/img/[hash].[name].${TimeStamp}.[ext]`
        }
      }
      return options
    })

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

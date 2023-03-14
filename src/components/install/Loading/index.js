import Loading from './Loading.vue'

const _Loading = {}

/**
 * Loading参数解析
 * text: Loading文案内容(String)
 * duration: Loading展示时间(Number)  为0时不会自动隐藏
 * callback: Loading消失时执行的回调函数(Function)
 */
const defaultOptions = {
  text: '',
  duration: 3000,
  callback: () => { }
}

// let callback = []
// const runCallback = () => {
//   for (const cb of callback) cb()
//   callback = []
// }

const closeLoading = (cb, ins) => {
  if (!ins) return
  setTimeout(() => {
    ins.$destroy(true)
    document.body.removeChild(ins.$el)
    cb && cb()
  }, 300)
}

let instance = null

_Loading.install = (Vue) => {
  const createLoading = () => {
    const vue = Vue
    const LoadingClass = vue.extend(Loading)
    instance = new LoadingClass()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)
  }

  const LoadingMain = {
    show(options = {}) {
      createLoading()
      const _options = {
        ...defaultOptions, ...options,
        callback: () => {
          closeLoading(options.callback || null, instance)
        }
      }
      instance.showLoading(_options)
    },
    hide() {
      instance.hideLoading()
    }
  }
  Vue.prototype.$grayLoading = LoadingMain
}

export default _Loading

import Alert from './Alert.vue'

const _Alert = {}

/**
 * Alert参数解析
 * text: 提示内容(String)
 * info: 附加内容(String)  可选项：info/success/notify/warn/fail
 * type: 提示类型(String)
 * duration: 提示展示时间(String)
 * canClose: 是否可手动关闭(Boolean)
 * callback: 提示消失回调(String)
 */
const defaultOptions = {
  text: '',
  info: '',
  type: 'info',
  duration: 2000,
  canClose: false,
  callback: () => { }
}

let instance = null

const closeAlertBox = () => {
  setTimeout(() => {
    instance.$destroy(true)
    document.body.removeChild(instance.$el)
    instance = null
  }, 300)
}

_Alert.install = (Vue) => {
  const createMessage = () => {
    const vue = Vue
    const AlertClass = vue.extend(Alert)
    if (!instance) {
      instance = new AlertClass()
      instance.$mount(document.createElement('div'))
      document.body.appendChild(instance.$el)
    }
    return instance
  }

  const AlertMain = {
    showMessage(options) {
      const instance = createMessage()
      const _options = { ...defaultOptions, ...options, id: new Date().getTime() + Math.random() * 1000 }
      instance.addMessage(_options, closeAlertBox)
    },
    info(options) {
      this.showMessage({ ...options, type: 'info' })
    },
    success(options) {
      this.showMessage({ ...options, type: 'success' })
    },
    notify(options) {
      this.showMessage({ ...options, type: 'notify' })
    },
    warn(options) {
      this.showMessage({ ...options, type: 'warn' })
    },
    fail(options) {
      this.showMessage({ ...options, type: 'fail' })
    }
  }
  Vue.prototype.$grayAlert = AlertMain
}

export default _Alert

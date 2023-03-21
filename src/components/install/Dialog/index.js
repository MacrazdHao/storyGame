import Dialog from './Dialog.vue'

const _Dialog = {}

/**
 * Dialog参数解析
 * width: 最小宽度(Number)  单位px
 * title: 标题(String)
 * showTitle: 是否展示标题(Boolean)
 * content: 内容(String)
 * type: 窗体类型(String)  可选项：normal/info/success/warn/fail/hide(隐藏)
 * cancelText: 取消按钮文案(String)
 * confirmText: 确认按钮文案(String)
 * showCancel: 是否显示取消按钮(Boolean)
 * showConfirm: 是否显示确认按钮(Boolean)
 * showClose: 是否显示关闭Icon按钮(Boolean)
 * showShade: 是否显示阴影遮罩(Boolean)
 * enableShadeClose: 是否展示阴影遮罩点击关闭效果(Boolean)
 * popover: 是否为纯文字提示窗(Boolean)
 * popDuration: 纯文字提示窗展示时间(Number)
 * groupName: 同组只展示限制的弹窗个数，与groupMax共用，如果为空则不限制(String)
 * groupMax: 同组展示的弹窗个数上限(Number)
 * callback: 确认按钮回调函数(Function)
 * cancelCallback: 窗体关闭回调函数(Function)
 */
const defaultOptions = {
  width: 360,
  title: '',
  showTitle: true,
  content: '',
  type: 'normal',
  cancelText: '取消',
  confirmText: '确认',
  showCancel: false,
  showConfirm: true,
  showClose: true,
  showShade: true,
  enableShadeClose: false,
  popover: false,
  popDuration: 2000,
  groupName: '',
  groupMax: 1,
  callback: () => { },
  cancelCallback: () => { }
}

const closeDialog = (cb, ins) => {
  setTimeout(() => {
    ins.$destroy(true)
    document.body.removeChild(ins.$el)
    cb()
  }, 300)
}

_Dialog.install = (Vue) => {
  const groupNameObj = {}
  const createMessage = () => {
    const vue = Vue
    const DialogClass = vue.extend(Dialog)
    const instance = new DialogClass()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)
    return instance
  }

  const DialogMain = {
    showMessage(options) {
      const _options = {
        ...defaultOptions, ...options
      }
      if (_options.groupName && groupNameObj[_options.groupName] && groupNameObj[_options.groupName] >= _options.groupMax) return
      if (_options.groupName) {
        groupNameObj[_options.groupName] = groupNameObj[_options.groupName] ? groupNameObj[_options.groupName] + 1 : 1
      }
      const instance = createMessage()
      instance.showMessage({
        ..._options,
        callback() {
          if (_options.groupName) groupNameObj[_options.groupName]--
          closeDialog(_options.callback, instance)
        },
        cancelCallback() {
          if (_options.onlyOne) groupNameObj[_options.groupName]--
          closeDialog(_options.cancelCallback, instance)
        }
      })
    },
    info(options) {
      this.showMessage({ ...options, type: 'info' })
    },
    success(options) {
      this.showMessage({ ...options, type: 'success' })
    },
    warn(options) {
      this.showMessage({ ...options, type: 'warn' })
    },
    fail(options) {
      this.showMessage({ ...options, type: 'fail' })
    },
    popconfirm(options) {
      this.showMessage({ ...options, showTitle: false, showCancel: true, showClose: false })
    },
    popover(options) {
      this.showMessage({ ...options, popover: true })
    }
  }
  Vue.prototype.$grayDialog = DialogMain
}

export default _Dialog

<template>
  <div v-if="showBuffer" class="GhDialog">
    <div
      v-show="showShade && !popover"
      :ref="`${refPrefix}-shade-${refSuffix}`"
      class="dialogShade"
      @click="shadeHandler"
    />
    <div
      :ref="`${refPrefix}-window-${refSuffix}`"
      :class="['dialog', `dialog--${type}`]"
      :style="{ minWidth: `${width}px` }"
    >
      <div v-if="showTitle && !popover" class="dialog-title">
        <slot name="title">
          <p class="dialog-title-text">{{ dialogTitle }}</p>
        </slot>
        <i
          v-if="showClose"
          class="
            grayManagement-iconfont
            icon-a-icon_outline_icon_addto_24px
            dialog-title-closeBtn
          "
          @click="cancelHandler"
        />
      </div>
      <p :class="['dialog-content', popover ? 'dialog-content--popover' : '']">
        <i
          v-if="type !== 'hide'"
          :class="['grayManagement-iconfont', 'dialog-content-icon', iconClass]"
        />
        <slot name="content">
          <pre class="dialog-content-text">{{ content }}</pre>
        </slot>
      </p>
      <div
        v-if="(showCancel || showConfirm) && !popover"
        class="dialog-buttons"
      >
        <div
          v-if="showCancel"
          class="dialog-buttons-item dialog-buttons-cancel"
          @click="cancelHandler"
        >
          {{ relCancelText }}
        </div>
        <div
          v-if="showConfirm"
          :class="[
            'dialog-buttons-item',
            'dialog-buttons-confirm',
            disabledConfirm ? 'dialog-buttons-confirm--disabled' : '',
          ]"
          @click="confirmHandler"
        >
          {{ relConfirmText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * GhDialog参数解析
 * @param show 显示弹窗
 * @param width[Number] 最小宽度，单位px
 * @param title[String] 标题
 * @param showTitle[Boolean] 是否展示标题
 * @param content[String] 内容
 * @param type[String] 窗体类型，可选项：normal/info/success/warn/fail/hide(隐藏)
 * @param cancelText[String] 取消按钮文案
 * @param confirmText[String] 确认按钮文案
 * @param showCancel[Boolean] 是否显示取消按钮
 * @param showConfirm[Boolean] 是否显示确认按钮
 * @param disabledConfirm[Boolean] 是否禁用确认按钮
 * @param dontHideWhenConfirm[Boolean] 确认按钮是否不触发窗口关闭行为
 * @param showClose[Boolean] 是否显示关闭Icon按钮
 * @param showShade[Boolean] 是否显示阴影遮罩
 * @param enableShadeClose[Boolean] 是否展示阴影遮罩点击关闭效果
 * @param popover[Boolean] 是否为纯文字提示窗
 * @param popDuration[Number] 纯文字提示窗展示时间
 * @param hide[Function] 窗体关闭回调函数
 * @param confirm[Function] 确认按钮回调函数
 * @param cancel[Function] 取消按钮回调函数
 */
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 360
    },
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'normal'
    },
    cancelText: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: ''
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    disabledConfirm: {
      type: Boolean,
      default: false
    },
    dontHideWhenConfirm: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showShade: {
      type: Boolean,
      default: true
    },
    enableShadeClose: {
      type: Boolean,
      default: false
    },
    popover: {
      type: Boolean,
      default: false
    },
    popDuration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      showBuffer: false
    }
  },
  computed: {
    relCancelText() {
      return this.cancelText || this.$t('gray.cancelBtn')
    },
    relConfirmText() {
      return this.confirmText || this.$t('gray.confirmBtn')
    },
    refPrefix() {
      return 'GhDialog-'
    },
    refSuffix() {
      return new Date().getTime() + Math.random() * 1000
    },
    dialogTitle() {
      if (this.title) return this.title
      else {
        switch (this.type) {
          case 'normal':
            return this.$t('gray.dialog_normal')
          case 'info':
            return this.$t('gray.dialog_info')
          case 'success':
            return this.$t('gray.dialog_success')
          case 'warn':
            return this.$t('gray.dialog_warn')
          case 'fail':
            return this.$t('gray.dialog_fail')
          default:
            return this.$t('gray.dialog_default')
        }
      }
    },
    iconClass() {
      switch (this.type) {
        case 'success':
          return 'icon-icon_filled-circle_success'
        case 'info':
          return 'icon-icon_filled-circle_warn'
        case 'warn':
          return 'icon-icon_filled-circle_warn'
        case 'fail':
          return 'icon-icon_filled-circle_failed'
        default:
          return ''
      }
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.showBuffer = true
        setTimeout(() => {
          this.showMessage()
        }, 10)
      } else {
        this.closeWindow()
      }
    }
  },
  mounted() {
    if (this.show) {
      this.showBuffer = true
      setTimeout(() => {
        this.showMessage()
      }, 10)
    }
  },
  methods: {
    shadeHandler() {
      if (this.enableShadeClose) this.cancelHandler()
    },
    showMessage(options) {
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dWindow = this.$refs[`${this.refPrefix}-window-${this.refSuffix}`]
      setTimeout(() => {
        dShade.style.opacity = 1
      })
      setTimeout(() => {
        dWindow.style.opacity = 1
        // dWindow.style.transform = 'translate(-50%, -50%)'
        dWindow.style.transform = 'translate(-50%, -50%) scale(1)'
        dWindow.style.filter = 'none'
        if (this.popover) {
          setTimeout(this.cancelHandler, this.popDuration)
        }
      }, 100)
    },
    closeWindow() {
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dWindow = this.$refs[`${this.refPrefix}-window-${this.refSuffix}`]
      dWindow.style.opacity = 0
      // dWindow.style.transform = 'translate(-50%, -70%)'
      dWindow.style.transform = 'translate(-50%, -53%) scale(1.03)'
      dWindow.style.filter = 'blur(2px)'
      setTimeout(() => {
        dShade.style.opacity = 0
        setTimeout(() => {
          this.$emit('hide')
        }, 100)
      }, 100)
      setTimeout(() => {
        this.showBuffer = false
      }, 300)
    },
    confirmHandler() {
      if (this.disabledConfirm) return
      this.$emit('confirm')
      if (!this.dontHideWhenConfirm) this.closeWindow()
    },
    cancelHandler() {
      this.$emit('cancel')
      this.closeWindow()
    }
  }
}
</script>

<style lang="scss" scoped>
.GhDialog {
  .dialogShade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    transition: 0.2s all;
    opacity: 0;
  }
  .dialog {
    padding: 14px 20px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0px 4px 16px rgba(147, 152, 196, 0.2);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -53%) scale(1.03);
    transform-origin: 50% 50%;
    z-index: 9999;
    transition: 0.25s opacity ease-in-out, 0.2s transform ease-in-out, 0.25s filter ease-in-out;
    filter: blur(2px);
    opacity: 0;
    max-width: calc(100% - 200px);
    width: fit-content;
    max-height: calc(100% - 260px);
    &-title {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      &-text {
        max-width: calc(100% - 32px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 16px;
        line-height: 24px;
        color: #121314;
      }
      &-closeBtn {
        font-size: 20px;
        transform: rotateZ(45deg);
        cursor: pointer;
      }
    }
    &-content--popover {
      margin-top: 0 !important;
    }
    &-content {
      display: inline-flex;
      font-size: 14px;
      line-height: 22px;
      color: #121314;
      overflow: auto;
      margin-top: 4px;
      &-icon {
        font-size: 20px;
        margin-right: 6px;
      }
    }
    &-buttons {
      width: 100%;
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      .dialog-buttons-item + .dialog-buttons-item {
        margin-left: 12px;
      }
      &-item {
        min-width: 80px;
        height: 36px;
        line-height: 34px;
        text-align: center;
        border-width: 1px;
        transition: 0.2s all;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
      }
      &-cancel {
        background-color: #ffffff00;
        border-color: #babdcc;
        border-style: solid;
        color: #121314;
      }
      .dialog-buttons-cancel:hover {
        background-color: #ffffff00;
        border-color: #5c87ff;
        color: #5c87ff !important;
      }
      .dialog-buttons-cancel:active {
        background-color: #f0f6ff;
        border-color: #284ac1;
        color: #5c87ff !important;
      }
      &-confirm {
        background-color: #3760ea;
        border-color: #3760ea;
        border-style: solid;
        color: #fff;
      }
      &-confirm--disabled {
        background-color: #b9d0fd !important;
        border-color: #b9d0fd !important;
      }
      .dialog-buttons-confirm:hover {
        background-color: #5c87ff;
        border-color: #5c87ff;
      }
      .dialog-buttons-confirm:active {
        background-color: #284ac1;
        border-color: #284ac1;
      }
    }
  }
  .dialog--normal {
    .dialog-content-icon {
      display: none;
    }
  }
  .dialog--info {
    .dialog-content-icon {
      color: #696c80;
    }
  }
  .dialog--success {
    .dialog-content-icon {
      color: #52b833;
    }
  }
  .dialog--warn {
    .dialog-content-icon {
      color: #f0983a;
    }
  }
  .dialog--fail {
    .dialog-title {
      &-text {
        font-weight: 700;
      }
    }
    .dialog-content-icon {
      color: #d13532;
    }
  }
}

.dialog-content {
  word-break: break-all;
}
</style>

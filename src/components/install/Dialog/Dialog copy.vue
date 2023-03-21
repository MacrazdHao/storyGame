<template>
  <div class="Dialog">
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
        <p class="dialog-title-text">{{ dialogTitle }}</p>
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
        <pre class="dialog-content">{{ content }}</pre>
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
          {{ cancelText }}
        </div>
        <div
          v-if="showConfirm"
          class="dialog-buttons-item dialog-buttons-confirm"
          @click="confirmHandler"
        >
          {{ confirmText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 360,
      title: '',
      showTitle: true,
      content: '',
      type: 'normal',
      cancelText: this.$t('knctr.cancelBtn'),
      confirmText: this.$t('knctr.confirmBtn'),
      showCancel: false,
      showConfirm: true,
      showClose: true,
      showShade: true,
      enableShadeClose: false,
      popover: false,
      popDuration: 2000,
      callback: () => {},
      cancelCallback: () => {}
    }
  },
  computed: {
    refPrefix() {
      return 'Dialog-'
    },
    refSuffix() {
      return new Date().getTime() + Math.random() * 1000
    },
    dialogTitle() {
      if (this.title) return this.title
      else {
        switch (this.type) {
          case 'normal':
            return this.$t('knctr.dialog_normal')
          case 'info':
            return this.$t('knctr.dialog_info')
          case 'success':
            return this.$t('knctr.dialog_success')
          case 'warn':
            return this.$t('knctr.dialog_warn')
          case 'fail':
            return this.$t('knctr.dialog_fail')
          default:
            return this.$t('knctr.dialog_default')
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
  methods: {
    shadeHandler() {
      if (this.enableShadeClose) this.cancelHandler()
    },
    showMessage(options) {
      for (const key in options) {
        this[key] = options[key]
      }
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dWindow = this.$refs[`${this.refPrefix}-window-${this.refSuffix}`]
      setTimeout(() => {
        dShade.style.opacity = 1
      })
      setTimeout(() => {
        dWindow.style.opacity = 1
        dWindow.style.transform = 'translate(-50%, -50%)'
        if (this.popover) {
          setTimeout(this.cancelHandler, this.popDuration)
        }
      }, 100)
    },
    closeWindow(cb) {
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dWindow = this.$refs[`${this.refPrefix}-window-${this.refSuffix}`]
      dWindow.style.opacity = 0
      dWindow.style.transform = 'translate(-50%, -70%)'
      setTimeout(() => {
        dShade.style.opacity = 0
        setTimeout(cb, 100)
      }, 100)
    },
    confirmHandler() {
      this.closeWindow(this.callback())
    },
    cancelHandler() {
      this.closeWindow(this.cancelCallback())
    }
  }
}
</script>

<style lang="scss" scoped>
.Dialog {
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
    transform: translate(-50%, -60%);
    z-index: 9999;
    transition: 0.3s all ease;
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

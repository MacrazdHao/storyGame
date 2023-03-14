<template>
  <div id="AlertBox" class="Alert">
    <div
      v-for="(item, index) in messages"
      :id="`${alertdomIdPrefix}${index}-${item.id}`"
      :key="index"
      :class="['alert-item', `alert-item--${item.type}`]"
    >
      <div class="alert-item-main">
        <i
          :class="[
            'grayManagement-iconfont',
            'alert-item-main-icon',
            getIconClass(item.type),
          ]"
        />
        <p class="alert-item-main-text">{{ item.text }}</p>
        <i
          v-if="item.canClose"
          class="
            grayManagement-iconfont
            icon-a-icon_outline_icon_addto_24px
            alert-item-main-closeBtn
          "
          @click="closeAlert(index)"
        />
      </div>
      <p v-if="item.info" class="alert-item-info">{{ item.info }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /** messages item
        text: '',
        info: '',
        type: 'info/success/notify/warn/fail',
        duration: 2000,
        canClose: false,
        callback: () => { }
      */
      messages: [],
      alertTimer: [],
      clearTimer: null,
      closeAlertBox: () => {}
    }
  },
  computed: {
    alertdomIdPrefix() {
      return 'alert-item-'
    }
  },
  methods: {
    clearMessages() {
      if (this.clearTimer) clearTimeout(this.clearTimer)
      this.clearTimer = setTimeout(() => {
        const msg = this.messages.filter((item) => {
          return !item.hide
        })
        if (msg.length === 0) {
          this.messages = msg
          this.closeAlertBox()
        } else this.clearMessages()
      }, 3000)
    },
    closeAlert(msgIndex) {
      setTimeout(() => {
        const alert = document.getElementById(
          `${this.alertdomIdPrefix}${msgIndex}-${this.messages[msgIndex].id}`
        )
        alert.style.display = 'none'
        this.messages[msgIndex].callback()
        this.$set(this.messages, msgIndex, {
          ...this.messages[msgIndex],
          hide: true
        })
        this.clearMessages()
      }, 300)
    },
    getIconClass(type) {
      switch (type) {
        case 'info':
          return 'icon-icon_filled-circle_warn'
        case 'success':
          return 'icon-icon_filled-circle_success'
        case 'notify':
          return 'icon-icon_filled-circle_warn'
        case 'warn':
          return 'icon-icon_filled-circle_warn'
        case 'fail':
          return 'icon-icon_filled-circle_failed'
        default:
          return ''
      }
    },
    addMessage(option, closeAlertBox = () => {}) {
      this.messages.push(option)
      this.closeAlertBox = closeAlertBox
      const index = this.messages.length - 1
      this.$nextTick(() => {
        setTimeout(() => {
          const alert = document.getElementById(
            `${this.alertdomIdPrefix}${index}-${option.id}`
          )
          alert.style.opacity = 1
          // alert.style.transform = 'translateY(0%)'
          alert.style.marginTop = index === 0 ? '0' : '16px'
          this.alertTimer.push(
            setTimeout(() => {
              alert.style.opacity = 0
              // alert.style.transform = 'translateY(-100%)'
              alert.style.marginTop = '-40px'
              this.closeAlert(index)
            }, option.duration)
          )
        }, 10)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Alert {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s all;
  pointer-events: none;
  .alert-item--info {
    background-color: #f7f7f8;
    border: 1px solid #121314;
    .alert-item-main-icon {
      color: #121314;
    }
  }
  .alert-item--success {
    background-color: #f3faf1;
    border: 1px solid #52b833;
    .alert-item-main-icon {
      color: #52b833;
    }
  }
  .alert-item--notify {
    background-color: #f4fcff;
    border: 1px solid #439dfc;
    .alert-item-main-icon {
      color: #439dfc;
    }
  }
  .alert-item--warn {
    background-color: #fef8f1;
    border: 1px solid #f0983a;
    .alert-item-main-icon {
      color: #f0983a;
    }
  }
  .alert-item--fail {
    background-color: #fef7f7;
    border: 1px solid #d13532;
    .alert-item-main-icon {
      color: #d13532;
    }
  }
  // .alert-item + .alert-item {
  //   margin-top: 16px;
  // }
  .alert-item {
    min-width: 320px;
    // max-width: 520px;
    width: fit-content;
    padding: 16px 22px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    opacity: 0;
    margin-top: -40px;
    // transform: translateY(-100%);
    transition: 0.3s all;
    pointer-events: auto;
    &-main {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &-icon {
        font-size: 20px;
        color: #121314;
      }
      &-text {
        width: 100%;
        text-align: left;
        margin-left: 10px;
      }
      &-closeBtn {
        font-size: 20px;
        transform: rotateZ(45deg);
        cursor: pointer;
      }
    }
    &-info {
      width: 100%;
      margin-top: 14px;
      margin-left: 30px;
      font-size: 14px;
      line-height: 22px;
      color: #121314;
    }
  }
}
</style>

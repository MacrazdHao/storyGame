<template>
  <div class="Dialog">
    <GhDialog
      :show="true"
      :width="width"
      :title="title"
      :show-title="showTitle"
      :content="content"
      :type="type"
      :cancel-text="cancelText"
      :confirm-text="confirmText"
      :show-cancel="showCancel"
      :show-confirm="showConfirm"
      :show-close="showClose"
      :show-shade="showShade"
      :enable-shade-close="enableShadeClose"
      :popover="popover"
      :pop-duration="popDuration"
      @confirm="confirmHandler"
      @cancel="cancelHandler"
    />
  </div>
</template>

<script>
import GhDialog from '../../GhDialog.vue'
export default {
  components: {
    GhDialog
  },
  data() {
    return {
      width: 360,
      title: '',
      showTitle: true,
      content: '',
      type: 'normal',
      cancelText: this.$t('gray.cancelBtn'),
      confirmText: this.$t('gray.confirmBtn'),
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
  methods: {
    showMessage(options) {
      for (const key in options) {
        this[key] = options[key]
      }
    },
    closeWindow(cb) {
      cb()
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
</style>

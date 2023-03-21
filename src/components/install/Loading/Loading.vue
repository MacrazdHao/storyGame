<template>
  <div class="Loading">
    <div :ref="`${refPrefix}-shade-${refSuffix}`" class="loadingShade" />
    <div :ref="`${refPrefix}-loading-${refSuffix}`" class="loadingTips">
      <i class="grayManagement-iconfont icon-import loadingAnim" />
      <p>{{ $t("knctr.loadingTips") }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      duration: 3000,
      callback: () => {}
    }
  },
  computed: {
    refPrefix() {
      return 'Loading-'
    },
    refSuffix() {
      return new Date().getTime() + Math.random() * 1000
    }
  },
  methods: {
    showLoading(options) {
      for (const key in options) {
        this[key] = options[key]
      }
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dLoading =
        this.$refs[`${this.refPrefix}-loading-${this.refSuffix}`]
      setTimeout(() => {
        dShade.style.opacity = 1
        dLoading.style.opacity = 1
        if (this.duration > 0) {
          setTimeout(this.hideLoading, this.duration)
        }
      })
    },
    hideLoading() {
      const dShade = this.$refs[`${this.refPrefix}-shade-${this.refSuffix}`]
      const dLoading =
        this.$refs[`${this.refPrefix}-loading-${this.refSuffix}`]
      dLoading.style.opacity = 0
      dShade.style.opacity = 0
      setTimeout(this.callback, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.Loading {
  .loadingShade {
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
  .loadingAnim {
    animation: rotate 0.5s linear infinite;
    font-size: 50px;
    width: fit-content;
    color: #121314;
    transform-origin: 24px 24px;
  }
  @-webkit-keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loadingTips {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: 0.3s all ease;
    opacity: 0;
    p {
      color: #121314;
      font-size: 16px;
      margin-top: 8px;
    }
  }
}
</style>

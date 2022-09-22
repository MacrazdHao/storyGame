<template>
  <div class="Maker">
    <div class="formBox"></div>
    <div class="previewBox"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mainTypeOptions: ['default', 'certain', 'passive'],
      mainType: '',
      optionTypeOptions: ['none', 'single', 'multiple'],
      optionType: '',
      isPr: false,
      isBinding: false,
      eventObj: {
        text: '',
        times: '',
        timesOfUnit: '',
        curTimesOfUnit: '',
        triggerConditions: '',
        execNormalDefaultWhenMismatchConditions: '',
        effectAttr: '',
        effectEvents: '',
        prEventsExtraWeight: '',
        extraRandomEvents: '',
        normalDefault: ''
      }
    }
  },
  watch: {
    mainType () {
      this.eventObj = { ...this.eventObj }
    },
    optionType () {
      this.eventObj = { ...this.eventObj }
    },
    isPr () {
      this.eventObj = { ...this.eventObj }
    },
    isBinding () {
      this.eventObj = { ...this.eventObj }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.Maker {
}
</style>

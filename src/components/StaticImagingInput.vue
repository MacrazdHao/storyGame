// 通用固定选项数据自动联想输入框
<template>
  <GhInput
    class="StaticImagingInput"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="keyword"
    :has-selections="true"
    :only-selector="false"
    :selection-data="relOptions"
    @select="selectOption"
    @input="handleInput"
  />
</template>

<script>
import GhInput from '../../../components/GhInput.vue'
export default {
  components: {
    GhInput
  },
  // value必填，否则v-for该输入框时，当数组发生改变，输入框的内容会出现错误或错乱
  props: ['value', 'placeholder', 'optionsData', 'keywordToValue', 'disabled'],
  data() {
    return {
      keyword: '',
      selectedOptionIndex: -1
    }
  },
  computed: {
    indexOptions() {
      return this.optionsData.map((item, index) => ({ ...item, index }))
    },
    relOptions() {
      if (!this.keyword) return this.indexOptions
      return this.indexOptions.filter((item) => {
        if (item.text.indexOf(this.keyword) > -1) {
          return true
        }
        if (item.value.indexOf(this.keyword) > -1) {
          return true
        }
        return false
      })
    }
  },
  watch: {
    value() {
      this.keyword = this.value
    }
  },
  mounted() {
    this.keyword = this.value
  },
  methods: {
    selectOption(index, item) {
      this.selectedOptionIndex = item.index
      this.keyword = item.text
      this.$emit('select', item.value)
    },
    handleInput(text, fromSelect = false) {
      if (!fromSelect) this.selectedOptionIndex = -1
      this.keyword = text
      if (!this.keywordToValue) this.$emit('select', '')
      else this.$emit('select', text)
    }
  }
}
</script>

<style lang="scss" scoped>
.StaticImagingInput {
}
</style>

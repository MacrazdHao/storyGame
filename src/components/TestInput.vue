<template>
  <GhInput
    placeholder="【测试】请选择选项"
    :value="keyword"
    :has-selections="true"
    :selection-data="selectionData"
    :is-cascade="true"
    @input="
      (text) => {
        ruleIndex = [];
        keyword = text;
      }
    "
    @select="handleSelect"
    @selectionInitData="initRuleSelectorData"
  />
</template>

<script>
import GhInput from './GhInput.vue'
const getTestChildren = () => {
  return new Array(Math.floor(Math.random() * 20 + 1)).fill(null).map(() => {
    const val = Math.floor(Math.random() * 10000) + 1
    return {
      text: `测试级联项【${val}】`,
      value: val
    }
  })
}
const createCascadeData = (arr, lev = 0) => {
  return arr.map(item => {
    const hasCascade = lev < 4 ? Math.floor(Math.random() * 2) : 0
    const newItem = { ...item }
    if (hasCascade) {
      newItem.children = createCascadeData(getTestChildren(), lev + 1)
      newItem.text = `[c]${newItem.text}`
    }
    return newItem
  })
}
export default {
  components: {
    GhInput
  },
  data () {
    return {
      keyword: '',
      indexes: [],
      selectionData: createCascadeData([{
        text: 'option-1',
        value: 1
      }, {
        text: 'option-2',
        value: 2
      }, {
        text: 'option-3',
        value: 3
      }])
    }
  },
  computed: {

  },
  methods: {
    initRuleSelectorData () {
      // do sth
    },
    handleSelect (indexes, item) {
      console.log('TestInput ===> ', indexes)
      this.indexes = indexes
    }
  }
}
</script>

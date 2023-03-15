<template>
  <div
    :ref="GhInputId"
    v-clickoutside="handleBlur"
    :class="[
      'GhInput',
      readOnly ? 'GhInput--readonly' : '',
      disabled ? 'GhInput--disabled' : '',
      isFocus && !disabled ? 'GhInput--focus' : '',
      onlySelector ? 'GhInput--selector' : '',
    ]"
    @click="toggleSelector"
  >
    <img v-if="relPrefixIcon" class="prefixIcon" :src="relPrefixIcon">
    <input
      :ref="`input-${time}`"
      :placeholder="placeholder || ''"
      :disabled="!!disabled"
      :readonly="!!readonly || onlySelector"
      :maxlength="maxLength"
      :type="inputType || 'text'"
      :max="maxNumber"
      :min="minNumber"
      :value="value"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keydown="handleEnter"
    >
    <p v-if="showLength && maxLength" class="length">
      {{ value.length }}/{{ maxLength }}
    </p>
    <img
      v-if="canCopy && type !== 'password'"
      class="copyButton rightButton"
      src="../assets/icon_copy.svg"
      @click="copyValue"
    >
    <img
      v-if="watchPassword && type === 'password'"
      class="watchButton rightButton"
      :src="watchPasswordIcon"
      @click="togglePassword"
    >
    <div v-if="showClear" class="clearButton" @click="clearValue">
      <span> × </span>
    </div>
    <div v-if="hasSuffix" class="suffix">
      <slot name="suffix" />
    </div>
    <img
      v-if="hasSelections && onlySelector"
      :class="[
        'selectorIcon',
        relShowSelectionBox ? 'selectorIcon--show' : 'selectorIcon--hide',
      ]"
      :src="require(`../assets/icon_down${disabled ? '_selected' : ''}.svg`)"
    >
    <!-- selections @scroll="handleScroll" -->
    <div
      v-if="hasSelections"
      ref="selectionBox"
      class="selectionBox"
      @mousedown="prevScrollerClick"
    >
      <div
        v-show="relShowSelectionBox || animToggle"
        :ref="`selectionBox-${time}`"
        class="selectionBox-inner"
        :style="relSelectionBoxStyle"
        @scroll="handleScroll"
      >
        <div
          v-if="!relSelectionTips || (selectionData && selectionData.length)"
          :class="[
            'selectionBox-inner-itemBox',
            `selectionBox-inner-itemBox-${time}`,
          ]"
        >
          <div
            v-for="(item, index) in selectionData"
            :key="`selectionItem-${time}-${index}`"
            :class="[
              'selectionBox-inner-item',
              `selectionItem-${time}`,
              item.disabled && value !== item[relSelectionTextKey]
                ? 'selectionBox-inner-item--disabled'
                : '',
              selectionItemBorder ? 'selectionBox-inner-item--border' : '',
              cascadePath[0] === index
                ? 'selectionBox-inner-item--selecting'
                : '',
              selectedCascadePath[0] === index
                ? 'selectionBox-inner-item--selected'
                : '',
            ]"
            @click="handleSelect(index, item, 1)"
          >
            <slot :slot-scope="item" name="selectionItem">
              <p
                class="selectionBox-inner-item-text"
                :title="item[relSelectionTextKey]"
              >
                {{ item[relSelectionTextKey] }}
              </p>
              <p
                v-if="isCascade && item.children"
                class="selectionBox-inner-item-icon"
              >
                <!-- 此处用了element的【>】图标，可替换为自己的 -->
                <i class="el-icon-arrow-right" />
              </p>
            </slot>
          </div>
        </div>
        <template v-if="isCascade && cascadeData.length">
          <div
            v-for="(cascade, cIndex) in cascadeData"
            :key="cIndex"
            :class="[
              'selectionBox-inner-itemBox',
              `selectionBox-inner-itemBox-${time}`,
            ]"
          >
            <div
              v-for="(item, index) in cascade"
              :key="`selectionItem-${time}-${index}`"
              :class="[
                'selectionBox-inner-item',
                'selectionBox-inner-item--cascadeItem',
                `selectionItem-${time}-cascade`,
                item.disabled && value !== item[relSelectionTextKey]
                  ? 'selectionBox-inner-item--disabled'
                  : '',
                selectionItemBorder ? 'selectionBox-inner-item--border' : '',
                cascadePath[cIndex + 1] === index
                  ? 'selectionBox-inner-item--selecting'
                  : '',
                item.selected ? 'selectionBox-inner-item--selected' : '',
              ]"
              @click="handleSelect(index, item, cIndex + 2)"
            >
              <slot :slot-scope="item" :name="`cascadeItem-${cIndex}`">
                <p
                  class="selectionBox-inner-item-text"
                  :title="item[relSelectionTextKey]"
                >
                  {{ item[relSelectionTextKey] }}
                </p>
                <p
                  v-if="isCascade && item.children"
                  class="selectionBox-inner-item-icon"
                >
                  <!-- 此处用了element的【>】图标，可替换为自己的 -->
                  <i class="el-icon-arrow-right" />
                </p>
              </slot>
            </div>
          </div>
        </template>
        <p
          v-if="relSelectionTips"
          class="selectionBox-inner-tips"
          :style="{ lineHeight: '34px' }"
        >
          {{ relSelectionTips }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * GhInput参数解析
 * @param value[String|Number|Null] 输入框value
 * @param prefixIcon[String(ImageModule)] 左侧Icon，为require的图片资源
 * @param hidePrefixIcon[Boolean] 是否隐藏前置(输入框左侧)Icon
 * @param placeholder[String] 输入框提示语(placeholder)
 * @param disabled[Boolean] 是否禁用输入框
 * @param readonly[Boolean] 是否只读输入框
 * @param maxLength[Number] 最大内容长度
 * @param showLength[Number] 是否显示内容长度
 * @param type[String] 输入框类型(原生input属性)
 * @param watchPassword[Boolean] 是否开启密码显示按钮
 * @param maxNumber[Number] 最大数值(仅type=number时起效)
 * @param minNumber[Number] 最小数值(仅type=number时起效)
 * @param canCopy[Boolean] 是否开启内容复制按钮
 * @param copyTips[Boolean] 复制成功提示
 * @param copyErrTips[String] 复制失败提示
 * @param showClear[Boolean] 是否显示清空内容按钮
 * @param hasSuffix[Boolean] 是否拥有后置(输入框右侧)内容
 * @param hasSelections[Boolean] 是否拥有可选项
 * @param isCascade[Boolean] 是否开启级联选项模式
 * @param selectionBoxMaxWidth[String] 选项下拉框的最大宽度
 * @param selectionItemBorder[Boolean] 每个选项是否需要分割线
 * @param onlySelector[Boolean] 是否仅启动选择功能（该属性为true时会禁用输入功能）
 * @param selectionData[Array({[TextKey||text]: String, disabled: Boolean, disabledCallback: Function, ...}]) 选项数据
 * @param selectionTextKey[String] 选项数据中单项的所需展示的文案内容对应Key值（默认为text）
 * @param selectionCascadeKey[String] 级联选项对应的Key值（默认为children）
 * @param selectionLoading[Boolean] 选项数据是否正在加载
 * @param selectionError[Boolean] 选项数据是否发生加载错误
 * @param selectionLoadingTips[String] 选项数据加载提示语
 * @param selectionErrorTips[String] 选项数据加载错误提示语
 * @param selectionEmptyTips[String] 选项数据为空提示语
 * @param selectionHideWhenNoKey[Boolean] 是否在value为空时隐藏选择框(onlySelector=true时不生效)
 * @param selectionNumOfPage[Number] 选项数据列表的第一页展示选项数
 * @param cascadeMinHeight[Number] 级联菜单最小高度，默认为120px，优先级低于selectionNumOfPage（当首级selectionNumOfPage导致的高度高于cascadeMinHeight时，以前者为准）
 * @function input(text, fromSelect) 输入回调函数，参数：[text-输入的内容][fromSelect-内容变更是否来自选择选项]
 * @function focus() 聚焦回调函数，onlySelector模式下不执行
 * @function blur() 失焦回调函数
 * @function clear() 清空内容按钮回调函数
 * @function enter() 键盘Enter按键(keycode===13)的回调函数
 * @function selectionInitData() 初始化选项列表的函数
 * @function select(index, item) 选择选项的回调函数，参数：[index-选项序号][item-选项对象]
 * @function selectionLoadMore() 滚动到选项列表底部时的回调函数，一般于选项滚动翻页
 */
import Clickoutside from './utilsFromElement/clickoutside'
export default {
  directives: { Clickoutside },
  props: {
    value: {
      type: [String, Number, null],
      default: ''
    },
    prefixIcon: {
      type: String,
      default: null
    },
    hidePrefixIcon: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: Infinity
    },
    type: {
      type: String,
      default: 'text'
    },
    watchPassword: {
      type: Boolean,
      default: false
    },
    maxNumber: {
      type: Number,
      default: 0
    },
    minNumber: {
      type: Number,
      default: 0
    },
    canCopy: {
      type: Boolean,
      default: false
    },
    copyTips: {
      type: String,
      default: ''
    },
    copyErrTips: {
      type: String,
      default: ''
    },
    showLength: {
      type: Boolean,
      default: false
    },
    showClear: {
      type: Boolean,
      default: false
    },
    hasSuffix: {
      type: Boolean,
      default: false
    },
    // 自动联想选择框参数：
    // (包含事件：selectionInitData, selectionLoadMore, select)
    hasSelections: {
      type: Boolean,
      default: false
    },
    isCascade: {
      type: Boolean,
      default: false
    },
    selectionBoxMaxWidth: {
      type: String,
      default: ''
    },
    selectionItemBorder: {
      type: Boolean,
      default: false
    },
    onlySelector: {
      type: Boolean,
      default: false
    },
    selectionData: {
      type: Array,
      default: () => []
    },
    selectionTextKey: {
      type: String,
      default: ''
    },
    selectionCascadeKey: {
      type: String,
      default: ''
    },
    selectionLoading: {
      type: Boolean,
      default: false
    },
    selectionError: {
      type: Boolean,
      default: false
    },
    selectionLoadingTips: {
      type: String,
      default: ''
    },
    selectionErrorTips: {
      type: String,
      default: ''
    },
    selectionEmptyTips: {
      type: String,
      default: ''
    },
    selectionHideWhenNoKey: {
      type: Boolean,
      default: false
    },
    selectionNumOfPage: {
      type: Number,
      default: 0
    },
    cascadeMinHeight: {
      type: Number,
      default: 168
    }
  },
  data() {
    return {
      time: Math.random().toString(36).slice(2),
      isFocus: false,
      showingPassword: false,
      // selections的隐藏标志在animToggle为false时才会生效
      animToggle: false,
      relSelectionBoxStyle: {
        height: 0,
        opacity: 0,
        padding: 0
      },
      selectedItem: false,
      transformOrigin: 'center bottom',

      cascadePath: [],
      isSelectCascade: false,
      blurTimer: null,
      isClickSelectionBox: false,
      selectedCascadePath: []
    }
  },
  computed: {
    GhInputId() {
      return `GhInput--${this.time}`
    },
    readOnly() {
      return this.readonly
    },
    // 自动建议选择框中，单项的文字key值：
    relSelectionTextKey() {
      return this.selectionTextKey || 'text'
    },
    relSelectionLoadingTips() {
      return this.selectionLoadingTips || '检索中...'
    },
    relSelectionEmptyTips() {
      return this.selectionErrorTips || '暂无符合条件的选项'
    },
    relSelectionErrorTips() {
      return this.selectionErrorTips || '检索失败，请重试'
    },
    relSelectionTips() {
      if (!this.hasSelections) return false
      if (this.selectionError) return this.relSelectionErrorTips
      if (this.selectionLoading) return this.relSelectionLoadingTips
      if (this.selectionData.length === 0) return this.relSelectionEmptyTips
      return false
    },
    relShowSelectionBox() {
      if (!this.hasSelections || this.disabled || this.readonly) return false
      if (!this.onlySelector && this.selectionHideWhenNoKey && !this.value) {
        return false
      }
      return this.isFocus
    },
    relSelectionNumOfPage() {
      return this.selectionNumOfPage || 5
    },
    selectionBoxStyle() {
      if (!this.hasSelections || !this.relShowSelectionBox) {
        return {
          // height: 0,
          height: `${this.relHeight()}px`,
          opacity: 0,
          transform: 'scaleY(0)',
          overflowY: 'hidden',
          transformOrigin: this.transformOrigin
        }
      }
      const commonStyle = {
        opacity: 1,
        transform: 'scaleY(1)',
        padding: '4px 0',
        overflowY: 'hidden',
        transformOrigin: this.transformOrigin
      }
      if (this.selectionData.length === 0 && this.relSelectionTips) {
        return {
          ...commonStyle,
          height: '42px',
          overflowY: 'hidden'
        }
      }
      // if (this.relSelectionTips) relHeight += 42
      // const singleItems = document.getElementsByClassName(
      //   `selectionItem-${this.time}`
      // )
      return {
        ...commonStyle,
        height: `${this.relHeight()}px`
        // overflowY:
        //   this.relSelectionNumOfPage >= singleItems.length ? 'hidden' : 'auto'
      }
    },

    relPrefixIcon() {
      if (this.hidePrefixIcon) return false
      if (this.prefixIcon) return this.prefixIcon
      return this.hasSelections && !this.onlySelector
        ? require('../assets/icon_search.svg')
        : false
    },
    watchPasswordIcon() {
      if (this.inputType === 'password') {
        return require('../assets/icon_hide.svg')
      }
      return require('../assets/icon_view.svg')
    },
    inputType() {
      if (this.type === 'password') {
        return this.showingPassword ? 'text' : 'password'
      }
      return this.type
    },

    relShowCascadeBox() {
      return this.cascadeData.length
    },
    selectedCascadePaths() {
      const paths = []
      let pathStr = ''
      for (let i = 0; i < this.selectedCascadePath.length; i++) {
        pathStr += `${this.selectedCascadePath[i]}`
        paths.push(pathStr)
        pathStr += '-'
      }
      return paths
    },
    cascadeData() {
      if (!this.cascadePath.length) return []
      const children = []
      let i = 0
      let next = this.selectionData[this.cascadePath[i]]
      let curPath = `${this.cascadePath[i]}`
      while (next?.children) {
        children.push(
          next.children.map((item, index) => {
            return {
              ...item,
              selected: this.selectedCascadePaths.includes(
                `${curPath}-${index}`
              )
            }
          })
        )
        i++
        next = next.children[this.cascadePath[i]]
        curPath = `${curPath}-${this.cascadePath[i]}`
      }
      return children
    }
  },
  watch: {
    relShowSelectionBox() {
      if (this.relShowSelectionBox) this.preShowSelections()
      else this.preCloseSelections()
    },
    hasSelections() {
      // this.preShowSelections()
      this.resetSelectionBoxStyle()
    },
    selectionData() {
      if (!this.onlySelector && !this.isCascade) {
        if (this.selectionData.length > 0) {
          const item = this.selectionData[0]
          if (item[this.relSelectionTextKey] === this.value) {
            if (!this.selectedItem) {
              this.$emit('input', item[this.relSelectionTextKey], true)
              this.$emit('select', 0, item)
            }
            this.selectedItem = true
          }
        }
        this.resetSelectionBoxStyle()
        // this.preShowSelections()
      }
      if (this.isCascade) {
        this.selectedCascadePath = []
      }
    },
    relSelectionTips() {
      // this.preShowSelections()
      this.resetSelectionBoxStyle()
    },
    value() {
      // this.$emit('selectionInitData')
    }
  },
  beforeDestroy() {
    if (this.hasSelections) {
      window.removeEventListener('scroll', this.scrollFollow, true)
      if (this.$refs.selectionBox) {
        document.body.removeChild(this.$refs.selectionBox)
      }
    }
  },
  mounted() {
    if (this.hasSelections) {
      window.addEventListener('scroll', this.scrollFollow, true)
    }
    if (this.hasSelections) {
      this.$emit('selectionInitData')
      this.setSelectionBoxPosition()
      this.relSelectionBoxStyle = this.selectionBoxStyle
    }
  },
  methods: {
    showCascade(cascadeIndex, itemIndex) {
      const tmp = []
      if (this.cascadePath.length > 0) {
        for (let i = 0; i < cascadeIndex - 1; i++) {
          tmp.push(this.cascadePath[i])
        }
      }
      tmp.push(itemIndex)
      this.cascadePath = [...tmp]
      setTimeout(() => {
        this.setSelectionBoxPosition()
        this.relSelectionBoxStyle = this.selectionBoxStyle
      })
    },
    scrollFollow(e) {
      setTimeout(() => {
        if (this.relShowSelectionBox) {
          this.setSelectionBoxPosition()
          this.relSelectionBoxStyle = this.selectionBoxStyle
        }
      })
    },
    relHeight() {
      const singleItems = document.getElementsByClassName(
        `selectionItem-${this.time}`
      )
      const itemNum = Math.min(this.relSelectionNumOfPage, singleItems.length)
      let relHeight = 8
      for (let i = 0; i < itemNum; i++) {
        relHeight += singleItems[i].offsetHeight
      }
      if (this.isCascade && this.cascadeMinHeight >= relHeight) {
        return this.cascadeMinHeight
      }
      return relHeight
    },
    toggleSelector() {
      if (this.onlySelector) {
        if (this.isFocus) this.closeSelector()
      }
      if (!this.isFocus) this.showSelector()
    },
    // 选择框模式下，点击外部收缩效果依赖closeSelector函数（clickoutside除外）
    // 输入联想式下，点击外部收缩效果依赖input的blur函数
    closeSelector() {
      this.isFocus = false
      // this.preCloseSelections()
    },
    showSelector() {
      this.isFocus = true
      this.$refs[`input-${this.time}`].focus()
      if (this.onlySelector) this.preShowSelections()
    },
    handleFocus() {
      if (!this.selectionData || this.selectionData.length === 0) { this.$emit('selectionInitData') }
      if (!this.onlySelector) {
        this.isFocus = true
        this.$emit('focus')
      }
    },
    handleBlur() {
      clearTimeout(this.blurTimer)
      // setTimeout的作用：
      // 1. 留出时间间隙触发选择选项的绑定事件
      // 2. 使isFocus置false的执行迟于handleSelect中isSelectCascade置true的执行
      this.blurTimer = setTimeout(() => {
        if (!this.isSelectCascade) {
          this.isFocus = false
          this.$emit('blur')
        } else {
          // this.$refs[`input-${this.time}`].focus()
          this.isSelectCascade = false
        }
      }, 100)
    },
    handleInput(e) {
      this.selectedItem = false
      if (this.isCascade) this.selectedCascadePath = []
      this.$emit('input', e.target.value, false)
      if (this.hasSelections) this.$emit('selectionInitData')
    },
    handleEnter(e) {
      if (e.keyCode === 13) {
        this.$emit('enter')
      }
    },
    copyValue() {
      const text = this.$refs[`input-${this.time}`]
      text.disabled = false
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges()
        const range = document.createRange()
        range.selectNode(text)
        window.getSelection().addRange(range)
        if (document.execCommand('Copy')) {
          alert(this.copyTips || '复制成功')
        } else {
          alert(this.copyErrTips || '复制失败，请尝试手动复制')
          this.showDownloadUrl = true
        }
      } else {
        text.select()
        if (document.execCommand('Copy')) {
          alert(this.copyTips || '复制成功')
        } else {
          alert(this.copyErrTips || '复制失败，请尝试手动复制')
          this.showDownloadUrl = true
        }
        text.blur()
      }
      text.disabled = true
    },
    togglePassword() {
      this.showingPassword = !this.showingPassword
    },
    clearValue() {
      this.selectedItem = false
      if (this.isCascade) this.selectedCascadePath = []
      this.$emit('input', '', false)
      this.$emit('clear')
    },
    setSelectionBoxPosition() {
      if (!this.$refs[this.GhInputId]) return
      const pos = this.$refs[this.GhInputId].getBoundingClientRect()
      const y = pos.y + pos.height
      const x = pos.x
      const selectionBoxHeight = this.relHeight()
      const BodyRect = document.body.getBoundingClientRect()
      this.$refs.selectionBox.style.height = this.relShowSelectionBox
        ? 'fit-content'
        : 0
      if (selectionBoxHeight - (BodyRect.height - y) > 8) {
        this.$refs.selectionBox.style.top =
          y - pos.height - selectionBoxHeight - 10 + 'px'
        this.transformOrigin = 'center bottom'
      } else {
        this.$refs.selectionBox.style.top = y + 'px'
        this.transformOrigin = 'center top'
      }
      this.$refs.selectionBox.style.minWidth =
        (this.relShowCascadeBox + 1) * pos.width + 'px'
      this.$refs.selectionBox.style.maxWidth =
        (this.relShowCascadeBox + 1) *
          (this.selectionBoxMaxWidth || pos.width) +
        'px'
      if (this.$refs.selectionBox.offsetWidth - (BodyRect.width - x) > 8) {
        this.$refs.selectionBox.style.left = ''
        this.$refs.selectionBox.style.right = '0px'
      } else {
        this.$refs.selectionBox.style.left = x + 'px'
        this.$refs.selectionBox.style.right = ''
      }

      // this.$refs.selectionBox.style.minWidth = pos.width + 'px'
      // this.$refs.selectionBox.style.maxWidth =
      //   this.selectionBoxMaxWidth || pos.width + 'px'
      const selectionItemBoxs = document.getElementsByClassName(
        `selectionBox-inner-itemBox-${this.time}`
      )
      for (let i = 0; i < selectionItemBoxs.length; i++) {
        selectionItemBoxs[i].style.minWidth = pos.width + 'px'
        selectionItemBoxs[i].style.maxWidth =
          (this.selectionBoxMaxWidth || pos.width) + 'px'
        selectionItemBoxs[i].style.height = this.relHeight() - 8 + 'px'
      }

      if (
        this.$refs.selectionBox.parentNode.tagName !== 'BODY' &&
        this.$refs.selectionBox.parentNode.tagName !== 'body'
      ) {
        document.body.appendChild(this.$refs.selectionBox)
      }
    },
    resetSelectionBoxStyle() {
      setTimeout(() => {
        this.setSelectionBoxPosition()
        this.relSelectionBoxStyle = this.selectionBoxStyle
      })
    },
    preShowSelections() {
      if (!this.animToggle) {
        setTimeout(() => {
          this.setSelectionBoxPosition()
          this.animToggle = true
          this.relSelectionBoxStyle = this.selectionBoxStyle
        })
      }
    },
    preCloseSelections() {
      if (this.animToggle) {
        this.relSelectionBoxStyle = this.selectionBoxStyle
        setTimeout(() => {
          this.animToggle = false
        }, 200)
      }
    },
    handleScroll(e) {
      if (this.relSelectionTips) return
      const { scrollTop, offsetHeight } = e.target
      if (offsetHeight - scrollTop <= 42) {
        this.$emit('selectionLoadMore')
      }
    },
    handleSelect(index, item, cascadeIndex) {
      // 此处showCascade作用为：更新selectedCascadePath
      if (this.isCascade && item?.children) {
        this.showCascade(cascadeIndex, index)
        this.isSelectCascade = true
        return
      }
      this.isSelectCascade = false
      this.preCloseSelections()
      setTimeout(() => {
        if (this.onlySelector) this.isFocus = false
        if (item.disabled && this.value !== item[this.relSelectionTextKey]) {
          if (item.disabledCallback) item.disabledCallback()
          return
        }
        this.selectedItem = true
        this.$emit('input', item[this.relSelectionTextKey], true)
        if (!this.isCascade) this.$emit('select', index, item)
        else {
        // 此处showCascade作用为：更新selectedCascadePath
          this.showCascade(cascadeIndex, index)
          const indexes = [...this.cascadePath, index]
          this.$emit('select', indexes, item)
          this.selectedCascadePath = indexes
        }
      }, 200)
    },
    prevScrollerClick() {
      this.isSelectCascade = true
    }
  }
}
</script>

<style lang="scss" scoped>
.selectionBox {
  position: fixed;
  // bottom: 0;
  // left: 0;
  // transform: translate(0%, 100%);
  z-index: 10000;
  width: fit-content;
  height: fit-content;
  margin-top: 6px;
  &-inner {
    width: 100%;
    overflow-x: hidden;
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px #e0e0e0;
    // transition: all 0.2s;
    box-sizing: border-box;
    border-radius: 4px;
    transition: transform 0.2s, opacity 0.1s;
    // transform: scaleY(0);
    display: flex;
    flex-direction: row;
    &-tips {
      font-size: 14px;
      color: #d3d3d3;
      // line-height: 34px;
      letter-spacing: normal;
      text-align: center;
      width: 100%;
    }
    .selectionBox-inner-item--border + .selectionBox-inner-item--border {
      border-top: 1px solid #ddd;
    }
    &-itemBox {
      overflow-y: auto;
    }
    &-item--cascadeItem {
      border-left: 2px solid #ddd;
    }
    &-item--selecting {
      background-color: #f5f7fa;
      font-weight: bold;
    }
    &-item--selected {
      background-color: #3d3d3d8d;
      font-weight: bold;
      p {
        color: #fff;
      }
    }
    &-item {
      width: 100%;
      min-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.2s;
      ::v-deep p {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        height: 20px;
        transition: all 0.2s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-icon {
        width: fit-content !important;
      }
    }
    .selectionBox-inner-item:hover {
      background: #000;
      box-shadow: 0 0 0 1px #fff;
      ::v-deep p {
        color: #fff;
      }
    }
    &-item--disabled {
      background-color: #f7f7f8 !important;
    }
    .selectionBox-inner-item--disabled:hover {
      background: #f7f7f8;
      box-shadow: 0 0 0 1px #fff;
      ::v-deep p {
        color: #000;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.GhInput--selector {
  cursor: pointer;
  input {
    cursor: pointer;
    user-select: none;
  }
}
.GhInput--disabled {
  background-color: #f5f5f5 !important;
  cursor: not-allowed !important;
  input {
    color: #b7b7b7 !important;
    cursor: not-allowed;
  }
  .length {
    color: #b7b7b7 !important;
  }
}
.GhInput--focus {
  border: 1px solid #000 !important;
  box-shadow: 0 0 0 1px #23232350 !important;
  .suffix {
    border-left: 1px solid #000 !important;
  }
}
.GhInput--readonly {
  // background-color: #f5f5f5 !important;
  // cursor: not-allowed !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 5px 0 !important;
  cursor: text !important;
  input {
    // color: #b7b7b7 !important;
    // cursor: not-allowed;
    cursor: text !important;
  }
  .length {
    color: #b7b7b7 !important;
  }
  .selectorIcon {
    opacity: 0 !important;
  }
}
.GhInput {
  display: flex;
  flex-direction: row;
  align-items: center;
  // height: 100%;
  min-height: 36px;
  max-width: 620px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  transition: all 0.2s;
  border-radius: 2px;
  position: relative;
  background-color: #fff;
  padding: 5px 12px;
  p {
    margin: 0;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
  }
  input {
    background: none;
    outline: none;
    border: none;
    margin: 0;
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    // margin-left: 29px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  input:disabled {
    color: #999999;
  }
  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #c7c7c7;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #c7c7c7;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #c7c7c7;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #c7c7c7;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .prefixIcon {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }
  .length {
    font-size: 14px;
    color: #999999;
    line-height: 20px;
  }
  .watchButton {
    width: 14px;
    height: auto;
    cursor: pointer;
    margin-left: 4px;
  }
  .copyButton {
    width: 14px;
    height: auto;
    cursor: pointer;
    margin-left: 4px;
  }
  .clearButton {
    background-color: #999999;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 4px;
    cursor: pointer;
    span {
      width: 14px !important;
      height: 14px !important;
      color: #fff;
      text-align: center;
      font-size: 12px;
      line-height: 14px;
      user-select: none;
    }
  }
  .suffix {
    margin-left: 4px;
  }
  .selectorIcon {
    margin-left: 8px;
    width: 14px;
    transition: 0.4s;
  }
  .selectorIcon--show {
    transform: rotate(180deg);
  }
  .selectorIcon--hide {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div
    ref="menuBox"
    v-clickoutside="closeMenu"
    class="FixedMenu"
    @mouseleave="mouseMoveHide ? closeMenu : () => {}"
  >
    <div
      ref="menuText"
      class="titleBox"
      :style="{ height: inputHeight ? `${inputHeight}px` : 'fit-content' }"
      @click="toggleMenu"
    >
      <p class="title">{{ text }}</p>
      <img
        v-if="showIcon"
        :class="['pull', showMenu ? 'pull--show' : 'pull--hide']"
        :style="iconStyle"
        :src="iconUrl"
      >
    </div>
    <div
      ref="coverBox"
      class="coverBox"
      :style="{
        height: showMenu ? height + 20 + 'px' : '0',
        ...menuPosition,
      }"
    >
      <div
        v-show="showMenu"
        ref="menu"
        class="menuBox"
        :style="{
          'max-height': height + 'px',
          'overflow-x': 'hidden',
          'overflow-y':
            overScroll && menuContentHeight > maxHeight ? 'scroll' : 'hidden',
          minWidth: `${boxMinWidth}px`,
        }"
        @scroll="scrollToBottom"
      >
        <div
          v-for="(item, index) in menu"
          :id="`menuItem${index}`"
          :key="index"
          class="menu-item"
          :style="{ height: `${itemHeight}px` }"
          @click="handleSelect(index, item)"
        >
          <p :id="`menuItemp${index}`">
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from './utilsFromElement/clickoutside'
export default {
  directives: { Clickoutside },
  props: {
    text: {
      default: '',
      type: String
    },
    inputHeight: {
      default: null,
      type: Number
    },
    menu: {
      defaultStatus: [],
      type: Array
    },
    mouseMoveHide: {
      default: true,
      type: Boolean
    },
    extra: {
      default: null
    },
    iconUrl: {
      default: require('../assets/icon_pull.svg')
    },
    showIcon: {
      default: true,
      type: Boolean
    },
    iconStyle: {
      default: () => {
        return {}
      },
      type: Object
    },
    maxHeight: {
      default: null,
      type: Number
    },
    extraMinWidth: {
      default: null,
      type: Number
    },
    minWidth: {
      default: null,
      type: Number
    },
    dynamicMinWidth: {
      default: false,
      type: Boolean
    },
    singleItemHeight: {
      default: null,
      type: Number
    },
    overScroll: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      showMenu: false,
      menuTop: 0,
      menuRight: 0
    }
  },
  computed: {
    boxMinWidth() {
      return this.minWidth || this.$refs.menuBox.offsetWidth
    },
    menuPosition() {
      let menuTop = this.menuTop
      let menuRight = this.menuRight
      if (this.$refs.coverBox) {
        menuTop =
          window.innerHeight - this.menuTop >= this.height
            ? this.menuTop
            : this.menuTop - this.height - this.$refs.menuBox.offsetHeight - 16
        menuRight =
          window.innerWidth - this.menuRight >= this.$refs.coverBox.offsetWidth
            ? this.menuRight
            : 0
      }
      return {
        top: menuTop + 'px',
        right: menuRight + 'px'
      }
    },
    itemHeight() {
      return this.singleItemHeight || 34
    },
    height() {
      if (this.itemHeight * this.menu.length + 8 < this.maxHeight) {
        return this.itemHeight * this.menu.length + 8
      } else return this.maxHeight || this.itemHeight * this.menu.length + 8
    },
    menuContentHeight() {
      return this.itemHeight * this.menu.length + 8
    }
  },
  watch: {
    showMenu(val) {
      this.$emit('handleOpen', val)
      if (val) {
        const position = this.$refs.menuText.getBoundingClientRect()
        this.menuTop = position.top + position.height
        this.menuRight = window.innerWidth - position.right
        this.$emit('focus', val)
      } else this.$emit('blur', val)
    }
  },
  mounted() {
    document.addEventListener('mousedown', this.handleMouseDown, false)
    window.addEventListener('resize', this.closeMenu)
    window.addEventListener('wheel', this.updatePosition)
    this.updatePosition()
  },
  methods: {
    updatePosition() {
      setTimeout(() => {
        if (this.$refs.menuText) {
          const position = this.$refs.menuText.getBoundingClientRect()
          this.menuTop = position.top + position.height
          this.menuRight = window.innerWidth - position.right
        }
      }, 300)
    },
    handleMouseDown(e) {
      if (e.target.id.match(/menuItem/)) {
        e.preventDefault()
      }
    },
    toggleMenu() {
      if (this.disabled) return
      if (this.showMenu) this.closeMenu()
      else this.openMenu()
    },
    openMenu() {
      if (this.showMenu) return
      if (this.dynamicMinWidth) this.$emit('getDynamicMinWidth')
      this.showMenu = true
      setTimeout(() => {
        this.menuAnimate(this.$refs.menu)
      }, 0)
    },
    closeMenu() {
      if (!this.showMenu) return
      this.menuAnimate(this.$refs.menu, true)
      setTimeout(() => {
        this.showMenu = false
      }, 100)
    },
    menuAnimate(element, hide) {
      if (!element) return
      element.style.padding = '4px 0'
      const targetHeight = this.height + 'px'
      element.style.height = hide ? targetHeight : '0'
      element.style.padding = hide ? '4px 0' : '0'
      setTimeout(() => {
        element.style.height = hide ? '0' : targetHeight
        element.style.padding = hide ? '0' : '4px 0'
      }, 0)
    },
    handleSelect(index, item) {
      if (item.disabled) {
        return
      }
      item.callback(this.extra, index)
      this.closeMenu()
    },
    scrollToBottom(e) {
      if (e.target.scrollTop / this.itemHeight >= this.menu.length - 6) {
        try {
          this.$emit('scrollToBottom', e)
        } catch (err) {
          console.log(err)
        }
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('resize', this.closeMenu)
    window.removeEventListener('wheel', this.updatePosition)
  }
}
</script>

<style lang="scss" scoped>
.FixedMenu {
  position: relative;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: space-between;
  p {
    margin: 0;
  }
  .titleBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    width: 100%;
    .title {
      font-size: 14px;
      color: #4b77f6;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
    }
    .pull {
      margin-left: 8px;
      width: 14px;
      transition: 0.4s;
    }
    .pull--show {
      transform: rotate(180deg);
    }
    .pull--hide {
      transform: rotate(360deg);
    }
  }
  .coverBox {
    width: fit-content;
    // min-width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: fixed;
    // bottom: 0;
    // transform: translate(0%, 100%);
    // right: -22px;
    z-index: 800;
    // overflow: scroll;
    transition: 0.1s all;
    .menuBox {
      margin-top: 6px;
      width: fit-content;
      background: #fff;
      box-shadow: 0px 4px 8px 0px #e0e0e0;
      border-radius: 2px;
      // padding: 4px 0;
      transition: all 0.2s;
      height: 0;
      box-sizing: border-box;
      .menu-item {
        box-sizing: border-box;
        padding: 7px 12px;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
        display: flex;
        flex-direction: row;
        align-items: center;
        p {
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          white-space: nowrap;
          user-select: none;
          text-align: center;
          color: #666666;
        }
      }
      .menu-item:hover {
        background: #f5f5f5;
        p {
          color: #333333;
        }
      }
    }
  }
}
</style>

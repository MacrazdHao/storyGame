<template>
  <div
    :class="[
      'Selector',
      border ? 'Selector--border' : '',
      border && menuFocus ? 'Selector--focus' : '',
      disabled ? 'Selector--disabled' : '',
    ]"
    ref="selector"
  >
    <FixedMenu
      class="dropper"
      :disabled="disabled"
      :inputHeight="inputHeight"
      :text="
        indexTmp < 0
          ? placeholder
          : items.length === 0
          ? ''
          : items[indexTmp || 0].text
      "
      :menu="optionsMenu"
      :showIcon="true"
      :iconUrl="
        iconUrl ||
        require(`../assets/icon_down${disabled ? '_selected' : ''}.svg`)
      "
      :mouseMoveHide="false"
      :iconStyle="{
        width: '12px',
        height: '6px',
      }"
      :maxHeight="listItemNum * itemHeight + 12"
      :singleItemHeight="itemHeight"
      :overScroll="true"
      :dynamicMinWidth="true"
      :minWidth="minWidth || 120"
      @getDynamicMinWidth="getDynamicMinWidth"
      @focus="handleFocus"
      @blur="handleBlur"
      @scrollToBottom="scrollToBottom"
    />
  </div>
</template>

<script>
import FixedMenu from "./GhFixedMenu.vue";
/*
  optionsMenu: [{
    text: String
  }]
*/
export default {
  props: [
    "items",
    "border",
    "index",
    "placeholder",
    "singleItemHeight",
    "showNum",
    "inputHeight",
    // "minWidth",
    "iconUrl",
    "disabled",
  ],
  components: {
    FixedMenu,
  },
  data() {
    return {
      indexTmp: -1,
      optionsMenu: [],
      menuFocus: false,
      minWidth: 120
    };
  },
  watch: {
    index(val) {
      if (val !== this.indexTmp) {
        this.indexTmp = val;
      }
    },
    items(val) {
      this.optionsMenu = [];
      this.indexTmp = this.index;
      for (let i = 0; i < this.items.length; i++) {
        const tmp = { text: "", callback: this.handleSelect };
        tmp.text = this.items[i].text;
        this.optionsMenu.push(tmp);
      }
    },
  },
  computed: {
    listItemNum() {
      return this.showNum || 4;
    },
    itemHeight() {
      return this.singleItemHeight || 34;
    },
  },
  mounted() {
    this.indexTmp = this.index;
    for (let i = 0; i < this.items.length; i++) {
      const tmp = { text: "", callback: this.handleSelect };
      tmp.text = this.items[i].text;
      this.optionsMenu.push(tmp);
    }
  },
  methods: {
    getDynamicMinWidth() {
      this.minWidth = this.$refs.selector.offsetWidth
    },
    handleSelect(info, index) {
      this.indexTmp = index;
      this.$emit("handleSelect", index);
    },
    handleFocus(e) {
      this.menuFocus = true;
    },
    handleBlur(e) {
      this.menuFocus = false;
    },
    scrollToBottom(e) {
      this.$emit("scrollToBottom", e);
    },
  },
};
</script>

<style lang="scss">
.Selector {
  .dropper {
    .titleBox {
      .title {
        color: #333333 !important;
      }
    }
    .coverBox {
      // left: -13px;
      // left: 50%;
      // right: 0 !important;
      // transform: translate(-50%, 100%) !important;
      .menuBox {
        margin-top: 9px !important;
        .menu-item:hover {
          background: #5c87ff !important;
          p {
            color: #fff !important;
          }
        }
      }
    }
  }
}
.Selector--border {
  .dropper {
    // height: fit-content;
    width: 100% !important;
    .titleBox {
      display: flex;
      flex-direction: row;
      .title {
        flex: 1;
        text-align: left;
      }
      .pull {
        margin-left: 6px !important;
        width: 11px !important;
        height: 6px !important;
      }
    }
    .coverBox {
      // width: calc(100% + 24px) !important;
      margin-right: -13px;
      .menuBox {
        width: 100% !important;
        // min-width: 100% !important;
        .menu-item {
          padding: 7px 16px !important;
          p {
            text-align: left !important;
          }
        }
      }
    }
  }
}
.Selector--disabled {
  cursor: not-allowed;
  .dropper {
    .titleBox {
      cursor: not-allowed !important;
      .title {
        color: #b7b7b7 !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.Selector--disabled {
  background-color: #f5f5f5 !important;
}
.Selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
  transition: .2s all;
  p {
    margin: 0;
  }
  .pullIcon {
    margin-left: 8px;
  }
}
.Selector--border {
  padding: 4px 12px;
  height: fit-content;
  max-width: 620px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  transition: all 0.2s;
  border-radius: 2px;
}
.Selector--focus {
  border: 1px solid #3760ea;
  box-shadow: 0 0 0 1px #5c88ff50;
}
</style>

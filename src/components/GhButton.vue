<template>
  <div
    :class="[
      disabled ? 'GhButton-disabled' : 'GhButton-normal',
      onlyIcon ? 'GhButton-onlyIcon' : '',
    ]"
    @click="clickHandler"
  >
    <div
      :class="[
        'GhButton',
        `GhButton-size-${size}`,
        `GhButton-iconAlign-${iconAlign}`,
        `GhButton-${theme}-${color}`,
      ]"
      :style="propsStyle"
    >
      <div class="loadingBox">
        <i
          v-if="loading"
          class="grayManagement-iconfont icon-import loadingAnim"
        />
      </div>
      <i
        v-if="icon"
        :class="[iconStore, icon, 'icon']"
        :style="{ opacity: loading ? 0 : 1 }"
      />
      <p
        v-if="!onlyIcon"
        class="text"
        :style="{ ...propsTextStyle, opacity: loading ? 0 : 1 }"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
/**
 * GhButton参数解析
 * @param text[String] 按钮文字
 * @param minWidth[Number] 按钮最小长度
 * @param normalFontColor[String] 常态字体颜色
 * @param cusStyle[Object(StyleSheet)] 自定义按钮样式
 * @param disabled[Boolean] 是否禁用按钮
 * @param size[String] 按钮预设尺寸，可选：medium/small/mini
 * @param theme[String] 按钮预设主题，可选：fill/solid/dashed
 * @param color[String] 按钮预设颜色，可选：blue/red
 * @param iconStore[String] Icon所在iconfont库的css类名
 * @param icon[String] Icon于iconfont库中的css类名
 * @param iconAlign[String] Icon的位置，可选：left/right
 * @param onlyIcon[Boolean] 是否仅显示Icon（隐藏文字）
 * @param loading[Boolean] 加载状态（为true时隐藏原按钮内容，变为加载Icon）
 */
export default {
  props: {
    text: {
      type: String,
      default: 'button'
    },
    minWidth: {
      type: Number,
      default: 0
    },
    normalFontColor: {
      type: String,
      default: ''
    },
    cusStyle: {
      type: Object
      // default: {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
      // medium, small, mini
    },
    theme: {
      type: String,
      default: 'fill'
      // fill, solid, dashed
    },
    color: {
      type: String,
      default: 'blue'
      // blue, red
    },
    icon: {
      type: String,
      default: ''
      // iconfont库中的icon Class
    },
    iconStore: {
      type: String,
      default: 'iconfont'
      // iconfont库的Class
    },
    iconAlign: {
      type: String,
      default: 'left'
      // left, right
    },
    onlyIcon: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    minWidthPX() {
      return this.minWidth > 0 ? `${this.minWidth}px` : null
    },
    propsStyle() {
      const style = { ...this.cusStyle }
      if (this.minWidthPX) style['minWidth'] = this.minWidthPX
      return style
    },
    propsTextStyle() {
      const style = {}
      if (this.normalFontColor) style['color'] = this.normalFontColor
      return style
    }
  },
  methods: {
    clickHandler() {
      if (this.disabled) return
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.GhButton {
  width: fit-content;
  display: flex;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s all;
  border-width: 1px;
  align-items: center;
  position: relative;
  .loadingBox {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .loadingAnim {
      animation: rotate 0.5s linear infinite;
      width: fit-content;
      color: #fff;
      transform-origin: 12px 11px;
    }
    @-webkit-keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  i {
    font-size: 24px;
  }
  .text {
    width: 100%;
    text-align: center;
    font-family: "Source Han Sans CN";
    font-size: 16px;
    line-height: 24px;
    user-select: none;
    transition: 0.2s all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.GhButton-size-medium {
  padding: 12px 16px;
}
.GhButton-size-small {
  padding: 8px 12px;
}
.GhButton-size-mini {
  padding: 4px 8px;
}
.GhButton-iconAlign-left {
  flex-direction: row;
  .icon {
    margin-right: 8px;
  }
}
.GhButton-iconAlign-right {
  flex-direction: row-reverse;
  .icon {
    margin-left: 8px;
  }
}
.GhButton-fill-blue {
  background-color: #3760ea;
  border-color: #3760ea;
  border-style: solid;
  .text {
    color: #fff;
  }
  .loadingAnim {
    color: #fff;
  }
  .icon {
    color: #fff;
  }
}
.GhButton-fill-red {
  background-color: #d13532;
  border-color: #d13532;
  border-style: solid;
  .text {
    color: #fff;
  }
  .loadingAnim {
    color: #fff;
  }
  .icon {
    color: #fff;
  }
}
.GhButton-solid-blue {
  background-color: #ffffff00;
  border-color: #babdcc;
  border-style: solid;
  .text {
    color: #121314;
  }
  .loadingAnim {
    color: #121314;
  }
  .icon {
    color: #d8dae5;
  }
}
.GhButton-solid-red {
  background-color: #ffffff00;
  border-color: #d13532;
  border-style: solid;
  .text {
    color: #d13532;
  }
  .loadingAnim {
    color: #d13532;
  }
  .icon {
    color: #d13532;
  }
}
.GhButton-dashed-blue {
  background-color: #ffffff00;
  border-color: #babdcc;
  border-style: dashed;
  .text {
    color: #121314;
  }
  .loadingAnim {
    color: #121314;
  }
  .icon {
    color: #d8dae5;
  }
}
.GhButton-dashed-red {
  background-color: #ffffff00;
  border-color: #d13532;
  border-style: dashed;
  .text {
    color: #d13532;
  }
  .loadingAnim {
    color: #d13532;
  }
  .icon {
    color: #d13532;
  }
}

.GhButton-normal {
  .GhButton-fill-blue:hover {
    background-color: #5c87ff;
    border-color: #5c87ff;
  }
  .GhButton-fill-blue:active {
    background-color: #284ac1;
    border-color: #284ac1;
  }

  .GhButton-fill-red:hover {
    background-color: #fa8075;
    border-color: #fa8075;
  }
  .GhButton-fill-red:active {
    background-color: #a92228;
    border-color: #a92228;
  }

  .GhButton-solid-blue:hover {
    background-color: #ffffff00;
    border-color: #5c87ff;
    .text {
      color: #5c87ff !important;
    }
    .loadingAnim {
      color: #5c87ff !important;
    }
    .icon {
      color: #5c87ff !important;
    }
  }
  .GhButton-solid-blue:active {
    background-color: #f0f6ff;
    border-color: #284ac1;
    .text {
      color: #5c87ff !important;
    }
    .loadingAnim {
      color: #5c87ff !important;
    }
    .icon {
      color: #284ac1 !important;
    }
  }

  .GhButton-solid-red:hover {
    background-color: #ffffff00;
    border-color: #fa8075;
    .text {
      color: #fa8075 !important;
    }
    .loadingAnim {
      color: #fa8075 !important;
    }
    .icon {
      color: #fa8075 !important;
    }
  }
  .GhButton-solid-red:active {
    background-color: #fff3f1;
    border-color: #a92228;
    .text {
      color: #a92228 !important;
    }
    .loadingAnim {
      color: #a92228 !important;
    }
    .icon {
      color: #a92228 !important;
    }
  }

  .GhButton-dashed-blue:hover {
    background-color: #ffffff00;
    border-color: #5c87ff;
    .text {
      color: #5c87ff !important;
    }
    .loadingAnim {
      color: #5c87ff !important;
    }
    .icon {
      color: #5c87ff !important;
    }
  }
  .GhButton-dashed-blue:active {
    background-color: #f0f6ff;
    border-color: #284ac1;
    .text {
      color: #284ac1 !important;
    }
    .loadingAnim {
      color: #284ac1 !important;
    }
    .icon {
      color: #284ac1 !important;
    }
  }

  .GhButton-dashed-red:hover {
    background-color: #ffffff00;
    border-color: #fa8075;
    .text {
      color: #fa8075 !important;
    }
    .loadingAnim {
      color: #fa8075 !important;
    }
    .icon {
      color: #fa8075 !important;
    }
  }
  .GhButton-dashed-red:active {
    background-color: #fff3f1;
    border-color: #a92228;
    .text {
      color: #a92228 !important;
    }
    .loadingAnim {
      color: #a92228 !important;
    }
    .icon {
      color: #a92228 !important;
    }
  }
}
.GhButton-disabled {
  .GhButton {
    cursor: no-drop;
  }
  .GhButton-fill-blue {
    background-color: #b9d0fd;
    border-color: #b9d0fd;
  }
  .GhButton-fill-red {
    background-color: #ffe5e1;
    border-color: #ffe5e1;
  }
  .GhButton-solid-blue {
    border-color: #babdcc;
    .text {
      color: #babdcc;
    }
    .loadingAnim {
      color: #babdcc;
    }
  }
  .GhButton-solid-red {
    border-color: #ffe5e1;
    .text {
      color: #ffe5e1;
    }
    .loadingAnim {
      color: #ffe5e1;
    }
    .icon {
      color: #ffe5e1;
    }
  }
  .GhButton-dashed-blue {
    border-color: #babdcc;
    .text {
      color: #babdcc;
    }
    .loadingAnim {
      color: #babdcc;
    }
  }
  .GhButton-dashed-red {
    border-color: #ffe5e1;
    .text {
      color: #ffe5e1;
    }
    .loadingAnim {
      color: #ffe5e1;
    }
    .icon {
      color: #ffe5e1;
    }
  }
}
.GhButton-onlyIcon {
  .GhButton {
    .icon {
      margin-left: 0;
      margin-right: 0;
    }
  }
}
</style>

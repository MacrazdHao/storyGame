<template>
  <div class="Textarea">
    <p v-if="label" class="label">{{ label }}：</p>
    <div v-if="labels" class="labels">
      <p>
        <span v-for="(item, index) in labels" :key="index" class="label">
          {{ `${item}${index == labels.length - 1 ? "：" : ""}` }}
        </span>
      </p>
    </div>
    <div :class="['textareaBox', focus ? 'textareaBox--focus' : '', disabled ? 'textareaBox--disabled' : '']">
      <p v-if="innerLabel">{{ innerLabel }}</p>
      <textarea
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        :readonly="readonly || false"
        @focus="tFocus"
        @blur="tBlur"
        @input="inputHandler"
      />
      <p v-if="showLength" class="length">{{ value.length }}/{{ maxLength }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'label',
    'labels',
    'innerLabel',
    'value',
    'placeholder',
    'showLength',
    'maxLength',
    'disabled',
    'height',
    'readonly'
  ],
  data() {
    return {
      focus: false
    }
  },
  computed: {
    _value() {
      return this.value
    }
  },
  mounted() {},
  methods: {
    tFocus() {
      this.focus = true
    },
    tBlur() {
      this.focus = false
    },
    inputHandler(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.Textarea {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 134px;
  p {
    margin: 0;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    min-width: 69px;
    text-align: left;
  }
  .label {
    width: 86px;
    margin-right: 12px;
    font-size: 14px;
    color: #333333;
    line-height: 32px;
    text-align: left;
  }
  .labels {
    width: 86px;
    margin-right: 12px;
    p {
      display: flex;
      flex-direction: column;
      text-align: left;
      padding: 6px 0;
      white-space: normal;
      .label {
        margin-right: 0px;
        // display: inline-block;
        line-height: 20px;
        white-space: nowrap;
      }
    }
  }
  .textareaBox {
    border: 1px solid #d9d9d9;
    transition: all 0.2s;
    border-radius: 2px;
    padding: 6px 12px;
    max-width: 620px;
    // width: 100%;
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    p {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
    .length {
      width: 100%;
      text-align: right;
      font-size: 14px;
      color: #c7c7c7;
      line-height: 20px;
    }
    textarea {
      background: none;
      outline: none;
      border: none;
      resize: none;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      flex: 1;
      // background: #000;
      font-size: 14px;

      line-height: 20px;
    }
    textarea:focus {
      border: 0;
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
    textarea:disabled {
      font-size: 14px;
      color: #b7b7b7 !important;
      line-height: 20px;
      cursor: not-allowed;
    }
  }
  .textareaBox--focus {
    border: 1px solid #5c87ff;
    box-shadow: 0 0 0 1px #5c88ff50;
  }
  .textareaBox--disabled {
    border: 1px solid #d3d3d3;
    background-color: #f6f6f6;
    box-shadow: none;
    cursor: not-allowed;
  }
}
</style>

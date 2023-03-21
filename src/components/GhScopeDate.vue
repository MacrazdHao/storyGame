<template>
  <div class="ScopeDate">
    <el-date-picker
      v-model="timeScope"
      type="datetimerange"
      align="right"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :editable="false"
      @change="handleChange"
    >
      <div slot="range-separator" class="separatorIcon">
        <img src="../assets/icon_right_arrow.svg">
      </div>
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: ['value', 'startPlaceholder', 'endPlaceholder'],
  data() {
    return {
      timeScope: ['', '']
    }
  },
  watch: {
    value(val) {
      if (this.value) {
        this.timeScope = [this.value[0] || '', this.value[1] || '']
      }
    }
  },
  mounted() {
    if (this.value) {
      this.timeScope = [this.value[0] || '', this.value[1] || '']
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style lang="scss">
.ScopeDate {
  height: 32px;
  .el-date-editor {
    padding: 0;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    .el-range-input {
      text-align: center;
      padding-left: 12px;
      padding-right: 12px;
      flex: 1;
    }
    .el-input__icon {
      display: none;
    }
    .separatorIcon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        width: 14px;
        height: 6px;
      }
    }
  }
  .el-range-editor.is-active,
  .el-range-editor.is-active:hover {
    border-color: #5c87ff;
    box-shadow: 0 0 0 1px #5c88ff50;
  }
}
</style>

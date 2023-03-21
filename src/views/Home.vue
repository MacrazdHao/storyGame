<template>
  <div class="Home">
    <p @click="start">start</p>
    <p @click="maker">Maker</p>
    <div class="block">
      <div class="block-layer" style="z-index: 10">
        <p>黑</p>
      </div>
      <div
        class="block-layer"
        style="z-index: 9; transform: translateZ(-0.5px)"
      />
      <div
        class="block-layer"
        style="z-index: 8; transform: translateZ(-1px)"
      />
      <div
        class="block-layer"
        style="z-index: 7; transform: translateZ(-1.5px)"
      />
      <div
        class="block-layer"
        style="z-index: 7; transform: translateZ(-2px)"
      />
      <div
        class="block-layer"
        style="z-index: 7; transform: translateZ(-2.5px)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    // var ajax = new XMLHttpRequest()
    // // https://juejin.im/user/update/user_info/       //旧版掘金的域名地址
    // // https://juejin.cn/user/update/user_info/        //2022-06-23更新时废弃
    // ajax.open('post', 'https://juejin.cn/web/user/update/user_info/', true)
    // ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    // ajax.send(
    //   'aid=2608&avatar=https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/409204f6283a410290621bb7de6d5f82~tplv-k3u1fbpfcp-no-mark:320:320:320:320.awebp'
    // )
    // ajax.onreadystatechange = function () {
    //   if (ajax.readyState == 4 && ajax.status == 200) {
    //     var c = ajax.responseText
    //     console.log(c)
    //   }
    // }
  },
  methods: {
    start() {
      this.$router.push({ path: 'sceen' })
    },
    maker() {
      this.$router.push({ path: 'maker' })
    }
  }
}
</script>

<style lang="scss" scoped>
@property --offset {
  syntax: "<length>";
  inherits: false;
  initial-value: 5px;
}
@keyframes move {
  to {
    --offset: 15px;
  }
}
.block {
  width: 40px;
  height: 40px;
  transform: translate(1px, 1px, 1px);
  position: relative;
  transform-origin: top left;
  transform: rotate3d(0.5, -0.2, 0, 20deg);
  transform-style: preserve-3d;
  margin-left: 20px;
  &-layer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    // filter: brightness();
    border-right: 1px solid hsl(120deg, 20%, 25%);
    border-bottom: 1px solid hsl(120deg, 70%, 25%);
    border-radius: 4px;
    box-sizing: border-box;
    background-color: hsl(120deg, 50%, 25%);
    p {
      font-size: 30px;
      // text-shadow: 0px 0px 3px #000;
      // -webkit-text-stroke: 1px #000; //文字描边
      color: transparent; //字体颜色设置为透明
      background: repeating-radial-gradient(
        circle at 0 0,
        #000 calc(var(--offset) - 5px),
        #000 var(--offset),
        rgb(145, 49, 49) var(--offset),
        rgb(145, 49, 49) calc(var(--offset) + 5px)
      );
      animation: move 0.5s infinite linear;
      background-clip: text;
      // // color: #fff;   //字体颜色设置为透明
    }
  }
  &-layer:last-child {
    box-shadow: 1px 1px 1px #000;
  }
  &-layer:first-child {
    border-right: 0px solid green !important;
    border-bottom: 0px solid green !important;
  }
}
</style>

<template>
  <div class="VoiceGame">
    <div class="options">
      <button @click="startRecord">启动</button>
      <button @click="stopRecord">停止</button>
      <!-- <canvas ref="waver" /> -->
    </div>
    <div ref="playground" class="playground">
      <div ref="dot" class="dot" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audioCtx: null,
      source: null,
      audioStream: null,
      analyserNode: null,
      animationFrame: null
      // animationYFrame: null
    }
  },
  mounted() {
    // this.startRecord()
  },
  methods: {
    startRecord() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.audioStream = stream
          this.audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)()
          this.source = this.audioCtx.createMediaStreamSource(this.audioStream)
          this.analyserNode = this.audioCtx.createAnalyser()
          this.analyserNode.fftSize = 32
          this.source.connect(this.analyserNode)
          this.analyserNode.connect(this.audioCtx.destination)

          this.animationFrame = setInterval(this.setDotPos, 10)
          // this.animationYFrame = setInterval(this.setDotY, 100)
        })
        .catch((e) => {
          console.log('调取麦克风出错: ', e)
        })
    },
    stopRecord() {
      const tracks = this.audioStream.getAudioTracks()
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].stop()
      }
      this.analyserNode.disconnect()
      this.source.disconnect()
      this.analyserNode = null
      this.source = null
      clearInterval(this.animationFrame)
      this.animationFrame = null
      // clearInterval(this.animationYFrame)
      // this.animationYFrame = null
    },
    getDotPos(offset, dir = 0) {
      const playgroundRect = this.$refs.playground.getBoundingClientRect()
      const curPos = dir ? this.$refs.dot.offsetTop : this.$refs.dot.offsetLeft
      const newPos = offset + curPos
      if (!dir && newPos > playgroundRect.width - 10) {
        return playgroundRect.width - 10 + 'px'
      }
      if (!dir && newPos < 0) return 0
      if (dir && newPos > playgroundRect.height - 10) {
        return playgroundRect.height - 10 + 'px'
      }
      if (dir && newPos < 0) return 0
      return newPos + 'px'
    },
    setDotPos() {
      // 左右由频率控制
      const originDataX = new Float32Array(this.analyserNode.fftSize)
      this.analyserNode.getFloatTimeDomainData(originDataX)
      let avgX = 0
      for (let i = 0; i < originDataX.length; i++) {
        avgX += originDataX[i]
      }
      avgX = avgX / originDataX.length
      // 上下由音量控制
      const originDataY = new Float32Array(this.analyserNode.frequencyBinCount)
      let avgY = 0
      this.analyserNode.getFloatFrequencyData(originDataY)
      for (let i = 0; i < originDataY.length; i++) {
        avgY += originDataY[i]
      }
      avgY = avgY / originDataY.length
      console.log(avgX * 100 + 0.015, Math.pow(10, avgY / 85) * 20 - 1.2)
      this.$refs.dot.style.left = this.getDotPos(avgX * 1000 + 0.15)
      this.$refs.dot.style.top = this.getDotPos(Math.pow(10, avgY / 85) * 20 - 1.2, 1)
    }
    // setDotY() {
    // }
  }
}
</script>

<style lang="scss" scoped>
.VoiceGame {
  width: 100%;
  height: 100vh;
  .options {
    width: 100%;
    height: 40px;
  }
  .playground {
    width: 100%;
    height: calc(100% - 40px);
    background-color: #f5f5f5;
    position: relative;
    .dot {
      position: absolute;
      top: calc(50% - 5px);
      left: calc(50% - 5px);
      height: 10px;
      width: 10px;
      background-color: red;
      transition: .01s all;
    }
  }
}
</style>

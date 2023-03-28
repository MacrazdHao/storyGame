<template>
  <div class="VoiceGame">
    <div class="options">
      <div>
        <button @click="startRecord">启动麦克风</button>
        <button @click="stopRecord">关闭麦克风</button>
      </div>
      <div>
        <button @click="playVirtual">播放虚拟音</button>
        <button @click="stopVirtual">停止虚拟音</button>
        <span id="wave_type_buttons_delegate" @click="setFrequency">
          <button data-type="sine">Sine</button>
          <button data-type="square">Square</button>
          <button data-type="triangle">Triangle</button>
          <button data-type="sawtooth">Sawtooth</button>
          <button data-type="custom">Custom</button>
        </span>
      </div>
      <div>
        <input
          id="frequency_input"
          type="range"
          min="100"
          max="2000"
          step="10"
          value="560"
          @input="handleFrequency"
        >
        <span ref="showFrequency">Frequency: 560Hz</span>
      </div>
      <div>
        <input
          id="volume_input"
          type="range"
          min="0"
          max="100"
          step="1"
          value="80"
          @input="handleVolumn"
        >
        <span ref="showVolume"> Volume: 80%</span>
      </div>
      <div>
        <canvas ref="time-canvas" class="virtualCanvas" />
        <canvas ref="frequency-canvas" class="virtualCanvas" />
      </div>
      <p>{{ pinlv }}</p>
      <!-- <canvas ref="waver" /> -->
      <video ref="video" autoplay />
    </div>
    <div ref="playground" class="playground">
      <div ref="dot" class="dot" />
    </div>
  </div>
</template>

<script>
import { Oscilloscope } from '../utils/GRWJMrx'
export default {
  data() {
    return {
      pinlv: 0,

      audioCtx: null,

      filter: null,
      filterSource: null,
      filterAudioCtx: null,

      gainNode: null,
      oscillator: null,
      oscilloscope: null,
      waveType: 'sine',
      frequency: 560,
      volume: 80,

      source: null,
      originStream: null,
      audioStream: null,
      analyserNode: null,
      animationFrame: null
      // animationYFrame: null
    }
  },
  mounted() {
    // this.startRecord()
    this.audioCtx = new AudioContext()
    this.gainNode = this.audioCtx.createGain()
    this.gainNode.gain.value = this.volume / 100
  },
  methods: {
    startVideo() {
      const ac = new AudioContext()
      const $audio = this.$refs.video
      const sourceNode = ac.createMediaElementSource($audio)
      sourceNode.connect(/* other audio node */)
    },
    playVirtual() {
      if (this.oscillator) return
      this.oscillator = this.audioCtx.createOscillator()
      this.oscillator.type = this.waveType
      this.oscillator.frequency.value = this.frequency
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioCtx.destination)

      this.oscillator.start()
      this.oscilloscope = new Oscilloscope({
        audioContext: this.audioCtx,
        sourceNode: this.oscillator,
        fftSize: 2048
      })
      console.log(this.oscilloscope, this.oscillator)
      this.oscilloscope.addCanvas(this.$refs['time-canvas'], 'time')
      this.oscilloscope.addCanvas(this.$refs['frequency-canvas'], 'frequency')

      // this.analyserNode = this.audioCtx.createAnalyser()
      // this.analyserNode.connect(this.audioCtx.destination)
      this.analyserNode = this.oscilloscope.analyser
      this.animationFrame = setInterval(this.setDotPos, 10)
    },
    stopVirtual() {
      if (!this.oscillator) return
      this.oscilloscope.destroy()
      this.oscillator.stop()
      this.oscillator.disconnect()
      this.oscillator = null
      clearInterval(this.animationFrame)
      this.animationFrame = null
    },
    setFrequency(e) {
      if (this.oscillator && event.target.dataset.type) {
        if (event.target.dataset.type === 'custom') {
          const real = [0, 0, 1, 0, 1]
          const imag = [0, 0, 0, 0, 0]
          const wave = this.audioCtx.createPeriodicWave(real, imag)
          this.oscillator.setPeriodicWave(wave)
        } else {
          this.oscillator.type = this.waveType = event.target.dataset.type
        }
      }
    },
    handleFrequency(event) {
      this.frequency = +event.target.value
      if (this.oscillator) { this.oscillator.frequency.value = +event.target.value }
      this.$refs.showFrequency.innerText = 'Frequency: ' + this.frequency + 'Hz'
    },
    handleVolumn(event) {
      this.volume = +event.target.value
      this.gainNode.gain.value = this.volume / 100
      this.$refs.showVolume.innerText = 'Volume: ' + this.volume + '%'
    },
    moveDot(stream) {
      // this.source = this.audioCtx.createMediaStreamSource(this.stream)
      // this.analyserNode = this.audioCtx.createAnalyser()
      // this.analyserNode.fftSize = 32
      // this.source.connect(this.analyserNode)
      // this.analyserNode.connect(this.audioCtx.destination)

      // this.animationFrame = setInterval(this.setDotPos, 10)
    },
    startRecord() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // this.stream = stream
          this.originStream = stream
          this.filterAudioCtx = new (window.AudioContext ||
            window.webkitAudioContext)()
          this.filterSource =
            this.filterAudioCtx.createMediaStreamSource(stream)

          // 创建滤波器
          this.filter = this.filterAudioCtx.createBiquadFilter()
          this.filter.type = 'lowpass'
          this.filter.Q.value = 10
          this.filter.frequency.value = 1500
          // this.filter.gain.value = 5
          const destination =
            this.filterAudioCtx.createMediaStreamDestination()
          this.filter.connect(destination)
          this.filterSource.connect(this.filter)
          this.stream = destination.stream

          this.source = this.audioCtx.createMediaStreamSource(this.stream)
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
      const tracks = this.originStream.getAudioTracks()
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].stop()
      }
      this.analyserNode.disconnect()
      this.source.disconnect()
      this.analyserNode = null
      this.source = null
      this.filterSource.disconnect()
      this.filter.disconnect()
      this.filterSource = null
      this.filter = null
      clearInterval(this.animationFrame)
      this.animationFrame = null
      // clearInterval(this.animationYFrame)
      // this.animationYFrame = null
    },
    getDotPos(offset, dir = 0) {
      const playgroundRect = this.$refs.playground.getBoundingClientRect()
      const rWinWidthRat = playgroundRect.width / 1440
      const rWinHeightRat = playgroundRect.height / 1080
      const curPos = dir ? this.$refs.dot.offsetTop : this.$refs.dot.offsetLeft
      const relOffset = offset * (dir ? rWinHeightRat : rWinWidthRat)
      const newPos = relOffset + curPos
      // (relOffset > 10 ? 10 : relOffset < -10 ? -10 : relOffset) + curPos
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
      let maxX = -Infinity
      let minX = Infinity
      for (let i = 0; i < originDataX.length; i++) {
        if (originDataX[i] > maxX) maxX = originDataX[i]
        if (originDataX[i] < minX) minX = originDataX[i]
        // avgX += originDataX[i]
      }
      // console.log(maxX, ',', minX)
      // avgX = avgX / originDataX.length
      avgX = (maxX + minX) / 2
      this.pinlv = avgX * 10000
      // 上下由音量控制
      const originDataY = new Float32Array(this.analyserNode.frequencyBinCount)
      let avgY = 0
      let length = 0
      this.analyserNode.getFloatFrequencyData(originDataY)
      for (let i = 0; i < originDataY.length; i++) {
        if (originDataY[i] === -Infinity) continue
        avgY += originDataY[i]
        length++
      }

      // avgY = Math.pow(10, avgY / length / 85) * 100
      avgY = -avgY / length / 100

      // const originDataZ = new Uint8Array(this.analyserNode.frequencyBinCount)
      // this.analyserNode.getByteFrequencyData(originDataZ)

      console.log(avgY)
      // console.log(avgX * 10000, -(Math.pow(10, avgY / 85) * 20) * 10 + 10)
      this.$refs.dot.style.left = this.getDotPos(this.pinlv)
      // console.log(this.pinlv)
      this.$refs.dot.style.top = this.getDotPos(-avgY, 1)
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
    height: 240px;
    .virtualCanvas {
      width: 360px;
      height: 120px;
    }
  }
  .playground {
    width: 100%;
    height: calc(100% - 240px);
    background-color: #f5f5f5;
    position: relative;
    .dot {
      position: absolute;
      top: calc(50% - 5px);
      left: calc(50% - 5px);
      height: 10px;
      width: 10px;
      background-color: red;
      transition: 0.01s top;
      transition: 0.2s left;
    }
  }
}
</style>

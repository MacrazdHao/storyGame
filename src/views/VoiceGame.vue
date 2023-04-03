<template>
  <div class="VoiceGame">
    <div class="options">
      <div>
        <button @click="resetDot">重置红点</button>
        <button @click="startRecord(false)">启动麦克风</button>
        <button @click="stopRecord">关闭麦克风</button>
        <button @click="startRecord(true)">校准0值</button>
        <button @click="clearZero">清空0值</button>
        <p>
          当前：{{ relYinliang }} - {{ relPinlv }}(校准：{{ yinliangZero }} -
          {{ pinlvZero
          }}{{ checkProcess === 100 ? "" : ` - ${checkProcess}%` }})
        </p>
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
          min="20"
          max="1100"
          step="10"
          value="1000"
          @input="handleFrequency"
        >
        <span ref="showFrequency">Frequency: {{ frequency }}Hz</span>
      </div>
      <div>
        <input
          id="volume_input"
          type="range"
          min="0"
          max="100"
          step="1"
          value="10"
          @input="handleVolumn"
        >
        <span ref="showVolume"> Volume: {{ volume }}%</span>
      </div>
      <div style="display: flex; flex-direction: row; width: 100%">
        <canvas v-show="true" ref="time-canvas" class="virtualCanvas" />
        <canvas v-show="true" ref="frequency-canvas" class="virtualCanvas" />
      </div>
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
// const originYinliangZero = 13
// const originPinlvZero = 42
const originYinliangBound = 20
const originPinlvBound = -23
const checkItemNum = 100 // 校准采样数
export default {
  data() {
    return {
      checkPinlv: [],
      checkYinliang: [],
      checkInterval: null,
      yinliangZero: 0,
      pinlvZero: 0,

      yinliang: 0,
      pinlv: 0,

      audioCtx: null,

      filter: null,
      filterSource: null,
      filterAudioCtx: null,

      gainNode: null,
      oscillator: null,
      oscilloscope: null,
      waveType: 'sine',
      frequency: 1000,
      volume: 10,
      // virtualFilter: 0,

      scriptProcessor: null,
      source: null,
      originStream: null,
      audioStream: null,
      analyserNode: null,
      animationFrame: null
      // animationYFrame: null
    }
  },
  computed: {
    checkProcess() {
      return (
        Math.min(this.checkYinliang.length, this.checkPinlv.length) * 100 / checkItemNum
      ).toFixed(2)
    },
    relYinliang() {
      return this.yinliang - originYinliangBound
    },
    relPinlv() {
      return this.pinlv - originPinlvBound
    }
  },
  mounted() {
    // this.startRecord()
    this.audioCtx = new AudioContext()
    this.gainNode = this.audioCtx.createGain()
    this.gainNode.gain.value = this.volume / 100
  },
  methods: {
    resetDot() {
      this.$refs.dot.style.left = 'calc(50% - 5px)'
      this.$refs.dot.style.top = 'calc(50% - 5px)'
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
      this.oscilloscope.addCanvas(this.$refs['time-canvas'], 'time')
      this.oscilloscope.addCanvas(this.$refs['frequency-canvas'], 'frequency')
      this.analyserNode = this.oscilloscope.analyser
      this.animationFrame = setInterval(this.setDotPos, 60)

      this.scriptProcessor = this.audioCtx.createScriptProcessor(4096, 1, 1)
      this.oscillator.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioCtx.destination)
      this.scriptProcessor.onaudioprocess = (e) => {
        const buffer = e.inputBuffer.getChannelData(0)
        this.yinliang = (Math.max(...buffer) * 1000).toFixed(2)
      }
    },
    stopVirtual() {
      if (!this.oscillator) return
      this.oscilloscope.destroy()
      this.oscillator.stop()
      this.oscillator.disconnect()
      this.scriptProcessor.disconnect()
      this.oscillator = null
      this.scriptProcessor = null
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
      if (this.oscillator) {
        this.oscillator.frequency.value = +event.target.value
      }
      // this.$refs.showFrequency.innerText = 'Frequency: ' + this.frequency + 'Hz'
    },
    handleVolumn(event) {
      this.volume = +event.target.value
      this.gainNode.gain.value = this.volume / 100
      // this.$refs.showVolume.innerText = 'Volume: ' + this.volume + '%'
    },
    startRecord(check = false) {
      if (this.source) return
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.stream = stream
          this.originStream = stream

          // this.filterAudioCtx = new (window.AudioContext ||
          //   window.webkitAudioContext)()
          // this.filterSource =
          //   this.filterAudioCtx.createMediaStreamSource(stream)
          // // 创建滤波器
          // this.filter = this.filterAudioCtx.createBiquadFilter()
          // this.filter.type = 'lowpass'
          // this.filter.Q.value = 10
          // this.filter.frequency.value = 1500
          // // this.filter.gain.value = 5
          // const destination =
          //   this.filterAudioCtx.createMediaStreamDestination()
          // this.filter.connect(destination)
          // this.filterSource.connect(this.filter)
          // this.stream = destination.stream

          this.source = this.audioCtx.createMediaStreamSource(this.stream)

          this.scriptProcessor = this.audioCtx.createScriptProcessor(
            4096,
            1,
            1
          )
          this.source.connect(this.scriptProcessor)
          this.scriptProcessor.connect(this.audioCtx.destination)
          this.scriptProcessor.onaudioprocess = (e) => {
            const buffer = e.inputBuffer.getChannelData(0)
            this.yinliang = ((Math.max(...buffer) * 1000).toFixed(2) - this.yinliangZero).toFixed()
            if (check) {
              this.checkYinliang.push(this.yinliang)
            }
          }

          this.analyserNode = this.audioCtx.createAnalyser()
          this.analyserNode.fftSize = 1024
          this.source.connect(this.analyserNode)
          this.analyserNode.connect(this.audioCtx.destination)

          this.oscillator = this.audioCtx.createOscillator()
          this.oscilloscope = new Oscilloscope({
            audioContext: this.audioCtx,
            sourceNode: this.source,
            fftSize: 1024
          })
          this.oscillator.connect(this.gainNode)
          this.gainNode.connect(this.audioCtx.destination)
          this.oscillator.start()

          this.oscilloscope.addCanvas(this.$refs['time-canvas'], 'time')
          this.oscilloscope.addCanvas(
            this.$refs['frequency-canvas'],
            'frequency'
          )
          if (check) {
            this.checkInterval = setInterval(this.checkZero, 10)
          } else this.animationFrame = setInterval(this.setDotPos, 10)
          // this.animationYFrame = setInterval(this.setDotY, 100)
        })
        .catch((e) => {
          console.log('调取麦克风出错: ', e)
        })
    },
    stopRecord() {
      if (!this.source) return
      if (this.oscillator) {
        this.oscilloscope.destroy()
        this.oscillator.stop()
        this.oscillator.disconnect()
        this.scriptProcessor.disconnect()
        this.scriptProcessor = null
        this.oscillator = null
      }
      const tracks = this.originStream.getAudioTracks()
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].stop()
      }
      this.source.disconnect()
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
        this.checkInterval = null
      } else {
        clearInterval(this.animationFrame)
        this.animationFrame = null
      }
      this.analyserNode = null
      this.source = null
      // this.filterSource.disconnect()
      // this.filter.disconnect()
      // this.filterSource = null
      // this.filter = null
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
      if (!this.analyserNode) return
      // 左右由音量控制，低左高右
      // const originDataX = new Uint8Array(this.analyserNode.frequencyBinCount)
      // this.analyserNode.getByteTimeDomainData(originDataX)
      // let maxX = -Infinity
      // for (let i = 0; i < originDataX.length; i++) {
      //   if (originDataX[i] > maxX) maxX = originDataX[i]
      // }
      // this.yinliang = +(maxX / 10 - this.yinliangZero).toFixed()
      // 上下由频率控制，低下高上（人声0-49）
      const originDataY = new Uint8Array(this.analyserNode.frequencyBinCount)
      let maxY = -Infinity
      let maxYIndex = 0
      this.analyserNode.getByteFrequencyData(originDataY)
      // console.log(originDataY)
      for (let i = 0; i < 49; i++) {
        if (originDataY[i] === -Infinity || originDataY[i] === Infinity) {
          continue
        }
        if (maxY < originDataY[i]) {
          maxY = originDataY[i]
          maxYIndex = i
        }
      }
      this.pinlv = isNaN(maxY) ? 0 : (this.pinlvZero - maxYIndex).toFixed()
      // console.log(this.pinlv, this.relPinlv)
      this.$refs.dot.style.left = this.getDotPos(this.relYinliang)
      this.$refs.dot.style.top = this.getDotPos(this.relPinlv, 1)
    },
    getAvgNum(arr) {
      let sum = 0
      for (let i = 0; i < arr.length; i++) {
        sum += +arr[i]
      }
      return +(sum / arr.length).toFixed(2)
    },
    checkZero() {
      if (!this.analyserNode) return
      if (Math.min(this.checkYinliang.length, this.checkPinlv.length) >= checkItemNum) {
        this.pinlvZero = this.getAvgNum(this.checkPinlv)
        this.yinliangZero = this.getAvgNum(this.checkYinliang)
        this.stopRecord()
        return
      }
      // 左右由音量控制
      // const originDataX = new Uint8Array(this.analyserNode.frequencyBinCount)
      // this.analyserNode.getByteTimeDomainData(originDataX)
      // let maxX = -Infinity
      // for (let i = 0; i < originDataX.length; i++) {
      //   if (originDataX[i] > maxX) maxX = originDataX[i]
      // }
      // this.checkYinliang.push((maxX / 10 - this.yinliangZero).toFixed())
      // 上下由频率控制
      const originDataY = new Uint8Array(this.analyserNode.frequencyBinCount)
      let maxY = -Infinity
      let maxYIndex = 0
      this.analyserNode.getByteFrequencyData(originDataY)
      for (let i = 0; i < 49; i++) {
        if (originDataY[i] === -Infinity || originDataY[i] === Infinity) {
          continue
        }
        if (maxY < originDataY[i]) {
          maxY = originDataY[i]
          maxYIndex = i
        }
      }
      this.checkPinlv.push(isNaN(maxY) ? 0 : this.pinlvZero - maxYIndex)
    },
    clearZero() {
      this.checkPinlv = []
      this.checkYinliang = []
      this.yinliangZero = 0
      this.pinlvZero = 0
    }
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
      // width: 360px;
      flex: 1;
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

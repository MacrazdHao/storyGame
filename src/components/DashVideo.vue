<template>
  <div
    :id="videoId"
    class="DashVideo"
    @mouseup.stop="changeProgressEnd"
    @mousemove.stop="movingMouse"
    @touchend.stop="changeProgressEnd"
    @touchmove.stop="movingMouse"
  >
    <video
      :id="videoRefId"
      :ref="`${videoRefId}`"
      @touchend.stop
      @click.stop="playOrPause"
      @dblclick.stop="fullscreen"
      @timeupdate.stop="timeupdate"
      @progress.stop="progressing"
      @durationchange.stop="durationchange"
      @play.stop="playHandler"
      @pause.stop="pauseHandler"
    />
    <transition name="el-fade-in-linear">
      <div
        v-show="showControl"
        class="controlBar"
        :style="{
          zIndex: fullscreenMode ? 2147483649 : 0,
          position: fullscreenMode ? 'fixed' : 'absolute',
        }"
        @touchend.stop
        @click.stop="
          showSpeed = false;
          showVolume = false;
        "
      >
        <div
          :id="progressId"
          class="progress"
          @mouseup.stop="changeProgressEnd"
          @mousedown.stop="changeProgressStart"
          @touchend.stop="changeProgressEnd"
          @touchstart.stop="changeProgressStart"
        >
          <div
            class="progress-buffed"
            :style="{
              width: `${bufferdPersend}%`,
              left: `${bufferdStartPersend}%`,
            }"
          />
          <div
            :id="curProgressId"
            class="progress-current"
            :style="{ width: `${progressPersent}%` }"
          >
            <div class="progress-current-block" />
          </div>
        </div>
        <div class="controlBar-options">
          <div class="controlBar-options-box">
            <i
              :class="[
                'controlBar-options-box-play',
                'knowledgeCenter-iconfont',
                playing ? 'icon-icon_suspend' : 'icon-icon_play',
              ]"
              @touchend.stop
              @click.stop="playOrPause"
            />
            <p class="controlBar-options-box-time">
              {{
                timeFormatter(currentTime, durationTime > 3600 ? "hour" : "min")
              }}
              /
              {{
                timeFormatter(
                  durationTime,
                  durationTime > 3600 ? "hour" : "min"
                )
              }}
            </p>
          </div>
          <div class="controlBar-options-box">
            <div
              class="controlBar-options-box-speed"
              @mouseenter="showSpeed = true"
              @mouseleave="showSpeed = false"
              @click.stop="showSpeed = true"
              @touchend.stop
            >
              <p class="controlBar-options-box-speed-num">{{ playSpeed }}x</p>
              <transition name="el-fade-in-linear">
                <div
                  v-show="showSpeed"
                  class="controlBar-options-box-speed-control"
                >
                  <div class="controlBar-options-box-speed-control-inBox">
                    <p
                      v-for="(item, index) in playSpeedOptions"
                      :key="index"
                      class="controlBar-options-box-speed-control-inBox-item"
                      @click.stop="changePlaySpeed(item)"
                    >
                      {{ item }}x
                    </p>
                  </div>
                </div>
              </transition>
            </div>
            <div
              class="controlBar-options-box-voice"
              @mouseenter="showVolume = true"
              @mouseleave="showVolume = false"
              @touchend.stop="showVolume = true"
            >
              <i
                :class="[
                  'controlBar-options-box-voice-mute',
                  'knowledgeCenter-iconfont',
                  muted ? 'icon-icon_voice_mute' : 'icon-icon_voice_default',
                ]"
                @click.stop="muteVoice"
              />
              <transition name="el-fade-in-linear">
                <div
                  v-show="showVolume"
                  class="controlBar-options-box-voice-control"
                  @mouseup.stop="changeVoiceProgressEnd"
                  @mousemove.stop="changingVoiceProgress"
                  @touchend.stop="changeVoiceProgressEnd"
                  @touchmove.stop="changingVoiceProgress"
                >
                  <div class="controlBar-options-box-voice-control-inBox">
                    <div
                      :id="voiceProgressId"
                      class="
                        controlBar-options-box-voice-control-inBox-progress
                      "
                      @mouseup.stop="changeVoiceProgressEnd"
                      @mousedown.stop="changeVoiceProgressStart"
                      @mousemove.stop="changingVoiceProgress"
                      @touchstart.stop="changeVoiceProgressStart"
                      @touchend.stop="changeVoiceProgressEnd"
                      @touchmove.stop="changingVoiceProgress"
                    >
                      <div
                        :id="curVoiceProgressId"
                        :style="{
                          height: `${volume}%`,
                        }"
                        class="
                          controlBar-options-box-voice-control-inBox-progress-current
                        "
                      >
                        <div
                          class="
                            controlBar-options-box-voice-control-inBox-progress-current-block
                          "
                        />
                      </div>
                    </div>
                    <p class="controlBar-options-box-voice-control-inBox-num">
                      {{ muted ? 0 : volume.toFixed(0) }}
                    </p>
                  </div>
                </div>
              </transition>
            </div>
            <i
              :class="[
                'controlBar-options-box-fullscreen',
                'knowledgeCenter-iconfont',
                fullscreenMode
                  ? 'icon-a-icon_outline_zoomin_24px'
                  : 'icon-a-icon_outline_zoomin_24px',
              ]"
              @touchend.stop
              @click.stop="fullscreen"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import dashjs from 'dashjs'
export default {
  props: ['videoRefId', 'videoUrl', 'autoplay'],
  data() {
    return {
      playing: false,
      paused: false,
      muted: false,
      showVolume: false,
      volume: 0,
      ended: false,
      durationTime: 0,
      currentTime: 0,
      videoDom: null,
      progressDom: null,
      curProgressDom: null,
      voiceProgressDom: null,
      curVoiceProgressDom: null,
      dragging: false,
      fullscreenMode: false,
      cursorTimer: null,
      showControl: true,
      showSpeed: false,
      playSpeed: '1.0',
      playSpeedOptions: [
        '0.5',
        '1.0',
        '1.2',
        '1.5',
        '2.0',
        '4.0',
        '8.0',
        '16.0'
      ],
      bufferdPersend: 0,
      bufferdStartPersend: 0
    }
  },
  computed: {
    videoId() {
      return `${this.videoRefId}-video`
    },
    progressId() {
      return `${this.videoRefId}-progress`
    },
    curProgressId() {
      return `${this.videoRefId}-progress-current`
    },
    progressPersent() {
      return (100 * this.currentTime) / this.durationTime
    },
    voiceProgressId() {
      return `${this.videoRefId}-voice-progress`
    },
    curVoiceProgressId() {
      return `${this.videoRefId}-voice-progress-current`
    }
  },
  watch: {
    videoUrl() {
      this.initVideo()
    }
  },
  mounted() {
    this.progressDom = document.querySelector(`#${this.progressId}`)
    this.curProgressDom = document.querySelector(`#${this.curProgressId}`)
    this.voiceProgressDom = document.querySelector(`#${this.voiceProgressId}`)
    this.curVoiceProgressDom = document.querySelector(
      `#${this.curVoiceProgressId}`
    )
    this.initVideo()
    window.addEventListener('resize', this.listenResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.listenResize)
  },
  methods: {
    listenResize() {
      const isFullScreen =
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen
      const fullScreenStatus = isFullScreen === undefined ? false : isFullScreen
      if (!fullScreenStatus) this.fullscreenMode = false
    },
    changePlaySpeed(speed) {
      this.playSpeed = speed
      this.videoDom.playbackRate = Number(speed)
      this.showSpeed = false
    },
    movingMouse(e) {
      e.preventDefault()
      document.querySelector(`#${this.videoId}`).style.cursor = 'auto'
      if (this.cursorTimer) {
        this.showControl = true
        clearTimeout(this.cursorTimer)
        this.cursorTimer = setTimeout(() => {
          this.showControl = false
          document.querySelector(`#${this.videoId}`).style.cursor = 'none'
        }, 3000)
      }
      this.changingProgress(e)
    },
    changeVoiceProgressStart(e) {
      e.preventDefault()
      this.videoDom.muted = false
      this.muted = false
      this.volume = (
        100 *
        (1 -
          (e.offsetY ||
            e.changedTouches[0].pageY -
              e.changedTouches[0].radiusY -
              this.videoDom.getBoundingClientRect().y) /
            this.voiceProgressDom.offsetHeight)
      ).toFixed(0)
      this.dragging = true
    },
    changingVoiceProgress(e) {
      e.preventDefault()
      if (!this.dragging) return
      const progress = (
        1 -
        ((e.clientY || e.changedTouches[0].clientY) -
          this.voiceProgressDom.getBoundingClientRect().y) /
          this.voiceProgressDom.offsetHeight
      ).toFixed(2)
      if (progress < 0) this.volume = 0
      else if (progress >= 1) this.volume = 100
      else this.volume = progress * 100
      this.videoDom.volume = this.volume / 100
    },
    changeVoiceProgressEnd(e) {
      e.preventDefault()
      if (!this.dragging) return
      this.dragging = false
      this.videoDom.volume = this.volume / 100
    },
    muteVoice() {
      this.videoDom.muted = !this.muted
      this.muted = !this.muted
    },
    progressing(e) {
      // this.videoDom.buffered.end()
      const bStart = this.videoDom.buffered.start(0)
      const bEnd = this.videoDom.buffered.end(0)
      console.log(
        this.videoDom.buffered.start(0),
        this.videoDom.buffered.end(0)
      )
      const bufferdPersend = (100 * bStart) / this.durationTime
      // this.bufferdStartPersend = 100 * (bEnd - bStart) / this.durationTime
      this.bufferdStartPersend = this.progressPersent
      this.bufferdPersend =
        bufferdPersend + this.bufferdStartPersend > 100
          ? 100 - this.bufferdStartPersend
          : bufferdPersend

      // this.bufferdStartPersend = 0
    },
    changeProgressStart(e) {
      e.preventDefault()
      this.videoDom.pause()
      this.currentTime =
        (this.durationTime *
          (e.offsetX ||
            e.changedTouches[0].pageX -
              e.changedTouches[0].radiusX -
              this.videoDom.getBoundingClientRect().x)) /
        this.progressDom.offsetWidth
      this.dragging = true
    },
    changingProgress(e) {
      e.preventDefault()
      if (!this.dragging) return
      this.bufferdPersend = 0
      const progress =
        ((e.clientX || e.changedTouches[0].clientX) -
          this.curProgressDom.getBoundingClientRect().x) /
        this.progressDom.offsetWidth
      if (progress < 0) this.currentTime = 0
      else if (progress >= 1) this.currentTime = this.durationTime
      else this.currentTime = progress * this.durationTime
      this.videoDom.currentTime = this.currentTime
    },
    changeProgressEnd(e) {
      e.preventDefault()
      document.querySelector(`#${this.videoId}`).style.cursor = 'auto'
      if (this.cursorTimer) {
        this.showControl = true
        clearTimeout(this.cursorTimer)
        this.cursorTimer = setTimeout(() => {
          this.showControl = false
          this.showVolume = false
          this.showSpeed = false
          document.querySelector(`#${this.videoId}`).style.cursor = 'none'
        }, 3000)
      }
      if (!this.dragging) return
      this.dragging = false
      this.videoDom.currentTime = this.currentTime
      this.videoDom.play()
    },

    playHandler() {
      this.paused = false
      this.ended = false
      this.playing = true
    },
    pauseHandler() {
      this.paused = true
      this.ended = true
      this.playing = false
    },
    endHandler() {
      this.ended = true
      this.paused = true
      this.playing = false
    },
    durationchange() {
      this.durationTime = this.videoDom.duration
    },
    timeupdate(e) {
      if (!this.dragging) {
        this.currentTime = this.videoDom.currentTime
        this.curProgressDom.style.width = `${this.progressPersent}%`
      }
    },
    fullscreen() {
      if (document.webkitFullscreenElement) {
        // this.videoDom.webkitExitFullscreen()
        document.webkitExitFullscreen()
        this.fullscreenMode = false
      } else {
        // this.videoDom.webkitRequestFullscreen()
        // document.body.webkitRequestFullscreen()
        document.querySelector(`#${this.videoId}`).webkitRequestFullscreen()
        this.fullscreenMode = true
      }
    },
    playOrPause() {
      if (this.videoDom.paused || this.videoDom.ended) this.videoDom.play()
      else this.videoDom.pause()
    },
    timeFormatter(seconds, maxUnit) {
      if (maxUnit === 'min') {
        return `${this.preTimeZero(
          Math.floor(seconds / 60)
        )}:${this.preTimeZero(seconds % 60)}`
      } else if (maxUnit === 'hour') {
        const hour = seconds % 3600
        const lastSec = seconds - hour * 3600
        return `${this.preTimeZero(hour)}:${this.preTimeZero(
          Math.floor(lastSec / 60)
        )}:${this.preTimeZero(lastSec % 60)}`
      }
    },
    preTimeZero(num, length = 2) {
      let numStr = `${Math.floor(num)}`
      const numLength = numStr.length
      if (length < numLength) return numStr
      for (let i = 0; i < length - numLength; i++) numStr = '0' + numStr
      return numStr
    },
    initVideo() {
      if (this.videoUrl) {
        this.cursorTimer = setTimeout(() => {
          document.querySelector(`#${this.videoId}`).style.cursor = 'none'
          this.showControl = false
        }, 3000)
        this.videoDom = document.querySelector(`#${this.videoRefId}`)
        const player = dashjs.MediaPlayer().create()
        player.initialize(this.videoDom, this.videoUrl, !!this.autoplay)
        console.log('查看属性===>', [this.videoDom])
        this.volume = this.videoDom.volume * 100
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.DashVideo {
  width: 100%;
  height: 100%;
  position: relative;
  height: fit-content;
  video {
    width: 100%;
    height: 100%;
  }
  video::-webkit-media-controls-enclosure {
    /*禁用播放器控制栏的样式*/
    display: none !important;
  }
  .controlBar {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    // height: 60px;
    // background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
    p {
      user-select: none;
      color: #fff;
      white-space: nowrap;
    }
    .progress:hover {
      .progress-current-block {
        transform: scale(1.1);
      }
    }
    .progress {
      width: calc(100% - 32px);
      height: 6px;
      border-radius: 4px;
      background-color: #babdcc;
      cursor: pointer;
      position: relative;
      &-buffed {
        height: 100%;
        transition: 0.2s all;
        background-color: #cdd0e1;
        // width: 600px;
        border-radius: 6px;
        position: absolute;
        bottom: 0;
        z-index: 8;
        pointer-events: none;
      }
      &-current {
        position: relative;
        z-index: 10;
        background-color: #439dfc;
        height: 100%;
        // position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        pointer-events: none;
        border-radius: 4px;
        // transition: 0.2s all;
        &-block {
          transition: 0.2s all;
          background: #fff;
          width: 16px;
          height: 16px;
          border-radius: 16px;
          margin-top: -5px;
          margin-right: -10px;
          // position: absolute;
          pointer-events: none;
          cursor: pointer;
        }
      }
    }
    &-options {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 28px 24px 20px 34px;
      &-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        .controlBar-options-box-play:hover,
        .controlBar-options-box-fullscreen:hover {
          // font-size: 25px;
          transform: scale(1.1);
        }
        &-play {
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          transition: 0.2s all;
        }
        &-time {
          margin-left: 45px;
          font-size: 16px;
        }
        .controlBar-options-box-voice:hover {
          .controlBar-options-box-voice-control {
            // opacity: 1;
            // display: block;
          }
        }
        &-voice {
          // cursor: pointer;
          position: relative;
          margin-left: 28px;
          z-index: 300;
          &-mute {
            color: #fff;
            font-size: 22px;
            cursor: pointer;
          }
          &-control {
            // opacity: 0;
            // display: none;
            // transition: 0.2s opacity 0.3s;
            top: 0px;
            left: 50%;
            transform: translate(-50%, -100%);
            position: absolute;
            padding-bottom: 8px;
            &-inBox {
              background-color: rgba(0, 0, 0, 0.8);
              border-radius: 4px;
              width: 50px;
              height: 140px;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 12px 12px;
              .controlBar-options-box-voice-control-inBox-progress:hover {
                .controlBar-options-box-voice-control-inBox-progress-current-block {
                  transform: scale(1.1);
                }
              }
              &-progress {
                height: 100%;
                width: 4px;
                background-color: #fff;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                justify-content: flex-end;
                &-current {
                  height: 50%;
                  background-color: #439dfc;
                  pointer-events: none;
                  &-block {
                    width: 10px;
                    height: 10px;
                    border-radius: 10px;
                    margin-left: -3px;
                    background-color: #fff;
                    pointer-events: none;
                    transition: 0.2s all;
                  }
                }
              }
              &-num {
                margin-top: 12px;
              }
            }
          }
        }
        &-fullscreen {
          margin-left: 28px;
          font-size: 24px;
          color: #fff;
          cursor: pointer;
          transition: 0.2s all;
        }
        .controlBar-options-box-speed:hover {
          .controlBar-options-box-speed-control {
            // opacity: 1;
            // display: block;
          }
        }
        &-speed {
          position: relative;
          z-index: 300;
          &-icon {
            font-size: 24px;
            color: #fff;
            cursor: pointer;
          }
          &-num {
            cursor: pointer;
          }
          &-control {
            // opacity: 0;
            // display: none;
            // transition: 0.2s opacity 0.3s;
            top: 0px;
            left: 50%;
            transform: translate(-50%, -100%);
            position: absolute;
            padding-bottom: 8px;
            &-inBox {
              background-color: rgba(0, 0, 0, 0.8);
              border-radius: 4px;
              // width: 50px;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 6px 0;
              &-item {
                cursor: pointer;
                padding: 6px 20px;
                transition: 0.2s all;
              }
              .controlBar-options-box-speed-control-inBox-item:hover {
                background-color: rgba(0, 0, 0, 0.8);
              }
            }
          }
        }
      }
    }
  }
}
</style>

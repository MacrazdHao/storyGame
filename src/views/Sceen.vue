<template>
  <div class="Sceen">
    <div class="eventsBox">
      <div class="eventsBox-list">
        <div
          class="eventList-list-item"
          v-for="(item, index) in events"
          :key="index"
        >
          {{ item.text }}
          <template v-if="index === events.length - 1">
            <div v-if="item.viewSingleOptions">
              <div
                v-for="(option, oindex) in item.viewSingleOptions"
                :key="oindex"
              >
                <button @click="selectSingleOption(option)">
                  {{ option.text }}
                </button>
              </div>
            </div>
            <div v-if="item.viewMultipleOptions">
              <div
                v-for="(option, oindex) in item.viewMultipleOptions"
                :key="oindex"
              >
                <button @click="selectMultipleOption(oindex)">
                  {{ option.text }}
                </button>
              </div>
              <button @click="submitMultipleOptions(item)">确定</button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <button
      class="nextButton"
      style="width: 120px"
      @click="getOneEvent"
      :disabled="!showNextUnitTimeButton"
    >
      {{ newUnitTime ? "喜迎春节" : "下一事件" }}
    </button>
  </div>
</template>

<script>
import {
  // getEventObj,
  // getCertainEvent,
  // pushEventKeyToStack,
  getOptEventOptions,
  getMultiOptEventOptions,
  selectOptEventOption,
  selectMultiOptEventOptions,
  execEvent,
  getNextEvent,
  toNewUnitTime,
  createUser
} from '../assets/data/events'
export default {
  components: {},
  data () {
    return {
      userInfo: {
        userId: 'test',
        name: '测试用户名',
        age: -1,
        meili: 1,
        jiajing: 1,
        yongqi: 1,
        yunqi: 1
      },
      userStatus: {
        zaijia: 1
      },
      userBuff: {
        fennu: 0
      },
      unitTimeInfo: {
        curUnitTimeNum: 0,
        chronology: ['公元', '年', '月', '日'],
        date: [1996, 6, 14]
      },
      events: [],
      newUnitTime: false,
      selectedMultipleOptionIndex: []
    }
  },
  computed: {
    showNextUnitTimeButton () {
      return this.events.length
        ? !(
          this.events.at(-1).viewSingleOptions ||
            this.events.at(-1).viewMultipleOptions
        )
        : true
    },
    textOptions () {
      return {
        userInfo: { ...this.userInfo, ...this.userStatus },
        unitTimeInfo: { ...this.unitTimeInfo }
      }
    },
    curConditions () {
      return {
        ...this.userInfo,
        ...this.userStatus,
        ...this.userBuff,
        ...this.unitTimeInfo
      }
    },
    eventOptions () {
      return {
        eventOptions: {
          text: this.textOptions
        }
      }
    }
  },
  mounted () {
    createUser(this.userInfo.userId)
    this.toNewUnitTime()
  },
  methods: {
    selectMultipleOption (index) {
      if (this.selectedMultipleOptionIndex.includes(index)) {
        this.selectedMultipleOptionIndex =
          this.selectedMultipleOptionIndex.filter((item) => item !== index)
      } else this.selectedMultipleOptionIndex.push(index)
    },
    submitMultipleOptions (event) {
      selectMultiOptEventOptions(
        this.userInfo.userId,
        this.curConditions,
        event,
        this.selectedMultipleOptionIndex
      )
      this.selectedMultipleOptionIndex = []
      this.getOneEvent()
    },
    selectSingleOption (option) {
      selectOptEventOption(this.userInfo.userId, option)
      this.getOneEvent()
    },
    updateUserAge () {
      this.$set(this.userInfo, 'age', this.userInfo.age + 1)
      this.$set(
        this.unitTimeInfo,
        'curUnitTimeNum',
        this.unitTimeInfo.curUnitTimeNum + 1
      )
    },
    toNewUnitTime () {
      this.updateUserAge()
      toNewUnitTime(this.userInfo.userId, this.curConditions)
      this.newUnitTime = false
    },
    getOneEvent () {
      if (this.newUnitTime) this.toNewUnitTime()
      const eventInfo = getNextEvent(
        this.userInfo.userId,
        this.eventOptions,
        this.curConditions
      )
      if (eventInfo === 'end') {
        this.newUnitTime = true
        return
      }
      this.events.push({
        ...JSON.parse(JSON.stringify(eventInfo.event)),
        viewSingleOptions: eventInfo.event.optEvents
          ? getOptEventOptions(
            this.userInfo.userId,
            eventInfo.event,
            this.curConditions
          )
          : null,
        viewMultipleOptions: eventInfo.event.maxSelection
          ? getMultiOptEventOptions(eventInfo.event, this.curConditions)
          : null
      })
      console.log(this.events.at(-1))
      execEvent(
        this.userInfo.userId,
        eventInfo,
        this.unitTimeInfo.curUnitTimeNum,
        this.userInfo,
        this.curConditions
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.Sceen {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .eventsBox {
    width: 100%;
    height: calc(100% - 60px);
    overflow: auto;
    &-list {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-end;
      align-items: center;
      &-item {
        flex: none;
        width: fit-content;
      }
    }
  }
  .nextButton {
    height: 36px;
  }
}
</style>

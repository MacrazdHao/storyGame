<template>
  <div class="Sceen">
    <div v-for="(item, index) in events" :key="index">
      {{ item.text }}
    </div>
    <button style="width: 120px" @click="getOneEvent">next</button>
  </div>
</template>

<script>
import {
  // getEventObj,
  // getCertainEvent,
  // pushEventKeyToStack,
  // getOptEventOptions,
  // getMultiOptEventOptions,
  // selectOptEventOption,
  // selectMultiOptEventOption,
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
      newUnitTime: false
    }
  },
  computed: {
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
      this.events.push(JSON.parse(JSON.stringify(eventInfo.event)))
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
  // cursor: none;
}
</style>

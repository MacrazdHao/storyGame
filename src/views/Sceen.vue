<template>
  <div class="Sceen">
    <div class="infoBox">
      <div class="infoBox-unitTimeInfo">
        <p class="infoBox-unitTimeInfo-username">{{ userInfo.name }}</p>
        <p class="infoBox-unitTimeInfo-date">
          {{ unitTimeString }} - {{ unitTimeNumString }}
        </p>
      </div>
      <div class="infoBox-userInfo">
        <div class="infoBox-userInfo-row">
          <div
            v-for="(item, index) in userInfoStringArr.basic"
            :key="index"
            class="infoBox-userInfo-row-item"
          >
            <p class="infoBox-userInfo-row-item-label">{{ item[0] }}</p>
            <p class="infoBox-userInfo-row-item-value">{{ item[1] }}</p>
          </div>
        </div>
        <div class="infoBox-userInfo-row">
          <div
            v-for="(item, index) in userInfoStringArr.status"
            :key="index"
            class="infoBox-userInfo-row-item"
          >
            <p class="infoBox-userInfo-row-item-label">{{ item[0] }}</p>
            <p class="infoBox-userInfo-row-item-value">{{ item[1] }}</p>
          </div>
        </div>
        <div class="infoBox-userInfo-row">
          <div
            v-for="(item, index) in userInfoStringArr.buffs"
            :key="index"
            class="infoBox-userInfo-row-item"
          >
            <p class="infoBox-userInfo-row-item-label">{{ item[0] }}</p>
            <p class="infoBox-userInfo-row-item-value">{{ item[1] }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="eventsBox">
      <div class="eventsBox-list">
        <div
          v-for="(item, index) in events"
          :key="index"
          class="eventsBox-list-item"
          :style="item.style"
        >
          <p class="eventsBox-list-item-text">{{ item.text }}</p>
          <div
            v-if="index === events.length - 1"
            class="eventsBox-list-item-extra"
          >
            <div
              v-if="item.viewSingleOptions"
              class="eventsBox-list-item-extra-optionBox"
              :style="{
                justifyContent:
                  item.viewSingleOptions.length % 3 ? 'center' : 'flex-start',
              }"
            >
              <template v-for="(option, oindex) in item.viewSingleOptions">
                <div
                  v-if="!option.hide"
                  :key="oindex"
                  class="eventsBox-list-item-extra-optionBox-item"
                >
                  <div
                    :class="[
                      'button',
                      option.disabled ? 'button--disabled' : '',
                      'eventsBox-list-item-extra-optionBox-item-option',
                    ]"
                    :style="{ color: option.color }"
                    @click="selectSingleOption(option)"
                  >
                    {{ option.text }}
                  </div>
                </div>
              </template>
            </div>
            <div
              v-if="item.viewMultipleOptions"
              class="eventsBox-list-item-extra-optionBox"
              :style="{
                justifyContent:
                  item.viewMultipleOptions.length % 3 ? 'center' : 'flex-start',
              }"
            >
              <template v-for="(option, oindex) in item.viewMultipleOptions">
                <div
                  v-if="!option.hide"
                  :key="oindex"
                  class="eventsBox-list-item-extra-optionBox-item"
                >
                  <div
                    :class="[
                      'button',
                      option.disabled ? 'button--disabled' : '',
                      selectedMultipleOptionIndex.includes(oindex)
                        ? 'button--active'
                        : '',
                      'eventsBox-list-item-extra-optionBox-item-option',
                    ]"
                    :style="{ color: option.color }"
                    @click="selectMultipleOption(oindex, option)"
                  >
                    {{ option.text }}
                  </div>
                </div>
              </template>
            </div>
            <div
              v-if="item.viewMultipleOptions"
              class="button eventsBox-list-item-extra-confirm"
              @click="submitMultipleOptions(item)"
            >
              {{ mutipleConfirmButtonText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="[
        'button',
        !this.enabledNextUnitTimeButton ? 'button--disabled' : '',
        'nextButton',
      ]"
      @click="getOneEvent(true)"
    >
      {{ nextButtonString }}
    </div>
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
  updateLocalRecords,
  execEvent,
  getNextEvent,
  toNewUnitTime,
  createUser
} from '../assets/data'
// 待修改：jieshu=1时，使jieshu为1后面的事件不再执行和显示
export default {
  components: {},
  data() {
    return {
      userBasicInfoLabels: {
        age: '年龄',
        xingbie: '性别',
        tizhi: '体质',
        meili: '魅力',
        jiajing: '家境',
        yongqi: '勇气',
        yunqi: '运气',
        zhili: '智力',
        jiankang: '健康'
      },
      userStatusInfoLabels: {
        zailaojia: '在老家'
      },
      userBuffInfoLabels: {
        fennu: '愤怒'
      },
      // 待修改：后续将这部分提取到js文件，用函数获取初始属性
      userInfo: {
        userId: 'test',
        name: '测试用户名',
        xingbie: '男',
        // 男1，女0，中性-1
        sex: 1,
        age: -1,
        tizhi: 3,
        jiankang: 3,
        zhili: 3,
        meili: 3,
        jiajing: 3,
        yongqi: 3,
        yunqi: 6
      },
      userStatus: {
        // 常规状态，天赋，特质
        jieshu: 0,
        siwang: 0,
        zailaojia: 1,
        mamazaishi: 1,
        babazaishi: 1,
        danshen: 1,
        lianaicishu: 0,
        chunan: 1,
        linglixiulian: 0,
        routibusi: 0, // 肉体不死
        tezhi_meishaonvzhanshi: 0,
        tezhi_weizhi: 0,
        tianfu_jianshu: 0,
        tianfu_mofa: 0
      },
      userBuffs: {
        // Buff，特殊等级
        fennu: 0,
        dengji_shoushang: 0, // 受伤等级(1-2轻，3-4中，5-max重)
        dengji_jianshu: 0,
        dengji_weiwuzhuyi: 0,
        dengji_koucai: 0,
        dengji_linghun: 0
      },
      unitTimeInfo: {
        curUnitTimeNum: 0,
        dm: 0,
        chronology: ['公元', '年', '月', '日'],
        date: [2001, 6, 14]
      },
      events: [],
      newUnitTime: false,
      selectedMultipleOptionIndex: []
    }
  },
  computed: {
    nextButtonString() {
      if (this.newUnitTime) return '喜迎新年，恭喜你又老了一岁，施舍个红包吧'
      if (!this.enabledNextUnitTimeButton) {
        let callname = ''
        if (this.userInfo.age < 12) callname = '龟孙儿'
        else if (this.userInfo.age < 18) callname = '后生仔'
        else if (this.userInfo.age < 29 && this.userInfo.xingbie === '男') {
          callname = 'giegie'
        } else if (this.userInfo.age < 29 && this.userInfo.xingbie === '女') {
          callname = '靓女'
        } else if (this.userInfo.age < 50) callname = '欧吉桑'
        else callname = '老闭灯，一把年纪了'
        return callname + '，请做出你的选择，别老想着什么“我全都要”'
      }
      return '下一事件'
    },
    userInfoStringArr() {
      const userInfo = {
        basic: [],
        status: [],
        buffs: []
      }
      for (const key in this.userBasicInfoLabels) {
        userInfo.basic.push([
          this.userBasicInfoLabels[key],
          this.userInfo[key]
        ])
      }
      for (const key in this.userStatusInfoLabels) {
        userInfo.status.push([
          this.userStatusInfoLabels[key],
          this.userStatus[key]
        ])
      }
      for (const key in this.userBuffInfoLabels) {
        userInfo.buffs.push([
          this.userBuffInfoLabels[key],
          this.userBuffs[key]
        ])
      }
      return userInfo
    },
    unitTimeNumString() {
      return `第${this.unitTimeInfo.curUnitTimeNum}年`
    },
    unitTimeString() {
      return `${this.unitTimeInfo.chronology[0]} ${
        this.unitTimeInfo.date[0] + this.unitTimeInfo.chronology[1]
      }${this.unitTimeInfo.date[1] + this.unitTimeInfo.chronology[2]}${
        this.unitTimeInfo.date[2] + this.unitTimeInfo.chronology[3]
      }`
    },
    enabledNextUnitTimeButton() {
      return this.events.length
        ? !(
          this.events.at(-1).viewSingleOptions ||
            this.events.at(-1).viewMultipleOptions
        )
        : true
    },
    textOptions() {
      return {
        userInfo: { ...this.userInfo, ...this.userStatus, ...this.userBuffs },
        unitTimeInfo: { ...this.unitTimeInfo }
      }
    },
    styleOptions() {
      return {
        userInfo: { ...this.userInfo, ...this.userStatus, ...this.userBuffs },
        unitTimeInfo: { ...this.unitTimeInfo }
      }
    },
    curConditions() {
      return {
        ...this.userInfo,
        ...this.userStatus,
        ...this.userBuffs,
        ...this.unitTimeInfo,
        year: this.unitTimeInfo.date[0]
        // month: this.unitTimeInfo.date[1],
        // day: this.unitTimeInfo.date[2]
      }
    },
    eventOptions() {
      return {
        eventOptions: {
          text: this.textOptions,
          style: this.styleOptions
        }
      }
    },
    mutipleConfirmButtonText() {
      return this.selectedMultipleOptionIndex.length === 0 ? '跳过' : '确定'
    }
  },
  watch: {
    userInfo() {
      const { jiankang, tizhi } = this.userInfo
      if (jiankang > tizhi * 10 + 10) {
        this.$set(this.userInfo, 'jiankang', tizhi * 10 + 10)
      }
    },
    userStatus() {
      if (this.userStatus.danshen === 0) {
        this.$set(this.userStatus, 'yizhidanshen', 0)
      }
      if (this.userStatus.siwang) {
        // 待修改：gameover逻辑
      }
    }
  },
  mounted() {
    // const rNum = new Array(100000)
    //   .fill(0)
    //   .map(() => (Math.random() * 101).toFixed(0))
    // const pr = {}
    // for (let i = 0; i < 101; i++) {
    //   pr[i] = rNum.filter((item) => parseInt(item) === i).length / 100000
    // }
    // console.log(pr)
    createUser(this.userInfo.userId)
    this.initUserInfo()
    this.toNewUnitTime()
  },
  methods: {
    initUserInfo() {
      const { tizhi } = this.userInfo
      this.$set(this.userInfo, 'jiankang', tizhi * 10 + 10)
    },
    selectMultipleOption(index, option) {
      if (option.disabled || option.hide) return
      if (this.selectedMultipleOptionIndex.includes(index)) {
        this.selectedMultipleOptionIndex =
          this.selectedMultipleOptionIndex.filter((item) => item !== index)
      } else this.selectedMultipleOptionIndex.push(index)
    },
    submitMultipleOptions(event) {
      // 多选参数待修改：
      // multiOptDefault
      // requireSelectNum
      // maxSelection(似乎可合并到requireSelectNum)
      // maxRepeat
      selectMultiOptEventOptions(
        this.userInfo.userId,
        this.curConditions,
        event,
        this.selectedMultipleOptionIndex
      )
      this.selectedMultipleOptionIndex = []
      this.getOneEvent()
    },
    selectSingleOption(option) {
      if (option.disabled || option.hide) return
      selectOptEventOption(this.userInfo.userId, option)
      this.getOneEvent()
    },
    updateUserAge() {
      this.$set(this.userInfo, 'age', this.userInfo.age + 1)
      this.$set(
        this.unitTimeInfo,
        'curUnitTimeNum',
        this.unitTimeInfo.curUnitTimeNum + 1
      )
      this.$set(this.unitTimeInfo, 'date', [
        this.unitTimeInfo.date[0] + 1,
        this.unitTimeInfo.date[1],
        this.unitTimeInfo.date[2]
      ])
    },
    toNewUnitTime() {
      this.updateUserAge()
      toNewUnitTime(
        this.userInfo.userId,
        this.eventOptions,
        this.curConditions
      )
      this.newUnitTime = false
    },
    getOneEvent(fromButton = false) {
      if (fromButton && !this.enabledNextUnitTimeButton) return
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
      const { userInfo } = execEvent(
        this.userInfo.userId,
        eventInfo,
        this.unitTimeInfo.curUnitTimeNum,
        this.curConditions,
        this.curConditions
      )
      for (const key in this.userInfo) {
        this.$set(this.userInfo, key, userInfo[key])
        delete userInfo[key]
      }
      for (const key in this.unitTimeInfo) {
        this.$set(this.unitTimeInfo, key, userInfo[key])
        delete userInfo[key]
      }
      // 除了userInfo和unitTimeInfo这两个部分的属性值是固定的，其余所有均列入userBuffs
      for (const key in userInfo) {
        this.$set(this.userBuffs, key, userInfo[key])
      }
      updateLocalRecords(this.userInfo.userId, {
        userBasicInfoLabels: this.userBasicInfoLabels,
        userStatusInfoLabels: this.userStatusInfoLabels,
        userBuffInfoLabels: this.userBuffInfoLabels,
        userInfo: this.userInfo,
        userStatus: this.userStatus,
        userBuffs: this.userBuffs,
        unitTimeInfo: this.unitTimeInfo,
        events: this.events,
        newUnitTime: this.newUnitTime,
        selectedMultipleOptionIndex: this.selectedMultipleOptionIndex
      })
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
  .infoBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-unitTimeInfo {
      width: 100%;
      height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #000;
      box-sizing: border-box;
      padding: 0px 4px;
      p {
        font-size: 14px;
        white-space: nowrap;
      }
      &-username {
      }
      &-date {
      }
    }
    &-userInfo {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #000;
      &-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        &-item {
          display: flex;
          flex-direction: row;
          width: 33.333%;
          // border: 1px solid #000;
          p {
            font-size: 12px;
            white-space: nowrap;
            line-height: 24px;
          }
          &-label {
            width: fit-content;
            // border-right: 1px solid #000;
            background-color: rgb(142, 219, 255);
            box-sizing: border-box;
            padding: 0 4px;
          }
          &-value {
            width: fit-content;
            flex: 1;
            background-color: rgb(206, 240, 255);
            padding: 0 4px;
          }
        }
      }
    }
  }
  .eventsBox {
    width: 100%;
    height: calc(100% - 60px);
    overflow: auto;
    border-bottom: 1px solid #000;
    display: flex;
    flex-direction: column-reverse;
    &-list {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      &-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(55, 105, 255);
        box-sizing: border-box;
        padding: 6px;
        &-text {
          font-size: 14px;
          text-align: left;
        }
        &-extra {
          margin-top: 12px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &-optionBox {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            &-item {
              min-width: calc(33.333% - 8px);
              max-width: 100%;
              margin: 2px 4px;
              &-option {
              }
            }
          }
          &-confirm {
            margin-top: 12px;
            width: fit-content;
          }
        }
      }
    }
  }
  .nextButton {
    width: 100%;
    min-height: 36px;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .button {
    cursor: pointer;
    color: #fff;
    user-select: none;
    background-color: rgb(112, 131, 255);
    transition: 0.2s all;
    padding: 4px 8px;
    box-sizing: border-box;
  }
  .button--disabled {
    background-color: rgb(149, 163, 255) !important;
  }
  .button--active {
    background-color: rgb(93, 114, 255) !important;
  }
  .button:hover {
    background-color: rgb(126, 143, 252);
  }
  .button:active {
    background-color: rgb(93, 114, 255);
  }
}
</style>

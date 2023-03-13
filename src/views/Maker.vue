<template>
  <div class="Maker">
    <div class="formBox"></div>
    <div class="previewBox"></div>
  </div>
</template>

<script>
import {
  MAXNUM,
  MINNUM,
  BasicYunqi,
  RareValue,
  DMMap,
  EventCode,
  getRandom
} from '@/eventObjects'
export default {
  data () {
    return {
      // 单选(必选)
      baseType: [
        {
          text: '默认事件',
          value: 'default',
          obj: {
            isDefault: true,
            isCertain: false,
            isPassive: false,
            times: MAXNUM,
            timesOfUnit: MAXNUM
          }
        },
        {
          text: '被动事件',
          value: 'passive',
          obj: {
            isDefault: false,
            isCertain: false,
            isPassive: true
          }
        },
        {
          text: '必然事件',
          value: 'certain',
          obj: {
            isDefault: false,
            isCertain: true,
            isPassive: false
          }
        }
      ],
      // 多选(可选)
      funcType: [
        {
          text: '概率事件',
          value: 'pr',
          obj: {
            prNumber: 0,
            prEvents: {
              demo: 100 // Number, 正数, 概率权重
            },
            prGoodOrBad: {
              demo: 0 // Number, 负坏正好
            },
            prRepeat: {
              demo: 1 // Number, 正数, 可重复次数
            },
            prDefault: 'gailvmoren'
          }
        },
        {
          text: '绑定事件',
          value: 'bind',
          obj: {
            bindEvents: {
              demo: {
                duration: 0, // Number, 延迟执行回合数
                conditions: {
                  // attr: [min, max]
                },
                donotMismatchToDefault: false // Boolean, 不要执行bindDefault
              }
            },
            bindDefault: 'bangdingmoren'
          }
        }
      ],
      // 单选(可选)
      optType: [
        {
          text: '选项事件',
          value: 'opt',
          obj: {
            optEvents: {
              demo: {
                text: '示例',
                color: '#000',
                conditions: {
                  // attr: [min, max]
                }
              }
            },
            optDefault: 'kexuanmoren', // 无满足条件的选项时，返回的唯一选项对应的事件
            multiOptions: null
          }
        },
        {
          text: '多选事件',
          value: 'multi',
          obj: {
            multiOptions: [
              {
                text: '示例1',
                color: '#000',
                maxRepeat: 1, // 可重复选择次数
                conditions: {
                  // attr: [min, max]
                }, // 该选项需达成该条件才可用
                disabledConditions: {
                  // attr: [min, max]
                } // 达成条件时该选项不可用
              },
              {
                text: '示例2',
                color: '#000',
                maxRepeat: 1, // 可重复选择次数
                conditions: {
                  // attr: [min, max]
                }, // 该选项需达成该条件才显示
                disabledConditions: {
                  // attr: [min, max]
                } // 达成条件时该选项隐藏
              }
            ],
            maxSelection: 2, // Number, 最大可选数，对[无满足条件的选项时]的唯一选项不起作用
            requireSelectNum: [2, MAXNUM], // Array(Number), 最少选择数、最大选择数
            multiMixEvents: {
              '0_1': 'demo',
              any: 'demo' // 所选择的选项没有对应的回调事件时执行的默认事件
            }, // 多选匹配事件
            multiOptDefault: 'duoxuanmoren', // 无满足条件的选项时，返回的唯一选项对应的事件
            optEvents: null
          }
        }
      ],
      originEventObj: {
        text: (options) => '',
        style: (options) => ({}),
        times: (initTimes = MAXNUM) => initTimes,
        timesOfUnit: (times = 1) => times,
        // curTimesOfUnit: (times = 1) => times,
        triggerConditions: (attr = { age: [0, MAXNUM] }) => ({ ...attr }),
        execNormalDefaultWhenMismatchConditions: (execDefault = false) =>
          execDefault,
        effectAttr: (attr = {}) => ({ ...attr }),
        // 用于变更或替换其他事件次数(times, timesOfUnit, curTimesOfUnit)（待修改：添加处理逻辑）
        effectEvents: (events = {}) => ({ ...events }),
        // 待修改： 添加prEventsExtraWeight和extraRandomEvents的逻辑
        prEventsExtraWeight: (events = {}) => ({ ...events }),
        extraRandomEvents: (events = {}) => ({ ...events }),
        normalDefault: (eventKey = 'putongmoren') => eventKey
      }
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.Maker {
}
</style>

<template>
  <div class="Maker">
    <div class="formBox">

    </div>
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
// 可编辑内容：
// 事件、属性
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
        text: '', // 可使用属性条件
        style: {}, // 可使用属性条件
        times: MAXNUM,
        timesOfUnit: 1,
        triggerConditions: {
          // attr: [min, max]
        },
        execNormalDefaultWhenMismatchConditions: false,
        effectAttr: {
          // attr: Number
        },
        // 事件次数额外增益
        effectEvents: {
          demo: {
            timesOfUnit: 1, // 每回合执行次数上限
            timesOfUnitReplace: false, // false为直接替换timesOfUnit，true为叠加
            lastUnitTime: 1 // 该项事件影响效果剩余持续回合数
          }
        },
        // 概率事件额外权重增益
        prEventsExtraWeight: {
          demo: {
            persent: 0, // 按百分比增加概率权重
            weight: 0, // 叠加概率权重
            times: 1, // 总有效次数，最多可执行次数
            weightReplace: false, // 为true时，将该事件权重直接替换为weight的值，persent变为无效
            lastUnitTime: 1 // 该项事件影响效果剩余持续回合数
          }
        },
        // 额外的随机事件
        extraRandomEvents: {
          demo: {
            persent: 10, // 该事件的百分比概率
            lastUnitTime: 1, // 该项事件影响效果剩余持续回合数
            times: 1, // 总有效次数，最多可执行次数
            goodOrBad: 0 // 负坏事，正好事
          }
        },
        normalDefault: 'putongmoren' // 未达成事件条件时执行的事件
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

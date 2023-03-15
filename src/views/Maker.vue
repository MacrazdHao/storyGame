<template>
  <div class="Maker">
    <div class="formBox">
      <div class="formBox-block">
        <p class="formBox-block-label">事件类型</p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">基础类型(必选)</p>
          <div class="formBox-block-item-radioBox">
            <p
              v-for="(item, index) in baseType"
              :key="index"
              :class="[
                'formBox-block-item-radioBox-radio',
                index === selectedBaseType
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              @click="selectBaseType(index)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              {{ item.text }}
            </p>
          </div>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">功能类型(多选)</p>
          <div class="formBox-block-item-radioBox">
            <p
              v-for="(item, index) in funcType"
              :key="index"
              :class="[
                'formBox-block-item-radioBox-radio',
                selectedFuncType.includes(index)
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              @click="selectFuncType(index)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              {{ item.text }}
            </p>
          </div>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">选项类型</p>
          <div class="formBox-block-item-radioBox">
            <p
              v-for="(item, index) in optType"
              :key="index"
              :class="[
                'formBox-block-item-radioBox-radio',
                index === selectedOptType
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              @click="selectOptType(index)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
      <div class="formBox-block">
        <p class="formBox-block-label">事件属性</p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">事件KEY</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入事件KEY"
            :value="key"
            @input="inputKey"
          />
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">事件描述</p>
          <div class="formBox-block-item-textareaBox">
            <GhTextarea
              class="formBox-block-item-textarea"
              placeholder="请输入事件描述段落"
              :value="text"
              @input="inputText"
            />
            <p class="formBox-block-item-tips">
              Tips1:
              如若加入属性三目运算，请使用双中括号"[[]]"将内容括起，例：[[a>=1?'是':'否']]
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 可用属性1 角色信息userInfo，悬停可查看可用属性
              <!-- 待修改，次数点击可预览可用属性 -->
            </p>
            <p class="formBox-block-item-tips">
              Tips3: 可用属性2 回合信息unitTimeInfo({ curUnitTimeNum: 0, dm: 0,
              chronology: ['公元', '年', '月', '日'], date: [2001, 6, 14] })
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">事件样式</p>
          <div class="formBox-block-item-styleBox">
            <div
              v-for="(item, index) in style"
              :key="index"
              class="formBox-block-item-styleBox-item"
            >
              <GhInput
                class="formBox-block-item-styleBox-item-input"
                placeholder="style属性名"
                :value="item.key"
                @input="(text) => inputStyleKey(index, text)"
              />
              <GhInput
                class="formBox-block-item-styleBox-item-input"
                placeholder="style属性值"
                :value="item.value"
                @input="(text) => inputStyleValue(index, text)"
              />
              <p
                class="formBox-block-item-styleBox-item-delBtn"
                @click="removeStyleItem(index)"
              >
                -- 移除 --
              </p>
            </div>
            <p class="formBox-block-item-styleBox-addBtn" @click="addStyleItem">
              ++ 添加一项 ++
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">总可执行次数</p>
          <div class="formBox-block-item-inputBox">
            <GhInput
              class="formBox-block-item-input"
              placeholder="请输入总可执行次数（小数将只保留整数位）"
              :value="times"
              :max-length="MaxNumLength"
              @input="inputTimes"
            />
            <p
              v-if="timesNotNumber"
              class="formBox-block-item-tips formBox-block-item-tips--warning"
            >
              请输入正确的数字
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">回合可执行次数</p>
          <div class="formBox-block-item-inputBox">
            <GhInput
              class="formBox-block-item-input"
              placeholder="请输入回合可执行次数（小数将只保留整数位）"
              :value="timesOfUnit"
              :max-length="MaxNumLength"
              @input="inputTimesOfUnit"
            />
            <p
              v-if="timesOfUnitNotNumber"
              class="formBox-block-item-tips formBox-block-item-tips--warning"
            >
              请输入正确的数字
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">触发条件</p>
          <div class="formBox-block-item-conditionBox">
            <p
              :class="[
                'formBox-block-item-tips',
                triggerConditionsError
                  ? 'formBox-block-item-tips--warning'
                  : '',
              ]"
            >
              最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
            </p>
            <div
              v-for="(item, index) in triggerConditions"
              :key="index"
              class="formBox-block-item-conditionBox-item"
            >
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="角色属性名"
                :value="item.key"
                @input="(text) => inputConditionKey(index, text)"
              />
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="角色属性最小值(含)"
                :value="item.min"
                :max-length="MaxNumLength"
                @input="(text) => inputConditionMinValue(index, text)"
              />
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="角色属性最大值(不含)"
                :value="item.max"
                :max-length="MaxNumLength"
                @input="(text) => inputConditionMaxValue(index, text)"
              />
              <p
                :class="[
                  'formBox-block-item-conditionBox-item-errTag',
                  triggerConditionsErrorIndex.includes(index)
                    ? 'formBox-block-item-conditionBox-item-errTag--show'
                    : '',
                ]"
              >
                ×
              </p>
              <p
                class="formBox-block-item-conditionBox-item-delBtn"
                @click="removeConditionItem(index)"
              >
                -- 移除 --
              </p>
            </div>
            <p
              class="formBox-block-item-conditionBox-addBtn"
              @click="addConditionItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
              回合信息(unitTimeInfo), 年份(year)
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 指定某一数值时，如a属性需要完全等于10时，则需输入a 10 11
            </p>
          </div>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">条件不足是否执行通用默认事件</p>
          <div class="formBox-block-item-radioBox">
            <p
              :class="[
                'formBox-block-item-radioBox-radio',
                execNormalDefaultWhenMismatchConditions
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              @click="setExecNormalDefaultWhenMismatchConditions(true)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              是
            </p>
            <p
              :class="[
                'formBox-block-item-radioBox-radio',
                !execNormalDefaultWhenMismatchConditions
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              @click="setExecNormalDefaultWhenMismatchConditions(false)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              否
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">角色影响</p>
          <div class="formBox-block-item-attrEffectBox">
            <p
              :class="[
                'formBox-block-item-tips',
                attrEffectError ? 'formBox-block-item-tips--warning' : '',
              ]"
            >
              准确值、最大值和最小值必须为数字（小数将只保留整数位）
            </p>
            <div
              v-for="(item, index) in effectAttr"
              :key="index"
              class="formBox-block-item-attrEffectBox-item"
            >
              <GhInput
                class="formBox-block-item-attrEffectBox-item-input"
                placeholder="角色属性名"
                :value="item.key"
                @input="(text) => inputAttrEffectKey(index, text)"
              />
              <template v-if="item.mode === 'random'">
                <GhInput
                  class="formBox-block-item-attrEffectBox-item-input"
                  placeholder="影响属性最小值(含)"
                  :value="item.min"
                  :max-length="MaxNumLength"
                  @input="(text) => inputAttrEffectMinValue(index, text)"
                />
                <GhInput
                  class="formBox-block-item-attrEffectBox-item-input"
                  placeholder="影响属性最大值(不含)"
                  :value="item.max"
                  :max-length="MaxNumLength"
                  @input="(text) => inputAttrEffectMaxValue(index, text)"
                />
              </template>
              <GhInput
                v-else-if="item.mode === 'exact'"
                class="formBox-block-item-attrEffectBox-item-input"
                placeholder="影响属性值"
                :value="item.value"
                :max-length="MaxNumLength"
                @input="(text) => inputAttrEffectValue(index, text)"
              />
              <p
                :class="[
                  'formBox-block-item-attrEffectBox-item-errTag',
                  attrEffectErrorIndex.includes(index)
                    ? 'formBox-block-item-attrEffectBox-item-errTag--show'
                    : '',
                ]"
              >
                ×
              </p>
              <p
                class="formBox-block-item-attrEffectBox-item-trigBtn"
                @click="changeAttrEffectItem(index)"
              >
                -- 切换值模式 --
              </p>
              <p
                class="formBox-block-item-attrEffectBox-item-delBtn"
                @click="removeAttrEffectItem(index)"
              >
                -- 移除 --
              </p>
            </div>
            <p
              class="formBox-block-item-attrEffectBox-addBtn"
              @click="addAttrEffectItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
              回合信息(unitTimeInfo)
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 值模式分为准确值模式和随机值模式
            </p>
            <p class="formBox-block-item-tips">
              Tips3:
              值模式为随机值模式时，min或max任一为空时，生成事件时将自动转为准确值模式，对应值为min
              / max-1，两种模式都不填写值时，不写入事件内
            </p>
            <p class="formBox-block-item-tips">
              Tips4: 负值为负面影响，正值为正面影响
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">事件影响</p>
          <div class="formBox-block-item-effectEvent">
            <p
              :class="[
                'formBox-block-item-tips',
                attrEffectError ? 'formBox-block-item-tips--warning' : '',
              ]"
            >
              回合执行次数上限、持续回合数必须为数字（小数将只保留整数位）
            </p>
            <div
              v-for="(item, index) in effectAttr"
              :key="index"
              class="formBox-block-item-effectEvent-item"
            >
              <div class="formBox-block-item-effectEvent-item-row">
                <GhInput
                  class="formBox-block-item-effectEvent-item-input"
                  placeholder="事件Key"
                  :value="item.key"
                  @input="(text) => inputEffectEventKey(index, text)"
                />
              </div>
              <div class="formBox-block-item-effectEvent-item-row">
                <GhInput
                  class="formBox-block-item-effectEvent-item-input"
                  placeholder="回合执行次数上限"
                  :value="item.timesOfUnit"
                  :max-length="MaxNumLength"
                  @input="(text) => inputEffectEventTimesOfUnit(index, text)"
                />
                <div class="">
                  <p class="formBox-block-item-label">次数模式</p>
                  <div class="formBox-block-item-radioBox">
                    <p
                      :class="[
                        'formBox-block-item-radioBox-radio',
                        item.timesOfUnitReplace
                          ? 'formBox-block-item-radioBox-radio--selected'
                          : '',
                      ]"
                      @click="setEffectEventTimesOfUnitMode(index, true)"
                    >
                      <span class="formBox-block-item-radioBox-radio-dot" />
                      替换
                    </p>
                    <p
                      :class="[
                        'formBox-block-item-radioBox-radio',
                        !item.timesOfUnitReplace
                          ? 'formBox-block-item-radioBox-radio--selected'
                          : '',
                      ]"
                      @click="setEffectEventTimesOfUnitMode(index, false)"
                    >
                      <span class="formBox-block-item-radioBox-radio-dot" />
                      叠加
                    </p>
                  </div>
                </div>
              </div>
              <div class="formBox-block-item-effectEvent-item-row">
                <GhInput
                  class="formBox-block-item-effectEvent-item-input"
                  placeholder="回合执行次数上限"
                  :value="item.times"
                  :max-length="MaxNumLength"
                  @input="(text) => inputEffectEventTimes(index, text)"
                />
                <div class="">
                  <p class="formBox-block-item-label">次数模式</p>
                  <div class="formBox-block-item-radioBox">
                    <p
                      :class="[
                        'formBox-block-item-radioBox-radio',
                        item.timesReplace
                          ? 'formBox-block-item-radioBox-radio--selected'
                          : '',
                      ]"
                      @click="setEffectEventTimesMode(index, true)"
                    >
                      <span class="formBox-block-item-radioBox-radio-dot" />
                      替换
                    </p>
                    <p
                      :class="[
                        'formBox-block-item-radioBox-radio',
                        !item.timesReplace
                          ? 'formBox-block-item-radioBox-radio--selected'
                          : '',
                      ]"
                      @click="setEffectEventTimesMode(index, false)"
                    >
                      <span class="formBox-block-item-radioBox-radio-dot" />
                      叠加
                    </p>
                  </div>
                </div>
              </div>
              <div class="formBox-block-item-effectEvent-item-row">
                <GhInput
                  class="formBox-block-item-effectEvent-item-input"
                  placeholder="效果持续回合数"
                  :value="item.lastUnitTime"
                  :max-length="MaxNumLength"
                  @input="(text) => inputEffectEventLastUnitTime(index, text)"
                />
              </div>
              <p
                class="formBox-block-item-effectEvent-item-delBtn"
                @click="removeEffectEventItem(index)"
              >
                -- 移除 --
              </p>
            </div>
            <p
              class="formBox-block-item-effectEvent-addBtn"
              @click="addEffectEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1: 该属性用于改变其他已存在事件的【回合执行次数上限】、【总执行次数上限】
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 次数模式分为叠加/替换两种模式
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="formBox-block">
      <p class="formBox-block-label">生成事件</p>
      <div class="formBox-block-item">
        <p class="formBox-block-item-label">输出模式</p>
        <div class="formBox-block-item-radioBox">
          <p
            v-for="(item, index) in createModes"
            :key="index"
            :class="[
              'formBox-block-item-radioBox-radio',
              index === selectedCreateMode
                ? 'formBox-block-item-radioBox-radio--selected'
                : '',
            ]"
            @click="selectCreateMode(index)"
          >
            <span class="formBox-block-item-radioBox-radio-dot" />
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>
    <div class="previewBox" />
  </div>
</template>

// 不存在事件检测（关联的事件不存在）
// 事件联想输入框（搜索text和key）

<script>
import GhInput from '@/components/GhInput'
import GhTextarea from '@/components/GhTextarea'
import StaticImagingInput from '@/components/StaticImagingInput'
import {
  MAXNUM,
  MINNUM,
  BasicYunqi,
  RareValue,
  DMMap,
  EventCode,
  getRandom
} from '@/assets/data/events/eventObjects'
// 可编辑内容：
// 事件、属性
export default {
  components: {
    GhInput,
    GhTextarea,
    StaticImagingInput
  },
  data() {
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
      selectedBaseType: 0,
      selectedFuncType: [],
      selectedOptType: -1,
      timesNotNumber: false,
      timesOfUnitNotNumber: false,
      triggerConditionsError: false,
      triggerConditionsErrorIndex: [],
      attrEffectError: false,
      attrEffectErrorIndex: [],
      // 属性
      key: '',
      text: '', // 可使用属性条件
      textArr: [], // 用于生成text
      style: [], // 可使用属性条件
      times: MAXNUM,
      timesOfUnit: 1,
      triggerConditions: [],
      execNormalDefaultWhenMismatchConditions: true,
      effectAttr: [], // attr: Number|Array
      // 事件次数额外增益
      effectEvents: {
        demo: {
          times: 1, // 总执行次数上限
          timesReplace: false, // false为直接替换times，true为叠加
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
      normalDefault: 'putongmoren', // 未达成事件条件时执行的事件

      // 生成模式
      createModes: [
        {
          text: '输出字符串'
        },
        {
          text: '写入文件'
        }
      ],
      selectedCreateMode: 0
    }
  },
  computed: {
    MaxNumLength() {
      return (MAXNUM + '').length
    },
    eventObjString() {
      return `{
        text: (options) =>
      }`
    },
    eventObj() {
      const textArr = this.getTextArr()
      const style = {}
      const times = parseInt(this.times)
      const timesOfUnit = parseInt(this.timesOfUnit)
      const triggerConditions = {}
      const effectAttr = {}
      this.style.forEach((item) => {
        if (item.key) style[item.key] = item.value
      })
      this.triggerConditions.forEach((item) => {
        if (item.key) {
          const max = parseInt(item.max)
          const min = parseInt(item.min)
          triggerConditions[item.key] = [
            isNaN(min) ? MINNUM : min,
            isNaN(max) ? MAXNUM : max
          ]
        }
      })
      this.effectAttr.forEach((item) => {
        if (item.key) {
          if (item.mode === 'random' && (item.max || item.min)) {
            const max = parseInt(item.max)
            const min = parseInt(item.min)
            if (!isNaN(min) && !isNaN(max)) effectAttr[item.key] = [min, max]
            else if (isNaN(min) && !isNaN(max)) {
              effectAttr[item.key] = max - 1
            } else if (!isNaN(min) && isNaN(max)) {
              effectAttr[item.key] = min
            }
          }
          if (item.mode === 'exact' && item.value) {
            const value = parseInt(item.value)
            effectAttr[item.key] = isNaN(value) ? 0 : value
          }
        }
      })
      return {
        eventKey: this.key,
        textArr,
        text: "false||function(options){let text='';for(let i=0;i<this.textArr.length;i++){const item=this.textArr[i];const isJur=item.indexOf('[[')>-1&&item.indexOf(']]')>-1;if(!isJur){text+=item;continue;}const jurCmd=item.substring(2,item.length-2);if(jurCmd){try{text+=eval('options.'+jurCmd);}catch(err){console.log(err);text+='';}}}return text;}",
        style,
        times: isNaN(times) ? MAXNUM : times,
        timesOfUnit: isNaN(timesOfUnit) ? 1 : timesOfUnit,
        triggerConditions,
        effectAttr
      }
    }
  },
  watch: {
    eventObj() {
      console.log(this.eventObj)
    },
    times() {
      this.timesNotNumber = isNaN(parseInt(this.times))
    },
    timesOfUnit() {
      this.timesOfUnitNotNumber = isNaN(parseInt(this.timesOfUnit))
    },
    triggerConditions() {
      this.triggerConditionsError = false
      this.triggerConditionsErrorIndex = []
      for (let i = 0; i < this.triggerConditions.length; i++) {
        const item = this.triggerConditions[i]
        const max = item.max ? parseInt(item.max) : MAXNUM
        const min = item.min ? parseInt(item.min) : MINNUM
        const errItem = isNaN(max) || isNaN(min)
        if (errItem) this.triggerConditionsErrorIndex.push(i)
      }
    },
    effectAttr() {
      this.attrEffectError = false
      this.attrEffectErrorIndex = []
      for (let i = 0; i < this.effectAttr.length; i++) {
        const item = this.effectAttr[i]
        let errItem = false
        if (item.mode === 'random') {
          const max = item.max ? parseInt(item.max) : MAXNUM
          const min = item.min ? parseInt(item.min) : MINNUM
          errItem = isNaN(max) || isNaN(min)
        }
        if (item.mode === 'exact') {
          const value = item.value ? parseInt(item.value) : 0
          errItem = isNaN(value)
        }
        if (errItem) this.attrEffectErrorIndex.push(i)
      }
      this.attrEffectError = this.attrEffectErrorIndex.length
    }
  },
  mounted() {
    // console.log(this.MaxNumLength)
  },
  methods: {
    getTextArr() {
      let text = this.text
      const texts = []
      while (text) {
        const st = text.indexOf('[[')
        const en = text.indexOf(']]')
        if (st < 0 || en < 0) {
          texts.push(text)
          text = ''
          continue
        }
        const comText = text.substring(0, st)
        const jurText = text.substring(st, en + 2)
        if (comText) texts.push(comText)
        if (jurText) texts.push(jurText)
        text = text.substring(en + 2)
      }
      return texts
    },
    selectBaseType(sindex) {
      this.selectedBaseType = this.selectedBaseType === sindex ? -1 : sindex
    },
    selectFuncType(sindex) {
      if (this.selectedFuncType.includes(sindex)) {
        this.selectedFuncType = this.selectedFuncType.filter(
          (item) => item !== sindex
        )
        return
      }
      this.selectedFuncType.push(sindex)
    },
    selectOptType(sindex) {
      this.selectedOptType = this.selectedOptType === sindex ? -1 : sindex
    },
    selectCreateMode(sindex) {
      this.selectedCreateMode =
        this.selectedCreateMode === sindex ? -1 : sindex
    },
    inputKey(text) {
      this.key = text
    },
    inputText(text) {
      this.text = text
    },
    inputStyleKey(index, text) {
      this.$set(this.style, index, {
        ...this.style[index],
        key: text
      })
    },
    inputStyleValue(index, text) {
      this.$set(this.style, index, {
        ...this.style[index],
        value: text
      })
    },
    addStyleItem() {
      this.style.push({ key: '', value: '' })
    },
    removeStyleItem(sindex) {
      this.style = this.style.filter((item, index) => sindex !== index)
    },
    inputTimes(text) {
      this.times = text
    },
    inputTimesOfUnit(text) {
      this.timesOfUnit = text
    },
    inputConditionKey(index, text) {
      this.$set(this.triggerConditions, index, {
        ...this.triggerConditions[index],
        key: text
      })
    },
    inputConditionMinValue(index, text) {
      this.$set(this.triggerConditions, index, {
        ...this.triggerConditions[index],
        min: text
      })
    },
    inputConditionMaxValue(index, text) {
      this.$set(this.triggerConditions, index, {
        ...this.triggerConditions[index],
        max: text
      })
    },
    addConditionItem() {
      this.triggerConditions.push({ key: '', min: '', max: '' })
    },
    removeConditionItem(sindex) {
      this.triggerConditions = this.triggerConditions.filter(
        (item, index) => sindex !== index
      )
    },
    setExecNormalDefaultWhenMismatchConditions(value) {
      this.execNormalDefaultWhenMismatchConditions = value
    },
    inputAttrEffectKey(index, text) {
      this.$set(this.effectAttr, index, {
        ...this.effectAttr[index],
        key: text
      })
    },
    inputAttrEffectMinValue(index, text) {
      this.$set(this.effectAttr, index, {
        ...this.effectAttr[index],
        min: text
      })
    },
    inputAttrEffectMaxValue(index, text) {
      this.$set(this.effectAttr, index, {
        ...this.effectAttr[index],
        max: text
      })
    },
    inputAttrEffectValue(index, text) {
      this.$set(this.effectAttr, index, {
        ...this.effectAttr[index],
        value: text
      })
    },
    changeAttrEffectItem(index) {
      this.$set(this.effectAttr, index, {
        ...this.effectAttr[index],
        mode: this.effectAttr[index].mode === 'exact' ? 'random' : 'exact'
      })
    },
    addAttrEffectItem() {
      this.effectAttr.push({
        key: '',
        min: '',
        max: '',
        value: '',
        mode: 'exact'
      })
    },
    removeAttrEffectItem(sindex) {
      this.effectAttr = this.effectAttr.filter(
        (item, index) => sindex !== index
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.Maker {
  width: 100%;
  padding: 8px 12px;
  .formBox {
    width: 100%;
    .formBox-block + .formBox-block {
      margin-top: 16px;
    }
    &-block {
      width: 100%;
      &-label {
        // width: 100%;
        text-align: left;
        border-left: 4px solid #000;
        padding-left: 6px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      &-item--multi {
        align-items: flex-start !important;
        .formBox-block-item-label {
          line-height: 36px;
        }
      }
      &-item {
        // width: 100%;
        padding: 6px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-label {
          min-width: 120px;
          text-align: left;
        }
        &-input {
          flex: 1;
        }
        &-textareaBox {
          width: 100%;
        }
        &-textarea {
          height: 200px;
          width: 100%;
          max-width: 620px;
        }
        &-tips {
          width: 100%;
          text-align: left;
          padding: 4px 0;
          color: #999;
        }
        &-tips--warning {
          color: #a92228;
        }
        &-styleBox {
          width: 386px;
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: row;
            .formBox-block-item-styleBox-item-input
              + .formBox-block-item-styleBox-item-input {
              margin-left: 12px;
            }
            &-input {
              width: 120px;
            }
            &-delBtn {
              line-height: 34px;
              margin-left: 12px;
              width: 120px;
              border: 1px dashed #a92228;
              color: #a92228;
              user-select: none;
              cursor: pointer;
            }
          }
          &-addBtn {
            user-select: none;
            cursor: pointer;
            padding: 6px 0;
            border: 1px dashed #000;
          }
        }
        &-conditionBox {
          width: 760px;
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: row;
            .formBox-block-item-conditionBox-item-input
              + .formBox-block-item-conditionBox-item-input {
              margin-left: 12px;
            }
            &-input {
              width: 180px;
            }
            &-errTag {
              opacity: 0;
              font-weight: bold;
              line-height: 34px;
              margin-left: 12px;
              font-size: 24px;
              color: #a92228;
              // border: 1px solid #a92228;
              border-radius: 34px;
              transition: 0.2s all;
            }
            &-errTag--show {
              opacity: 1;
            }
            &-delBtn {
              line-height: 34px;
              margin-left: 12px;
              width: 160px;
              border: 1px dashed #a92228;
              color: #a92228;
              user-select: none;
              cursor: pointer;
            }
          }
          &-addBtn {
            user-select: none;
            cursor: pointer;
            padding: 6px 0;
            border: 1px dashed #000;
          }
        }
        &-attrEffectBox {
          width: 816px;
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: row;
            .formBox-block-item-attrEffectBox-item-input
              + .formBox-block-item-attrEffectBox-item-input {
              margin-left: 12px;
            }
            &-input {
              width: 180px;
            }
            &-errTag {
              opacity: 0;
              font-weight: bold;
              line-height: 34px;
              margin-left: 12px;
              font-size: 24px;
              color: #a92228;
              // border: 1px solid #a92228;
              border-radius: 34px;
              transition: 0.2s all;
            }
            &-errTag--show {
              opacity: 1;
            }
            &-trigBtn {
              line-height: 34px;
              margin-left: 12px;
              width: 120px;
              border: 1px dashed #000;
              user-select: none;
              cursor: pointer;
            }
            &-delBtn {
              line-height: 34px;
              margin-left: 12px;
              width: 120px;
              border: 1px dashed #a92228;
              color: #a92228;
              user-select: none;
              cursor: pointer;
            }
          }
          &-addBtn {
            user-select: none;
            cursor: pointer;
            padding: 6px 0;
            border: 1px dashed #000;
          }
        }
        &-radioBox {
          display: flex;
          flex-direction: row;
          &-radio {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 2px 18px;
            user-select: none;
            cursor: pointer;
            white-space: nowrap;
            &-dot {
              width: 10px;
              height: 10px;
              border: 1px dashed #000;
              margin-right: 6px;
              transition: 0.1s all;
            }
          }
          &-radio--selected {
            .formBox-block-item-radioBox-radio-dot {
              background-color: #000;
            }
          }
        }
      }
    }
  }
}
</style>

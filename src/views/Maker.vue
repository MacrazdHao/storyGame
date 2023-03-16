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
              :title="item.desc"
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
              :title="item.desc"
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
              :title="item.desc"
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
                'formBox-block-item-pretips',
                triggerConditionsError
                  ? 'formBox-block-item-pretips--warning'
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
                @input="(text) => inputConditionMinValue(index, text)"
              />
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="角色属性最大值(不含)"
                :value="item.max"
                @input="(text) => inputConditionMaxValue(index, text)"
              />
              <p
                :class="[
                  'formBox-block-item-conditionBox-item-errTag',
                  triggerConditionsErrorIndex.includes(index)
                    ? 'formBox-block-item-conditionBox-item-errTag--show'
                    : '',
                ]"
                title="请输入正确的数字"
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
                'formBox-block-item-pretips',
                attrEffectError ? 'formBox-block-item-pretips--warning' : '',
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
                  @input="(text) => inputAttrEffectMinValue(index, text)"
                />
                <GhInput
                  class="formBox-block-item-attrEffectBox-item-input"
                  placeholder="影响属性最大值(不含)"
                  :value="item.max"
                  @input="(text) => inputAttrEffectMaxValue(index, text)"
                />
              </template>
              <GhInput
                v-else-if="item.mode === 'exact'"
                class="formBox-block-item-attrEffectBox-item-input"
                placeholder="影响属性值"
                :value="item.value"
                @input="(text) => inputAttrEffectValue(index, text)"
              />
              <p
                :class="[
                  'formBox-block-item-attrEffectBox-item-errTag',
                  attrEffectErrorIndex.includes(index)
                    ? 'formBox-block-item-attrEffectBox-item-errTag--show'
                    : '',
                ]"
                title="请输入正确的数字"
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
          <div class="formBox-block-item-effectEventBox">
            <p
              :class="[
                'formBox-block-item-pretips',
                effectEventError ? 'formBox-block-item-pretips--warning' : '',
              ]"
            >
              回合执行次数上限、持续回合数必须为数字（小数将只保留整数位）
            </p>
            <div
              v-for="(item, index) in effectEvents"
              :key="index"
              class="formBox-block-item-effectEventBox-item"
            >
              <div class="formBox-block-item-effectEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--nopadding">
                  <p class="formBox-block-item-label">
                    受影响事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputEffectEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-effectEventBox-item-delBtn"
                    @click="removeEffectEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-effectEventBox-item-row">
                <p class="formBox-block-item-label">回合执行次数上限</p>
                <GhInput
                  class="formBox-block-item-effectEventBox-item-input"
                  placeholder="回合执行次数上限"
                  :value="item.timesOfUnit"
                  @input="(text) => inputEffectEventTimesOfUnit(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectEventBox-item-errTag',
                    effectEventErrorIndex[index] &&
                      effectEventErrorIndex[index].timesOfUnit
                      ? 'formBox-block-item-effectEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
                <div class="formBox-block-item-radioBox">
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      !item.timesOfUnitReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="原回合执行数上限+该增益回合执行次数上限"
                    @click="setEffectEventTimesOfUnitMode(index, false)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    叠加
                  </p>
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      item.timesOfUnitReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="原回合执行数上限变为该增益回合执行次数上限"
                    @click="setEffectEventTimesOfUnitMode(index, true)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    替换
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-effectEventBox-item-row">
                <p class="formBox-block-item-label">总执行次数上限</p>
                <GhInput
                  class="formBox-block-item-effectEventBox-item-input"
                  placeholder="总执行次数上限"
                  :value="item.times"
                  @input="(text) => inputEffectEventTimes(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectEventBox-item-errTag',
                    effectEventErrorIndex[index] &&
                      effectEventErrorIndex[index].times
                      ? 'formBox-block-item-effectEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
                <div class="formBox-block-item-radioBox">
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      !item.timesReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="原总执行数上限+该增益总执行次数上限"
                    @click="setEffectEventTimesMode(index, false)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    叠加
                  </p>
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      item.timesReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="原总执行数上限变为该增益总执行次数上限"
                    @click="setEffectEventTimesMode(index, true)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    替换
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-effectEventBox-item-row">
                <p class="formBox-block-item-label">效果持续回合数</p>
                <GhInput
                  class="formBox-block-item-effectEventBox-item-input"
                  placeholder="效果持续回合数"
                  :value="item.lastUnitTime"
                  @input="(text) => inputEffectEventLastUnitTime(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectEventBox-item-errTag',
                    effectEventErrorIndex[index] &&
                      effectEventErrorIndex[index].lastUnitTime
                      ? 'formBox-block-item-effectEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
            </div>
            <p
              class="formBox-block-item-effectEventBox-addBtn"
              @click="addEffectEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1:
              该属性用于改变其他已存在事件的【回合执行次数上限】、【总执行次数上限】
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 次数模式分为叠加/替换两种模式
            </p>
            <p class="formBox-block-item-tips">
              Tips3:
              【回合执行次数上限】、【总执行次数上限】、【持续回合数】均不可为空，任一为空则在生成事件时将忽略该受影响事件
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">概率事件结果事件概率影响</p>
          <div class="formBox-block-item-effectPrEventBox">
            <p
              :class="[
                'formBox-block-item-pretips',
                effectEventError ? 'formBox-block-item-pretips--warning' : '',
              ]"
            >
              权重百分比、权重增益/替换值、总生效次数上限、持续回合数必须为数字（小数将只保留整数位）
            </p>
            <div
              v-for="(item, index) in prEventsExtraWeight"
              :key="index"
              class="formBox-block-item-effectPrEventBox-item"
            >
              <div class="formBox-block-item-effectPrEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--nopadding">
                  <p class="formBox-block-item-label">
                    受影响概率事件结果{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputEffectPrEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-effectPrEventBox-item-delBtn"
                    @click="removeEffectPrEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item formBox-block-item--nopadding">
                <p class="formBox-block-item-label">增益模式</p>
                <div class="formBox-block-item-radioBox">
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      !item.weightReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="基础权重+基础权重*增益百分比+权重数值数值"
                    @click="setEffectPrEventWeightMode(index, false)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    叠加
                  </p>
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      item.weightReplace
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    title="权重替换为该权重替换值"
                    @click="setEffectPrEventWeightMode(index, true)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    替换
                  </p>
                </div>
              </div>
              <div
                v-if="!item.weightReplace"
                class="formBox-block-item-effectPrEventBox-item-row"
              >
                <p class="formBox-block-item-label">按百分比增益权重</p>
                <GhInput
                  class="formBox-block-item-effectPrEventBox-item-input"
                  placeholder="按百分比增益权重(%)"
                  :value="item.persent"
                  @input="(text) => inputEffectPrPersent(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectPrEventBox-item-errTag',
                    effectPrEventErrorIndex[index] &&
                      effectPrEventErrorIndex[index].persent
                      ? 'formBox-block-item-effectPrEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectPrEventBox-item-row">
                <p class="formBox-block-item-label">
                  {{ item.weightReplace ? "权重替换值" : "权重增益值" }}
                </p>
                <GhInput
                  class="formBox-block-item-effectPrEventBox-item-input"
                  :placeholder="
                    item.weightReplace ? '权重替换值' : '权重增益值'
                  "
                  :value="item.weight"
                  @input="(text) => inputEffectPrWeight(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectPrEventBox-item-errTag',
                    effectPrEventErrorIndex[index] &&
                      effectPrEventErrorIndex[index].weight
                      ? 'formBox-block-item-effectPrEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectPrEventBox-item-row">
                <p class="formBox-block-item-label">总有效次数上限</p>
                <GhInput
                  class="formBox-block-item-effectPrEventBox-item-input"
                  placeholder="总有效次数上限"
                  :value="item.times"
                  @input="(text) => inputEffectPrEventTimes(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectPrEventBox-item-errTag',
                    effectPrEventErrorIndex[index] &&
                      effectPrEventErrorIndex[index].times
                      ? 'formBox-block-item-effectPrEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectPrEventBox-item-row">
                <p class="formBox-block-item-label">效果持续回合数</p>
                <GhInput
                  class="formBox-block-item-effectPrEventBox-item-input"
                  placeholder="效果持续回合数"
                  :value="item.lastUnitTime"
                  @input="(text) => inputEffectPrEventLastUnitTime(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectPrEventBox-item-errTag',
                    effectPrEventErrorIndex[index] &&
                      effectPrEventErrorIndex[index].lastUnitTime
                      ? 'formBox-block-item-effectPrEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
            </div>
            <p
              class="formBox-block-item-effectPrEventBox-addBtn"
              @click="addEffectPrEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1: 该属性用于改变其他已存在概率事件的权重
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 权重增益模式分为叠加/替换两种模式
            </p>
            <p class="formBox-block-item-tips">
              Tips3:
              【回合执行次数上限】、【总执行次数上限】、【持续回合数】均不可为空，任一为空则在生成事件时将忽略该受影响事件
            </p>
            <p class="formBox-block-item-tips">
              Tips4:
              权重增益模式为替换模式时，将直接使用权重替换值，替换为事件权重，而persent失效
            </p>
            <p class="formBox-block-item-tips">
              Tips5:
              权重增益模式为叠加模式时，权重数值增益、权重百分比增益两者可同时生效，效果为，基础权重+基础权重*增益百分比+权重数值数值
            </p>
            <p class="formBox-block-item-tips">
              Tips6:
              不建议使用替换模式，因其效果可能影响到其他事件的概率叠加效果，如A首先引起随机事件1百分比增益，B随后引起事件1的权重数值增益，而C最后引起随机事件1的概率替换，则A和B引起的增益将失效（但剩余回合数仍会持续计算），而最终生效的是最新的C的替换概率值
            </p>
            <p class="formBox-block-item-tips">
              Tips7:
              触发该概率事件结果事件的相关概率事件被执行时，该概率事件结果概率增益效果总有效次数即-1；持续回合数则以实际经过的回合数为准，与触不触发该概率事件结果的相关概率事件无关
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">携带额外事件</p>
          <div class="formBox-block-item-effectRandomEventBox">
            <p
              :class="[
                'formBox-block-item-pretips',
                effectEventError ? 'formBox-block-item-pretips--warning' : '',
              ]"
            >
              概率百分比、总生效次数上限、持续回合数必须为数字（小数将只保留整数位）
            </p>
            <div
              v-for="(item, index) in extraRandomEvents"
              :key="index"
              class="formBox-block-item-effectRandomEventBox-item"
            >
              <div class="formBox-block-item-effectRandomEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--nopadding">
                  <p class="formBox-block-item-label">
                    额外随机事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputEffectRandomEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-effectRandomEventBox-item-delBtn"
                    @click="removeEffectRandomEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-effectRandomEventBox-item-row">
                <p class="formBox-block-item-label">百分比概率</p>
                <GhInput
                  class="formBox-block-item-effectRandomEventBox-item-input"
                  placeholder="百分比概率(0-100%)"
                  :value="item.persent"
                  @input="(text) => inputEffectRandomEventPersent(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectRandomEventBox-item-errTag',
                    effectRandomEventErrorIndex[index] &&
                      effectRandomEventErrorIndex[index].persent
                      ? 'formBox-block-item-effectRandomEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectRandomEventBox-item-row">
                <p class="formBox-block-item-label">事件好坏程度值</p>
                <GhInput
                  class="formBox-block-item-effectRandomEventBox-item-input"
                  placeholder="事件好坏程度值(负为坏，正为好)"
                  :value="item.goodOrBad"
                  @input="
                    (text) => inputEffectRandomEventGoodOrBad(index, text)
                  "
                />
                <p
                  :class="[
                    'formBox-block-item-effectRandomEventBox-item-errTag',
                    effectRandomEventErrorIndex[index] &&
                      effectRandomEventErrorIndex[index].goodOrBad
                      ? 'formBox-block-item-effectRandomEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectRandomEventBox-item-row">
                <p class="formBox-block-item-label">总有效次数上限</p>
                <GhInput
                  class="formBox-block-item-effectRandomEventBox-item-input"
                  placeholder="总有效次数上限"
                  :value="item.times"
                  @input="(text) => inputEffectRandomEventTimes(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-effectRandomEventBox-item-errTag',
                    effectRandomEventErrorIndex[index] &&
                      effectRandomEventErrorIndex[index].times
                      ? 'formBox-block-item-effectRandomEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-effectRandomEventBox-item-row">
                <p class="formBox-block-item-label">效果持续回合数</p>
                <GhInput
                  class="formBox-block-item-effectRandomEventBox-item-input"
                  placeholder="效果持续回合数"
                  :value="item.lastUnitTime"
                  @input="
                    (text) => inputEffectRandomEventLastUnitTime(index, text)
                  "
                />
                <p
                  :class="[
                    'formBox-block-item-effectRandomEventBox-item-errTag',
                    effectRandomEventErrorIndex[index] &&
                      effectRandomEventErrorIndex[index].lastUnitTime
                      ? 'formBox-block-item-effectRandomEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
            </div>
            <p
              class="formBox-block-item-effectRandomEventBox-addBtn"
              @click="addEffectRandomEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1:
              概率百分比最大值为100，大于100时，将默认视为100,；小于0时，则视为0
            </p>
            <p class="formBox-block-item-tips">
              Tips2:
              事件好坏程度值与运气值会联合影响事件概率，概率运算为，基础概率 +
              (运气值 - 基础运气值) * 0.1 * / |goodOrBad|，(运气值 -
              基础运气值)为正则坏事概率减幅，好事概率增幅；反之坏事增幅，好事减幅
            </p>
            <p class="formBox-block-item-tips">
              Tips3: 概率百分比、事件好坏程度值不输入则视为0
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
      <div class="formBox-block-item">
        <p class="formBox-block-item-label">输出说明</p>

        <p class="formBox-block-item-tips">
          所有数值设置，除特殊要求外，值大于{{ MAXNUM }}的都自动转为{{
            MAXNUM
          }}，值小于{{ MINNUM }}的都自动转为{{ MINNUM }}
        </p>
      </div>
    </div>
    <div class="previewBox" />
  </div>
</template>

// 不存在事件检测（关联的事件不存在） // 事件联想输入框（搜索text和key）

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
          desc: '不会主动执行，仅作为任意事件条件不足时触发使用',
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
          desc: '不会主动执行，仅作为概率事件的结果事件、绑定事件的结果事件、可选事件的结果事件',
          obj: {
            isDefault: false,
            isCertain: false,
            isPassive: true
          }
        },
        {
          text: '必然事件',
          value: 'certain',
          desc: '达成触发条件必然执行的事件',
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
          desc: '拥有不同概率的结果事件，该事件执行时会随机触发设定数量的概率结果事件，概率结果事件数少于设定的应触发数量时，以默认概率结果事件补充；概率结果事件不存在、不满足条件、超出次数时，将执行默认概率结果事件',
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
          desc: '拥有绑定的结果事件，若绑定的结果事件，则会马上/延迟执行，不满足的则会执行默认结果事件(可设置为不执行)',
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
          desc: '提供单项选择，每个选择对应一个反馈事件；选项前置条件不满足时，隐藏选项；反馈事件触发条件不满足时，选项置灰；没有选项可选时，提供“跳过”选项，执行默认反馈事件',
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
          desc: '可选择多个选项的选择事件，可根据所选结果设定反馈事件，不存在对应反馈事件时，则执行any反馈事件；any反馈事件未定义/不符合触发条件时，则执行默认反馈事件',
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
      effectEventError: false,
      effectEventErrorIndex: {},
      effectPrEventError: false,
      effectPrEventErrorIndex: {},
      effectRandomEventError: false,
      effectRandomEventErrorIndex: {},
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
      effectEvents: [],
      // 概率事件额外权重增益
      prEventsExtraWeight: [],
      // 额外的随机事件
      extraRandomEvents: [],
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
    MAXNUM() {
      return MAXNUM
    },
    MINNUM() {
      return MINNUM
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
      const effectEvents = {}
      const prEventsExtraWeight = {}
      const extraRandomEvents = {}
      this.style.forEach((item) => {
        if (item.key) style[item.key] = item.value
      })
      this.triggerConditions.forEach((item) => {
        if (item.key) {
          const max = parseInt(item.max)
          const min = parseInt(item.min)
          triggerConditions[item.key] = [
            isNaN(min) ? MINNUM : this.getMinNum(min),
            isNaN(max) ? MAXNUM : this.getMaxNum(max)
          ]
        }
      })
      this.effectAttr.forEach((item) => {
        if (item.key) {
          if (item.mode === 'random' && (item.max || item.min)) {
            const max = parseInt(item.max)
            const min = parseInt(item.min)
            if (!isNaN(min) && !isNaN(max)) {
              effectAttr[item.key] = [this.getMinNum(min), this.getMaxNum(max)]
            } else if (isNaN(min) && !isNaN(max)) {
              effectAttr[item.key] = this.getScopeNum(max - 1)
            } else if (!isNaN(min) && isNaN(max)) {
              effectAttr[item.key] = this.getScopeNum(min)
            }
          }
          if (item.mode === 'exact' && item.value) {
            const value = parseInt(item.value)
            effectAttr[item.key] = isNaN(value) ? 0 : this.getScopeNum(value)
          }
        }
      })
      this.effectEvents.forEach((item) => {
        const {
          key,
          times,
          timesReplace,
          timesOfUnit,
          timesOfUnitReplace,
          lastUnitTime
        } = item
        const rtimes = parseInt(times)
        const rtimesOfUnit = parseInt(timesOfUnit)
        const rlastUnitTime = parseInt(lastUnitTime)
        const rtimesIsNaN = isNaN(rtimes)
        const rtimesOfUnitIsNaN = isNaN(rtimesOfUnit)
        const rlastUnitTimeIsNaN = isNaN(rlastUnitTime)
        if (key && !rtimesIsNaN && !rtimesOfUnitIsNaN && !rlastUnitTimeIsNaN) {
          effectEvents[key] = {
            times: this.getScopeNum(rtimes, [0, MAXNUM]),
            timesReplace,
            timesOfUnit: this.getScopeNum(rtimesOfUnit, [0, MAXNUM]),
            timesOfUnitReplace,
            lastUnitTime: this.getScopeNum(rlastUnitTime, [0, MAXNUM])
          }
        }
      })
      this.prEventsExtraWeight.forEach((item) => {
        if (item.key) {
          const { key, persent, weight, times, weightReplace, lastUnitTime } =
            item
          const persentInt = parseInt(persent)
          const weightInt = parseInt(weight)
          const timesInt = parseInt(times)
          const lastUnitTimeInt = parseInt(lastUnitTime)
          const rpersent = isNaN(persentInt) ? 0 : persentInt
          const rweight = isNaN(weightInt) ? 0 : weightInt
          const rtimes = isNaN(timesInt) ? MAXNUM : timesInt
          const rlastUnitTime = isNaN(lastUnitTimeInt) ? 1 : lastUnitTimeInt
          prEventsExtraWeight[key] = {
            persent: this.getScopeNum(rpersent),
            weight: this.getScopeNum(rweight),
            times: this.getScopeNum(rtimes, [0, MAXNUM]),
            lastUnitTime: this.getScopeNum(rlastUnitTime, [0, MAXNUM]),
            weightReplace
          }
        }
      })
      this.extraRandomEvents.forEach((item) => {
        if (item.key) {
          const { key, persent, goodOrBad, times, lastUnitTime } = item
          const persentInt = parseInt(persent)
          const goodOrBadInt = parseInt(goodOrBad)
          const timesInt = parseInt(times)
          const lastUnitTimeInt = parseInt(lastUnitTime)
          const rpersent = isNaN(persentInt) ? 0 : persentInt
          const rgoodOrBad = isNaN(goodOrBadInt) ? 0 : goodOrBadInt
          const rtimes = isNaN(timesInt) ? 1 : timesInt
          const rlastUnitTime = isNaN(lastUnitTimeInt) ? 1 : lastUnitTimeInt
          extraRandomEvents[key] = {
            persent: this.getScopeNum(rlastUnitTime, [0, 100]),
            goodOrBad: this.getScopeNum(rgoodOrBad),
            times: this.getScopeNum(rtimes, [0, MAXNUM]),
            lastUnitTime: this.getScopeNum(rlastUnitTime, [0, MAXNUM])
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
        effectAttr,
        effectEvents,
        prEventsExtraWeight,
        extraRandomEvents
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
    },
    effectEvents() {
      this.effectEventError = false
      this.effectEventErrorIndex = {}
      for (let i = 0; i < this.effectEvents.length; i++) {
        const item = this.effectEvents[i]
        let errItem = false
        const times = item.times ? parseInt(item.times) : 1
        const timesOfUnit = item.timesOfUnit ? parseInt(item.timesOfUnit) : 1
        const lastUnitTime = item.lastUnitTime
          ? parseInt(item.lastUnitTime)
          : 1
        errItem = isNaN(times) || isNaN(timesOfUnit) || isNaN(lastUnitTime)
        if (errItem) {
          this.effectEventError = this.effectEventError || errItem
          this.$set(this.effectEventErrorIndex, i, {
            times: isNaN(times),
            timesOfUnit: isNaN(timesOfUnit),
            lastUnitTime: isNaN(lastUnitTime)
          })
        }
      }
    },
    prEventsExtraWeight() {
      this.effectPrEventError = false
      this.effectPrEventErrorIndex = {}
      for (let i = 0; i < this.prEventsExtraWeight.length; i++) {
        const item = this.prEventsExtraWeight[i]
        let errItem = false
        const persent = item.persent ? parseInt(item.persent) : 0
        const weight = item.weight ? parseInt(item.weight) : 0
        const times = item.times ? parseInt(item.times) : 1
        const lastUnitTime = item.lastUnitTime
          ? parseInt(item.lastUnitTime)
          : 1
        errItem =
          isNaN(persent) ||
          isNaN(weight) ||
          isNaN(times) ||
          isNaN(lastUnitTime)
        if (errItem) {
          this.effectPrEventError = this.effectPrEventError || errItem
          this.$set(this.effectPrEventErrorIndex, i, {
            persent: isNaN(persent),
            weight: isNaN(weight),
            times: isNaN(times),
            lastUnitTime: isNaN(lastUnitTime)
          })
        }
      }
    },
    extraRandomEvents() {
      this.effectRandomEventError = false
      this.effectRandomEventErrorIndex = {}
      for (let i = 0; i < this.extraRandomEvents.length; i++) {
        const item = this.extraRandomEvents[i]
        let errItem = false
        const persent = item.persent ? parseInt(item.persent) : 0
        const goodOrBad = item.goodOrBad ? parseInt(item.goodOrBad) : 0
        const times = item.times ? parseInt(item.times) : 1
        const lastUnitTime = item.lastUnitTime
          ? parseInt(item.lastUnitTime)
          : 1
        errItem =
          isNaN(persent) ||
          isNaN(goodOrBad) ||
          isNaN(times) ||
          isNaN(lastUnitTime)
        if (errItem) {
          this.effectRandomEventError = this.effectRandomEventError || errItem
          this.$set(this.effectRandomEventErrorIndex, i, {
            persent: isNaN(persent),
            goodOrBad: isNaN(goodOrBad),
            times: isNaN(times),
            lastUnitTime: isNaN(lastUnitTime)
          })
        }
      }
    }
  },
  mounted() {
    // console.log(this.MaxNumLength)
    // console.log(this.getScopeNum(-111111111111))
  },
  methods: {
    getMaxNum(num) {
      return num > MAXNUM ? MAXNUM : num
    },
    getMinNum(num) {
      return num < MINNUM ? MINNUM : num
    },
    getScopeNum(num, scope = [MINNUM, MAXNUM]) {
      const min = Math.min(...scope)
      const max = Math.max(...scope)
      if (num < min) return min
      if (num > max) return max
      return num
    },
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
    },
    inputEffectEventKey(index, text) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        key: text
      })
    },
    inputEffectEventTimesOfUnit(index, text) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        timesOfUnit: text
      })
    },
    setEffectEventTimesOfUnitMode(index, isReplace) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        timesOfUnitReplace: isReplace
      })
    },
    inputEffectEventTimes(index, text) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        times: text
      })
    },
    setEffectEventTimesMode(index, isReplace) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        timesReplace: isReplace
      })
    },
    inputEffectEventLastUnitTime(index, text) {
      this.$set(this.effectEvents, index, {
        ...this.effectEvents[index],
        lastUnitTime: text
      })
    },
    removeEffectEventItem(sindex) {
      this.effectEvents = this.effectEvents.filter(
        (item, index) => sindex !== index
      )
    },
    addEffectEventItem() {
      this.effectEvents.push({
        key: '',
        times: '',
        timesReplace: false,
        timesOfUnit: '',
        timesOfUnitReplace: false,
        lastUnitTime: ''
      })
    },
    inputEffectPrEventKey(index, text) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        key: text
      })
    },
    removeEffectPrEventItem(sindex) {
      this.prEventsExtraWeight = this.prEventsExtraWeight.filter(
        (item, index) => sindex !== index
      )
    },
    setEffectPrEventWeightMode(index, isReplace) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        weightReplace: isReplace,
        weight: ''
      })
    },
    inputEffectPrPersent(index, text) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        persent: text
      })
    },
    inputEffectPrWeight(index, text) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        weight: text
      })
    },
    inputEffectPrEventTimes(index, text) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        times: text
      })
    },
    inputEffectPrEventLastUnitTime(index, text) {
      this.$set(this.prEventsExtraWeight, index, {
        ...this.prEventsExtraWeight[index],
        lastUnitTime: text
      })
    },
    addEffectPrEventItem() {
      this.prEventsExtraWeight.push({
        key: '',
        persent: '',
        weight: '',
        times: '',
        weightReplace: false,
        lastUnitTime: ''
      })
    },
    inputEffectRandomEventKey(index, text) {
      this.$set(this.extraRandomEvents, index, {
        ...this.extraRandomEvents[index],
        key: text
      })
    },
    removeEffectRandomEventItem(sindex) {
      this.extraRandomEvents = this.extraRandomEvents.filter(
        (item, index) => sindex !== index
      )
    },
    inputEffectRandomEventPersent(index, text) {
      this.$set(this.extraRandomEvents, index, {
        ...this.extraRandomEvents[index],
        persent: text
      })
    },
    inputEffectRandomEventGoodOrBad(index, text) {
      this.$set(this.extraRandomEvents, index, {
        ...this.extraRandomEvents[index],
        goodOrBad: text
      })
    },
    inputEffectRandomEventTimes(index, text) {
      this.$set(this.extraRandomEvents, index, {
        ...this.extraRandomEvents[index],
        times: text
      })
    },
    inputEffectRandomEventLastUnitTime(index, text) {
      this.$set(this.extraRandomEvents, index, {
        ...this.extraRandomEvents[index],
        lastUnitTime: text
      })
    },
    addEffectRandomEventItem() {
      this.extraRandomEvents.push({
        key: '',
        persent: '', // 该事件的百分比概率
        lastUnitTime: '', // 该项事件影响效果剩余持续回合数
        times: '', // 总有效次数，最多可执行次数
        goodOrBad: '' // 负坏事，正好事
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Maker {
  min-width: 1440px;
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
      &-item--nopadding {
        padding: 6px 0 !important;
      }
      &-item--column {
        flex-direction: column !important;
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
          padding-right: 12px;
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
        &-pretips {
          width: 100%;
          text-align: left;
          // padding: 4px 0;
          line-height: 36px;
          color: #999;
        }
        &-pretips--warning,
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
            max-width: 178px;
            width: 100%;
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
            max-width: 178px;
            width: 100%;
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
            max-width: 178px;
            width: 100%;
          }
        }
        &-effectEventBox {
          width: 816px;
          .formBox-block-item-effectEventBox-item
            + .formBox-block-item-effectEventBox-item {
            border-top: 1px solid #000;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0;
            .formBox-block-item-effectEventBox-item-input
              + .formBox-block-item-effectEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-effectEventBox-item-row
              + .formBox-block-item-effectEventBox-item-row {
              margin-top: 12px;
            }
            &-row {
              width: 100%;
              display: flex;
              flex-direction: row;
            }
            &-input {
              width: 100%;
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
              // margin-top: 12px;
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
            max-width: 178px;
            width: 100%;
          }
        }
        &-effectPrEventBox {
          width: 828px;
          .formBox-block-item-effectPrEventBox-item
            + .formBox-block-item-effectPrEventBox-item {
            border-top: 1px solid #000;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0;
            .formBox-block-item-effectPrEventBox-item-input
              + .formBox-block-item-effectPrEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-effectPrEventBox-item-row
              + .formBox-block-item-effectPrEventBox-item-row {
              margin-top: 12px;
            }
            &-row {
              width: 100%;
              display: flex;
              flex-direction: row;
            }
            &-input {
              width: 100%;
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
              // margin-top: 12px;
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
            max-width: 178px;
            width: 100%;
          }
        }
        &-effectRandomEventBox {
          width: 828px;
          .formBox-block-item-effectRandomEventBox-item
            + .formBox-block-item-effectRandomEventBox-item {
            border-top: 1px solid #000;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0;
            .formBox-block-item-effectRandomEventBox-item-input
              + .formBox-block-item-effectRandomEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-effectRandomEventBox-item-row
              + .formBox-block-item-effectRandomEventBox-item-row {
              margin-top: 12px;
            }
            &-row {
              width: 100%;
              display: flex;
              flex-direction: row;
            }
            &-input {
              width: 100%;
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
              // margin-top: 12px;
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
            max-width: 178px;
            width: 100%;
          }
        }
        &-radioBox {
          display: flex;
          flex-direction: row;
          .formBox-block-item-radioBox-radio
            + .formBox-block-item-radioBox-radio {
            margin-left: 12px;
          }
          &-radio {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 2px 0;
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

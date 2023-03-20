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
            <p class="formBox-block-item-tips">
              Tips4:
              所有属性均需携带"options."前缀，如"[[options.a===100?options.a:333]]"
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
                style="width: 260px"
                placeholder="style属性值(可加三目)"
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
              placeholder="请输入总可执行次数(≥0)"
              :disabled="selectedBaseType === 0"
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
              placeholder="请输入回合可执行次数(≥0)"
              :disabled="selectedBaseType === 0"
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
          <p class="formBox-block-item-label">默认事件KEY</p>
          <div
            class="formBox-block-item formBox-block-item--column formBox-block-item--child"
          >
            <GhInput
              class="formBox-block-item-input"
              placeholder="请输入默认事件KEY"
              :value="normalDefault"
              @input="inputNormalDefault"
            />
            <p class="formBox-block-item-tips">
              Tips1:
              除特殊情况外，设置条件不足是否执行通用默认事件为是，且当本事件触发条件不足时，将执行该默认事件
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 不填写则自动填充为【putongmoren】
            </p>
          </div>
        </div>
      </div>
      <div class="formBox-block">
        <p class="formBox-block-label">事件影响</p>
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
          <p class="formBox-block-item-label">影响事件</p>
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
                  placeholder="回合执行次数上限(≥0)"
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
                  placeholder="总执行次数上限(≥0)"
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
                  placeholder="效果持续回合数(≥0)"
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
            <p class="formBox-block-item-tips">
              Tips4:
              若填写当前事件本身为影响次数事件之一，则也会影响到当次次数结算
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
                    item.weightReplace ? '权重替换值(≥0)' : '权重增益值(≥0)'
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
                  placeholder="总有效次数上限(≥0)"
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
                  placeholder="效果持续回合数(≥0)"
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
            <p class="formBox-block-item-tips">
              Tips8:
              若当前事件为概率事件，同时填写当前事件本身为影响的概率事件之一，则也会影响到当次概率结算
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
                  placeholder="总有效次数上限(≥0)"
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
                  placeholder="效果持续回合数(≥0)"
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
      <div v-show="selectedFuncType.includes(0)" class="formBox-block">
        <p class="formBox-block-label">概率事件属性</p>
        <p
          :class="[
            'formBox-block-item-pretips',
            effectEventError ? 'formBox-block-item-pretips--warning' : '',
            'formBox-block-any--extraPadding',
          ]"
        >
          概率权重、结果事件好坏程度、重复次数必须为数字（小数将只保留整数位）
        </p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">概率结果数</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入概率结果数(≥0)"
            :value="prNumber"
            @input="inputPrNumber"
          />
          <p
            :class="[
              'formBox-block-item-prEventBox-item-errTag',
              prNumberError
                ? 'formBox-block-item-prEventBox-item-errTag--show'
                : '',
            ]"
            title="请输入正确的数字"
          >
            ×
          </p>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">默认结果事件KEY</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入默认结果事件KEY"
            :value="prDefault"
            @input="inputPrDefault"
          />
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">结果事件</p>
          <div class="formBox-block-item-prEventBox">
            <div
              v-for="(item, index) in prEventsArr"
              :key="index"
              class="formBox-block-item-prEventBox-item"
            >
              <div class="formBox-block-item-prEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--nopadding">
                  <p class="formBox-block-item-label">
                    结果事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputPrEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-prEventBox-item-delBtn"
                    @click="removePrEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-prEventBox-item-row">
                <p class="formBox-block-item-label">概率权重</p>
                <GhInput
                  class="formBox-block-item-prEventBox-item-input"
                  placeholder="概率权重(≥0)"
                  :value="item.prWeight"
                  @input="(text) => inputPrEventWeight(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-prEventBox-item-errTag',
                    prEventErrorIndex[index] &&
                      prEventErrorIndex[index].prWeight
                      ? 'formBox-block-item-prEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-prEventBox-item-row">
                <p class="formBox-block-item-label">事件好坏程度值</p>
                <GhInput
                  class="formBox-block-item-prEventBox-item-input"
                  placeholder="事件好坏程度值(负为坏，正为好)"
                  :value="item.prGoodOrBad"
                  @input="(text) => inputPrEventGoodOrBad(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-prEventBox-item-errTag',
                    prEventErrorIndex[index] &&
                      prEventErrorIndex[index].prGoodOrBad
                      ? 'formBox-block-item-prEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
              <div class="formBox-block-item-prEventBox-item-row">
                <p class="formBox-block-item-label">可重复次数</p>
                <GhInput
                  class="formBox-block-item-prEventBox-item-input"
                  placeholder="可重复次数(≥0)"
                  :value="item.prRepeat"
                  @input="(text) => inputPrEventRepeatTimes(index, text)"
                />
                <p
                  :class="[
                    'formBox-block-item-prEventBox-item-errTag',
                    prEventErrorIndex[index] &&
                      prEventErrorIndex[index].prRepeat
                      ? 'formBox-block-item-prEventBox-item-errTag--show'
                      : '',
                  ]"
                  title="请输入正确的数字"
                >
                  ×
                </p>
              </div>
            </div>
            <p
              class="formBox-block-item-prEventBox-addBtn"
              @click="addPrEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1: 概率事件采用权重百分比计算方式，结果事件概率 = 结果事件权重
              / 总权重
            </p>
            <p class="formBox-block-item-tips">Tips2: 概率权重必须 ≥ 0</p>
            <p class="formBox-block-item-tips">
              Tips3:
              事件好坏程度值与运气值会联合影响事件概率，概率运算为，基础概率 +
              (运气值 - 基础运气值) * 0.1 * / |goodOrBad|，(运气值 -
              基础运气值)为正则坏事概率减幅，好事概率增幅；反之坏事增幅，好事减幅
            </p>
            <p class="formBox-block-item-tips">
              Tips4: 概率结果数表示抽取的结果事件数
            </p>
            <p class="formBox-block-item-tips">
              Tips5:
              可重复次数表示在随机选取事件时，可以重复得到的该结果事件的次数
            </p>
            <p class="formBox-block-item-tips">
              Tips6: 默认概率结果事件为空时，将自动填充为【gailvmoren】
            </p>
          </div>
        </div>
      </div>
      <div v-show="selectedFuncType.includes(1)" class="formBox-block">
        <p class="formBox-block-label">绑定事件属性</p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">默认结果事件KEY</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入默认结果事件KEY"
            :value="bindDefault"
            @input="inputBindDefault"
          />
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">绑定事件</p>
          <div class="formBox-block-item-bindEventBox">
            <div
              v-for="(item, index) in bindEventsArr"
              :key="index"
              class="formBox-block-item-bindEventBox-item"
            >
              <div class="formBox-block-item-bindEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--child">
                  <p class="formBox-block-item-label">
                    结果事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputBindEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-bindEventBox-item-delBtn"
                    @click="removeBindEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-bindEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--child">
                  <p class="formBox-block-item-label">延迟回合数</p>
                  <GhInput
                    class="formBox-block-item-bindEventBox-item-input"
                    placeholder="延迟回合数(≥0)"
                    :value="item.bindEventDuration"
                    @input="(text) => inputBindEventDuration(index, text)"
                  />
                  <p
                    :class="[
                      'formBox-block-item-bindEventBox-item-errTag',
                      bindEventErrorIndex[index] &&
                        bindEventErrorIndex[index].bindEventDuration
                        ? 'formBox-block-item-bindEventBox-item-errTag--show'
                        : '',
                    ]"
                    title="请输入正确的数字"
                  >
                    ×
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-bindEventBox-item-row">
                <p class="formBox-block-item-label">
                  条件不足是否执行通用默认事件
                </p>
                <div class="formBox-block-item-radioBox">
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      item.bindEventDonotMismatchToDefault
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    @click="setBindEventDonotMismatchToDefault(index, true)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    是
                  </p>
                  <p
                    :class="[
                      'formBox-block-item-radioBox-radio',
                      !item.bindEventDonotMismatchToDefault
                        ? 'formBox-block-item-radioBox-radio--selected'
                        : '',
                    ]"
                    @click="setBindEventDonotMismatchToDefault(index, false)"
                  >
                    <span class="formBox-block-item-radioBox-radio-dot" />
                    否
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-bindEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">触发条件</p>
                  <div class="formBox-block-item-conditionBox">
                    <p
                      :class="[
                        'formBox-block-item-pretips',
                        bindEventConditionsError
                          ? 'formBox-block-item-pretips--warning'
                          : '',
                      ]"
                    >
                      最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
                    </p>
                    <div
                      v-for="(citem, cindex) in bindEventConditions[index]"
                      :key="cindex"
                      class="formBox-block-item-conditionBox-item"
                    >
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性名"
                        :value="citem.key"
                        @input="
                          (text) =>
                            inputBindEventConditionKey(index, cindex, text)
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最小值(含)"
                        :value="citem.min"
                        @input="
                          (text) =>
                            inputBindEventConditionMinValue(index, cindex, text)
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最大值(不含)"
                        :value="citem.max"
                        @input="
                          (text) =>
                            inputBindEventConditionMaxValue(index, cindex, text)
                        "
                      />
                      <p
                        :class="[
                          'formBox-block-item-conditionBox-item-errTag',
                          bindEventConditionsErrorIndex[index] &&
                            bindEventConditionsErrorIndex[index].includes(cindex)
                            ? 'formBox-block-item-conditionBox-item-errTag--show'
                            : '',
                        ]"
                        title="请输入正确的数字"
                      >
                        ×
                      </p>
                      <p
                        class="formBox-block-item-conditionBox-item-delBtn"
                        @click="removeBindEventConditionItem(index, cindex)"
                      >
                        -- 移除 --
                      </p>
                    </div>
                    <p
                      class="formBox-block-item-conditionBox-addBtn"
                      @click="addBindEventConditionItem(index)"
                    >
                      ++ 添加一项 ++
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
                      回合信息(unitTimeInfo), 年份(year)
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips2: 指定某一数值时，如a属性需要完全等于10时，则需输入a
                      10 11
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p
              class="formBox-block-item-bindEventBox-addBtn"
              @click="addBindEventItem"
            >
              ++ 添加一项 ++
            </p>
          </div>
        </div>
      </div>
      <div v-show="selectedOptType === 0" class="formBox-block">
        <p class="formBox-block-label">单选事件属性</p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">默认选项事件KEY</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入默认选项事件KEY"
            :value="optDefault"
            @input="inputOptDefault"
          />
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">选项事件</p>
          <div class="formBox-block-item-optEventBox">
            <div
              v-for="(item, index) in optEventsArr"
              :key="index"
              class="formBox-block-item-optEventBox-item"
            >
              <div class="formBox-block-item-optEventBox-item-row">
                <div class="formBox-block-item formBox-block-item--child">
                  <p class="formBox-block-item-label">
                    结果事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-input"
                    placeholder="事件Key"
                    :value="item.key"
                    @input="(text) => inputOptEventKey(index, text)"
                  />
                  <p
                    class="formBox-block-item-optEventBox-item-delBtn"
                    @click="removeOptEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-optEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">选项标题</p>
                  <div class="formBox-block-item-textareaBox">
                    <GhInput
                      class="formBox-block-item-input"
                      placeholder="选项标题"
                      :value="item.optEventText"
                      @input="(text) => inputOptEventText(index, text)"
                    />
                  </div>
                </div>
              </div>
              <div class="formBox-block-item-optEventBox-item-row">
                <p class="formBox-block-item-label">字体颜色</p>
                <div class="formBox-block-item-optEventBox">
                  <div class="formBox-block-item formBox-block-item--child">
                    <GhInput
                      class="formBox-block-item-optEventBox-item-input"
                      placeholder="字体颜色(默认:#000000)"
                      :value="item.optEventColor"
                      @input="(text) => inputOptEventColor(index, text)"
                    />
                    <p
                      :class="[
                        'formBox-block-item-optEventBox-item-errTag',
                        optEventErrorIndex[index] &&
                          optEventErrorIndex[index].optEventColor
                          ? 'formBox-block-item-optEventBox-item-errTag--show'
                          : '',
                      ]"
                      title="请输入正确的色号"
                    >
                      ×
                    </p>
                  </div>
                  <p class="formBox-block-item-tips">
                    Tips: 色号示例 三位【#000】 六位【#000000】
                    八位【#00000000】
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-optEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">触发条件</p>
                  <div class="formBox-block-item-conditionBox">
                    <p
                      :class="[
                        'formBox-block-item-pretips',
                        optEventConditionsError
                          ? 'formBox-block-item-pretips--warning'
                          : '',
                      ]"
                    >
                      最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
                    </p>
                    <div
                      v-for="(citem, cindex) in optEventConditions[index]"
                      :key="cindex"
                      class="formBox-block-item-conditionBox-item"
                    >
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性名"
                        :value="citem.key"
                        @input="
                          (text) =>
                            inputOptEventConditionKey(index, cindex, text)
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最小值(含)"
                        :value="citem.min"
                        @input="
                          (text) =>
                            inputOptEventConditionMinValue(index, cindex, text)
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最大值(不含)"
                        :value="citem.max"
                        @input="
                          (text) =>
                            inputOptEventConditionMaxValue(index, cindex, text)
                        "
                      />
                      <p
                        :class="[
                          'formBox-block-item-conditionBox-item-errTag',
                          optEventConditionsErrorIndex[index] &&
                            optEventConditionsErrorIndex[index].includes(cindex)
                            ? 'formBox-block-item-conditionBox-item-errTag--show'
                            : '',
                        ]"
                        title="请输入正确的数字"
                      >
                        ×
                      </p>
                      <p
                        class="formBox-block-item-conditionBox-item-delBtn"
                        @click="removeOptEventConditionItem(index, cindex)"
                      >
                        -- 移除 --
                      </p>
                    </div>
                    <p
                      class="formBox-block-item-conditionBox-addBtn"
                      @click="addOptEventConditionItem(index)"
                    >
                      ++ 添加一项 ++
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
                      回合信息(unitTimeInfo), 年份(year)
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips2: 指定某一数值时，如a属性需要完全等于10时，则需输入a
                      10 11
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p
              class="formBox-block-item-optEventBox-addBtn"
              @click="addOptEventItem"
            >
              ++ 添加一项 ++
            </p>
          </div>
        </div>
      </div>
      <div v-show="selectedOptType === 1" class="formBox-block">
        <p class="formBox-block-label">多选事件属性</p>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">多选默认事件KEY</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="请输入默认匹配事件KEY"
            :value="multiOptDefault"
            @input="inputMultiOptDefault"
          />
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">默认选项匹配事件KEY</p>
          <div
            class="formBox-block-item formBox-block-item--column formBox-block-item--child"
          >
            <GhInput
              class="formBox-block-item-input"
              placeholder="请输入默认选项匹配事件KEY"
              :value="multiOptMultiMixDefaultEvent"
              @input="inputMultiOptMultiMixDefaultEvent"
            />
            <p class="formBox-block-item-tips">
              Tips1:
              在选项结果匹配中没有指定结果事件，则执行该事件，如：事件匹配事件只有【0_1:
              resultEvent】，则0_2无匹配结果事件，则将执行该事件
            </p>
            <p class="formBox-block-item-tips">
              Tips2: 该事件执行条件不足时，将执行多选默认事件KEY
            </p>
            <p class="formBox-block-item-tips">
              Tips3:
              多选默认事件、默认选项匹配事件为空时，都将自动填充为【duoxuanmoren】
            </p>
          </div>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">最大选择选项数</p>
          <GhInput
            class="formBox-block-item-input"
            placeholder="最大选择选项数(≥0)"
            :value="multiOptMaxSelection"
            @input="inputMultiOptMaxSelection"
          />
          <p
            :class="[
              'formBox-block-item-conditionBox-item-errTag',
              multiOptMaxSelectionNumError
                ? 'formBox-block-item-conditionBox-item-errTag--show'
                : '',
            ]"
            title="请输入正确的数字"
          >
            ×
          </p>
        </div>
        <div class="formBox-block-item">
          <div class="formBox-block-item-conditionBox">
            <p
              :class="[
                'formBox-block-item-pretips',
                multiOptRequireSelectNumError
                  ? 'formBox-block-item-pretips--warning'
                  : '',
              ]"
            >
              最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
            </p>
            <div class="formBox-block-item-conditionBox-item">
              <p class="formBox-block-item-label">可选数量范围</p>
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="最小选择数(含, ≥0)"
                :value="multiOptRequireSelectNum[0]"
                @input="(text) => inputMultiOptRequireSelectNum(text, 0)"
              />
              <GhInput
                class="formBox-block-item-conditionBox-item-input"
                placeholder="最大可选数(不含, ≥0)"
                :value="multiOptRequireSelectNum[1]"
                @input="(text) => inputMultiOptRequireSelectNum(text, 1)"
              />
              <p
                :class="[
                  'formBox-block-item-conditionBox-item-errTag',
                  multiOptRequireSelectNumError
                    ? 'formBox-block-item-conditionBox-item-errTag--show'
                    : '',
                ]"
                title="请输入正确的数字"
              >
                ×
              </p>
            </div>
          </div>
        </div>
        <div class="formBox-block-item">
          <p class="formBox-block-item-label">有序选项</p>
          <div class="formBox-block-item-radioBox">
            <p
              :class="[
                'formBox-block-item-radioBox-radio',
                !multiOptOrderlySelections
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              title="匹配多选结果时无需选择顺序"
              @click="selectMultiOptOrderlySelections(false)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              关闭
            </p>
            <p
              :class="[
                'formBox-block-item-radioBox-radio',
                multiOptOrderlySelections
                  ? 'formBox-block-item-radioBox-radio--selected'
                  : '',
              ]"
              title="匹配多选结果时需按照选择顺序"
              @click="selectMultiOptOrderlySelections(true)"
            >
              <span class="formBox-block-item-radioBox-radio-dot" />
              开启
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">可选选项</p>
          <div class="formBox-block-item-multiOptEventBox">
            <div
              v-for="(item, index) in multiOptOptions"
              :key="index"
              class="formBox-block-item-multiOptEventBox-item"
            >
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">
                    选项 {{ index + 1 }} 标题
                  </p>
                  <div class="formBox-block-item-textareaBox">
                    <GhInput
                      class="formBox-block-item-input"
                      :placeholder="`选项 ${index + 1} 标题`"
                      :value="item.text"
                      @input="(text) => inputMultiOptText(index, text)"
                    />
                  </div>
                  <p
                    class="formBox-block-item-conditionBox-item-delBtn"
                    @click="removeMultiOptEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <p class="formBox-block-item-label">字体颜色</p>
                <div class="formBox-block-item-multiOptEventBox">
                  <div class="formBox-block-item formBox-block-item--child">
                    <GhInput
                      class="formBox-block-item-multiOptEventBox-item-input"
                      placeholder="字体颜色(默认:#000000)"
                      :value="item.color"
                      @input="(text) => inputMultiOptColor(index, text)"
                    />
                    <p
                      :class="[
                        'formBox-block-item-multiOptEventBox-item-errTag',
                        multiOptOptionsErrorIndex[index] &&
                          multiOptOptionsErrorIndex[index].color
                          ? 'formBox-block-item-multiOptEventBox-item-errTag--show'
                          : '',
                      ]"
                      title="请输入正确的色号"
                    >
                      ×
                    </p>
                  </div>
                  <p class="formBox-block-item-tips">
                    Tips: 色号示例 三位【#000】 六位【#000000】
                    八位【#00000000】
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <p class="formBox-block-item-label">选项重复数</p>
                <div class="formBox-block-item-multiOptEventBox">
                  <div class="formBox-block-item formBox-block-item--child">
                    <GhInput
                      class="formBox-block-item-multiOptEventBox-item-input"
                      placeholder="选项重复数量(≥1)"
                      :value="item.maxRepeat"
                      @input="(text) => inputMultiOptMaxRepeat(index, text)"
                    />
                    <p
                      :class="[
                        'formBox-block-item-multiOptEventBox-item-errTag',
                        multiOptOptionsErrorIndex[index] &&
                          multiOptOptionsErrorIndex[index].maxRepeat
                          ? 'formBox-block-item-multiOptEventBox-item-errTag--show'
                          : '',
                      ]"
                      title="请输入正确的数字"
                    >
                      ×
                    </p>
                  </div>
                  <p class="formBox-block-item-tips">
                    Tips:
                    为空则默认为1，n大于1时，玩家选择时会出现n个相同的该选项
                  </p>
                </div>
              </div>
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">触发条件</p>
                  <div class="formBox-block-item-conditionBox">
                    <p
                      :class="[
                        'formBox-block-item-pretips',
                        multiOptOptionConditionsError
                          ? 'formBox-block-item-pretips--warning'
                          : '',
                      ]"
                    >
                      最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
                    </p>
                    <div
                      v-for="(citem, cindex) in multiOptConditions[index]"
                      :key="cindex"
                      class="formBox-block-item-conditionBox-item"
                    >
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性名"
                        :value="citem.key"
                        @input="
                          (text) =>
                            inputMultiOptOptionConditionKey(index, cindex, text)
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最小值(含)"
                        :value="citem.min"
                        @input="
                          (text) =>
                            inputMultiOptOptionConditionMinValue(
                              index,
                              cindex,
                              text
                            )
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最大值(不含)"
                        :value="citem.max"
                        @input="
                          (text) =>
                            inputMultiOptOptionConditionMaxValue(
                              index,
                              cindex,
                              text
                            )
                        "
                      />
                      <p
                        :class="[
                          'formBox-block-item-conditionBox-item-errTag',
                          multiOptOptionConditionsErrorIndex[index] &&
                            multiOptOptionConditionsErrorIndex[index].includes(
                              cindex
                            )
                            ? 'formBox-block-item-conditionBox-item-errTag--show'
                            : '',
                        ]"
                        title="请输入正确的数字"
                      >
                        ×
                      </p>
                      <p
                        class="formBox-block-item-conditionBox-item-delBtn"
                        @click="
                          removeMultiOptOptionConditionItem(index, cindex)
                        "
                      >
                        -- 移除 --
                      </p>
                    </div>
                    <p
                      class="formBox-block-item-conditionBox-addBtn"
                      @click="addMultiOptOptionConditionItem(index)"
                    >
                      ++ 添加一项 ++
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
                      回合信息(unitTimeInfo), 年份(year)
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips2: 指定某一数值时，如a属性需要完全等于10时，则需输入a
                      10 11
                    </p>
                  </div>
                </div>
              </div>
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <div
                  class="formBox-block-item formBox-block-item--multi formBox-block-item--child"
                >
                  <p class="formBox-block-item-label">禁用条件</p>
                  <div class="formBox-block-item-conditionBox">
                    <p
                      :class="[
                        'formBox-block-item-pretips',
                        multiOptOptionDisableConditionsError
                          ? 'formBox-block-item-pretips--warning'
                          : '',
                      ]"
                    >
                      最大值和最小值必须为数字（小数将只保留整数位），不输入则默认为无(上/下)限制
                    </p>
                    <div
                      v-for="(citem, cindex) in multiOptDisbleConditions[index]"
                      :key="cindex"
                      class="formBox-block-item-conditionBox-item"
                    >
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性名"
                        :value="citem.key"
                        @input="
                          (text) =>
                            inputMultiOptOptionDisableConditionKey(
                              index,
                              cindex,
                              text
                            )
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最小值(含)"
                        :value="citem.min"
                        @input="
                          (text) =>
                            inputMultiOptOptionDisableConditionMinValue(
                              index,
                              cindex,
                              text
                            )
                        "
                      />
                      <GhInput
                        class="formBox-block-item-conditionBox-item-input"
                        placeholder="角色属性最大值(不含)"
                        :value="citem.max"
                        @input="
                          (text) =>
                            inputMultiOptOptionDisableConditionMaxValue(
                              index,
                              cindex,
                              text
                            )
                        "
                      />
                      <p
                        :class="[
                          'formBox-block-item-conditionBox-item-errTag',
                          multiOptOptiontDisableConditionsErrorIndex[index] &&
                            multiOptOptiontDisableConditionsErrorIndex[
                              index
                            ].includes(cindex)
                            ? 'formBox-block-item-conditionBox-item-errTag--show'
                            : '',
                        ]"
                        title="请输入正确的数字"
                      >
                        ×
                      </p>
                      <p
                        class="formBox-block-item-conditionBox-item-delBtn"
                        @click="
                          removeMultiOptOptionDisableConditionItem(
                            index,
                            cindex
                          )
                        "
                      >
                        -- 移除 --
                      </p>
                    </div>
                    <p
                      class="formBox-block-item-conditionBox-addBtn"
                      @click="addMultiOptOptionDisableConditionItem(index)"
                    >
                      ++ 添加一项 ++
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips1: 可填属性包含，角色信息, 角色状态, 角色Buff,
                      回合信息(unitTimeInfo), 年份(year)
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips2: 指定某一数值时，如a属性需要完全等于10时，则需输入a
                      10 11
                    </p>
                    <p class="formBox-block-item-tips">
                      Tips3: 优先级高于【触发条件】
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p
              class="formBox-block-item-multiOptEventBox-addBtn"
              @click="addMultiOptEventItem"
            >
              ++ 添加一项 ++
            </p>
          </div>
        </div>
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">选项匹配事件</p>
          <div class="formBox-block-item-multiOptEventBox">
            <p
              :class="[
                'formBox-block-item-pretips',
                multiOptMixEventsError
                  ? 'formBox-block-item-pretips--warning'
                  : '',
              ]"
            >
              匹配选项按照选项序号填写，选项序号间用 下划线_ 间隔，例如: 1_2_5
            </p>
            <div
              v-for="(item, index) in multiOptMultiMixEvents"
              :key="index"
              class="formBox-block-item-multiOptEventBox-item"
            >
              <div class="formBox-block-item-multiOptEventBox-item-row">
                <div class="formBox-block-item-conditionBox-item">
                  <p class="formBox-block-item-label">
                    匹配事件{{ index + 1 }}
                  </p>
                  <GhInput
                    class="formBox-block-item-conditionBox-item-input"
                    placeholder="匹配选项序号"
                    :value="item.indexes"
                    @input="(text) => inputMultiOptMixEventIndexes(index, text)"
                  />
                  <GhInput
                    class="formBox-block-item-conditionBox-item-input"
                    placeholder="匹配事件Key"
                    :value="item.key"
                    @input="(text) => inputMultiOptMixEventKey(index, text)"
                  />
                  <p
                    :class="[
                      'formBox-block-item-conditionBox-item-errTag',
                      multiOptMixEventsErrorIndex.includes(index)
                        ? 'formBox-block-item-conditionBox-item-errTag--show'
                        : '',
                    ]"
                    title="请输入正确的选项序号"
                  >
                    ×
                  </p>
                  <p
                    class="formBox-block-item-multiOptEventBox-item-delBtn"
                    @click="removeMultiOptMixEventItem(index)"
                  >
                    -- 移除 --
                  </p>
                </div>
              </div>
            </div>
            <p
              class="formBox-block-item-multiOptEventBox-addBtn"
              @click="addMultiOptMixEventItem"
            >
              ++ 添加一项 ++
            </p>
            <p class="formBox-block-item-tips">
              Tips1:
              有序选项开启后，玩家选择选项顺序与匹配选项序号顺序将以严格一致作为规则进行匹配
            </p>
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
        <div class="formBox-block-item formBox-block-item--multi">
          <p class="formBox-block-item-label">输出说明</p>
          <p class="formBox-block-item-text">
            所有数值设置，除特殊要求外，值大于{{ MAXNUM }}的都自动转为{{
              MAXNUM
            }}，值小于{{ MINNUM }}的都自动转为{{ MINNUM }}<br>
            回合数、次数相关数值、选项数等必须 ≥0
            的数值，如果小于0将自动转为0<br>
            所有可复数项属性，当key值相同时，仅最后一个生效<br>
            所有范围数值，若最小值 >
            最大值，在实际生效时，最大值会自动作为最小值，最小值作为最大值
          </p>
        </div>
      </div>
    </div>
    <div class="previewBox">{{ eventText }}</div>
  </div>
</template>

// 不存在事件检测（关联的事件不存在） // 事件联想输入框（搜索text和key）
// 概率结果事件、绑定事件不可填写自己，只能选择被动事件（做校验），但实际上是可行的，仅避免无限循环同一事件的情况发生
// 色号标准：#000, #000000, #00000000, rgb(255,255,255), rgba(255,255,255,1)
<script>
const colorReg =
  /^\#([a-zA-Z0-9]){3}$|^\#([a-zA-Z0-9]){6}$|^\#([a-zA-Z0-9]){8}$|^rgb\(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\,\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\,\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\)$|^rgba\(\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\,\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\,\b([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\,(([01])|(0\.\d+))\)$/
function notColor(color) {
  return !colorReg.test(color)
}
const mixEventIndexReg = /^(\d|([1-9]\d*))(\_(\d|([1-9]\d*)))*$/
function notMixEventIndex(color) {
  return !mixEventIndexReg.test(color)
}
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
          desc: `不会主动执行，仅作为任意事件条件不足时触发使用，可执行次数和总可执行次数必须为${MAXNUM}`,
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
          desc: '拥有不同概率的结果事件，该事件执行时会随机触发设定数量的概率结果事件，概率结果事件数少于设定的应触发数量时，以默认概率结果事件补充；概率结果事件不存在、不满足条件、超出次数时，将执行默认概率结果事件'
        },
        {
          text: '绑定事件',
          value: 'bind',
          desc: '拥有绑定的结果事件，若绑定的结果事件，则会马上/延迟执行，不满足的则会执行默认结果事件(可设置为不执行)'
        }
      ],
      // 单选(可选)
      optType: [
        {
          text: '单选事件',
          value: 'opt',
          desc: '提供单项选择，每个选择对应一个反馈事件；选项前置条件不满足时，隐藏选项；反馈事件触发条件不满足时，选项置灰；没有选项可选时，提供“跳过”选项，执行默认反馈事件'
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
            orderlySelections: false, // 是否开启有序选项模式
            maxSelection: 2, // Number, 最大可选数，对[无满足条件的选项时]的唯一选项不起作用
            requireSelectNum: [2, MAXNUM], // Array(Number), 最少选择数、最大选择数
            multiMixEvents: {
              '0_1': 'demo',
              any: 'demo' // 所选择的选项没有对应的回调事件时执行的默认事件
            }, // 多选匹配事件
            multiOptDefault: 'duoxuanmoren' // 无满足条件的选项时，返回的唯一选项对应的事件
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
      prNumberError: false,
      prEventError: false,
      prEventErrorIndex: {},
      bindEventError: [],
      bindEventErrorIndex: [],
      bindEventConditionsError: false,
      bindEventConditionsErrorIndex: {},
      optEventError: [],
      optEventErrorIndex: [],
      optEventConditionsError: false,
      optEventConditionsErrorIndex: {},
      multiOptMaxSelectionNumError: false,
      multiOptRequireSelectNumError: false,
      multiOptOptionsError: false,
      multiOptOptionsErrorIndex: [],
      multiOptOptionConditionsError: false,
      multiOptOptionConditionsErrorIndex: {},
      multiOptOptionDisableConditionsError: false,
      multiOptOptiontDisableConditionsErrorIndex: {},
      multiOptMixEventsError: false,
      multiOptMixEventsErrorIndex: [],
      // 属性
      key: '',
      text: '', // 可使用属性条件
      textArr: [], // 用于生成text
      style: [], // 可使用属性条件
      times: MAXNUM,
      timesOfUnit: MAXNUM,
      triggerConditions: [],
      execNormalDefaultWhenMismatchConditions: true,
      effectAttr: [], // attr: Number|Array
      // 事件次数额外增益
      effectEvents: [],
      // 概率事件额外权重增益
      prEventsExtraWeight: [],
      // 额外的随机事件
      extraRandomEvents: [],
      normalDefault: '', // 未达成事件条件时执行的事件
      // 基础类型属性
      isDefault: false,
      isCertain: false,
      isPassive: false,
      // 概率事件属性
      prEventsArr: [],
      prNumber: '',
      prDefault: '', // 为空则gailvmoren
      // 绑定事件属性
      bindEventsArr: [],
      bindEventConditions: {},
      bindDefault: '', // 为空则bangdingmoren
      // 单选事件属性
      optEventsArr: [],
      optEventConditions: {},
      optDefault: '', // 为空则kexuanmoren
      // 多选事件属性
      multiOptDefault: '', // 为空则duoxuanmoren
      multiOptMaxSelection: '',
      multiOptRequireSelectNum: ['', ''],
      multiOptOrderlySelections: false,
      multiOptOptions: [], // 选项配置
      multiOptConditions: {},
      multiOptDisbleConditions: {},
      multiOptMultiMixEvents: [],
      multiOptMultiMixDefaultEvent: '', // 可为空
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
    eventJSON() {
      return {
        selectedBaseType: this.selectedBaseType,
        selectedFuncType: this.selectedFuncType,
        selectedOptType: this.selectedOptType,
        key: this.key,
        text: this.text,
        textArr: this.textArr,
        style: this.style,
        times: this.times,
        timesOfUnit: this.timesOfUnit,
        triggerConditions: this.triggerConditions,
        execNormalDefaultWhenMismatchConditions: this.execNormalDefaultWhenMismatchConditions,
        effectAttr: this.effectAttr,
        effectEvents: this.effectEvents,
        prEventsExtraWeight: this.prEventsExtraWeight,
        extraRandomEvents: this.extraRandomEvents,
        normalDefault: this.normalDefault,
        isDefault: this.isDefault,
        isCertain: this.isCertain,
        isPassive: this.isPassive,
        prEventsArr: this.prEventsArr,
        prNumber: this.prNumber,
        prDefault: this.prDefault,
        bindEventsArr: this.bindEventsArr,
        bindEventConditions: this.bindEventConditions,
        bindDefault: this.bindDefault,
        optEventsArr: this.optEventsArr,
        optEventConditions: this.optEventConditions,
        optDefault: this.optDefault,
        multiOptDefault: this.multiOptDefault,
        multiOptMaxSelection: this.multiOptMaxSelection,
        multiOptRequireSelectNum: this.multiOptRequireSelectNum,
        multiOptOrderlySelections: this.multiOptOrderlySelections,
        multiOptOptions: this.multiOptOptions,
        multiOptConditions: this.multiOptConditions,
        multiOptDisbleConditions: this.multiOptDisbleConditions,
        multiOptMultiMixEvents: this.multiOptMultiMixEvents,
        multiOptMultiMixDefaultEvent: this.multiOptMultiMixDefaultEvent
      }
    },
    eventObj() {
      const textArr = this.getTextArr()
      const styleArr = this.getStyleArr()
      const style = {}
      const times = parseInt(this.times)
      const rtimes = isNaN(times)
        ? MAXNUM
        : this.getScopeNum(times, [0, MAXNUM])
      const timesOfUnit = parseInt(this.timesOfUnit)
      const rtimesOfUnit = isNaN(timesOfUnit)
        ? 1
        : this.getScopeNum(timesOfUnit, [0, MAXNUM])
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
            persent: this.getScopeNum(rpersent, [0, 100]),
            goodOrBad: this.getScopeNum(rgoodOrBad),
            times: this.getScopeNum(rtimes, [0, MAXNUM]),
            lastUnitTime: this.getScopeNum(rlastUnitTime, [0, MAXNUM])
          }
        }
      })
      const prEventObj =
        this.selectedFuncType.includes(0) &&
        this.prEventsArr.filter((item) => !!item.key).length
          ? { ...this.prEventObj }
          : {}
      const bindEventObj =
        this.selectedFuncType.includes(1) &&
        this.bindEventsArr.filter((item) => !!item.key).length
          ? { ...this.bindEventObj }
          : {}
      const optEventObj =
        this.selectedOptType === 0 &&
        this.optEventsArr.filter((item) => !!item.key).length
          ? this.optEventObj
          : {}
      const multiOptEventObj =
        this.selectedOptType === 1 ? this.multiOptEventObj : {}
      return {
        eventKey: this.key,
        textArr: `false||function(textArr=[...JSON.parse('${JSON.stringify(
          textArr
        )}')]){return [...textArr]}`,
        styleArr: `false||function(styleArr=[...JSON.parse('${JSON.stringify(
          styleArr
        )}')]){return [...styleArr]}`,
        text: "false||function(options){const textArr=this.textArr;let text='';for(let i=0;i<textArr.length;i++){const item=textArr[i];const isJur=item.indexOf('[[')>-1&&item.indexOf(']]')>-1;if(!isJur){text+=item;continue;}const jurCmd=item.substring(2,item.length-2);if(jurCmd){try{text+=eval(jurCmd);}catch(err){console.log(err);text+='';}}}return text;}",
        style: `false||function(options){const styleArr=this.styleArr;const style = {};for (let i=0;i<styleArr.length;i++){const key=styleArr[i].key;let text = '';const textArr=styleArr[i].value;for(let i=0;i<textArr.length;i++){const item=textArr[i];const isJur=item.indexOf('[[')>-1&&item.indexOf(']]')>-1;if (!isJur) {text += item;continue;}const jurCmd=item.substring(2,item.length-2);if(jurCmd){try{text+=eval(jurCmd);}catch(err){console.log(err);text+='';}}}style[key]=text;}return style;}`,
        times: `false||function(initTimes=${rtimes}){return initTimes}`,
        timesOfUnit: `false||function(times=${rtimesOfUnit}){return times}`,
        triggerConditions: `false||function(attr={...JSON.parse('${JSON.stringify(
          triggerConditions
        )}')}){return {...attr}}`,
        effectAttr: `false||function(attr={...JSON.parse('${JSON.stringify(
          effectAttr
        )}')}){return {...attr}}`,
        effectEvents: `false||function(events={...JSON.parse('${JSON.stringify(
          effectEvents
        )}')}){return {...events}}`,
        prEventsExtraWeight: `false||function(events={...JSON.parse('${JSON.stringify(
          prEventsExtraWeight
        )}')}){return {...events}}`,
        extraRandomEvents: `false||function(events={...JSON.parse('${JSON.stringify(
          extraRandomEvents
        )}')}){return {...events}}`,
        normalDefault: `false||function(eventKey='${
          this.normalDefault || 'putongmoren'
        }'){return eventKey}`,
        ...this.baseTypeObj,
        ...prEventObj,
        ...bindEventObj,
        ...optEventObj,
        ...multiOptEventObj
      }
    },
    eventText() {
      console.log(this.eventObj)
      const json = {}
      json.textArr = (eval(this.eventObj.textArr))()
      json.styleArr = (eval(this.eventObj.styleArr))()
      for (const key in this.eventObj) {
        if (key === 'eventKey' || key === 'textArr' || key === 'styleArr') continue
        json[key] = (eval(this.eventObj[key]))
        json[key] = json[key]()
      }
      return JSON.stringify(json)
    },
    baseTypeObj() {
      return {
        isDefault: `false||function(){return ${this.isDefault}}`,
        isCertain: `false||function(){return ${this.isCertain}}`,
        isPassive: `false||function(){return ${this.isPassive}}`
      }
    },
    prEventObj() {
      const prNumber = parseInt(this.prNumber)
      const rPrNumber = isNaN(prNumber)
        ? 0
        : this.getScopeNum(prNumber, [0, MAXNUM])
      const prEventsObj = {}
      const prGoodOrBadObj = {}
      const prRepeatObj = {}
      this.prEventsArr.forEach((item) => {
        const { key, prWeight, prGoodOrBad, prRepeat } = item
        if (key) {
          const prWeightInt = parseInt(prWeight)
          const prGoodOrBadInt = parseInt(prGoodOrBad)
          const prRepeatInt = parseInt(prRepeat)
          const rPrWeight = isNaN(prWeightInt)
            ? 0
            : this.getScopeNum(prWeightInt, [0, MAXNUM])
          const rPrGoodOrBad = isNaN(prGoodOrBadInt)
            ? 0
            : this.getScopeNum(prGoodOrBadInt)
          const rPrRepeat = isNaN(prRepeatInt)
            ? 0
            : this.getScopeNum(prRepeatInt, [0, MAXNUM])
          prEventsObj[key] = rPrWeight
          prGoodOrBadObj[key] = rPrGoodOrBad
          prRepeatObj[key] = rPrRepeat
        }
      })
      return {
        prDefault: `false||function(eventKey='${
          this.prDefault || 'gailvmoren'
        }'){return eventKey}`,
        prNumber: `false||function(num=${rPrNumber}){return num}`,
        prEvents: `false||function(events={...JSON.parse('${JSON.stringify(
          prEventsObj
        )}')}){return {...events}}`,
        prGoodOrBad: `false||function(events={...JSON.parse('${JSON.stringify(
          prGoodOrBadObj
        )}')}){return {...events}}`,
        prRepeat: `false||function(events={...JSON.parse('${JSON.stringify(
          prRepeatObj
        )}')}){return {...events}}`
      }
    },
    bindEventObj() {
      const bindEventsObj = {}
      this.bindEventsArr.forEach((item, index) => {
        const { key, bindEventDuration, bindEventDonotMismatchToDefault } =
          item
        if (key) {
          const bindEventDurationInt = parseInt(bindEventDuration)
          const rBindEventDuration = isNaN(bindEventDurationInt)
            ? 0
            : this.getScopeNum(bindEventDurationInt, [0, MAXNUM])
          bindEventsObj[key] = {
            duration: rBindEventDuration,
            donotMismatchToDefaut: bindEventDonotMismatchToDefault,
            conditions: {}
          }
          this.bindEventConditions[index].forEach((citem, cindex) => {
            const bkey = citem.key
            if (bkey) {
              const max = parseInt(citem.max)
              const min = parseInt(citem.min)
              bindEventsObj[key].conditions[bkey] = [
                isNaN(min) ? MINNUM : this.getMinNum(min),
                isNaN(max) ? MAXNUM : this.getMaxNum(max)
              ]
            }
          })
        }
      })
      return {
        bindDefault: `false||function(eventKey='${
          this.bindDefault || 'bangdingmoren'
        }'){return eventKey}`,
        bindEvents: `false||function(events={...JSON.parse('${JSON.stringify(
          bindEventsObj
        )}')}){return {...events}}`
      }
    },
    optEventObj() {
      const optEventsObj = {}
      this.optEventsArr.forEach((item, index) => {
        const { key, optEventColor, optEventText } = item
        if (key) {
          const optEventColorStr = (optEventColor || '#000').replaceAll(
            ' ',
            ''
          )
          const rOptEventColor = notColor(optEventColorStr)
            ? '#000'
            : optEventColorStr
          optEventsObj[key] = {
            color: rOptEventColor,
            text: optEventText,
            conditions: {}
          }
          this.optEventConditions[index].forEach((citem, cindex) => {
            const bkey = citem.key
            if (bkey) {
              const max = parseInt(citem.max)
              const min = parseInt(citem.min)
              optEventsObj[key].conditions[bkey] = [
                isNaN(min) ? MINNUM : this.getMinNum(min),
                isNaN(max) ? MAXNUM : this.getMaxNum(max)
              ]
            }
          })
        }
      })
      return {
        optDefault: `false||function(eventKey='${
          this.optDefault || 'kexuanmoren'
        }'){return eventKey}`,
        optEvents: `false||function(events={...JSON.parse('${JSON.stringify(
          optEventsObj
        )}')}){return {...events}}`
      }
    },
    multiOptEventObj() {
      const maxSelection = parseInt(this.multiOptMaxSelection)
      const rMaxSelection = isNaN(maxSelection)
        ? 2
        : this.getScopeNum(maxSelection, [2, MAXNUM])
      const requireSelectMinNum = parseInt(this.multiOptRequireSelectNum[0])
      const rRequireSelectMinNum = isNaN(requireSelectMinNum)
        ? 2
        : this.getScopeNum(requireSelectMinNum, [2, MAXNUM])
      const requireSelectMaxNum = parseInt(this.multiOptRequireSelectNum[1])
      const rRequireSelectMaxNum = isNaN(requireSelectMaxNum)
        ? 3
        : this.getScopeNum(requireSelectMaxNum, [
          rRequireSelectMinNum + 1,
          MAXNUM
        ])
      const multiMixEventsObj = {}
      for (let i = 0; i < this.multiOptMultiMixEvents.length; i++) {
        const { indexes, key } = this.multiOptMultiMixEvents[i]
        if (indexes && key) {
          if (!notMixEventIndex(indexes)) {
            multiMixEventsObj[indexes] = key
          }
        }
      }
      const multiOptionsArr = []
      this.multiOptOptions.forEach((item, index) => {
        let multiOptionObj = {}
        const { text, color, maxRepeat } = item
        if (text) {
          const optEventColorStr = (color || '#000').replaceAll(
            ' ',
            ''
          )
          const rOptEventColorStr = notColor(optEventColorStr)
            ? '#000'
            : optEventColorStr
          const _maxRepeat = parseInt(maxRepeat)
          const rMaxRepeat = isNaN(_maxRepeat)
            ? 1
            : this.getScopeNum(_maxRepeat, [1, MAXNUM])
          multiOptionObj = {
            color: rOptEventColorStr,
            text,
            maxRepeat: rMaxRepeat,
            conditions: {},
            disabledConditions: {}
          }
          this.multiOptConditions[index].forEach((citem, cindex) => {
            const bkey = citem.key
            if (bkey) {
              const max = parseInt(citem.max)
              const min = parseInt(citem.min)
              multiOptionObj.conditions[bkey] = [
                isNaN(min) ? MINNUM : this.getMinNum(min),
                isNaN(max) ? MAXNUM : this.getMaxNum(max)
              ]
            }
          })
          this.multiOptDisbleConditions[index].forEach((citem, cindex) => {
            const bkey = citem.key
            if (bkey) {
              const max = parseInt(citem.max)
              const min = parseInt(citem.min)
              multiOptionObj.disabledConditions[bkey] = [
                isNaN(min) ? MINNUM : this.getMinNum(min),
                isNaN(max) ? MAXNUM : this.getMaxNum(max)
              ]
            }
          })
          multiOptionsArr.push(multiOptionObj)
        }
      })
      return {
        maxSelection: `false||function(num=${rMaxSelection}){return num}`,
        requireSelectNum: `false||function(nums=${JSON.stringify([
          rRequireSelectMinNum,
          rRequireSelectMaxNum
        ])}){return nums}`,
        orderlySelections: `false||function(enable=${this.multiOptOrderlySelections}){return enable}`,
        multiOptDefault: `false||function(eventKey='${
          this.multiOptDefault || 'duoxuanmoren'
        }'){return eventKey}`,
        multiMixEvents: `false||function(mixEvents={...(JSON.parse('${JSON.stringify(multiMixEventsObj)}')),any:'${
          this.multiOptMultiMixDefaultEvent || 'duoxuanmoren'
        }'}){return {...mixEvents}}`,
        multiOptions: `false||function(options=${JSON.stringify(multiOptionsArr)}){return [...options]}`
      }
    }
  },
  watch: {
    eventObj() {
      // console.log(this.eventObj)
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
    },
    prNumber() {
      this.prNumberError = this.prNumber && isNaN(parseInt(this.prNumber))
    },
    prEventsArr() {
      this.prEventError = false
      this.prEventErrorIndex = {}
      for (let i = 0; i < this.prEventsArr.length; i++) {
        const item = this.prEventsArr[i]
        let errItem = false
        const prWeight = item.prWeight ? parseInt(item.prWeight) : 0
        const prGoodOrBad = item.prGoodOrBad ? parseInt(item.prGoodOrBad) : 0
        const prRepeat = item.prRepeat ? parseInt(item.prRepeat) : 0
        errItem = isNaN(prWeight) || isNaN(prGoodOrBad) || isNaN(prRepeat)
        if (errItem) {
          this.prEventError = this.prEventError || errItem
          this.$set(this.prEventErrorIndex, i, {
            prWeight: isNaN(prWeight),
            prGoodOrBad: isNaN(prGoodOrBad),
            prRepeat: isNaN(prRepeat)
          })
        }
      }
    },
    bindEventsArr() {
      this.bindEventError = false
      this.bindEventErrorIndex = []
      for (let i = 0; i < this.bindEventsArr.length; i++) {
        const item = this.bindEventsArr[i]
        let errItem = false
        const bindEventDuration = item.bindEventDuration
          ? parseInt(item.bindEventDuration)
          : 0
        errItem = isNaN(bindEventDuration)
        if (errItem) {
          this.bindEventError = this.bindEventError || errItem
          this.$set(this.bindEventErrorIndex, i, {
            bindEventDuration: isNaN(bindEventDuration)
          })
        }
      }
    },
    bindEventConditions: {
      handler() {
        this.bindEventConditionsError = false
        this.bindEventConditionsErrorIndex = {}
        for (const key in this.bindEventConditions) {
          const errIndex = []
          for (let i = 0; i < this.bindEventConditions[key].length; i++) {
            const item = this.bindEventConditions[key][i]
            if (item.key) {
              let errItem = false
              const min = item.min ? parseInt(item.min) : MINNUM
              const max = item.max ? parseInt(item.max) : MAXNUM
              errItem = isNaN(min) || isNaN(max)
              if (errItem) {
                this.bindEventConditionsError =
                  this.bindEventConditionsError || errItem
                errIndex.push(i)
              }
            }
          }
          this.$set(this.bindEventConditionsErrorIndex, key, errIndex)
        }
      },
      deep: true
    },
    optEventsArr() {
      this.optEventError = false
      this.optEventErrorIndex = []
      for (let i = 0; i < this.optEventsArr.length; i++) {
        const item = this.optEventsArr[i]
        let errItem = false
        const optEventColor = (item.optEventColor || '#000').replaceAll(
          ' ',
          ''
        )
        errItem = notColor(optEventColor)
        if (errItem) {
          this.optEventError = this.optEventError || errItem
          this.$set(this.optEventErrorIndex, i, {
            optEventColor: notColor(optEventColor)
          })
        }
      }
    },
    optEventConditions: {
      handler() {
        this.optEventConditionsError = false
        this.optEventConditionsErrorIndex = {}
        for (const key in this.optEventConditions) {
          const errIndex = []
          for (let i = 0; i < this.optEventConditions[key].length; i++) {
            const item = this.optEventConditions[key][i]
            if (item.key) {
              let errItem = false
              const min = item.min ? parseInt(item.min) : MINNUM
              const max = item.max ? parseInt(item.max) : MAXNUM
              errItem = isNaN(min) || isNaN(max)
              if (errItem) {
                this.optEventConditionsError =
                  this.optEventConditionsError || errItem
                errIndex.push(i)
              }
            }
          }
          this.$set(this.optEventConditionsErrorIndex, key, errIndex)
        }
      },
      deep: true
    },
    multiOptMaxSelection() {
      this.multiOptMaxSelectionNumError = isNaN(
        parseInt(this.multiOptMaxSelection || 0)
      )
    },
    multiOptRequireSelectNum() {
      this.multiOptRequireSelectNumError =
        isNaN(parseInt(this.multiOptRequireSelectNum[0] || 0)) ||
        isNaN(parseInt(this.multiOptRequireSelectNum[1] || 0))
    },
    multiOptOptions() {
      this.multiOptOptionsError = false
      this.multiOptOptionsErrorIndex = []
      for (let i = 0; i < this.multiOptOptions.length; i++) {
        const item = this.multiOptOptions[i]
        let errItem = false
        const color = (item.color || '#000').replaceAll(' ', '')
        // maxRepeat最小为1，小于等于0时自动置1
        const maxRepeat = parseInt(item.maxRepeat || 1)
        errItem = notColor(color) || isNaN(maxRepeat)
        if (errItem) {
          this.multiOptOptionsError = this.multiOptOptionsError || errItem
          this.$set(this.multiOptOptionsErrorIndex, i, {
            color: notColor(color),
            maxRepeat: isNaN(maxRepeat)
          })
        }
      }
    },
    multiOptConditions: {
      handler() {
        this.multiOptOptionConditionsError = false
        this.multiOptOptionConditionsErrorIndex = {}
        for (const key in this.multiOptConditions) {
          const errIndex = []
          for (let i = 0; i < this.multiOptConditions[key].length; i++) {
            const item = this.multiOptConditions[key][i]
            if (item.key) {
              let errItem = false
              const min = item.min ? parseInt(item.min) : MINNUM
              const max = item.max ? parseInt(item.max) : MAXNUM
              errItem = isNaN(min) || isNaN(max)
              if (errItem) {
                this.multiOptOptionConditionsError =
                  this.multiOptOptionConditionsError || errItem
                errIndex.push(i)
              }
            }
          }
          this.$set(this.multiOptOptionConditionsErrorIndex, key, errIndex)
        }
      },
      deep: true
    },
    multiOptDisbleConditions: {
      handler() {
        this.multiOptOptionDisableConditionsError = false
        this.multiOptOptiontDisableConditionsErrorIndex = {}
        for (const key in this.multiOptDisbleConditions) {
          const errIndex = []
          for (let i = 0; i < this.multiOptDisbleConditions[key].length; i++) {
            const item = this.multiOptDisbleConditions[key][i]
            if (item.key) {
              let errItem = false
              const min = item.min ? parseInt(item.min) : MINNUM
              const max = item.max ? parseInt(item.max) : MAXNUM
              errItem = isNaN(min) || isNaN(max)
              if (errItem) {
                this.multiOptOptionDisableConditionsError =
                  this.multiOptOptionDisableConditionsError || errItem
                errIndex.push(i)
              }
            }
          }
          this.$set(
            this.multiOptOptiontDisableConditionsErrorIndex,
            key,
            errIndex
          )
        }
      },
      deep: true
    },
    multiOptMultiMixEvents() {
      this.multiOptMixEventsError = false
      this.multiOptMixEventsErrorIndex = []
      for (let i = 0; i < this.multiOptMultiMixEvents.length; i++) {
        const { indexes, key } = this.multiOptMultiMixEvents[i]
        if (indexes) {
          const errItem = notMixEventIndex(indexes)
          if (errItem) {
            this.multiOptMixEventsError =
              this.multiOptMixEventsError || errItem
            this.multiOptMixEventsErrorIndex.push(i)
          }
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
    getTextArr(str) {
      let text = str || this.text
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
    getStyleArr() {
      const styleArr = []
      for (let i = 0; i < this.style.length; i++) {
        if (this.style[i].key && this.style[i].value) {
          styleArr.push({
            key: this.style[i].key,
            value: this.getTextArr(this.style[i].value)
          })
        }
      }
      return styleArr
    },
    selectBaseType(sindex) {
      this.selectedBaseType = sindex
      if (this.selectedBaseType > -1) {
        for (const key in this.baseType[this.selectedBaseType].obj) {
          this[key] = this.baseType[this.selectedBaseType].obj[key]
        }
      }
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
    },
    inputNormalDefault(text) {
      this.normalDefault = text
    },
    inputPrNumber(text) {
      this.prNumber = text
    },
    inputPrEventKey(index, text) {
      this.$set(this.prEventsArr, index, {
        ...this.prEventsArr[index],
        key: text
      })
    },
    removePrEventItem(sindex) {
      this.prEventsArr = this.prEventsArr.filter(
        (item, index) => sindex !== index
      )
    },
    inputPrEventWeight(index, text) {
      this.$set(this.prEventsArr, index, {
        ...this.prEventsArr[index],
        prWeight: text
      })
    },
    inputPrEventGoodOrBad(index, text) {
      this.$set(this.prEventsArr, index, {
        ...this.prEventsArr[index],
        prGoodOrBad: text
      })
    },
    inputPrEventRepeatTimes(index, text) {
      this.$set(this.prEventsArr, index, {
        ...this.prEventsArr[index],
        prRepeat: text
      })
    },
    inputPrDefault(text) {
      this.prDefault = text
    },
    addPrEventItem() {
      this.prEventsArr.push({
        key: '',
        prWeight: '',
        prGoodOrBad: '',
        prRepeat: ''
      })
    },
    inputBindDefault(text) {
      this.bindDefault = text
    },
    inputBindEventKey(index, text) {
      this.$set(this.bindEventsArr, index, {
        ...this.bindEventsArr[index],
        key: text
      })
    },
    removeBindEventItem(sindex) {
      this.bindEventsArr = this.bindEventsArr.filter(
        (item, index) => sindex !== index
      )
      this.$set(this.bindEventConditions, sindex, [])
      delete this.bindEventConditions[sindex]
    },
    inputBindEventDuration(index, text) {
      this.$set(this.bindEventsArr, index, {
        ...this.bindEventsArr[index],
        bindEventDuration: text
      })
    },
    setBindEventDonotMismatchToDefault(index, tog) {
      this.$set(this.bindEventsArr, index, {
        ...this.bindEventsArr[index],
        bindEventDonotMismatchToDefault: tog
      })
    },
    inputBindEventConditionKey(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.bindEventConditions[index])
      )
      conditions[cindex].key = text
      this.$set(this.bindEventConditions, index, conditions)
    },
    inputBindEventConditionMinValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.bindEventConditions[index])
      )
      conditions[cindex].min = text
      this.$set(this.bindEventConditions, index, conditions)
    },
    inputBindEventConditionMaxValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.bindEventConditions[index])
      )
      conditions[cindex].max = text
      this.$set(this.bindEventConditions, index, conditions)
    },
    removeBindEventConditionItem(sindex, cindex) {
      let conditions = JSON.parse(
        JSON.stringify(this.bindEventConditions[sindex])
      )
      conditions = conditions.filter((item, index) => cindex !== index)
      this.$set(this.bindEventConditions, sindex, conditions)
    },
    addBindEventConditionItem(sindex) {
      const conditions = JSON.parse(
        JSON.stringify(this.bindEventConditions[sindex])
      )
      conditions.push({ key: '', min: '', max: '' })
      this.$set(this.bindEventConditions, sindex, conditions)
    },
    addBindEventItem() {
      this.bindEventsArr.push({
        key: '',
        bindEventDuration: '',
        bindEventDonotMismatchToDefault: false
      })
      this.$set(this.bindEventConditions, this.bindEventsArr.length - 1, [])
    },
    inputOptDefault(text) {
      this.optDefault = text
    },
    inputOptEventKey(index, text) {
      this.$set(this.optEventsArr, index, {
        ...this.optEventsArr[index],
        key: text
      })
    },
    removeOptEventItem(sindex) {
      this.optEventsArr = this.optEventsArr.filter(
        (item, index) => sindex !== index
      )
      this.$set(this.optEventConditions, sindex, [])
      delete this.optEventConditions[sindex]
    },
    inputOptEventText(index, text) {
      this.$set(this.optEventsArr, index, {
        ...this.optEventsArr[index],
        optEventText: text
      })
    },
    inputOptEventColor(index, text) {
      this.$set(this.optEventsArr, index, {
        ...this.optEventsArr[index],
        optEventColor: text
      })
    },
    inputOptEventConditionKey(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.optEventConditions[index])
      )
      conditions[cindex].key = text
      this.$set(this.optEventConditions, index, conditions)
    },
    inputOptEventConditionMinValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.optEventConditions[index])
      )
      conditions[cindex].min = text
      this.$set(this.optEventConditions, index, conditions)
    },
    inputOptEventConditionMaxValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.optEventConditions[index])
      )
      conditions[cindex].max = text
      this.$set(this.optEventConditions, index, conditions)
    },
    removeOptEventConditionItem(sindex, cindex) {
      let conditions = JSON.parse(
        JSON.stringify(this.optEventConditions[sindex])
      )
      conditions = conditions.filter((item, index) => cindex !== index)
      this.$set(this.optEventConditions, sindex, conditions)
    },
    addOptEventConditionItem(sindex) {
      const conditions = JSON.parse(
        JSON.stringify(this.optEventConditions[sindex])
      )
      conditions.push({ key: '', min: '', max: '' })
      this.$set(this.optEventConditions, sindex, conditions)
    },
    addOptEventItem() {
      this.optEventsArr.push({
        key: '',
        optEventText: '',
        optEventColor: ''
      })
      this.$set(this.optEventConditions, this.optEventsArr.length - 1, [])
    },
    inputMultiOptDefault(text) {
      this.multiOptDefault = text
    },
    inputMultiOptMultiMixDefaultEvent(text) {
      this.multiOptMultiMixDefaultEvent = text
    },
    inputMultiOptMaxSelection(text) {
      this.multiOptMaxSelection = text
    },
    inputMultiOptRequireSelectNum(text, index) {
      this.$set(this.multiOptRequireSelectNum, index, text)
    },
    selectMultiOptOrderlySelections(orderly) {
      this.multiOptOrderlySelections = orderly
    },
    removeMultiOptEventItem(sindex) {
      this.multiOptOptions = this.multiOptOptions.filter(
        (item, index) => sindex !== index
      )
      this.$set(this.multiOptConditions, sindex, [])
      delete this.multiOptConditions[sindex]
      this.$set(this.multiOptDisbleConditions, sindex, [])
      delete this.multiOptDisbleConditions[sindex]
    },
    addMultiOptEventItem() {
      this.multiOptOptions.push({
        text: '',
        color: '',
        maxRepeat: ''
      })
      this.$set(this.multiOptConditions, this.multiOptOptions.length - 1, [])
      this.$set(
        this.multiOptDisbleConditions,
        this.multiOptOptions.length - 1,
        []
      )
    },
    inputMultiOptText(index, text) {
      this.$set(this.multiOptOptions, index, {
        ...this.multiOptOptions[index],
        text
      })
    },
    inputMultiOptColor(index, text) {
      this.$set(this.multiOptOptions, index, {
        ...this.multiOptOptions[index],
        color: text
      })
    },
    inputMultiOptMaxRepeat(index, text) {
      this.$set(this.multiOptOptions, index, {
        ...this.multiOptOptions[index],
        maxRepeat: text
      })
    },
    inputMultiOptOptionConditionKey(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptConditions[index])
      )
      conditions[cindex].key = text
      this.$set(this.multiOptConditions, index, conditions)
    },
    inputMultiOptOptionConditionMinValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptConditions[index])
      )
      conditions[cindex].min = text
      this.$set(this.multiOptConditions, index, conditions)
    },
    inputMultiOptOptionConditionMaxValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptConditions[index])
      )
      conditions[cindex].max = text
      this.$set(this.multiOptConditions, index, conditions)
    },
    removeMultiOptOptionConditionItem(sindex, cindex) {
      let conditions = JSON.parse(
        JSON.stringify(this.multiOptConditions[sindex])
      )
      conditions = conditions.filter((item, index) => cindex !== index)
      this.$set(this.multiOptConditions, sindex, conditions)
    },
    addMultiOptOptionConditionItem(sindex) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptConditions[sindex])
      )
      conditions.push({ key: '', min: '', max: '' })
      this.$set(this.multiOptConditions, sindex, conditions)
    },
    inputMultiOptOptionDisableConditionKey(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptDisbleConditions[index])
      )
      conditions[cindex].key = text
      this.$set(this.multiOptDisbleConditions, index, conditions)
    },
    inputMultiOptOptionDisableConditionMinValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptDisbleConditions[index])
      )
      conditions[cindex].min = text
      this.$set(this.multiOptDisbleConditions, index, conditions)
    },
    inputMultiOptOptionDisableConditionMaxValue(index, cindex, text) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptDisbleConditions[index])
      )
      conditions[cindex].max = text
      this.$set(this.multiOptDisbleConditions, index, conditions)
    },
    removeMultiOptOptionDisableConditionItem(sindex, cindex) {
      let conditions = JSON.parse(
        JSON.stringify(this.multiOptDisbleConditions[sindex])
      )
      conditions = conditions.filter((item, index) => cindex !== index)
      this.$set(this.multiOptDisbleConditions, sindex, conditions)
    },
    addMultiOptOptionDisableConditionItem(sindex) {
      const conditions = JSON.parse(
        JSON.stringify(this.multiOptDisbleConditions[sindex])
      )
      conditions.push({ key: '', min: '', max: '' })
      this.$set(this.multiOptDisbleConditions, sindex, conditions)
    },
    inputMultiOptMixEventIndexes(index, text) {
      this.$set(this.multiOptMultiMixEvents, index, {
        ...this.multiOptMultiMixEvents[index],
        indexes: text
      })
    },
    inputMultiOptMixEventKey(index, text) {
      this.$set(this.multiOptMultiMixEvents, index, {
        ...this.multiOptMultiMixEvents[index],
        key: text
      })
    },
    removeMultiOptMixEventItem(sindex) {
      this.multiOptMultiMixEvents = this.multiOptMultiMixEvents.filter(
        (item, index) => sindex !== index
      )
    },
    addMultiOptMixEventItem() {
      this.multiOptMultiMixEvents.push({
        indexes: '',
        key: ''
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
      &-any--extraPadding {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      &-any--extraMargin {
        margin-left: 10px !important;
        margin-right: 10px !important;
      }
      &-item--nopadding {
        padding: 6px 0 !important;
      }
      &-item--child {
        padding: 0 !important;
      }
      &-item--column {
        width: 100%;
        flex-direction: column !important;
        align-items: flex-start !important;
        .formBox-block-item-input {
          width: 100%;
        }
      }
      &-item {
        width: 100%;
        padding: 6px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-any--extraPadding {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        &-any--extraMargin {
          margin-left: 10px !important;
          margin-right: 10px !important;
        }
        &-label {
          min-width: 160px;
          text-align: left;
          padding-right: 12px;
        }
        &-text {
          padding: 4.5px 0;
          width: 100%;
          text-align: left;
          color: #999;
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
          transition: 0.2s all;
        }
        &-pretips {
          width: 100%;
          text-align: left;
          // padding: 4px 0;
          line-height: 36px;
          color: #999;
          // padding: 0 10px;
          transition: 0.2s all;
        }
        &-pretips--warning,
        &-tips--warning {
          color: #a92228;
          font-weight: bold;
        }
        &-styleBox {
          width: 100%;
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
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0px;
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
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0px;
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
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 12px 0px;
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
        &-prEventBox {
          width: 828px;
          .formBox-block-item-prEventBox-item
            + .formBox-block-item-prEventBox-item {
            border-top: 1px solid #000;
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 0px;
            .formBox-block-item-prEventBox-item-input
              + .formBox-block-item-prEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-prEventBox-item-row
              + .formBox-block-item-prEventBox-item-row {
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
        &-bindEventBox {
          width: 828px;
          .formBox-block-item-bindEventBox-item
            + .formBox-block-item-bindEventBox-item {
            border-top: 1px solid #000;
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 0px;
            .formBox-block-item-bindEventBox-item-input
              + .formBox-block-item-bindEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-bindEventBox-item-row
              + .formBox-block-item-bindEventBox-item-row {
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
        &-optEventBox {
          width: 828px;
          .formBox-block-item-optEventBox-item
            + .formBox-block-item-optEventBox-item {
            border-top: 1px solid #000;
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 0px;
            .formBox-block-item-optEventBox-item-input
              + .formBox-block-item-optEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-optEventBox-item-row
              + .formBox-block-item-optEventBox-item-row {
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
        &-multiOptEventBox {
          width: 828px;
          .formBox-block-item-multiOptEventBox-item
            + .formBox-block-item-multiOptEventBox-item {
            border-top: 1px solid #000;
            padding-top: 12px;
          }
          &-item {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            padding: 0px;
            .formBox-block-item-multiOptEventBox-item-input
              + .formBox-block-item-multiOptEventBox-item-input {
              margin-left: 12px;
            }
            .formBox-block-item-multiOptEventBox-item-row
              + .formBox-block-item-multiOptEventBox-item-row {
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
            margin-left: 36px;
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

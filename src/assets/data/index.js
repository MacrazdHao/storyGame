import Events from './events'

const {
  MAXNUM,
  MINNUM,
  BasicYunqi,
  RareValue,
  EventCode,
  DefautEvents,
  NormalEvents,
  PrEvents,
  BindingEvents,
  OptEvents,
  MultiOptEvents
} = Events

const AllEvents = {
  ...DefautEvents,
  ...NormalEvents,
  ...PrEvents,
  ...BindingEvents,
  ...OptEvents,
  ...MultiOptEvents
}

const EventsTypeMap = {}
for (const key in AllEvents) {
  EventsTypeMap[key] = {
    isCertain: false,
    isPassive: false,
    isDefault: false
  }
  EventsTypeMap[key].isCertain = AllEvents[key].isCertain ? AllEvents[key].isCertain() : false
  EventsTypeMap[key].isPassive = AllEvents[key].isPassive ? AllEvents[key].isPassive() : false
  EventsTypeMap[key].isDefault = AllEvents[key].isDefault ? AllEvents[key].isDefault() : false
}

// 过滤出非被动（又称主动/随机）事件
const NonPassiveEvents = {}
for (const key in EventsTypeMap) {
  if (!EventsTypeMap[key].isDefault && !EventsTypeMap[key].isPassive && !EventsTypeMap[key].isCertain) {
    // 所有非被动(又称主动/随机）事件的execNormalDefaultWhenMismatchConditions均为true
    AllEvents[key].execNormalDefaultWhenMismatchConditions = (execNormalDefaultWhenMismatchConditions = true) => true
    NonPassiveEvents[key] = AllEvents[key]
  }
}

// 过滤出必然事件
const CertainEvents = {}
for (const key in EventsTypeMap) {
  if (EventsTypeMap[key].isCertain) CertainEvents[key] = AllEvents[key]
}

/**
 * 角色事件存档
 * 'UserId[String]': {
 ** events: { 'EventName': {事件对象} },
 ** history: { 'DayNum[Number]': [{'key': String, 'event': Object}, ...] , ... }
 * }
 */
const EventsRecord = {
  default: {
    stack: {
      // 常规事件栈 Array(EventName(String))
      common: [],
      // 优先栈 Array(EventName(String))
      priority: [],
      // 计时事件栈 Array([Object({key: EventName[String], duration: Number})])
      duration: []
    },
    // weightReplace为true时，weight生效，否则生效persent(按比例增幅权重)
    // prEventsExtraWeight: { 'EventName': Array[Object{ persent: Number, weight: Number, lastUnitTime: Number, times: Number, weightReplace: Boolean }] }
    // extraRandomEvents: { 'EventName': Array[Object({ persent: Number, lastUnitTime: Number, times: Number, persentReplace: Boolean, goodOrBad: Number })] }
    // extraEventTimes: { 'EventName': Array[Object({ timesOfUnit: Number, timesOfUnitReplace: Boolean, lastUnitTime: Number })] }
    prEventsExtraWeight: {},
    extraRandomEvents: {},
    extraEventTimes: {},
    events: {},
    history: {}
  }
}

const UsersRecord = {}

// 获取事件对象EventObj
export const getEventObj = (userId, options = {}, conditions = {}, execNormalDefaultWhenMismatchConditions = false) => {
  const defaultOptions = {
    key: '',
    updateMode: false,
    update: {
      times: false
    },
    eventOptions: {
      // text为必须传入的事件参数，包括人物信息、单位时间信息等
      // text: { userInfo: {}, unitTimeInfo: {} }
    }
  }
  const { key, eventOptions, updateMode, update } = { ...defaultOptions, ...options }
  const { events } = EventsRecord[userId]
  let eventObj = {}
  if (!AllEvents[key]) return EventCode.NotExist
  if (!events[key]) {
    // 正在使用的事件列表无该事件，则从事件库中获取并初始化
    for (const ekey in AllEvents[key]) {
      switch (ekey) {
        case 'text':
          try {
            eventObj.text = eventOptions.text ? AllEvents[key].text(eventOptions.text) : `---${key}: 重新生成文案错误(no params)---`
          } catch (err) {
            eventObj[ekey] = `---${key}: 生成文案错误(params error, ${err})---`
          }
          break
        case 'style':
          eventObj.style = AllEvents[key].style(eventOptions.style)
          break
        default:
          eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
      }
      // 无传入参数则走默认
      // else eventObj[ekey] = AllEvents[key][ekey]()
    }
    eventObj = {
      ...AllEvents[key],
      ...eventObj,
      curTimesOfUnit: eventObj.timesOfUnit
    }
  } else {
    eventObj = JSON.parse(JSON.stringify(events[key]))
    // text、style每次调用事件都必须重构
    try {
      eventObj.text = eventOptions.text ? AllEvents[key].text(eventOptions.text) : `---${key}: 重新生成文案错误(no params)---`
    } catch (err) {
      eventObj.text = `---${key}: 重新生成文案错误(params error, ${err})---`
    }
    eventObj.style = AllEvents[key].style(eventOptions.style)
    if (eventObj.prEvents) eventObj.prEvents = AllEvents[key].prEvents(eventOptions.prEvents || {})
    // if (eventObj.prRepeat)eventObj.prRepeat = AllEvents[key].prRepeat(eventOptions.prRepeat || {})
    if (updateMode) {
      // 重置/更新事件属性
      for (const ekey in update) {
        if (update[ekey]) {
          if (eventOptions[ekey]) eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
          // 无传入参数则走默认
          else eventObj[ekey] = AllEvents[key][ekey]()
        }
      }
    }
  }
  // 额外概率事件结果概率不在此调整，而是在执行事件时当下实时计算
  // 额外事件次数叠加/覆盖
  if (EventsRecord[userId].extraEventTimes[key]) {
    for (let i = 0; i < EventsRecord[userId].extraEventTimes[key].length; i++) {
      if (EventsRecord[userId].extraEventTimes[key][i].lastUnitTime > 0) {
        const { timesOfUnit, times, timesOfUnitReplace, timesReplace } = EventsRecord[userId].extraEventTimes[key][i]
        eventObj.curTimesOfUnit = typeof timesOfUnit === 'number' ? (timesOfUnit + (timesOfUnitReplace ? 0 : eventObj.curTimesOfUnit)) : eventObj.timesOfUnit
        if (!EventsRecord[userId].extraEventTimes[key][i].timesAdded) {
          eventObj.times = typeof times === 'number' ? (times + (timesReplace ? 0 : eventObj.times)) : eventObj.times
          EventsRecord[userId].extraEventTimes[key][i].timesAdded = true
        }
      }
    }
  }
  for (const key in eventObj.triggerConditions) {
    if (typeof conditions[key] === 'undefined') {
      if (eventObj.execNormalDefaultWhenMismatchConditions || execNormalDefaultWhenMismatchConditions) return getEventObj(userId, { key: eventObj.normalDefault, options }, conditions)
      return EventCode.MismatchConditions
    }
    const min = Math.min(...eventObj.triggerConditions[key])
    const max = Math.max(...eventObj.triggerConditions[key])
    if (conditions[key] < min || conditions[key] >= max) return EventCode.MismatchConditions
  }
  eventObj.times -= 1
  eventObj.curTimesOfUnit -= 1
  return eventObj.times < 0 || eventObj.curTimesOfUnit < 0 ? EventCode.OutOfTimes : eventObj
}

export const getCertainEvent = (userId, eventOptions, conditions) => {
  for (const key in CertainEvents) {
    const event = getEventObj(userId, { key, ...eventOptions }, conditions)
    switch (event) {
      case EventCode.NotExist:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        // 直到找到可用的必然事件
        break
      default:
        return { key, event }
    }
  }
  // 未找到可用的必然事件
  return null
}

export const pushEventKeyToStack = (userId, events = [], stackType = 'common') => {
  EventsRecord[userId].stack[stackType].push(...events)
}
export const getOptEventOptions = (userId, _event, curConditions) => {
  const event = JSON.parse(JSON.stringify(_event))
  const defaultOption = { color: '#000', text: '跳过', event: event.optDefault, disabled: false, hide: false }
  if (!event.optEvents) return [defaultOption]
  const options = []
  let hideNum = 0
  let disabledNum = 0
  // 将可选项根据当前状态和条件解析出可用内容
  for (const key in event.optEvents) {
    const { color, text, conditions } = event.optEvents[key]
    // disabled为置灰，hide为隐藏
    const option = { color, text, event: key, disabled: false, hide: false }
    // 判断当前状态是否符合选项展示的条件
    if (conditions) {
      for (const ckey in conditions) {
        if (typeof curConditions[ckey] === 'undefined') option.hide = true
        const min = Math.min(...conditions[ckey])
        const max = Math.max(...conditions[ckey])
        if (curConditions[ckey] < min || curConditions[ckey] >= max) option.hide = true
        if (option.hide) {
          hideNum++
          break
        }
      }
    }
    const eventObj = getEventObj(userId, { key }, curConditions)
    // 判断当前选项的反馈事件是否可用
    switch (eventObj) {
      case EventCode.NotExist:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        option.disabled = true
        disabledNum++
    }
    options.push(option)
  }
  if (options.length === 0 || (disabledNum + hideNum) === options.length) options.push(defaultOption)
  return options
  // 界面逻辑中，若返回为空数组，则跳过当前事件
}

export const getMultiOptEventOptions = (_event, curConditions) => {
  const event = JSON.parse(JSON.stringify(_event))
  if (!event.multiOptions) return []
  const options = []
  // 将可选项根据当前状态和条件解析出可用内容
  for (const key in event.multiOptions) {
    const { color, text, conditions, disabledConditons } = event.multiOptions[key]
    // hide为隐藏
    const option = { color, text, hide: false }
    // 判断当前状态是否符合选项展示的条件
    if (conditions) {
      for (const ckey in conditions) {
        if (typeof curConditions[ckey] === 'undefined') option.hide = true
        const min = Math.min(...conditions[ckey])
        const max = Math.max(...conditions[ckey])
        if (curConditions[ckey] < min || curConditions[ckey] >= max) option.hide = true
        if (option.hide) break
      }
    }
    if (disabledConditons) {
      for (const ckey in disabledConditons) {
        if (typeof curConditions[ckey] === 'undefined') option.hide = true
        const min = Math.min(...disabledConditons[ckey])
        const max = Math.max(...disabledConditons[ckey])
        if (curConditions[ckey] < min || curConditions[ckey] >= max) option.hide = true
        if (option.hide) break
      }
    }
    options.push(option)
  }
  return options
}

export const selectOptEventOption = (userId, selectedOption) => {
  pushEventKeyToStack(userId, [selectedOption.event], 'priority')
}

export const selectMultiOptEventOptions = (userId, conditions, _event, selections = []) => {
  const event = JSON.parse(JSON.stringify(_event))
  let eventKey = ''
  const { multiMixEvents, multiOptDefault } = event
  selections.sort((a, b) => a - b)
  const cSelections = JSON.stringify(selections)
  let eventObj = null
  let anyEventKey = multiMixEvents.any
  if (anyEventKey) {
    const anyObj = getEventObj(userId, { key: anyEventKey }, conditions)
    // 判断当前选项的反馈事件是否可用
    switch (anyObj) {
      case EventCode.NotExist:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        anyEventKey = multiOptDefault
        break
    }
  } else anyEventKey = multiOptDefault
  for (const rkey in multiMixEvents) {
    if (rkey === 'any') continue
    const mixEventSelections = rkey.split('_').map(item => parseInt(item))
    mixEventSelections.sort((a, b) => a - b)
    const rSeletions = JSON.stringify(mixEventSelections)
    if (rSeletions === cSelections) {
      eventKey = multiMixEvents[rkey]
      eventObj = getEventObj(userId, { key: multiMixEvents[rkey] }, conditions)
      // 判断当前选项的反馈事件是否可用
      switch (eventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          eventKey = anyEventKey
          eventObj = getEventObj(userId, { key: anyEventKey }, conditions)
          break
      }
    }
  }
  // 没有相匹配的反馈事件（或没有选择任何选项，也会执行该逻辑）
  if (!eventObj) {
    eventKey = anyEventKey
    eventObj = getEventObj(userId, { key: anyEventKey }, conditions)
  }
  pushEventKeyToStack(userId, [eventKey], 'priority')
}

// 数据存档
export const updateLocalRecords = (userId, record) => {
  UsersRecord[userId] = JSON.parse(JSON.stringify(record))
  localStorage.setItem('usersRecord', JSON.stringify(UsersRecord))
  localStorage.setItem('eventRecord', JSON.stringify(EventsRecord))
}

export const execEvent = (userId, _eventInfo, unitTimeNum, _userInfo, curConditions) => {
  const eventInfo = JSON.parse(JSON.stringify(_eventInfo))
  const userInfo = JSON.parse(JSON.stringify(_userInfo))
  // 事件对象存入事件记录
  // 【单位时间可触发次数上限】timesOfUnit
  // 【当前单位时间可触发次数】curTimesOfUnit
  const { key, event } = eventInfo
  EventsRecord[userId].events[key] = event
  if (!EventsRecord[userId].history[unitTimeNum]) EventsRecord[userId].history[unitTimeNum] = []
  EventsRecord[userId].history[unitTimeNum].push(eventInfo)
  // 计算用户数据effect => userInfo
  // 获取事件结果
  // 【事件属性影响】effectAttr
  for (const akey in event.effectAttr) {
    if (Array.isArray(event.effectAttr[akey])) {
      const min = Math.min(...event.effectAttr[akey])
      const max = Math.max(...event.effectAttr[akey])
      userInfo[akey] += (Math.random() * (max - min + 1) + min)
    } else userInfo[akey] += event.effectAttr[akey]
  }
  // 【关联事件影响】effectEvents
  for (const ekey in event.effectEvents) {
    if (!EventsRecord[userId].extraEventTimes[ekey]) EventsRecord[userId].extraEventTimes[ekey] = []
    const { times, timesReplace, timesOfUnit, timesOfUnitReplace, lastUnitTime } = event.effectEvents[ekey]
    // 当前不作处理，下一个单位时间开始加成
    const extraEventTimesObj = {}
    if (typeof timesOfUnit === 'number') {
      extraEventTimesObj.timesOfUnit = timesOfUnit
      extraEventTimesObj.timesOfUnitReplace = !!timesOfUnitReplace
    }
    if (typeof times === 'number') {
      extraEventTimesObj.times = times
      extraEventTimesObj.timesReplace = !!timesReplace
    }
    extraEventTimesObj.lastUnitTime = lastUnitTime || 1
    EventsRecord[userId].extraEventTimes[ekey].push(extraEventTimesObj)
  }
  // 【概率事件结果额外概率调整】prEventsExtraWeight
  for (const ekey in event.prEventsExtraWeight) {
    if (!EventsRecord[userId].prEventsExtraWeight[ekey]) EventsRecord[userId].prEventsExtraWeight[ekey] = []
    EventsRecord[userId].prEventsExtraWeight[ekey].push(JSON.parse(JSON.stringify(event.prEventsExtraWeight[ekey])))
  }
  // 【额外随机事件概率触发】extraRandomEvents
  for (const ekey in event.extraRandomEvents) {
    if (!EventsRecord[userId].extraRandomEvents[ekey]) EventsRecord[userId].extraRandomEvents[ekey] = []
    EventsRecord[userId].extraRandomEvents[ekey].push(JSON.parse(JSON.stringify(event.extraRandomEvents[ekey])))
  }
  // 【绑定事件】bindEvents
  if (event.bindEvents) {
    for (const ekey in event.bindEvents) {
      let mismatch = false
      if (event.bindEvents[ekey].conditions) {
        for (const ckey in event.bindEvents[ekey].conditions) {
          if (typeof curConditions[ckey] === 'undefined') mismatch = true
          const min = Math.min(...event.bindEvents[ekey].conditions[ckey])
          const max = Math.max(...event.bindEvents[ekey].conditions[ckey])
          if (curConditions[ckey] < min || curConditions[ckey] >= max) mismatch = true
          if (mismatch) break
        }
      }
      if (!mismatch) pushEventKeyToStack(userId, !event.bindEvents[ekey].duration ? [ekey] : [{ key: ekey, duration: event.bindEvents[ekey].duration }], !event.bindEvents[ekey].duration ? 'priority' : 'duration')
      else if (!event.bindEvents[ekey].donotMismatchToDefault) pushEventKeyToStack(userId, [event.bindDefault], 'priority')
    }
  }
  // 【获取概率结果数】prNumber
  // 【概率事件可重复次数】prRepeat
  // 【概率事件】prEvents
  // 【概率默认事件】prDefault
  if (event.prEvents) {
    const { prNumber, prEvents, prRepeat, prDefault, prGoodOrBad } = event
    const _prRepeat = JSON.parse(JSON.stringify(prRepeat))
    const _prEvents = JSON.parse(JSON.stringify(prEvents))
    const realYunqi = curConditions.yunqi - BasicYunqi
    // realYunqi 每 1运气 加 1% 概率基数，按稀有度效果递减
    const yunqiPersent = Math.abs(0.1 * realYunqi)
    let totalWeight = 0
    for (const pkey in _prEvents) {
      let realWeight = _prEvents[pkey]
      // 【概率事件结果额外概率调整】prEventsExtraWeight
      if (EventsRecord[userId].prEventsExtraWeight[pkey]) {
        for (let i = 0; i < EventsRecord[userId].prEventsExtraWeight[pkey].length; i++) {
          const { lastUnitTime, times, weight, persent, weightReplace } = EventsRecord[userId].prEventsExtraWeight[pkey][i]
          if (lastUnitTime <= 0 || times <= 0 || (!weight && !persent)) continue
          EventsRecord[userId].prEventsExtraWeight[pkey][i].times--
          // weightReplace置true后，persent无效
          // weightReplace置false时，先以原概率基数*persent再叠加weight
          // 不设置weight时，weightReplace不生效
          realWeight = realWeight * (1 + (persent / 100))
          if (typeof weight === 'number') realWeight = weightReplace ? weight : (realWeight + weight)
        }
      }
      if (prGoodOrBad[pkey]) {
        // 运气概率增幅由原概率基数决定，与prEventsExtraWeight效果不互相作用
        // 运气>3，好事概率增幅，运气<3，坏事概率减幅
        if (prGoodOrBad[pkey] > 0) realWeight = realWeight + (realYunqi > 0 ? 1 : -1) * _prEvents[pkey] * yunqiPersent / Math.abs(prGoodOrBad[pkey])
        // 运气>3，坏事概率减幅，运气<3，坏事概率增幅
        if (prGoodOrBad[pkey] < 0) realWeight = realWeight + (realYunqi > 0 ? -1 : 1) * _prEvents[pkey] * yunqiPersent / Math.abs(prGoodOrBad[pkey])
      }
      _prEvents[pkey] = realWeight
      totalWeight += _prEvents[pkey]
    }
    let randomEvents = []
    const prEventKeys = Object.keys(_prEvents)
    // 按权重大小倒序排序（由大到小）
    prEventKeys.sort((a, b) => _prEvents[b] - _prEvents[a])
    Array(prNumber).fill(0).map(() => {
      let randomNum = (Math.random() * (totalWeight + 1)).toFixed(1)
      // 有两种随机方式：离散随机和连续随机，此处使用连续随机
      for (let i = 0; i < prEventKeys.length; i++) {
        const ekey = prEventKeys[i]
        randomNum -= _prEvents[ekey]
        // 未定义重复次数的默认为1
        if (typeof _prRepeat[ekey] === 'undefined') _prRepeat[ekey] = 1
        // 当前概率结果可重复次数耗尽，则取下一个作为结果
        if (_prRepeat[ekey] <= 0) continue
        if (randomNum <= 0) randomEvents.push(ekey)
        _prRepeat[ekey]--
        if (randomEvents.length >= prNumber) break
      }
    })
    // 不足概率结果数的部分，补充为默认概率事件
    if (randomEvents.length < prNumber) {
      randomEvents.push(...((new Array(prNumber - randomEvents.length).fill(prDefault))))
    }
    randomEvents = randomEvents.map(item => {
      const randomEventObj = getEventObj(userId, { key: item }, curConditions)
      switch (randomEventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          return event.prDefault
        default: return item
      }
    })
    pushEventKeyToStack(userId, randomEvents, 'priority')
  }
  console.log(EventsRecord[userId])
  return { event, userInfo }
}

export const getNextEvent = (userId, options = {}, conditions = {}, prEventsExtraWeight = {}, extraRandomEvents = {}) => {
  // 优先事件栈
  let key = null
  let event = null
  if (EventsRecord[userId].stack.priority.length) {
    while ((!event || typeof event === 'string') && EventsRecord[userId].stack.priority.length) {
      key = EventsRecord[userId].stack.priority.pop()
      event = getEventObj(userId, { key, ...options }, conditions)
    }
  }
  // 必然事件
  if (!event || typeof event === 'string') {
    const certainEvent = getCertainEvent(userId, options, conditions)
    if (certainEvent) {
      key = certainEvent.key
      event = certainEvent.event
    } else event = null
  }
  // 延时事件栈
  if ((!event || typeof event === 'string') && EventsRecord[userId].stack.duration.length) {
    if (EventsRecord[userId].stack.duration.at(-1).duration === 0) {
      key = EventsRecord[userId].stack.duration.pop().key
      event = getEventObj(userId, { key, ...options }, conditions)
    }
  }
  // 额外概率随机事件
  if (!event || typeof event === 'string') {
    for (const ekey in EventsRecord[userId].extraRandomEvents) {
      for (let i = 0; i < EventsRecord[userId].extraRandomEvents[ekey].length; i++) {
        if (EventsRecord[userId].extraRandomEvents[ekey][i].lastUnitTime <= 0 || EventsRecord[userId].extraRandomEvents[ekey][i].times <= 0) continue
        key = ekey
        event = getEventObj(userId, { key, ...options }, conditions)
        // 不符合条件则不执行
        if (typeof event === 'string') {
          key = null
          event = null
          continue
        }
        const { goodOrBad, persent } = EventsRecord[userId].extraRandomEvents[ekey][i]
        const realYunqi = conditions.yunqi - BasicYunqi
        const yunqiPersent = Math.abs(0.1 * realYunqi)
        let realPersent = persent
        // 额外概率随机事件相对运气的概率加成
        if (goodOrBad) {
          // 运气概率增幅由原概率基数决定，与prEventsExtraWeight效果不互相作用
          // 运气>3，好事概率增幅，运气<3，坏事概率减幅
          if (goodOrBad > 0) realPersent = realPersent + (realYunqi > 0 ? 1 : -1) * persent * yunqiPersent / Math.abs(goodOrBad)
          // 运气>3，坏事概率减幅，运气<3，坏事概率增幅
          if (goodOrBad < 0) realPersent = realPersent + (realYunqi > 0 ? -1 : 1) * persent * yunqiPersent / Math.abs(goodOrBad)
        }
        const randomNum = (Math.random() * 101).toFixed(0)
        if (realPersent >= randomNum) {
          EventsRecord[userId].extraRandomEvents[ekey][i].times--
          break
        } else {
          key = null
          event = null
        }
      }
      if (!event || typeof event === 'string') break
    }
  }
  // 常规事件栈
  if ((!event || typeof event === 'string') && EventsRecord[userId].stack.common.length) {
    while ((!event || typeof event === 'string') && EventsRecord[userId].stack.common.length) {
      key = EventsRecord[userId].stack.common.pop()
      event = getEventObj(userId, { key, ...options }, conditions)
    }
  }
  return (!event || typeof event === 'string') ? 'end' : { key, event }
}

export const toNewUnitTime = (userId, options = {}, conditions = {}, callback, randomEventNum = 8) => {
  if (EventsRecord[userId].stack.duration.length) {
    // 延迟事件倒计时结算
    for (let i = 0; i < EventsRecord[userId].stack.duration.length; i++) {
      EventsRecord[userId].stack.duration[i].duration -= 1
    }
  }
  // 事件次数重置
  for (const key in EventsRecord[userId].events) {
    EventsRecord[userId].events[key].curTimesOfUnit = EventsRecord[userId].events[key].timesOfUnit
    // 额外次数结算
    if (EventsRecord[userId].extraEventTimes[key]) {
      for (let i = 0; i < EventsRecord[userId].extraEventTimes[key].length; i++) {
        EventsRecord[userId].events[key].curTimesOfUnit = EventsRecord[userId].extraEventTimes[key][i].timesOfUnitReplace ? EventsRecord[userId].extraEventTimes[key][i] : (EventsRecord[userId].extraEventTimes[key][i] + EventsRecord[userId].events[key].curTimesOfUnit)
      }
    }
  }
  // 结算额外概率事件结果权重剩余持续单位时间数
  for (const ekey in EventsRecord[userId].prEventsExtraWeight) {
    const noLastUnitTimeExtraWeightIndex = {}
    for (let i = 0; i < EventsRecord[userId].prEventsExtraWeight[ekey]; i++) {
      EventsRecord[userId].prEventsExtraWeight[ekey][i].lastUnitTime--
      if (EventsRecord[userId].prEventsExtraWeight[ekey][i].lastUnitTime <= 0 || EventsRecord[userId].prEventsExtraWeight[ekey][i].times <= 0) {
        noLastUnitTimeExtraWeightIndex[`${i}`] = true
      }
    }
    // 移除耗尽次数的内容
    EventsRecord[userId].prEventsExtraWeight[ekey].filter((item, index) => !noLastUnitTimeExtraWeightIndex[`${index}`])
  }
  // 结算额外每单位时间事件次数剩余持续单位时间数
  for (const ekey in EventsRecord[userId].extraEventTimes) {
    const noLastUnitTimeExtraTimesIndex = {}
    for (let i = 0; i < EventsRecord[userId].extraEventTimes[ekey]; i++) {
      EventsRecord[userId].extraEventTimes[ekey][i].lastUnitTime--
      if (EventsRecord[userId].extraEventTimes[ekey][i].lastUnitTime <= 0) {
        noLastUnitTimeExtraTimesIndex[`${i}`] = true
      }
    }
    // 移除耗尽次数的内容
    EventsRecord[userId].extraEventTimes[ekey].filter((item, index) => !noLastUnitTimeExtraTimesIndex[`${index}`])
  }
  // 结算额外随机事件剩余持续单位时间数
  for (const ekey in EventsRecord[userId].extraRandomEvents) {
    const noLastUnitTimeExtraEventIndex = {}
    for (let i = 0; i < EventsRecord[userId].extraRandomEvents[ekey]; i++) {
      EventsRecord[userId].extraRandomEvents[ekey][i].lastUnitTime--
      if (EventsRecord[userId].extraRandomEvents[ekey][i].lastUnitTime <= 0 || EventsRecord[userId].extraRandomEvents[ekey][i].times <= 0) {
        noLastUnitTimeExtraEventIndex[`${i}`] = true
      }
    }
    // 移除耗尽次数的内容
    EventsRecord[userId].extraRandomEvents[ekey].filter((item, index) => !noLastUnitTimeExtraEventIndex[`${index}`])
  }
  // 插入过新年事件
  if (!EventsRecord[userId].stack.priority.includes('guoxinnian')) EventsRecord[userId].stack.priority.push('guoxinnian')
  // 获取当前单位时间的随机事件(8)
  let randomEventKeys = Object.keys(NonPassiveEvents)
  const randomEvents = []
  for (let i = 0; i < randomEventNum; i++) {
    if (randomEventKeys.length === 0) {
      randomEvents.push('pingfandeyitian')
      continue
    }
    const randomNum = (Math.random() * randomEventKeys.length).toFixed(0)
    // randomEvents.push()
    const eventObj = getEventObj(userId, { key: randomEventKeys[randomNum], ...options }, conditions)
    switch (eventObj) {
      case EventCode.NotExist:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        i--
        // 剔除不符合条件的事件，避免重复随机到
        randomEventKeys = randomEventKeys.filter((item, index) => parseInt(randomNum) !== index)
        break
      default: randomEvents.push(randomEventKeys[randomNum])
    }
  }
  pushEventKeyToStack(userId, randomEvents)
  if (callback) callback()
}

export const createUser = (userId, reset = true) => {
  if (!EventsRecord[userId] || reset) {
    EventsRecord[userId] = {
      stack: {
        // 常规事件栈
        common: [],
        // 优先栈
        priority: ['guoxinnian', 'chusheng'],
        // 计时事件栈
        duration: []
      },
      // weightReplace为true时，weight生效，否则生效persent(按比例增幅权重)
      // prEventsExtraWeight: { 'EventName': Array[Object{ persent: Number, weight: Number, lastUnitTime: Number, times: Number, weightReplace: Boolean }] }
      // extraRandomEvents: { 'EventName': Array[Object({ persent: Number, lastUnitTime: Number, times: Number })] }
      // extraEventTimes: { 'EventName': Array[Object({ timesOfUnit: Number, timesOfUnitReplace: Boolean, lastUnitTime: Number, timesAdded: Boolean })] }
      prEventsExtraWeight: {},
      extraRandomEvents: {},
      extraEventTimes: {},
      events: {},
      history: {}
    }
  }
}

// 待补充：
// 后期角色特质、状态等都作为属性之一，用数值来表示(0/1)，方便事件条件判断
// 如：[克苏鲁]-> kesulu: 1
// 事件attrConditions中，kesulu属性范围则写为[1,2]

// 待补充：
// Buff可以用延迟事件去除，用必然事件做每单位时间的交互事件

// 待补充：
// 属性：meili jiajing yongqi yunqi
// 状态：zailaojia
// Buff：...

// 待补充：
// 随机事件中的好事或坏事，无需增加概率属性或运气判断
// 只需在该事件triggerConditions加上运气值作为条件即可（注：随机好/坏事件则不要设为必然事件）

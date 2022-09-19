
const MAXNUM = 99999

const EventCode = {
  NotExist: 'notExist',
  OutOfAge: 'outOfAge',
  OutOfTimes: 'outOfTimes',
  MismatchConditions: 'mismatchConditions'
}

const defaultDefaultEvent = {
  // 默认事件，仅可通过命令行调用的默认事件，默认事件也可以是[概率事件/绑定事件/可选事件]事件，但不可以作为被动/必然事件
  text: (options) => '',
  isDefault: (_default = true) => _default,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false,
  // 注：必然事件和被动事件相冲
  isPassive: (passive = false) => false,
  // 默认事件的执行次数必须为【MAXNUM】
  times: (initTimes = MAXNUM) => initTimes,
  timesOfUnit: (times = MAXNUM) => times
}

const defaultNormalEvent = {
  // 普通事件，当某些条件下无可执行的结果，则会默认执行normalDefault事件
  text: (options) => '',
  times: (initTimes = 1) => initTimes,
  timesOfUnit: (times = 1) => times,
  curTimesOfUnit: (times = 1) => times,
  effectAttr: (attr = {}) => ({ ...attr }),
  triggerConditions: (attr = { age: [0, MAXNUM] }) => ({ ...attr }),
  normalDefault: (eventKey = null) => eventKey
}
const defaultPrEvent = {
  // 概率结果事件，按权重概率触发结果事件，当某些条件下无可执行的结果，则会默认执行prDefault事件
  prNumber: (num = 1) => num,
  prEvents: (events = {}) => ({ ...events }),
  prRepeat: (events = {}) => ({ ...events }),
  prDefault: (eventKey = 'gailvmoren') => eventKey
}
const defaultBindingEvent = {
  // 绑定事件事件，必定触发所有事件（按数组排序），当某些条件下无可执行的结果，则会默认执行bindDefault事件
  bindEvents: (events = []) => [...events],
  bindDefault: (eventKey = 'bangdingmoren') => eventKey
}
const defaultOptEvent = {
  // 可选事件，可选选择其一触发，当某些条件下无可执行的结果，则会默认执行optDefault事件
  optEvents: (events = {}) => ({ ...events }),
  optDefault: (eventKey = 'kexuanmoren') => eventKey,
  // 注：选项事件和多选事件相冲
  multiOptions: (options = []) => null
}
const defaultMultiOptEvent = {
  // 多选事件，根据所选择的选项匹配反馈事件，当某些条件下无可执行的结果，则会默认执行multiOptDefault事件
  multiOptions: (options = []) => ([...options]),
  maxSelection: (num = 2) => num,
  isFullMaxSelection: (isFullMaxSelection = false) => isFullMaxSelection,
  multiMixEvents: (mixEvents = { any: 'duoxuanmoren' }) => ({ ...mixEvents }),
  multiOptDefault: (eventKey = 'duoxuanmoren') => eventKey,
  // 注：多选事件和单选事件相冲
  optEvents: (events = {}) => null
}
const defaultPassiveEvent = {
  // 被动事件，非主动事件，不可直接触发，仅通过概率/绑定/可选事件触发
  isPassive: (passive = true) => passive,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false,
  // 注：被动事件和默认事件相冲
  isDefault: (_default = false) => false
}
const defaultCertainEvent = {
  // 必然事件，达到条件必定触发
  isCertain: (certain = true) => certain,
  unitTimeBegin: (unitTimeBegin = true) => unitTimeBegin,
  // 注：必然事件和被动事件相冲
  isPassive: (passive = false) => false,
  // 注：必然事件和默认事件相冲
  isDefault: (_default = false) => false
}
// 和必然事件相对的随机事件无需单独定义，因为其余所有事件实际上都是随机事件
/**
 * 构造器内所有属性均为函数
 * 'EventName[String]': {
 ** 【事件陈述】text: (options[Object(Any)]) => String
 ** 【可执行次数】times: (initTimes[Number]) => Number
 ** 【单位时间可触发次数上限】timesOfUnit: (times[Number]) => Number
 ** 【当前单位时间可触发次数】curTimesOfUnit: (times[Number]) => Number
 ** 【事件触发条件[min, max)】triggerConditions: (attr[Object({ 'Attr[String]': [Array(Number, 2)] })]) => Object
 ** 【事件属性影响】effectAttr: (attr[Object({ 'Attr[String]': Number })]) => Object
 ** 【普通事件默认事件】normalDefault: (eventKey[String]) => String
 ** 【默认事件标识】isDefault: (_default[Boolean]) => Boolean
 ** 【获取概率结果数】prNumber: (num[Number]) => Number
 ** 【概率事件可重复次数】prRepeat: (events[Object({'EventName[String]': times[Number]})]) => Object
 ** 【概率事件】prEvents: (events[Object({'EventName[String]': weight[Number]})]) => Object
 ** 【概率默认事件】prDefault: (eventKey[String]) => String
 ** 【绑定事件】bindEvents: (events[Array]) => Array
 ** 【绑定默认事件】bindDefault: (eventKey[String]) => String
 ** 【被动事件标识】isPassive: (passive[Boolean]) => Boolean
 ** 【必然事件标识】isCertain: (passive[Boolean]) => Boolean
 ** 【必然事件发生时机（单位时间的起始）】unitTimeBegin: (unitTimeBegin[Boolean]) => Boolean
 ** 【可选事件】optEvents: (events[Object({'EventName[String]': {text: [String], color: String, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] }})]) => Object
 ** 【可选默认事件】optDefault: (eventKey[String]) => String
 ** 【多选选项】multiOptions: (events[Array({text: [String], color: String, maxRepeat: 1, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] })]) => Object
 ** 【多选上限】maxSelection: (num[Number]) => Number
 ** 【要求选满多选上限标识】isFullMaxSelection: (isFullMaxSelection[Boolean]) => Boolean
 ** 【多选匹配事件】multiMixEvents: (events[Object({ '[index0]_[index1]_...(String)': EventName[String], 'any(默认)': EventName[String], })]) => Object
 ** 【多选默认事件】multiOptDefault: (eventKey[String]) => String
 * }
 */
const DefautEvents = {
  moren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【默认】什么都没发生'
  },
  gailvmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【概率默认】可惜什么都没发生'
  },
  bangdingmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【绑定默认】可惜什么都没发生'
  },
  kexuanmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【可选默认】可惜什么都没发生'
  },
  duoxuanmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【多选默认】可惜什么都没发生'
  }
}
const NormalEvents = {
  // 普通事件
  chusheng: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `${options.chronology[0]} ${options.date[0] + options.chronology[1]}${options.date[1] + options.chronology[2]}${options.date[2] + options.chronology[3]}，你出生了，你的父母带上美好的祝福和希望，为你取名【${options.name}】`,
    triggerConditions: (attr = { age: [0, 1] }) => ({ ...attr })
  },
  putong1: {
    ...defaultNormalEvent
  },
  beidong_putong1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent
  }
}
const PrEvents = {
  // 概率结果-事件
  gailv: {
    ...defaultNormalEvent,
    ...defaultPrEvent,
    prNumber: (num = 1) => num,
    prRepeat: (events = {}) => ({
      passive1: 1,
      passive2: 2,
      ...events
    }),
    prEvents: (events = {}) => ({
      passive1: 10,
      passive2: 20,
      ...events
    })
  },
  beidong_gailv: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultPrEvent,
    prNumber: (num = 1) => num,
    prRepeat: (events = {}) => ({
      passive1: 1,
      passive2: 2,
      ...events
    }),
    prEvents: (events = {}) => ({
      ...events,
      passive1: 10,
      passive2: 20
    })
  }
}
const BindingEvents = {
  // 绑定事件-事件
  bangding: {
    ...defaultNormalEvent,
    ...defaultBindingEvent,
    bindEvents: (events = []) => [
      ...events,
      'passive1',
      'passive2'
    ]
  },
  beidong_bangding: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    bindEvents: (events = []) => [
      ...events,
      'passive1',
      'passive2'
    ]
  }
}
const OptEvents = {
  // 可选事件-事件
  kexuan: {
    ...defaultNormalEvent,
    ...defaultOptEvent,
    optEvents: (events = {}) => ({
      ...events,
      passive1: { text: '选项1', color: '#2545C4', conditions: {} },
      passive2: { text: '选项2', color: '#2545C4', conditions: { age: [1, 5] } }
    })
  },
  beidong_kexuan: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultOptEvent,
    optEvents: (events = {}) => ({
      ...events,
      passive1: { text: '选项1', color: '#2545C4', conditions: {} },
      passive2: { text: '选项2', color: '#2545C4', conditions: { age: [1, 5] } }
    })
  }
}
const MultiOptEvents = {
  // 可选事件-事件
  duoxuan: {
    ...defaultNormalEvent,
    ...defaultMultiOptEvent,
    multiOptions: (options = []) => ([{
      text: '选项1',
      color: '#2545C4',
      maxRepeat: 1,
      conditions: {}
    }, {
      text: '选项2',
      color: '#2545C4',
      maxRepeat: 2,
      conditions: {}
    }, ...options]),
    maxSelection: (num = 2) => num,
    isFullMaxSelection: (isFullMaxSelection = false) => isFullMaxSelection,
    multiMixEvents: (mixEvents) => ({
      '0_1': 'passive1',
      1: 'passive2',
      any: 'duoxuanmoren',
      ...mixEvents
    }),
    multiOptDefault: (eventKey = 'duoxuanmoren') => eventKey
  },
  beidong_duoxuan: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultMultiOptEvent,
    multiOptions: (options = []) => ([{
      text: '选项1',
      color: '#2545C4',
      conditions: {}
    }, {
      text: '选项2',
      color: '#2545C4',
      conditions: {}
    }, ...options]),
    maxSelection: (num = 2) => num,
    isFullMaxSelection: (isFullMaxSelection = false) => isFullMaxSelection,
    multiMixEvents: (mixEvents) => ({
      '0_1': 'passive1',
      1: 'passive2',
      any: 'duoxuanmoren',
      ...mixEvents
    }),
    multiOptDefault: (eventKey = 'duoxuanmoren') => eventKey
  }
}
const AllEvents = {
  ...DefautEvents,
  ...NormalEvents,
  ...PrEvents,
  ...BindingEvents,
  ...OptEvents,
  ...MultiOptEvents
}

// 过滤出非被动（主动/随机）事件
const NonPassiveEvents = {}
for (const key in AllEvents) {
  if (!AllEvents.isDefault && !AllEvents[key].isPassive && !AllEvents[key].isCertain) NonPassiveEvents[key] = AllEvents[key]
}

// 过滤出必然事件
const CertainEvents = {}
for (const key in AllEvents) {
  if (AllEvents[key].isCertain) CertainEvents[key] = AllEvents[key]
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
    events: {},
    history: {}
  }
}

// ---以下为数据查询函数---

// 获取事件对象EventObj
export const getEventObj = (userId, options = {}, conditions = {}) => {
  const defaultOptions = {
    key: '',
    updateMode: false,
    update: {
      text: false,
      times: false
    },
    eventOptions: {}
  }
  const { key, eventOptions, updateMode, update } = { ...defaultOptions, ...options }
  const { events } = EventsRecord[userId]
  let eventObj = {}
  if (!AllEvents[key]) return EventCode.NotExist
  if (!events[key]) {
    // 正在使用的事件列表无该事件，则从事件库中获取
    for (const ekey in AllEvents[key]) {
      eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
    }
    eventObj = {
      ...AllEvents[key],
      ...eventObj
    }
  } else {
    eventObj = JSON.parse(JSON.stringify(events[key]))
    if (updateMode) {
    // 重置/更新事件属性
      for (const ekey in update) {
        if (update[ekey]) {
          eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
        }
      }
    }
  }
  for (const key in eventObj.triggerConditions) {
    if (!conditions[key]) return EventCode.MismatchConditions
    const min = eventObj.triggerConditions[key][0]
    const max = eventObj.triggerConditions[key][1] > min ? eventObj.triggerConditions[key][1] : MAXNUM
    if (conditions[key] < min || conditions[key] > max) return EventCode.MismatchConditions
  }
  eventObj.times -= 1
  eventObj.curTimesOfUnit -= 1
  return eventObj.times <= 0 || eventObj.curTimesOfUnit === 0 ? EventCode.OutOfTimes : eventObj
}

// 执行 概率事件/绑定事件 的事件结果，概率与绑定事件并存时，概率结果优先执行
export const getEventResult = (userId, event, conditions) => {
  if (!event.prEvents && !event.bindEvents) return []
  const events = []
  const _event = JSON.parse(JSON.stringify(event))
  if (_event.prEvents && _event.prNumber) {
    const { prNumber, prEvents } = _event
    const prRepeat = JSON.parse(JSON.stringify(_event.prRepeat))
    let totalWeight = 0
    let totalRepeatNum = 0
    // 计算总权重，构建weightMap，组建完整的prRepeat
    for (const key in prEvents) {
      totalWeight += prEvents[key]
      // prRepeat的元素默认为1
      if (!prRepeat[key] && prRepeat[key] !== 0) prRepeat[key] = 1
      totalRepeatNum += prRepeat[key]
    }
    // 获取随机权重结果
    const randomResults = new Array(prNumber).fill(null).map(() => (Math.random() * totalWeight).toFixed(0))
    const randomEventKeys = null
    const prEventKeys = Object.keys(prEvents)
    // 按权重大小倒序排序
    prEventKeys.sort((a, b) => prEvents[b] - prEvents[a])
    for (const randomResult of randomResults) {
      // 当前结果事件数量已超出可抽取结果限制，或结果事件总获取次数为0时，则退出循环
      if (randomEventKeys.length >= prNumber || totalRepeatNum <= 0) break
      let _totalWeight = randomResult
      for (let i = 0; i < prEventKeys.length; i++) {
        let ekey = prEventKeys[i]
        _totalWeight -= prEvents[ekey]
        // 符合权重范围
        if (_totalWeight <= 0) {
          // 当前的结果事件剩余获取次数为0，则从第一个结果事件开始遍历，寻找次数>0的结果事件替代
          if (prRepeat[ekey] <= 0) {
            for (const _ekey of prEventKeys) {
              if (prRepeat[_ekey] > 0) {
                ekey = _ekey
                break
              }
            }
          }
          prRepeat[ekey]--
          totalRepeatNum--
          const resEventObj = getEventObj(userId, { key: ekey }, conditions)
          switch (resEventObj) {
            case EventCode.NotExist:
            case EventCode.OutOfAge:
            case EventCode.OutOfTimes:
            case EventCode.MismatchConditions:
              // 概率事件的默认事件
              events.push({ key: _event.prDefault, event: AllEvents[_event.prDefault] })
              break
            default:
              events.push({ key: ekey, event: resEventObj })
          }
          // 递归获取执行结果事件的事件结果
          events.push(...getEventResult(userId, events.at(-1).event, conditions))
        }
      }
    }
  }
  if (_event.bindEvents) {
    for (const bkey of _event.bindEvents) {
      const resEventObj = getEventObj(userId, { key: bkey }, conditions)
      switch (resEventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfAge:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          // 绑定事件的默认事件
          events.push({ key: _event.prDefault, event: AllEvents[_event.bindDefault] })
          break
        default:
          events.push({ key: bkey, event: resEventObj })
      }
      // 递归获取执行结果事件的事件结果
      events.push(...getEventResult(userId, events.at(-1), conditions))
    }
  }
  return events
}

// 获取一个随机发生的事件
const getRandomEvent = (userId, conditions, eventOptions) => {
  const eventKeys = Object.keys(NonPassiveEvents)
  const randomIndex = (Math.random() * eventKeys.length).toFixed(0)
  const randomEventKey = eventKeys[randomIndex]
  const randomEvent = getEventObj(userId, { key: randomEventKey, ...eventOptions }, conditions)
  switch (randomEvent) {
    case EventCode.NotExist:
    case EventCode.OutOfAge:
    case EventCode.OutOfTimes:
    case EventCode.MismatchConditions:
      // 递归直至随机出可执行事件
      return getRandomEvent(userId, conditions, eventOptions)
    default:
      return { key: randomEventKey, event: randomEvent }
  }
}

// ---以下为数据操作函数---

// 强制执行指定事件
export const forceRunEvent = (userId, conditions, eventOptions) => {

}

// 获取当前状态下的必然事件
export const getCertainEvents = (userId, conditions, eventOptions, unitTimeBegin = false) => {
  const certainEvents = []
  for (const key in CertainEvents) {
    const event = getEventObj(userId, { key, ...eventOptions }, conditions)
    if (!!event.unitTimeBegin !== !!unitTimeBegin) continue
    switch (event) {
      case EventCode.NotExist:
      case EventCode.OutOfAge:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        break
      default:
        certainEvents.push({ key, event })
    }
  }
  return certainEvents
}

// 获取随机事件（包含可选事件，但选项内容、选择操作、操作结果需另外获取）
export const getRandomEvents = (userId, conditions, eventOptions, num) => {
  const rEvents = []
  for (let i = 0; i < num; i++) {
    const randomEvent = getRandomEvent(userId, conditions, eventOptions[i])
    rEvents.push(randomEvent)
    rEvents.push(...getEventResult(userId, randomEvent.event, conditions))
  }
  return rEvents
}

// 更新事件记录
export const updateEventsRecord = (userId, unitTimeNum, eventInfo) => {
  const { key, event } = eventInfo
  EventsRecord[userId].events[key] = event
  if (!EventsRecord[userId].history[unitTimeNum]) EventsRecord[userId].history[unitTimeNum] = []
  EventsRecord[userId].history[unitTimeNum].push(eventInfo)
}

// 更新新单位时间出现的新变化，并返回新单位时间起始的必然事件
export const newUnitTime = (userId, conditions, certainEventOptions = {}, callback) => {
  for (const key in EventsRecord[userId].events) {
    EventsRecord[userId].events[key].curTimesOfUnit = EventsRecord[userId].events[key].timesOfUnit
  }
  const newUnitTimeEvents = getCertainEvents(userId, conditions, certainEventOptions, true)
  callback()
  return newUnitTimeEvents
}

// 获取选项事件的可选项，及可选项的eventObj，eventObj为EventCode时，选项置灰
export const getOptEventOptions = (userId, event, curConditions) => {
  if (!event.optEvents) return []
  const options = []
  for (const key in event.optEvents) {
    const { color, text, conditions } = event.optEvents[key]
    // 判断当前状态是否符合选项展示的条件
    for (const ckey in conditions) {
      // disabled为置灰，hide为隐藏
      const option = { color, text, disabled: false, hide: false, keys: [key], events: [] }
      if (!curConditions[ckey]) option.hide = true
      const min = conditions[ckey][0]
      const max = conditions[ckey][1] > min ? conditions[ckey][1] : MAXNUM
      if (curConditions[ckey] < min || curConditions[ckey] > max) option.hide = true
      if (!option.hide) {
        const eventObj = getEventObj(userId, { key }, curConditions)
        // 判断当前选项的反馈事件是否可用
        switch (eventObj) {
          case EventCode.NotExist:
          case EventCode.OutOfAge:
          case EventCode.OutOfTimes:
          case EventCode.MismatchConditions:
            option.disabled = true
            break
          default: option.events.push({ ...eventObj, notUpdate: true }, ...getEventResult(userId, eventObj, conditions))
        }
      }
      options.push(option)
    }
  }
  return options
  // 界面逻辑中，若返回为空数组，则跳过当前事件
}

export const getMultiOptEventOptions = (event, curConditions) => {
  if (!event.multiOptions) return []
  // 待修改：添加逻辑
  // 获取多选事件的可选项
  const options = []
  for (const key in event.multiOptions) {
    const { color, text, conditions } = event.multiOptions[key]
    // 判断当前状态是否符合选项展示的条件
    for (const ckey in conditions) {
      // disabled为置灰，hide为隐藏
      const option = { color, text, hide: false }
      if (!curConditions[ckey]) option.hide = true
      const min = conditions[ckey][0]
      const max = conditions[ckey][1] > min ? conditions[ckey][1] : MAXNUM
      if (curConditions[ckey] < min || curConditions[ckey] > max) option.hide = true
      options.push(option)
    }
  }
  return options
  // 界面逻辑中，若返回为空数组，则跳过当前事件
}

export const getMultiOptResult = (userId, conditions, event, selections = []) => {
  const { multiMixEvents } = event
  const cSelections = selections.sort((a, b) => a - b).toString()
  let eventObj = null
  for (const rkey in multiMixEvents) {
    if (rkey === 'any') continue
    const rSeletions = rkey.split('_').sort((a, b) => a - b).toString()
    if (rSeletions === cSelections) {
      eventObj = getEventObj(userId, { key: multiMixEvents[rkey] }, conditions)
      // 判断当前选项的反馈事件是否可用
      switch (eventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfAge:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          eventObj = getEventObj(userId, { key: multiMixEvents.any }, conditions)
          break
      }
    }
  }
  eventObj = eventObj || getEventObj(userId, { key: multiMixEvents.any }, conditions)
  return [{ ...eventObj, notUpdate: true }, ...getEventResult(userId, eventObj, conditions)]
}

// 更新外部事件栈
export const updateEventStack = () => {
// 待修改：每个事件执行后，事件剩余次数、当前状态都会变更
// 1. EventRecord中的事件次数、单位时间事件次数更新(-1)
// 2. 当前状态变更，事件是否仍然符合条件(triggerConditions)，不符合条件则移除事件（选项/多选事件的反馈事件除外，根据notUpdate标识判断）
}

// 1. 更新新单位时间出现的新变化，并获取新单位时间起始的必然事件-A[]
// ---状态、属性更新---
// 2. 获取当前状态下的必然事件-B[]
// 3. 获取随机事件-C[]
// 4. 合并ABC-S[]
// 5. 逐条执行-S[]，单个事件需要执行步骤：
//    * 属性变更
//    * (无需获取执行结果，执行结果在获取该事件eventObj过程时已处理并加入到-C[])
//    * 必然事件获取-n[]
//    * (可选事件/多选事件)获取可选项、选择可选项
//    * 获取可选项反馈事件-X，并合并到-S[]（放入紧跟当前选项反馈事件后的位置）
//    * -------(已在上一步同步处理)获取可选项反馈事件的事件结果(getEventResult)，并合并到-S[]（放入紧跟该可选项反馈事件后的位置）
//    * 更新时间记录(updateEventsRecord)
//    * 更新外部事件栈(updateEventStack)
//    * 执行下一条事件
// 6. 进入下一单位时间

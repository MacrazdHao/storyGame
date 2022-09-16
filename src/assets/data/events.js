
const EventCode = {
  NotExist: 'notExist',
  OutOfAge: 'outOfAge',
  OutOfTimes: 'outOfTimes'
}

const defaultNormalEvent = {
  text: (options) => '',
  ageScope: (scope = [0, 1]) => scope,
  times: (initTimes = 1) => initTimes,
  timesOfUnit: (times = 1) => times
}
const defaultPrEvent = {
  // 概率结果事件，按权重概率触发结果事件
  prEvents: (events = {}) => ({ ...events })
}
const defaultBindingEvent = {
  // 绑定事件事件，必定触发所有事件（按数组排序）
  bindEvents: (events = []) => [...events]
}
const defaultOptEvent = {
  // 可选事件，可选选择其一触发
  optEvents: (events = {}) => ({ ...events })
}
const defaultPassiveEvent = {
  // 被动事件，非主动事件，不可直接触发，仅通过概率/绑定/可选事件触发
  isPassive: (passive = true) => passive,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false
}
const defaultCertainEvent = {
  // 必然事件，达到条件必定触发
  isCertain: (certain = true) => certain,
  triggerConditions: (attr = { age: [0, 1] }) => ({ ...attr }),
  // 注：必然事件和被动事件相冲
  isPassive: (passive = false) => false
}
// 和必然事件相对的随机事件无需单独定义，因为其余所有事件实际上都是随机事件
/**
 * 构造器内所有属性均为函数
 * "EventName[String]": {
 ** 【事件陈述】text: (options[Object(Any)]) => String
 ** 【触发年龄范围[min, max)】ageScope: (scope[Array(Number, 2)]) => Array
 ** 【可执行次数】times: (initTimes[Number]) => Number
 ** 【单位时间可触发次数】timesOfUnit: (times[Number]) => Number
 ** 【概率事件】prEvents: (events[Object({'EventName[String]': weight[Number]})]) => Object
 ** 【绑定事件】bindEvents: (events[Array]) => Array
 ** 【可选事件】optEvents: (events[Object('EventName[String]': color[String]})]) => Object
 ** 【被动事件标识】isPassive: (passive[Boolean]) => Boolean
 ** 【必然事件标识】isCertain: (passive[Boolean]) => Boolean
 ** 【必然事件触发条件[min, max)】triggerConditions: (attr[Object({ "Attr": [Array(Number, 2)] })]) => Object
 * }
 */
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
    prEvents: (events = {}) => ({
      ...events,
      passive1: 10,
      passive2: 20
    })
  },
  beidong_gailv: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultPrEvent,
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
    optEvents: (events = {}) => ({ ...events, passive1: '#2545C4' })
  },
  beidong_kexuan: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultOptEvent,
    optEvents: (events = {}) => ({ ...events, passive1: '#2545C4' })
  }
}
const AllEvents = {
  ...NormalEvents,
  ...PrEvents,
  ...BindingEvents,
  ...OptEvents
}

// 过滤出非被动（主动/随机）事件
const NonPassiveEvents = {}
for (const key in AllEvents) {
  if (!AllEvents[key].isPassive && !AllEvents[key].isCertain) NonPassiveEvents[key] = AllEvents[key]
}

// 过滤出必然事件
const CertainEvents = {}
for (const key in AllEvents) {
  if (AllEvents[key].isCertain) CertainEvents[key] = AllEvents[key]
}

/**
 * 角色事件存档
 * "UserId[String]": {
 ** events: { "EventName": {事件对象} },
 ** history: { "DayNum[Number]": [EventName[String], ...] , ... }
 * }
 */
const UsingEvents = {
  default: {
    events: {},
    history: {}
  }
}

// 执行 概率事件/绑定事件 的事件结果
const getEventResult = () => {

}

// 获取发生的必然事件
const getCertainEvents = (userId, conditions, eventOptions) => {

}

// 强制执行指定事件
const doForceEvent = (userId, eventOptions) => {

}

// 获取随机发生的事件
const getRandomEvent = (userId, conditions, eventOptions) => {
  const { age } = conditions
  const eventKeys = Object.keys(NonPassiveEvents)
  const randomIndex = (Math.random() * eventKeys.length).toFixed(0)
  const randomEventKey = eventKeys[randomIndex]
  const { events } = UsingEvents[userId]
  const randomEvent = events[randomEventKey] || getEventObj({ userId, age }, eventOptions)
  switch (randomEvent) {
    case EventCode.NotExist:
    case EventCode.OutOfAge:
    case EventCode.OutOfTimes:
      return getRandomEvent(userId, conditions, eventOptions)
    default:
      return { key: randomEventKey, event: randomEvent }
  }
}

export const randomEvents = (userId, conditions, eventOptions, num, resetHistory = false) => {
  const { events, history } = UsingEvents[userId]
  const rEvents = []
  for (let i = 0; i < num; i++) {
    const { key, event } = getRandomEvent(userId, conditions, eventOptions[i])
    UsingEvents[userId] = {
      events: {
        ...events,
        [key]: event
      },
      history: {
        ...history,
        [key]: resetHistory ? 1 : (history[key] + 1)
      }
    } || {
      events: { [key]: event },
      history: { [key]: 1 }
    }
    rEvents.push({ key, event })
  }
  return rEvents
}

export const getEventObj = (userInfo, options) => {
  const { userId, age } = userInfo
  const defaultOptions = {
    key: '',
    updateMode: false,
    update: {
      text: false,
      ageScope: false,
      times: false
    },
    eventOptions: {}
  }
  const { key, eventOptions, updateMode, update } = { ...defaultOptions, ...options }
  const { events, history } = UsingEvents[userId]
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
    eventObj = { ...events[key] }
    if (updateMode) {
    // 重置/更新事件属性
      for (const ekey in update) {
        if (update[ekey]) {
          eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
        }
      }
    }
    if (age < eventObj.ageScope[0] || age >= eventObj.ageScope[1]) return EventCode.OutOfAge
  }
  eventObj.times -= 1
  return eventObj.times <= 0 || eventObj.timesOfUnit >= history[key] ? EventCode.OutOfTimes : eventObj
}

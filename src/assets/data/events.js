
const MAXNUM = 999999
const MINNUM = -999999

const EventCode = {
  NotExist: 'notExist',
  OutOfTimes: 'outOfTimes',
  MismatchConditions: 'mismatchConditions'
}

const defaultDefaultEvent = {
  // 默认事件，仅可通过命令行调用的默认事件，默认事件也可以是[概率事件/绑定事件/可选事件]事件，但不可以作为被动/必然事件
  text: (options) => '',
  isDefault: (_default = true) => true,
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
  // text每次调用事件都必须重构
  text: (options) => '',
  times: (initTimes = MAXNUM) => initTimes,
  timesOfUnit: (times = 1) => times,
  curTimesOfUnit: (times = 1) => times,
  triggerConditions: (attr = { age: [0, MAXNUM] }) => ({ ...attr }),
  execNormalDefaultWhenMismatchConditions: (execDefault = false) => execDefault,
  effectAttr: (attr = {}) => ({ ...attr }),
  // 用于变更或替换其他事件次数(times, timesOfUnit, curTimesOfUnit)（待修改：添加处理逻辑）
  effectEvents: (events = {}) => ({ ...events }),
  // 待修改： 添加prEventsExtraWeight和extraRandomEvents的逻辑
  prEventsExtraWeight: (events = {}) => ({ ...events }),
  extraRandomEvents: (events = {}) => ({ ...events }),
  normalDefault: (eventKey = 'putongmoren') => eventKey
}
const defaultPrEvent = {
  // 概率结果事件，按权重概率触发结果事件，当某些条件下无可执行的结果，则会默认执行prDefault事件
  prNumber: (num = 1) => num,
  prEvents: (events = {}) => ({ ...events }),
  prRepeat: (events = {}) => ({ ...events }),
  prDefault: (eventKey = 'gailvmoren') => eventKey
}
const defaultBindingEvent = {
  // 绑定事件事件，必定触发所有事件（含延迟单位时间数，执行顺序按事件首字母排序），当某些条件下无可执行的结果，则会默认执行bindDefault事件
  // 待修改：添加逻辑，duration为0加入priority，非0则入duration并重排序
  bindEvents: (events = {}) => ({ ...events }),
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
  isPassive: (passive = true) => true,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false,
  // 注：被动事件和默认事件相冲
  isDefault: (_default = false) => false
}
const defaultCertainEvent = {
  // 必然事件，达到条件必定触发
  isCertain: (certain = true) => true,
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
 ** 【事件陈述】text: (options[Object({'userInfo': [Object], 'unitTimeInfo': [Object]), ...待补充]) => String
 ** 【可执行次数】times: (initTimes[Number]) => Number
 ** 【单位时间可触发次数上限】timesOfUnit: (times[Number]) => Number
 ** 【当前单位时间可触发次数】curTimesOfUnit: (times[Number]) => Number
 ** 【事件触发条件[min, max)】triggerConditions: (attr[Object({ 'Attr[String]': [Array(Number, 2)] })]) => Object
 ** 【不符合条件时是否执行普通事件默认事件标识】execNormalDefaultWhenMismatchConditions: (execDefault[Boolean]) => Boolean
 ** 【事件属性影响】effectAttr: (attr[Object({ 'Attr[String]': Number })]) => Object
 ** 【关联事件影响（持续回合数lastUnitTime仅对timesOfUnit有效，times则为一次性加成）】effectEvents：(events[Object({ 'EventName[String]': Object({'times': Number, 'timesOfUnit': Number, 'timesReplace': Boolean, 'timesOfUnitReplace': Boolean, 'lastUnitTime': Number}) })]) => Object
 ** 【概率事件结果额外概率调整】prEventsExtraWeight: (events[Object({ 'EventName[String]': Object({'lastUnitTime': Number, 'weight': Number, 'times': Number, 'weightReplace': Boolean}) })]) => Object
 ** 【额外随机事件概率触发】extraRandomEvents: (events[Object({ 'EventName[String]': Object({'persent': Number, 'lastUnitTime': Number, 'times': Number, 'persentReplace': Boolean}) })]) => Object
 ** 【普通事件默认事件】normalDefault: (eventKey[String]) => String
 ** 【默认事件标识】isDefault: (_default[Boolean]) => Boolean
 ** 【获取概率结果数】prNumber: (num[Number]) => Number
 ** 【概率事件可重复次数】prRepeat: (events[Object({'EventName[String]': times[Number]})]) => Object
 ** 【概率事件】prEvents: (events[Object({'EventName[String]': weight[Number]})]) => Object
 ** 【概率默认事件】prDefault: (eventKey[String]) => String
 ** 【绑定事件】bindEvents: (events[Object({'EventName[String]': {'duration': Number, 'conditions': { attr[Object({ 'Attr[String]': [Array(Number, 2)] }}})]) => Object
 ** 【绑定默认事件】bindDefault: (eventKey[String]) => String
 ** 【被动事件标识】isPassive: (passive[Boolean]) => Boolean
 ** 【必然事件标识】isCertain: (passive[Boolean]) => Boolean
 ** 【必然事件发生时机（单位时间的起始）】unitTimeBegin: (unitTimeBegin[Boolean]) => Boolean
 ** 【可选事件】optEvents: (events[Object({'EventName[String]': {text: [String], color: String, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] }})]) => Object
 ** 【可选默认事件】optDefault: (eventKey[String]) => String
 ** 【多选选项】multiOptions: (events[Array({text: [String], color: String, maxRepeat: 1, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] })]) => Object
 ** 【多选上限】maxSelection: (num[Number]) => Number
 ** 【要求选满多选上限标识】isFullMaxSelection: (isFullMaxSelection[Boolean]) => Boolean
 ** 【多选匹配事件】multiMixEvents: (events[Object({ '[index0]_[index1]_...(String)': EventName[String], 'any(默认)': EventName[String] })]) => Object
 ** 【多选默认事件】multiOptDefault: (eventKey[String]) => String
 * }
 */
const DefautEvents = {
  moren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【默认】什么都没发生'
  },
  putongmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【常规默认】普通的一天，什么都没发生'
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
    text: (options) => `${options.unitTimeInfo.chronology[0]} ${options.unitTimeInfo.date[0] + options.unitTimeInfo.chronology[1]}${options.unitTimeInfo.date[1] + options.unitTimeInfo.chronology[2]}${options.unitTimeInfo.date[2] + options.unitTimeInfo.chronology[3]}，你出生了，你的父母带上美好的祝福和希望，为你取名【${options.userInfo.name}】`,
    triggerConditions: (attr = { age: [0, 1] }) => ({ ...attr })
  },
  meiniankaishi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    ...defaultPrEvent,
    text: () => '新的一年开始了',
    times: () => 1,
    prEvents: (events = {}) => ({
      ...events,
      shaoyanhua1: 10,
      shaoyanhua2: 10,
      shaoyanhua3: 10,
      shaoyanhua4: 20,
      shaoyanhua5: 10,
      shaoyanhua6: 10,
      shaoyanhua7: 10,
      mamadamajiang1: 10,
      mamadamajiang2: 10,
      mamadamajiang3: 10
    })
  },
  putong1: {
    ...defaultNormalEvent
  },
  beidong_putong1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent
  },
  shaoyanhua1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '看到其他小朋友们烧烟花烧得起劲，你走过去也想上去烧，结果因为穿得太穷酸，被嘲笑了一顿然后把你赶走了(魅力-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [5, 12],
      jiajing: [MINNUM, 5]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -1
    })
  },
  shaoyanhua2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '看到其他小朋友们烧烟花烧得起劲，你走过去也想上去烧，小朋友们看到你身上穿着崭新的高仿奶哥牌衣服，极为羡慕，过年这段时间你都成了这条guy最靓的崽(魅力+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [5, 12],
      jiajing: [5, 10]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 1
    })
  },
  shaoyanhua3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你爸给你买了一大堆烟花，附近的小朋友都羡慕极了，纷纷上前讨好你，好一段时间里他们都尊你为孩子王(魅力+2)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [5, 12],
      jiajing: [10, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 2
    })
  },
  shaoyanhua4: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花噼啪响，百花齐放，但你好像完全不感兴趣',
    triggerConditions: (attr = {}) => ({
      ...attr,
      age: [5, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  shaoyanhua5: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你被吓出了屎',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [MINNUM, 3]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  shaoyanhua6: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你却出其的镇定，大家都说你有大将之风(勇气+1, 魅力+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [5, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1,
      meili: 1
    })
  },
  shaoyanhua7: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '外面烟花鞭炮噼啪响，你被吓哭了，但没多久又能平静下来，如此反复横跳了很久，你爸妈因此被折腾得不行',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [0, 5],
      yongqi: [3, 5]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  mamadamajiang1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你跟着你妈去亲戚家打麻将，你在旁边大吵大闹影响了风水，亏惨了，于是你的红包被上缴了，还被骂了一顿(家境-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      age: [5, 18]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      jiajing: -1
    })
  },
  mamadamajiang2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你妈去亲戚家打麻将，亏惨了，幸好你没跟着去，不然肯定少不了一顿迁怒',
    triggerConditions: (attr = {}) => ({
      ...attr,
      age: [5, 18]
    }),
    effectAttr: (attr = {}) => ({
      ...attr
    })
  },
  mamadamajiang3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '过年你跟着你妈去亲戚家打麻将，隐约中你仿佛感应到了什么，鬼使神差地坐在了你妈身后的某个角落，结果你妈打麻将赢麻了，还给了你一封大红包',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zaijia: [1, MAXNUM],
      age: [5, 18],
      jiajing: [10, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 1
    })
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
    bindEvents: (events = {}) => ({
      ...events,
      passive1: { duration: 1 },
      passive2: { duration: 0 }
    })
  },
  beidong_bangding: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    bindEvents: (events = {}) => ({
      ...events,
      passive1: { duration: 1 },
      passive2: { duration: 0 }
    })
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

// 过滤出非被动（又称主动/随机）事件
const NonPassiveEvents = {}
for (const key in AllEvents) {
  if (!AllEvents.isDefault && !AllEvents[key].isPassive && !AllEvents[key].isCertain) {
    // 所有非被动(又称主动/随机）事件的execNormalDefaultWhenMismatchConditions均为true
    AllEvents[key].execNormalDefaultWhenMismatchConditions = (execNormalDefaultWhenMismatchConditions = true) => true
    NonPassiveEvents[key] = AllEvents[key]
  }
}

// 过滤出必然事件
const CertainEvents = {}
for (const key in AllEvents) {
  if (AllEvents[key].isCertain) {
    if (AllEvents[key].isCertain) { CertainEvents[key] = AllEvents[key] }
  }
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
      // 常规事件栈
      common: [],
      // 优先栈
      priority: [],
      // 计时事件栈
      duration: []
    },
    // prEventsExtraWeight: { 'EventName': Array[Object{ weight: Number, lastUnitTime: Number, lastTimes: Number, weightReplace: Boolean }] }
    // extraRandomEvents: { 'EventName': Array[Object({ persent: Number, lastUnitTime: Number, times: Number })] }
    // extraEventTimes: { 'EventName': Array[Object({ timesOfUnit: Number, timesOfUnitReplace: Boolean, lastUnitTime: Number })] }
    prEventsExtraWeight: {},
    extraRandomEvents: {},
    extraEventTimes: {},
    events: {},
    history: {}
  }
}

// 版本通用：

// 获取事件对象EventObj
export const getEventObj = (userId, options = {}, conditions = {}, execNormalDefaultWhenMismatchConditions = false) => {
  const defaultOptions = {
    key: '',
    updateMode: false,
    update: {
      text: false,
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
      if (ekey === 'text') {
        try {
          eventObj.text = eventOptions.text ? AllEvents[key].text(eventOptions.text) : `---${key}: 重新生成文案错误(no params)---`
        } catch (err) {
          eventObj[ekey] = `---${key}: 生成文案错误(params error, ${err})---`
        }
      }
      if (eventOptions[ekey]) eventObj[ekey] = AllEvents[key][ekey](eventOptions[ekey])
      // 无传入参数则走默认
      else eventObj[ekey] = AllEvents[key][ekey]()
    }
    eventObj = {
      ...AllEvents[key],
      ...eventObj
    }
  } else {
    eventObj = JSON.parse(JSON.stringify(events[key]))
    // text每次调用事件都必须重构
    try {
      eventObj.text = eventOptions.text ? AllEvents[key].text(eventOptions.text) : `---${key}: 重新生成文案错误(no params)---`
    } catch (err) {
      eventObj.text = `---${key}: 重新生成文案错误(params error, ${err})---`
    }
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
  for (const key in eventObj.triggerConditions) {
    if (!conditions[key]) {
      if (eventObj.execNormalDefaultWhenMismatchConditions || execNormalDefaultWhenMismatchConditions) return getEventObj(userId, { key: eventObj.normalDefault, options }, conditions)
      return EventCode.MismatchConditions
    }
    const min = eventObj.triggerConditions[key][0]
    const max = eventObj.triggerConditions[key][1] > min ? eventObj.triggerConditions[key][1] : MAXNUM
    if (conditions[key] < min || conditions[key] > max) return EventCode.MismatchConditions
  }
  eventObj.times -= 1
  eventObj.curTimesOfUnit -= 1
  return eventObj.times <= 0 || eventObj.curTimesOfUnit === 0 ? EventCode.OutOfTimes : eventObj
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
  EventsRecord[userId][stackType].push(...events)
}

export const getOptEventOptions = (userId, event, curConditions) => {
  if (!event.optEvents) return []
  const options = []
  // 将可选项根据当前状态和条件解析出可用内容
  for (const key in event.optEvents) {
    const { color, text, conditions } = event.optEvents[key]
    // disabled为置灰，hide为隐藏
    const option = { color, text, event: key, disabled: false, hide: false }
    // 判断当前状态是否符合选项展示的条件
    if (conditions) {
      for (const ckey in conditions) {
        if (!curConditions[ckey]) option.hide = true
        const min = conditions[ckey][0]
        const max = conditions[ckey][1] > min ? conditions[ckey][1] : MAXNUM
        if (curConditions[ckey] < min || curConditions[ckey] > max) option.hide = true
        if (option.hide) break
      }
    }
    if (!option.hide) {
      const eventObj = getEventObj(userId, { key }, curConditions)
      // 判断当前选项的反馈事件是否可用
      switch (eventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          option.disabled = true
      }
    }
    options.push(option)
  }
  return options
  // 界面逻辑中，若返回为空数组，则跳过当前事件
}

export const getMultiOptEventOptions = (event, curConditions) => {
  if (!event.multiOptions) return []
  const options = []
  // 将可选项根据当前状态和条件解析出可用内容
  for (const key in event.multiOptions) {
    const { color, text, conditions } = event.multiOptions[key]
    // hide为隐藏
    const option = { color, text, hide: false }
    // 判断当前状态是否符合选项展示的条件
    if (conditions) {
      for (const ckey in conditions) {
        if (!curConditions[ckey]) option.hide = true
        const min = conditions[ckey][0]
        const max = conditions[ckey][1] > min ? conditions[ckey][1] : MAXNUM
        if (curConditions[ckey] < min || curConditions[ckey] > max) option.hide = true
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

export const selectMultiOptEventOption = (userId, conditions, event, selections = []) => {
  let eventKey = ''
  const { multiMixEvents } = event
  const cSelections = selections.sort((a, b) => a - b).toString()
  let eventObj = null
  for (const rkey in multiMixEvents) {
    if (rkey === 'any') continue
    const rSeletions = rkey.split('_').sort((a, b) => a - b).toString()
    if (rSeletions === cSelections) {
      eventKey = multiMixEvents[rkey]
      eventObj = getEventObj(userId, { key: multiMixEvents[rkey] }, conditions)
      // 判断当前选项的反馈事件是否可用
      switch (eventObj) {
        case EventCode.NotExist:
        case EventCode.OutOfTimes:
        case EventCode.MismatchConditions:
          eventKey = multiMixEvents.any
          eventObj = getEventObj(userId, { key: multiMixEvents.any }, conditions)
          break
      }
    }
  }
  // 没有相匹配的反馈事件
  if (!eventObj) {
    eventKey = multiMixEvents.any
    eventObj = getEventObj(userId, { key: multiMixEvents.any }, conditions)
  }
  pushEventKeyToStack(userId, [eventKey], 'priority')
}

export const execEvent = (userId, eventInfo, unitTimeNum, userInfo, curConditions) => {
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
    userInfo[akey] += event.effectAttr[akey]
  }
  // 【关联事件影响】effectEvents
  for (const ekey in event.effectEvents) {
    const { times, timesOfUnit, timesReplace, timesOfUnitReplace, lastUnitTime } = event.effectEvents[ekey]
    EventsRecord[userId].events[ekey].times = timesReplace ? times : (EventsRecord[userId].events[ekey].times + times)
    // 此处不作处理，下一个单位时间开始加成
    EventsRecord[userId].extraEventTimes[ekey].push({ timesOfUnit, timesOfUnitReplace, lastUnitTime })
  }
  // 【概率事件结果额外概率调整】prEventsExtraWeight
  for (const ekey in event.prEventsExtraWeight) {
    EventsRecord[userId].prEventsExtraWeight[ekey].push(JSON.parse(JSON.stringify(event.prEventsExtraWeight[ekey])))
  }
  // 【额外随机事件概率触发】extraRandomEvents
  for (const ekey in event.extraRandomEvents) {
    EventsRecord[userId].extraRandomEvents[ekey].push(JSON.parse(JSON.stringify(event.extraRandomEvents[ekey])))
  }
  // 【绑定事件】bindEvents
  if (event.bindEvents) {
    for (const ekey in event.bindEvents) {
      let mismatch = false
      if (event.bindEvents[ekey].conditions) {
        for (const ckey in event.bindEvents[ekey].conditions) {
          if (!curConditions[ckey]) mismatch = true
          const min = event.bindEvents[ekey].conditions[ckey][0]
          const max = event.bindEvents[ekey].conditions[ckey][1] > min ? event.bindEvents[ekey].conditions[ckey][1] : MAXNUM
          if (curConditions[ckey] < min || curConditions[ckey] > max) mismatch = true
          if (mismatch) break
        }
      }
      if (!mismatch)pushEventKeyToStack(userId, [ekey], event.bindEvents[ekey].duration === 0 ? 'priority' : 'duration')
      else pushEventKeyToStack(userId, [event.defaultBindingEvent], 'priority')
    }
  }
  // 【获取概率结果数】prNumber
  // 【概率事件可重复次数】prRepeat
  // 【概率事件】prEvents
  // 【概率默认事件】prDefault
  if (event.prEvents) {
    const { prNumber, prEvents, prRepeat, prDefault } = event
    let totalWeight = 0
    for (const item of prEvents) totalWeight += item
    const randomEvents = []
    const prEventKeys = Object.keys(prEvents)
    // 按权重大小倒序排序（由大到小）
    prEventKeys.sort((a, b) => prEvents[b] - prEvents[a])
    Array(prNumber).fill(0).map(() => {
      let randomNum = (Math.random() * totalWeight).toFixed(0)
      for (const ekey in prEventKeys) {
        randomNum -= prEvents[ekey]
        // 未定义重复次数的默认为1
        if (typeof prRepeat[ekey] === 'undefined') prRepeat[ekey] = 1
        // 当前概率结果可重复次数耗尽，则取下一个作为结果
        if (prRepeat[ekey] <= 0) continue
        if (randomNum <= 0) randomEvents.push(ekey)
        prRepeat[ekey]--
      }
    })
    // 不足概率结果数的部分，补充为默认概率事件
    if (randomEvents.length < prNumber) {
      randomEvents.push(...((new Array(prNumber - randomEvents.length).fill(prDefault))))
    }
    pushEventKeyToStack(userId, randomEvents, 'priority')
  }
  return { event, userInfo }
}

export const getNextEvent = (userId, options = {}, conditions = {}, prEventsExtraWeight = {}, extraRandomEvents = {}) => {
  // 优先事件栈
  let key = null
  let event = null
  if (EventsRecord[userId].stack.priority.length) {
    key = EventsRecord[userId].stack.priority.pop()
    event = getEventObj(userId, { key, ...options }, conditions)
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
  if ((!event || typeof event === 'string') && JSON.stringify(EventsRecord[userId].extraRandomEvents) !== '{}') {
    for (const ekey in EventsRecord[userId].extraRandomEvents) {
      for (let i = 0; i < EventsRecord[userId].extraRandomEvents[ekey].length; i++) {
        if (EventsRecord[userId].extraRandomEvents[ekey][i].lastUnitTime || EventsRecord[userId].extraRandomEvents[ekey][i].times <= 0) continue
        const randomNum = (Math.random() * 100).toFixed(0)
        if (EventsRecord[userId].extraRandomEvents[ekey][i].persent >= randomNum) {
          EventsRecord[userId].extraRandomEvents[ekey][i].times--
          key = ekey
          event = getEventObj(userId, { key, ...options }, conditions)
          break
        }
      }
      if (!event || typeof event === 'string') break
    }
  }
  // 常规事件栈
  if ((!event || typeof event === 'string') && EventsRecord[userId].stack.common.length) {
    key = EventsRecord[userId].stack.common.pop().key
    event = getEventObj(userId, { key, ...options }, conditions)
  }
  return (!event || typeof event === 'string') ? 'end' : { key, event }
}

export const toNewUnitTime = (userId, randomEventNum = 2, callback) => {
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
      if (EventsRecord[userId].prEventsExtraWeight[ekey][i].lastUnitTime <= 0) {
        noLastUnitTimeExtraWeightIndex[`${i}`] = true
      }
    }
    // 移除耗尽次数的内容
    EventsRecord[userId].extraEventTimes[ekey].filter((item, index) => !noLastUnitTimeExtraWeightIndex[`${index}`])
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
    EventsRecord[userId].extraEventTimes[ekey].filter((item, index) => !noLastUnitTimeExtraEventIndex[`${index}`])
  }
  // 获取当前单位时间的随机事件(2)
  const randomEventKeys = Object.keys(NonPassiveEvents)
  const randomEvents = []
  for (let i = 0; i < randomEventNum; i++) {
    randomEvents.push(randomEventKeys[(Math.random() * randomEventKeys.length).toFixed(0)])
  }
  pushEventKeyToStack(userId, randomEvents)
  callback()
}

// 待补充：
// 后期角色特质、状态等都作为属性之一，用数值来表示(0/1)，方便事件条件判断
// 如：[克苏鲁]-> kesulu: 1
// 事件attrConditions中，kesulu属性范围则写为[1,2]

// 待补充：
// 属性：meili jiajing yongqi yunqi
// 状态：zaijia
// Buff：

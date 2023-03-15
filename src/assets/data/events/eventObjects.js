// 和必然事件相对的随机事件无需单独定义，因为其余所有事件实际上都是随机事件
/**
 * 构造器内所有属性均为函数
 * 'EventName[String]': {
 ** 【事件陈述】text: (options[Object({'userInfo': [Object], 'unitTimeInfo': [Object]), ...待补充]) => String
 ** 【事件样式】style: (options[Object({'userInfo': [Object], 'unitTimeInfo': [Object]), ...待补充]) => CSS[Object]
 ** 【可执行次数】times: (initTimes[Number]) => Number
 ** 【单位时间可触发次数上限】timesOfUnit: (times[Number]) => Number
 ** 【当前单位时间可触发次数】curTimesOfUnit: (times[Number]) => Number
 ** 【事件触发条件[min, max)】triggerConditions: (attr[Object({ 'Attr[String]': [Array(Number, 2)] })]) => Object
 ** 【不符合条件时是否执行普通事件默认事件标识】execNormalDefaultWhenMismatchConditions: (execDefault[Boolean]) => Boolean
 ** 【事件属性影响】effectAttr: (attr[Object({ 'Attr[String]': Number|RandomScope(Array[Number,2]) })]) => Object
 ** 【关联事件影响（持续回合数lastUnitTime仅对timesOfUnit有效，times则为一次性加成）】effectEvents：(events[Object({ 'EventName[String]': Object({ 'times': Number, 'timesReplace': Boolean,'timesOfUnit': Number, 'timesOfUnitReplace': Boolean, 'lastUnitTime': Number}) })]) => Object
 ** 【概率事件结果额外概率调整】prEventsExtraWeight: (events[Object({ 'EventName[String]': Object({'lastUnitTime': Number, persent: Number, 'weight': Number, 'times': Number, 'weightReplace': Boolean}) })]) => Object
 ** 【额外随机事件概率触发】extraRandomEvents: (events[Object({ 'EventName[String]': Object({'persent': Number, 'lastUnitTime': Number, 'times': Number,  'goodOrBad': Number}) })]) => Object
 ** 【普通事件默认事件】normalDefault: (eventKey[String]) => String
 ** 【默认事件标识】isDefault: (_default[Boolean]) => Boolean
 ** 【获取概率结果数】prNumber: (num[Number]) => Number
 ** 【概率事件可重复次数】prRepeat: (events[Object({'EventName[String]': times[Number]})]) => Object
 ** 【概率事件】prEvents: (events[Object({'EventName[String]': weight[Number]})]) => Object
 ** 【概率默认事件】prDefault: (eventKey[String]) => String
 ** 【概率事件的好/坏结果标识(负坏,0,正好)】prGoodOrBad: (events[Object({'EventName[String]': goodOrBad[Number]})]) => Object
 ** 【绑定事件】bindEvents: (events[Object({'EventName[String]': {'duration': Number, 'conditions': { attr[Object({ 'Attr[String]': [Array(Number, 2)] })]}, 'donotMismatchToDefault': Boolean})]) => Object
 ** 【绑定默认事件】bindDefault: (eventKey[String]) => String
 ** 【被动事件标识】isPassive: (passive[Boolean]) => Boolean
 ** 【必然事件标识】isCertain: (passive[Boolean]) => Boolean
 ** 【必然事件发生时机（单位时间的起始）】unitTimeBegin: (unitTimeBegin[Boolean]) => Boolean
 ** 【可选事件】optEvents: (events[Object({'EventName[String]': {text: [String], color: String, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] }})]) => Object
 ** 【可选默认事件】optDefault: (eventKey[String]) => String
 ** 【多选选项】multiOptions: (events[Array({text: [String], color: String, maxRepeat: 1, conditions: attr[Object({ 'Attr[String]': [Array(Number, 2)], disabledConditions: attr[Object({ 'Attr[String]': [Array(Number, 2)] }})] })]) => Object
 ** 【多选上限】maxSelection: (num[Number]) => Number
 ** 【要求选满多选上限标识】requireSelectNum: (nums[Array(Number)]) => Array(Number)
 ** 【多选匹配事件】multiMixEvents: (events[Object({ '[index0]_[index1]_...(String)': EventName[String], 'any(默认)': EventName[String] })]) => Object
 ** 【多选默认事件】multiOptDefault: (eventKey[String]) => String
 * }
 */

export const MAXNUM = 999999
export const MINNUM = -999999
export const BasicYunqi = 3
// 越稀有，运气影响效果越低
export const RareValue = {
  NORMAL: 0,
  RARE: 1,
  SUPER_RARE: 2,
  SUPERIOR_SUPER_RARE: 3,
  ULTRA_RARE: 4
}

export const DMMap = {
  // [min, max)
  0: { text: '公元', scope: [0, 1] }
}

export const EventCode = {
  NotExist: 'notExist',
  OutOfTimes: 'outOfTimes',
  MismatchConditions: 'mismatchConditions'
}

export const getRandom = (max = 1, min = 0) => {
  return (Math.random() * (max - min + 1) + min).toFixed(0)
}

// 原始事件类型
export const defaultNormalEvent = {
  // 普通事件，当某些条件下无可执行的结果，则会默认执行normalDefault事件
  // text每次调用事件都必须重构
  text: (options) => '',
  style: (options) => ({}),
  times: (initTimes = MAXNUM) => initTimes,
  timesOfUnit: (times = 1) => times,
  // curTimesOfUnit: (times = 1) => times,
  triggerConditions: (attr = { age: [0, MAXNUM] }) => ({ ...attr }),
  execNormalDefaultWhenMismatchConditions: (execDefault = false) => execDefault,
  effectAttr: (attr = {}) => ({ ...attr }),
  // 用于变更或替换其他事件次数(times, timesReplace, timesOfUnit, timesOfUnitReplace, curTimesOfUnit)（待修改：添加处理逻辑）
  effectEvents: (events = {}) => ({ ...events }),
  // 待修改： 添加prEventsExtraWeight和extraRandomEvents的逻辑
  prEventsExtraWeight: (events = {}) => ({ ...events }),
  extraRandomEvents: (events = {}) => ({ ...events }),
  normalDefault: (eventKey = 'putongmoren') => eventKey
}
// 基础事件类型
export const defaultDefaultEvent = {
  // 默认事件，仅可通过命令行调用的默认事件，默认事件也可以是[概率事件/绑定事件/可选事件]事件，但不可以作为被动/必然事件
  isDefault: (_default = true) => true,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false,
  // 注：必然事件和被动事件相冲
  isPassive: (passive = false) => false,
  // 默认事件的执行次数必须为【MAXNUM】
  times: (initTimes = MAXNUM) => MAXNUM,
  timesOfUnit: (times = MAXNUM) => MAXNUM
}
export const defaultPassiveEvent = {
  // 被动事件，非主动事件，不可直接触发，仅通过概率/绑定/可选事件触发
  isPassive: (passive = true) => true,
  // 注：被动事件和必然事件相冲
  isCertain: (certain = false) => false,
  // 注：被动事件和默认事件相冲
  isDefault: (_default = false) => false
}
export const defaultCertainEvent = {
  // 必然事件，达到条件必定触发
  isCertain: (certain = true) => true,
  unitTimeBegin: (unitTimeBegin = true) => unitTimeBegin,
  // 注：必然事件和被动事件相冲
  isPassive: (passive = false) => false,
  // 注：必然事件和默认事件相冲
  isDefault: (_default = false) => false
}
// 功能事件类型
export const defaultPrEvent = {
  // 概率结果事件，按权重概率触发结果事件，当某些条件下无可执行的结果，则会默认执行prDefault事件
  prNumber: (num = 1) => num,
  prEvents: (events = {}) => ({ ...events }),
  prGoodOrBad: (events = {}) => ({ ...events }),
  prRepeat: (events = {}) => ({ ...events }),
  prDefault: (eventKey = 'gailvmoren') => eventKey
}
export const defaultBindingEvent = {
  // 绑定事件事件，必定触发所有事件（含延迟单位时间数，执行顺序按事件首字母排序），当某些条件下无可执行的结果，则会默认执行bindDefault事件
  bindEvents: (events = {}) => ({ ...events }),
  bindDefault: (eventKey = 'bangdingmoren') => eventKey
}
export const defaultOptEvent = {
  // 可选事件，可选选择其一触发，当某些条件下无可执行的结果，则会默认执行optDefault事件
  optEvents: (events = {}) => ({ ...events }),
  optDefault: (eventKey = 'kexuanmoren') => eventKey,
  // 注：选项事件和多选事件相冲
  multiOptions: (options = []) => null
}
export const defaultMultiOptEvent = {
  // 多选事件，根据所选择的选项匹配反馈事件，当某些条件下无可执行的结果，则会默认执行multiOptDefault事件
  multiOptions: (options = []) => ([...options]),
  maxSelection: (num = 2) => num,
  requireSelectNum: (nums = [2, MAXNUM]) => nums,
  multiMixEvents: (mixEvents = { any: 'duoxuanmoren' }) => ({ ...mixEvents }),
  multiOptDefault: (eventKey = 'duoxuanmoren') => eventKey,
  // 注：多选事件和单选事件相冲
  optEvents: (events = {}) => null
}

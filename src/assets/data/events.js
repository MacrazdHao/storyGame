
const MAXNUM = 999999
const MINNUM = -999999
const BasicYunqi = 3
// 越稀有，运气影响效果越低
const RareValue = {
  NORMAL: 0,
  RARE: 1,
  SUPER_RARE: 2,
  SUPERIOR_SUPER_RARE: 3,
  ULTRA_RARE: 4
}

const EventCode = {
  NotExist: 'notExist',
  OutOfTimes: 'outOfTimes',
  MismatchConditions: 'mismatchConditions'
}

const defaultDefaultEvent = {
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
  prGoodOrBad: (events = {}) => ({ ...events }),
  prRepeat: (events = {}) => ({ ...events }),
  prDefault: (eventKey = 'gailvmoren') => eventKey
}
const defaultBindingEvent = {
  // 绑定事件事件，必定触发所有事件（含延迟单位时间数，执行顺序按事件首字母排序），当某些条件下无可执行的结果，则会默认执行bindDefault事件
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
 ** 【概率事件结果额外概率调整】prEventsExtraWeight: (events[Object({ 'EventName[String]': Object({'lastUnitTime': Number, persent: Number, 'weight': Number, 'times': Number, 'weightReplace': Boolean}) })]) => Object
 ** 【额外随机事件概率触发】extraRandomEvents: (events[Object({ 'EventName[String]': Object({'persent': Number, 'lastUnitTime': Number, 'times': Number, 'persentReplace': Boolean}) })]) => Object
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
  guonianmoren: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '今年的春节也是平凡的春节'
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
    times: (times = 1) => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [0, 1] })
  },
  // 成就-必然事件
  nihenyongo: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——你很勇哦】在路上你遇到了杰哥，他觉得你很勇，邀请你到他的房子里康些好康的东西，你当然觉得你很勇，就跟着去了，结果...(魅力+10，体质-1，智力-1)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [18, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 10,
      tizhi: -1,
      zhili: -1
    })
  },
  nihenyongo2: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——勇个屁】在路上你遇到了杰哥，他觉得你很勇，邀请你到他的房子里康些好康的东西，你当然觉得你很勇，就跟着去了，结果他好像发现了什么，突然说：你勇个屁。然后吧你赶走了，你愣在了原地，不知所措(运气+4，魅力-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [-1, 0], age: [18, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yunqi: 4,
      meili: -2
    })
  },
  dashayifang: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【勇气达成100——大杀一方】尖叫？不存在的，徒手擒拿南方大老鼠，手执拖鞋打遍南方大蟑螂，南方的老鼠蟑螂在你附近都能被你的气场震慑得当场去世，你的生活没有了老鼠蟑螂，再也不用担心脏乱差了(体质+8)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [4, MAXNUM], yongqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 8
    })
  },
  fayudebucuoma: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——发育得不错嘛】杰哥温柔地捏了你的大腿几下，说：发育得不错嘛，还蛮结实的喔。然后...(魅力+10，勇气-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [18, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 10,
      yongqi: -2
    })
  },
  nvhanzi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——女汉子】抱歉，男人是什么？有什么用？你并不是那种喊giegie的人，而是手拎起桶装水，肩扛煤气罐的超级女汉子(勇气+10，魅力-3)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [4, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 10,
      meili: -3
    })
  },
  kuihuabaodian: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【体质达成100——葵花宝典】葵花宝典大成，阴阳怪气天下无双，你的一套组合拳下去，连某博拳师都不敢轻易惹上你(体质+3，勇气+3，智力+2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [-1, 0], age: [4, MAXNUM], tizhi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 3,
      tizhi: 3,
      zhili: 2
    })
  },
  baozugong: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: (options) => `【家境达成100——包租${options.userInfo.sex === 1 ? '公' : options.userInfo.sex === 0 ? '婆' : ''}】你的钱多到花不完，北上广深已经没有一个地方你是没有房子的${options.userInfo.sex === 1 || options.userInfo.sex === -1 ? '，每天穿着人字拖，白背心，大裤衩' : '，每天穿着人字拖，花睡裙，卷着头发'}，天天家里蹲看着房价天天涨，不要太舒服(魅力+5，家境+3，体质-2)`,
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [18, MAXNUM], jiajing: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: 5,
      jiajing: 3,
      tizhi: -2
    })
  },
  ouzhougou: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【运气达成100——欧洲狗】有一天，你发现自己无论走到哪都能捡到钱，最后你的运气好到连种族都变了，你变成了真正的欧洲狗，在大街上人人都想给你一矛吃，你被吓得不敢出门(家境+10，魅力-3，勇气-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM], yunqi: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 10,
      meili: -3,
      tizhi: -2
    })
  },
  changtiaorap: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【魅力达成100——唱跳Rap】你人不仅长得炫，唱跳Rap篮球还样样精通，就连练习两年半的练习生阿坤都对你佩服得五体投地，某博打榜你月月稳居第一，无人超越(家境+10，体质+2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM], meili: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 10,
      tizhi: 2
    })
  },
  laobideng: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【年龄达成100——老闭灯】你在家做健身体操的时候，常常会碰到家里灯的开关，你家里人开了你又不小心关上，开了你又关上，这时候你家里人经常会对你说：诶，你老闭灯噶蛤鸭(体质+5)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      tizhi: 5
    })
  },
  mutaidanshen_nan: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【母胎单身】汪汪汪(魅力-2，体质-2)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [1, 2], age: [30, MAXNUM], lianaicishu: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -2,
      tizhi: -2
    })
  },
  mutaidanshen_nv: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【母胎单身】汪汪汪(魅力-3)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, sex: [0, 1], age: [30, MAXNUM], lianaicishu: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      meili: -3
    })
  },
  kaizhi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【智力达成100——开智】你的大脑开发程度超越爱因斯坦，你除了五官之外还多了一种奇妙的神秘第六感，感知到了一种遍布世界却又从未曾感知到的神奇能量(开启灵力修炼)',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, age: [18, MAXNUM], zhili: [100, MAXNUM] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      linglixiulian: 1
    })
  },
  // 结束-必然事件
  siwang: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    text: () => '【Game Over】',
    times: () => 1,
    triggerConditions: (attr = {}) => ({ ...attr, tizhi: [MINNUM, -10], routibusi: [0, 1] }),
    effectAttr: (attr = {}) => ({
      ...attr,
      siwang: 1,
      jieshu: 1
    })
  },
  // 普通-随机事件
  caigoushi: {
    ...defaultNormalEvent,
    text: (options) => '你走在街上踩到了狗屎，心想肯定要走狗屎运了(运气+1)',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 2) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, MAXNUM] }),
    effectAttr: (attr = {}) => ({ ...attr, yunqi: 1 })
  },
  ganmao: {
    ...defaultNormalEvent,
    text: (options) => '你因为吹到冷风而发烧感冒，难顶(体质-1)',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 2) => times,
    triggerConditions: (attr = {}) => ({ ...attr, tizhi: [MINNUM, 30] }),
    effectAttr: (attr = {}) => ({ ...attr, tizhi: -1 })
  },

  putong1: {
    ...defaultNormalEvent,
    text: (options) => '【普通事件】'
  },
  beidong_putong1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: (options) => '【被动普通事件】'
  },
  jiemojirouchuan_jieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    text: (options) => '【点了一串试试】你迫不及待咬下一口芥末鸡肉，那股上头劲儿...',
    bindEvents: (events = {}) => ({
      ...events,
      jiemojirouchuan_jieguo1_bangdingjieguo1: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [MINNUM, 7]
        }
      },
      jiemojirouchuan_jieguo1_bangdingjieguo2: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [7, MAXNUM]
        }
      }
    })
  },
  jiemojirouchuan_jieguo1_bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，你幻想着咬牙吞下去，结果差点被芥末刺杀，最后还是吐掉了，过了好一会依然心有余悸，心里暗骂到底谁才吃得下这玩意儿'
  },
  jiemojirouchuan_jieguo1_bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去(勇气+1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1
    })
  },
  jiemojirouchuan_jieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    text: (options) => '【一串怎么够，当然是来十打】你迫不及待咬下一口芥末鸡肉，那股上头劲儿...(家境-1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: -1
    }),
    bindEvents: (events = {}) => ({
      ...events,
      jiemojirouchuan_jieguo2_bangdingjieguo1: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [MINNUM, 7]
        }
      },
      jiemojirouchuan_jieguo2_bangdingjieguo2: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [7, 10]
        }
      },
      jiemojirouchuan_jieguo2_bangdingjieguo3: {
        duration: 0,
        donotMismatchToDefault: true,
        conditions: {
          yongqi: [10, MAXNUM]
        }
      }
    })
  },
  jiemojirouchuan_jieguo2_bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，你幻想着咬牙吞下去，结果差点被芥末刺杀，最后还是吐掉了，过了好一会依然心有余悸，心里暗骂到底谁才吃得下这玩意儿，最后你一串串地把芥末挑走才吃完了'
  },
  jiemojirouchuan_jieguo2_bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去，但剩下的你再也吃下了，一串串地把芥末挑走才吃完了(勇气+1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 1
    })
  },
  jiemojirouchuan_jieguo2_bangdingjieguo3: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '那股上头劲儿如同针扎电钻一般不断冲击突袭着你的五官，最后你竟然还是坚持吞了下去，还把剩下的全都给吃完了，事后你去了医院，在家躺了一天才恢复过来(勇气+3，家境-1，体质-1)',
    effectAttr: (attr = {}) => ({
      ...attr,
      yongqi: 3,
      tizhi: -1,
      jiajing: -1
    })
  },
  jiemojirouchuan_jieguo3: {
    ...defaultNormalEvent,
    ...defaultDefaultEvent,
    text: (options) => '【算了，不点】你和美味失之交臂'
  },
  shaoyanhua1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    execNormalDefaultWhenMismatchConditions: () => true,
    text: (options) => '看到其他小朋友们烧烟花烧得起劲，你走过去也想上去烧，结果因为穿得太穷酸，被嘲笑了一顿然后把你赶走了(魅力-1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
      age: [5, 17],
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
      zailaojia: [1, MAXNUM],
      age: [5, 17],
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
      babazaishi: [1, MAXNUM],
      zailaojia: [1, MAXNUM],
      age: [5, 17],
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
    text: (options) => '外面烟花鞭炮噼啪响，你被吓出了屎，把你爸妈熏得够呛',
    triggerConditions: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
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
      zailaojia: [1, MAXNUM],
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
      zailaojia: [1, MAXNUM],
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
      mamazaishi: [1, MAXNUM],
      age: [5, 18]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      zailaojia: [1, MAXNUM],
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
      mamazaishi: [1, MAXNUM],
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
    text: (options) => '过年你跟着你妈去亲戚家打麻将，隐约中你仿佛感应到了什么，鬼使神差地坐在了你妈身后的某个角落，结果你妈打麻将赢麻了，还给了你一封大红包(家境+1)',
    triggerConditions: (attr = {}) => ({
      ...attr,
      mamazaishi: [1, MAXNUM],
      zailaojia: [1, MAXNUM],
      age: [5, 18],
      jiajing: [10, MAXNUM]
    }),
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: 1
    })
  },
  passive1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【概率事件结果1】'
  },
  passive2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【概率事件结果2】'
  },
  bangdingjieguo1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【绑定事件结果1】'
  },
  bangdingjieguo2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【绑定事件结果2】'
  },
  xuanxiangshijian1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【选项事件结果1】'
  },
  xuanxiangshijian2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【选项事件结果2】'
  },
  duoxuanshijian1: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【多选事件结果1】'
  },
  duoxuanshijian2: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    text: () => '【多选事件结果2】'
  }
}
const PrEvents = {
  // 概率结果-事件
  gailv: {
    ...defaultNormalEvent,
    ...defaultPrEvent,
    text: () => '【概率事件】',
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
    text: () => '【被动概率事件】',
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
  },
  meiniankaishi: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    ...defaultPrEvent,
    text: () => '新的一年开始了',
    times: () => MAXNUM,
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
    }),
    prGoodOrBad: (events = {}) => ({
      ...events,
      shaoyanhua1: -RareValue.RARE,
      shaoyanhua2: RareValue.RARE,
      shaoyanhua3: RareValue.RARE,
      shaoyanhua4: RareValue.NORMAL,
      shaoyanhua5: RareValue.NORMAL,
      shaoyanhua6: RareValue.SUPER_RARE,
      shaoyanhua7: RareValue.NORMAL,
      mamadamajiang1: -RareValue.RARE,
      mamadamajiang2: RareValue.NORMAL,
      mamadamajiang3: RareValue.RARE
    }),
    prDefault: (eventKey) => 'guonianmoren'
  }
}
const BindingEvents = {
  // 绑定事件-事件
  bangding: {
    ...defaultNormalEvent,
    ...defaultBindingEvent,
    text: () => '【绑定事件】',
    bindEvents: (events = {}) => ({
      ...events,
      bangdingjieguo1: { duration: 1 },
      bangdingjieguo2: { duration: 0 }
    })
  },
  beidong_bangding: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultBindingEvent,
    text: () => '【被动绑定事件】',
    bindEvents: (events = {}) => ({
      ...events,
      bangdingjieguo1: { duration: 1 },
      bangdingjieguo2: { duration: 0 }
    })
  }
}
const OptEvents = {
  jiemojirouchuan: {
    ...defaultNormalEvent,
    ...defaultOptEvent,
    text: (options) => '你去鸟刀居日料店看到菜单里有芥末鸡肉串（鸡肉上真的有好几坨绿绿的芥末），你决定',
    times: (initTimes = MAXNUM) => initTimes,
    curTimesOfUnit: (times = 3) => times,
    triggerConditions: (attr = { age: [4, MAXNUM] }) => ({ ...attr }),
    optEvents: (events = {}) => ({
      ...events,
      jiemojirouchuan_jieguo1: { text: '点一串试试', color: '#2545C4', conditions: { jiajing: [1, MAXNUM] } },
      jiemojirouchuan_jieguo2: { text: '一串怎么够，当然是来十打', color: '#2545C4', conditions: { jiajing: [5, MAXNUM] } },
      jiemojirouchuan_jieguo3: { text: '算了，不点', color: '#2545C4' }
    })

  },
  // 可选事件-事件
  kexuan: {
    ...defaultNormalEvent,
    ...defaultOptEvent,
    text: () => '【可选事件】',
    optEvents: (events = {}) => ({
      ...events,
      xuanxiangshijian1: { text: '选项1', color: '#2545C4', conditions: {} },
      xuanxiangshijian2: { text: '选项2', color: '#2545C4', conditions: { age: [1, 5] } }
    })
  },
  beidong_kexuan: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultOptEvent,
    text: () => '【被动可选事件】',
    optEvents: (events = {}) => ({
      ...events,
      xuanxiangshijian1: { text: '选项1', color: '#2545C4', conditions: {} },
      xuanxiangshijian2: { text: '选项2', color: '#2545C4', conditions: { age: [1, 5] } }
    })
  }
}
const MultiOptEvents = {
  // 可选事件-事件
  duoxuan: {
    ...defaultNormalEvent,
    ...defaultMultiOptEvent,
    text: () => '【多选事件】',
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
      '0_1': 'duoxuanshijian1',
      1: 'duoxuanshijian2',
      any: 'duoxuanmoren',
      ...mixEvents
    }),
    multiOptDefault: (eventKey = 'duoxuanmoren') => eventKey
  },
  beidong_duoxuan: {
    ...defaultNormalEvent,
    ...defaultPassiveEvent,
    ...defaultMultiOptEvent,
    text: () => '【被动多选事件】',
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
      '0_1': 'duoxuanshijian1',
      1: 'duoxuanshijian2',
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
    // prEventsExtraWeight: { 'EventName': Array[Object{ persent: Number, weight: Number, lastUnitTime: Number, lastTimes: Number, weightReplace: Boolean }] }
    // extraRandomEvents: { 'EventName': Array[Object({ persent: Number, lastUnitTime: Number, times: Number })] }
    // extraEventTimes: { 'EventName': Array[Object({ timesOfUnit: Number, timesOfUnitReplace: Boolean, lastUnitTime: Number })] }
    prEventsExtraWeight: {},
    extraRandomEvents: {},
    extraEventTimes: {},
    events: {},
    history: {}
  }
}

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
    if (typeof conditions[key] === 'undefined') {
      if (eventObj.execNormalDefaultWhenMismatchConditions || execNormalDefaultWhenMismatchConditions) return getEventObj(userId, { key: eventObj.normalDefault, options }, conditions)
      return EventCode.MismatchConditions
    }
    const min = eventObj.triggerConditions[key][0]
    const max = eventObj.triggerConditions[key][1] > min ? eventObj.triggerConditions[key][1] : MAXNUM
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
        if (typeof curConditions[ckey] === 'undefined') option.hide = true
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

export const getMultiOptEventOptions = (_event, curConditions) => {
  const event = JSON.parse(JSON.stringify(_event))
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
        if (typeof curConditions[ckey] === 'undefined') option.hide = true
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

export const selectMultiOptEventOptions = (userId, conditions, _event, selections = []) => {
  const event = JSON.parse(JSON.stringify(_event))
  let eventKey = ''
  const { multiMixEvents } = event
  selections.sort((a, b) => a - b)
  const cSelections = JSON.stringify(selections)
  let eventObj = null
  for (const rkey in multiMixEvents) {
    if (rkey === 'any') continue
    const mixEventSelections = rkey.split('_').map(item => parseInt(item))
    mixEventSelections.sort((a, b) => a - b)
    const rSeletions = JSON.stringify(mixEventSelections)
    console.log(cSelections, rSeletions)
    if (rSeletions === cSelections) {
      eventKey = multiMixEvents[rkey]
      eventObj = getEventObj(userId, { key: multiMixEvents[rkey] }, conditions)
      console.log(eventObj)
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
          if (typeof curConditions[ckey] === 'undefined') mismatch = true
          const min = event.bindEvents[ekey].conditions[ckey][0]
          const max = event.bindEvents[ekey].conditions[ckey][1] > min ? event.bindEvents[ekey].conditions[ckey][1] : MAXNUM
          if (curConditions[ckey] < min || curConditions[ckey] > max) mismatch = true
          if (mismatch) break
        }
      }
      if (!mismatch)pushEventKeyToStack(userId, !event.bindEvents[ekey].duration ? [ekey] : [{ key: ekey, duration: event.bindEvents[ekey].duration }], !event.bindEvents[ekey].duration ? 'priority' : 'duration')
      else if (!event.bindEvents[ekey].donotMismatchToDefault) pushEventKeyToStack(userId, [event.defaultBindingEvent], 'priority')
    }
  }
  // 【获取概率结果数】prNumber
  // 【概率事件可重复次数】prRepeat
  // 【概率事件】prEvents
  // 【概率默认事件】prDefault
  if (event.prEvents) {
    const { prNumber, prEvents, prRepeat, prDefault, prGoodOrBad } = event
    const realYunqi = curConditions.yunqi - BasicYunqi
    // realYunqi 每 1运气 加 1% 概率基数，按稀有度效果递减
    const yunqiPersent = Math.abs(0.01 * realYunqi)
    let totalWeight = 0
    for (const pkey in prEvents) {
      let weight = prEvents[pkey]
      // 【概率事件结果额外概率调整】prEventsExtraWeight
      if (EventsRecord[userId].prEventsExtraWeight[key]) {
        for (let i = 0; i < EventsRecord[userId].prEventsExtraWeight[key].length; i++) {
          if (EventsRecord[userId].prEventsExtraWeight[key].lastUnitTime <= 0 || EventsRecord[userId].prEventsExtraWeight[key].lastTimes <= 0) continue
          EventsRecord[userId].prEventsExtraWeight[key].lastTimes--
          weight = EventsRecord[userId].prEventsExtraWeight[key].weightReplace ? EventsRecord[userId].prEventsExtraWeight[key].weight : (weight + weight * EventsRecord[userId].prEventsExtraWeight[key].weight)
        }
      }
      if (prGoodOrBad[pkey]) {
        // 运气>3，好事概率增幅，运气<3，坏事概率减幅
        if (prGoodOrBad[pkey] > 0) weight = weight + (realYunqi > 0 ? 1 : -1) * prEvents[pkey] * yunqiPersent / Math.abs(prGoodOrBad[pkey])
        // 运气>3，坏事概率减幅，运气<3，坏事概率增幅
        if (prGoodOrBad[pkey] < 0) weight = weight + (realYunqi > 0 ? -1 : 1) * prEvents[pkey] * yunqiPersent / Math.abs(prGoodOrBad[pkey])
      }
      prEvents[pkey] = weight
      totalWeight += prEvents[pkey]
    }
    let randomEvents = []
    const prEventKeys = Object.keys(prEvents)
    // 按权重大小倒序排序（由大到小）
    prEventKeys.sort((a, b) => prEvents[b] - prEvents[a])
    Array(prNumber).fill(0).map(() => {
      let randomNum = (Math.random() * totalWeight).toFixed(1)
      for (let i = 0; i < prEventKeys.length; i++) {
        const ekey = prEventKeys[i]
        randomNum -= prEvents[ekey]
        // 未定义重复次数的默认为1
        if (typeof prRepeat[ekey] === 'undefined') prRepeat[ekey] = 1
        // 当前概率结果可重复次数耗尽，则取下一个作为结果
        if (prRepeat[ekey] <= 0) continue
        if (randomNum <= 0) randomEvents.push(ekey)
        prRepeat[ekey]--
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
    key = EventsRecord[userId].stack.common.pop()
    event = getEventObj(userId, { key, ...options }, conditions)
  }
  return (!event || typeof event === 'string') ? 'end' : { key, event }
}

export const toNewUnitTime = (userId, conditions, callback, randomEventNum = 2) => {
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
    const randomNum = (Math.random() * randomEventKeys.length - 1).toFixed(0)
    // randomEvents.push()
    const eventObj = getEventObj(userId, { key: randomEventKeys[randomNum] }, conditions)
    switch (eventObj) {
      case EventCode.NotExist:
      case EventCode.OutOfTimes:
      case EventCode.MismatchConditions:
        i--
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
        priority: [],
        // 计时事件栈
        duration: []
      },
      // weightReplace为true时，weight生效，否则生效persent(按比例增幅权重)
      // prEventsExtraWeight: { 'EventName': Array[Object{ persent: Number, weight: Number, lastUnitTime: Number, lastTimes: Number, weightReplace: Boolean }] }
      // extraRandomEvents: { 'EventName': Array[Object({ persent: Number, lastUnitTime: Number, times: Number })] }
      // extraEventTimes: { 'EventName': Array[Object({ timesOfUnit: Number, timesOfUnitReplace: Boolean, lastUnitTime: Number })] }
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
// Buff：

// 待补充：
// 随机事件中的好事或坏事，无需增加概率属性或运气判断
// 只需在该事件triggerConditions加上运气条件即可（注：随机好/坏事件则不要设为必然事件）

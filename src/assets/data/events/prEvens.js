import {
  MAXNUM,
  MINNUM,
  BasicYunqi,
  RareValue,
  EventCode,
  defaultDefaultEvent,
  defaultNormalEvent,
  defaultPrEvent,
  defaultBindingEvent,
  defaultOptEvent,
  defaultMultiOptEvent,
  defaultPassiveEvent,
  defaultCertainEvent
} from './eventObjects'
export default {
  // 常规事件
  shenmishitou: {
    ...defaultNormalEvent,
    ...defaultPrEvent,
    text: () => '你在地上捡了个形状不正常的黑石头，刚拿起来就有一股黑烟冒了出来，逐渐凝成一个人影...',
    times: (initTimes = 1) => initTimes,
    timesOfUnit: (times = 1) => times,
    prNumber: (num = 1) => num,
    prEvents: (events = {}) => ({
      shenmishitou_jieguo2: 10,
      ...events
    }),
    prDefault: (eventKey = 'shenmishitou_jieguo1') => eventKey
  },
  maicaipiao: {
    ...defaultNormalEvent,
    ...defaultPrEvent,
    text: (options) => `你路过一家福利彩票的店，你心血来潮，${options.userInfo.yunqi > 30 ? '灵光一闪，凭借此时的第六感' : options.userInfo.yunqi > 8 ? '照着昨晚梦里梦到的数字' : '凭感觉随便'}买了一张双色球彩票(家境-1)`,
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [18, 80], jiajing: [0, MAXNUM] }),
    prEvents: (events = {}) => ({
      maicaipiao_jieguo1: 60,
      maicaipiao_jieguo2: 30,
      maicaipiao_jieguo3: 10,
      maicaipiao_jieguo4: 2,
      ...events
    }),
    prGoodOrBad: (event = {}) => ({
      ...event,
      maicaipiao_jieguo1: RareValue.NORMAL,
      maicaipiao_jieguo2: RareValue.RARE,
      maicaipiao_jieguo3: RareValue.SUPER_RARE,
      maicaipiao_jieguo4: RareValue.SUPERIOR_SUPER_RARE
    }),
    prDefault: (eventKey = 'maicaipiao_jieguo1') => eventKey,
    effectAttr: (attr = {}) => ({
      ...attr,
      jiajing: -1
    })
  },
  tiaolouti: {
    ...defaultNormalEvent,
    ...defaultPrEvent,
    text: (options) => '最近你迷恋上了跳楼梯，结果这次没站稳一个不小心直接摔了下去',
    times: (initTimes = MAXNUM) => initTimes,
    timesOfUnit: (times = 1) => times,
    triggerConditions: (attr = {}) => ({ ...attr, age: [4, 13] }),
    prEvents: (events = {}) => ({
      tiaolouti_jieguo1: 60,
      tiaolouti_jieguo2: 20,
      tiaolouti_jieguo3: 15,
      tiaolouti_jieguo4: 5,
      ...events
    })
  },
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
    }),
    prGoodOrBad: (event = {}) => ({
      ...event,
      passive1: RareValue.RARE
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
  guoxinnian: {
    ...defaultNormalEvent,
    // ...defaultCertainEvent,
    ...defaultPrEvent,
    text: () => '新的一年开始了',
    style: () => ({ backgroundColor: 'red', color: '#fff' }),
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

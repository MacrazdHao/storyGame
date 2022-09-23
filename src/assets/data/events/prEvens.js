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
  guoxinnian: {
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

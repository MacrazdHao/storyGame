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

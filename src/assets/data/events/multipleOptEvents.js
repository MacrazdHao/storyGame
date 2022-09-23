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
// 事件选项内的条件影响hide，disabled条件影响disabled
export default {
  // 可选事件-事件
  duoxuan: {
    ...defaultNormalEvent,
    ...defaultMultiOptEvent,
    text: () => '【多选事件】',
    multiOptions: (options = []) => ([{
      text: '选项1',
      color: '#2545C4',
      maxRepeat: 1,
      conditions: {},
      disabledConditons: {}
    }, {
      text: '选项2',
      color: '#2545C4',
      maxRepeat: 2,
      conditions: {},
      disabledConditons: {}
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

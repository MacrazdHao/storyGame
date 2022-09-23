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
// 事件选项内的条件影响hide，结果事件内的条件影响disabled
export default {
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
      jiemojirouchuan_jieguo2: { text: '一串怎么够，东北爷们儿当然直接是来十打', color: '#2545C4' },
      jiemojirouchuan_jieguo3: { text: '算了，不点', color: '#2545C4' }
    })
  },
  bbzhuazhou_nan: {
    ...defaultNormalEvent,
    ...defaultCertainEvent,
    ...defaultOptEvent,
    text: (options) => `你${options.userInfo.babazaishi && options.userInfo.mamazaishi ? '父母' : !options.userInfo.babazaishi && options.userInfo.mamazaishi ? '妈妈' : options.userInfo.babazaishi && !options.userInfo.mamazaishi ? '爸爸' : '身边的人'}放了好几样东西在你眼前，让你在你面前选择一样，你选择...`,
    times: (initTimes = 1) => initTimes,
    curTimesOfUnit: (times = 1) => times,
    triggerConditions: (attr = { age: [0, 1] }) => ({ ...attr }),
    optEvents: (events = {}) => ({
      ...events,
      bbzhuazhou_jieguo1: { text: '笔', color: '#2545C4' },
      bbzhuazhou_jieguo2: { text: '木锤', color: '#2545C4' },
      bbzhuazhou_jieguo3: { text: '计算器', color: '#2545C4' },
      bbzhuazhou_jieguo4: { text: '钱', color: '#2545C4' },
      bbzhuazhou_jieguo5: { text: '画', color: '#2545C4' },
      bbzhuazhou_jieguo6: { text: '印章', color: '#2545C4' },
      bbzhuazhou_jieguo7: {
        text: '爸爸的电脑',
        color: '#2545C4',
        conditions: {
          sex: [1, MAXNUM]
        }
      },
      bbzhuazhou_jieguo10: {
        text: '妈妈的口红',
        color: '#2545C4',
        conditions: {
          sex: [-1, 1]
        }
      },
      bbzhuazhou_jieguo8: {
        text: '木剑',
        color: '#2545C4',
        conditions: {
          sex: [1, MAXNUM],
          tizhi: [5, MAXNUM],
          tianfu_jianshu: [2, MAXNUM]
        }
      },
      bbzhuazhou_jieguo11: {
        text: '仙女棒',
        color: '#2545C4',
        conditions: {
          sex: [0, 1],
          zhili: [5, MAXNUM],
          tianfu_mofa: [2, MAXNUM]
        }
      },
      bbzhuazhou_jieguo9: { text: '???', color: '#2545C4', conditions: { tezhi_weizhi: [1, MAXNUM] } },
      bbzhuazhou_jieguo12: { text: '这么迷信干嘛？不选！', color: '#2545C4' }
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

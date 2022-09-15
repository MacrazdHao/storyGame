
// let BasicInfo = {
//   chronology: ['公元', '年', '月', '日'],
//   date: [9999, 1, 1],
//   name: '自己名',
//   bornDate: ['公元', 9999, 1, 1],
//   fatherName: '爸爸名',
//   motherName: '妈妈名'
// }
/**
 * 构造器内所有属性均为函数
 *
 */
const Events = {
  chusheng: {
    text: (options) => `${options.chronology[0]} ${options.date[0] + options.chronology[1]}${options.date[1] + options.chronology[2]}${options.date[2] + options.chronology[3]}，你出生了，你的父母带上美好的祝福和希望，为你取名【${options.name}】`,
    yearsScope: (scope = [1, 1]) => scope,
    times: (initTimes = 1) => initTimes
  },
  chusheng2: {
    text: (options) => '',
    yearsScope: (scope = [0, 999]) => scope,
    times: (initTimes = 999) => initTimes
  }
}

// '角色ID': {事件对象}
const UsingEvents = {
  default: {}
}

export const getEvents = (options) => {
  const defaultOptions = {
    key: '',
    update: {
      text: false,
      yearsScope: false,
      times: false
    },
    customTimes: null,
    eventOptions: {}
  }
  const { key, customTimes, eventOptions } = { ...defaultOptions, ...options }
  if (!Events[key]) return false
  if (!UsingEvents[key]) {
    const eventObj = {}
    for (const ekey in Events[key]) {
      eventObj[ekey] = Events[key][ekey](eventOptions[ekey])
    }
    UsingEvents[key] = {
      ...Events[key],
      ...eventObj
    }
  } else if (UsingEvents[key]) {
    for (const ekey in options.update) {
      if (options.update[ekey]) {
        UsingEvents[ekey] = Events[key][ekey](eventOptions[ekey])
      }
    }
  }
  if (typeof customTimes === 'number') UsingEvents[key].times = customTimes
  else UsingEvents[key].times -= 1
  return UsingEvents[key].times <= 0 ? false : UsingEvents[key]
}

let player = {
  DefaultEvent: 10000,
  NextEvent: null,
  // 自更属性
  EVT: {}, // 历史事件
  TLT: {}, // 天赋
  AGE: 0, // 年龄
  // 基础属性
  CHR: 0, // 颜值
  INT: 0, // 智力
  MNY: 0, // 家境
  STR: 0, // 体质
  // 额外属性
  SPR: 0,
  HAP: 0, // 心情
  LIF: 1 // 是否活着
}

const AgeEventsMap = []

function transSingleJurdgement(command = '', player) {
  const { CHR, INT, MNY, STR, HAP, SPR } = player
  const isFalseCommand = command.includes('!')
  const isTrueCommand = command.includes('?')
  if (isFalseCommand || isTrueCommand) {
    const cmd = command.split(/[\?\!]/)
    const cond = JSON.parse(cmd[1])
    switch (cmd[0]) {
      case 'EVT':
      case 'TLT':
        for (let i = 0; i < cond.length; i++) {
          if ((isFalseCommand && !player[cmd[0]][cond[i]]) || (isTrueCommand && player[cmd[0]][cond[i]])) {
            return true
          }
        }
        return false
      case 'AGE':
        return (isFalseCommand && !cond.includes(player[cmd[0]])) || (isTrueCommand && cond.includes(player[cmd[0]]))
    }
  }
  return eval(command)
}

function transJurdgement(command, player) {
  if (!command) return false
  let result = null
  const AndCommands = command.split('&')
  AndCommands.forEach((andCmd, andIndex) => {
    const OrCommands = andCmd.split('|')
    const singleAndRes = transSingleJurdgement(OrCommands[0], player)
    result = andIndex > 0 ? result && singleAndRes : singleAndRes
    OrCommands.forEach((orCmd, orIndex) => {
      if (orIndex > 0) result = singleAndRes || transSingleJurdgement(orCmd, player)
    })
  })
  return result
}

function transResultJurdgement(commands = [], player) {
  console.log(commands)
  const results = []
  commands.forEach(command => {
    const cmdArr = command.split(':')
    const JurdgementCmd = cmdArr[0]
    const Result = parseInt(cmdArr[1])
    transJurdgement(JurdgementCmd, player) && results.push(Result)
  })
  return results
}

function updateEventsMap(player) {
  const { AGE, EVT } = player
  const _EVT = {}
  for (const eid in EVT) {
    const records = EVT[eid].filter(age => age < AGE)
    if (records.length > 0) _EVT[eid] = records
  }
  return _EVT
}
// console.log((transJurdgement('EVT?[10140,10141]|TLT?[1030]', player)))
function getCurrentEventsMap(EventsData, AgeEventsMap, player) {
  const { AGE } = player
  const AgeEvents = JSON.parse(JSON.stringify(AgeEventsMap[AGE]))
  const RandomEvents = []
  let RandomTotalWeight = 0
  const CertainEvents = []
  for (let i = 0; i < AgeEvents.length; i++) {
    const { include, exclude, certainly } = EventsData[AgeEvents[i]]
    if (
      // 没有排除条件 或 不符合排除条件
      (!exclude || !transJurdgement(exclude, player)) &&
      // 没有执行条件 或 符合执行条件
      (!include || transJurdgement(include, player))
    ) {
      console.log(AgeEvents[i], transJurdgement(exclude, player))
      if (certainly) {
        CertainEvents.push(AgeEvents[i])
        continue
      }
      RandomEvents.push(AgeEvents[i])
      RandomTotalWeight += EventsData[AgeEvents[i]].weight
    }
  }
  CertainEvents.sort((a, b) => EventsData[b].weight - EventsData[a].weight)
  return { RandomEvents, CertainEvents, RandomTotalWeight }
}

function getCurrentEvent(EventsData, { RandomEvents = [], CertainEvents = [], RandomTotalWeight = 0 }, player) {
  const { DefaultEvent, NextEvent } = player
  if (NextEvent) return NextEvent
  if (CertainEvents.length > 0) return CertainEvents[0]
  if (RandomEvents.length === 0) return DefaultEvent
  let randNum = parseInt(Math.random() * RandomTotalWeight)
  for (let i = 0; i < RandomEvents.length; i++) {
    randNum -= EventsData[RandomEvents[i]].weight
    if (randNum <= 0) return RandomEvents[i]
  }
  return DefaultEvent
}

function execEvent(EventsData, eid, player, recur = false) {
  let _player = JSON.parse(JSON.stringify(player))
  _player.NextEvent = null
  const { AGE } = _player
  const { event, defaultResult, resultEvents, effect } = EventsData[eid]
  const desc = [event]
  if (!_player.EVT[eid]) _player.EVT[eid] = []
  _player.EVT[eid].push(AGE)
  if (effect) {
    for (const key in effect) {
      _player[key] += effect[key]
    }
  }
  if (resultEvents) {
    const resultEventEids = transResultJurdgement(resultEvents, player)
    if (resultEventEids.length > 0) {
      if (defaultResult || recur) {
        const resultExecRes = execEvent(EventsData, resultEventEids[0], _player, true)
        desc.push(...resultExecRes.desc)
        _player = resultExecRes.player
      } else {
        _player.NextEvent = resultEventEids[0]
      }
    } else if (resultEventEids.length === 0 && (defaultResult || recur)) {
      if (defaultResult) desc.push(defaultResult)
    }
  } else if (!resultEvents && (defaultResult || recur)) {
    if (defaultResult) desc.push(defaultResult)
  }
  return { player: _player, desc }
}

const ContentBoxDom = document.getElementById('ContentBox')
const EventDomProto = document.getElementById('EventDomProto')
const EventSingleDescDomProto = EventDomProto.getElementsByClassName('EventBox-desc')[0]

const gameover = () => {
  document.body.removeEventListener('click', nextAge)
  document.getElementById('next').removeEventListener('click', nextAge)
}

const nextAge = () => {
  player.AGE++
  player.EVT = updateEventsMap(player)
  const CurrentEventsMap = getCurrentEventsMap(EventsData, AgeEventsMap, player)
  // console.log(CurrentEventsMap)
  const CurrentEvent = getCurrentEvent(EventsData, CurrentEventsMap, player)
  console.log(CurrentEvent)
  const ExecEventRes = execEvent(EventsData, CurrentEvent, player)
  player = ExecEventRes.player
  if (player.LIF <= 0) {
    gameover()
  }
  // 更新页面
  const EventDom = EventDomProto.cloneNode(true)
  EventDom.style.display = 'flex'
  const EventDomRandomId = Math.random().toString(36).slice(2)
  EventDom.setAttribute('id', `${player.AGE}-${EventDomRandomId}`)
  // 年龄内容
  const EventSingleDescDom = EventSingleDescDomProto.cloneNode(true)
  EventSingleDescDom.setAttribute('id', `${player.AGE}-${EventDomRandomId}-age`)
  EventSingleDescDom.innerHTML = `${player.AGE} 岁`
  EventDom.appendChild(EventSingleDescDom)
  // 内容内容
  ExecEventRes.desc.forEach((desc, index) => {
    const EventSingleDescDom = EventSingleDescDomProto.cloneNode(true)
    EventSingleDescDom.setAttribute('id', `${player.AGE}-${EventDomRandomId}-${index}`)
    EventSingleDescDom.innerHTML = desc
    EventDom.appendChild(EventSingleDescDom)
  })
  ContentBoxDom.appendChild(EventDom)
  ContentBoxDom.scrollTop = ContentBoxDom.scrollHeight - ContentBoxDom.clientHeight;
}

const initAgeEventsMap = () => {
  for (const eid in EventsData) {
    if (!EventsData[eid].age) continue
    EventsData[eid].age.forEach(age => {
      const ageArr = AgeEventsMap[age] || []
      ageArr.push(parseInt(eid))
      AgeEventsMap[age] = Array.from(new Set(ageArr))
    })
  }
}

initAgeEventsMap()

// document.body.addEventListener('click', nextAge)
document.getElementById('next').addEventListener('click', nextAge)

// for (const age in ageData) {
//   const { event } = ageData[age]
//   event.forEach(eid => {
//     const eventInfo = `${eid}`.split('*')
//     const ageArr = eventsData[eventInfo[0]].age || []
//     ageArr.push(parseInt(age))
//     eventsData[eventInfo[0]].age = Array.from(new Set(ageArr))
//     eventsData[eventInfo[0]].weight = eventInfo.length > 1 ? parseFloat(eventInfo[1]) * 10000 : 10
//   })
// }
// for (const eid in eventsData) {
//   const item = eventsData[eid]
//   eventsData[eid] = {
//     noRandom: item.NoRandom, // 是否随机事件(true表示用于拼接的事件)
//     event: item.event,  // 事件文字
//     defaultResult: item.postEvent,
//     include: item.include,
//     exclude: item.exclude,
//     color: "#000", // 事件颜色
//     resultEvents: item.branch,
//     effect: item.effect, // 属性影响
//     weight: item.weight, // 事件权重（随机抽取事件时使用，及决定在多个达成条件必然发生的事件中的优先级）
//     age: item.age // 事件适龄
//   }

// }
// const str = JSON.stringify(eventsData).replaceAll(/[\(\)]/g, '')
// const blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
// const downLink = document.createElement('a')
// downLink.download = 'language.json'
// downLink.href = URL.createObjectURL(blob)
// document.body.appendChild(downLink)
// downLink.click()
// document.body.removeChild(downLink)

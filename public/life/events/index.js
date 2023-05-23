const player = {
  DefaultEvent: 10000,
  NextEvent: null,
  // 自更属性
  EVT: { 10002: [1], 10003: [2] }, // 历史事件
  TLT: { 1001: true, 1002: true }, // 天赋
  AGE: 10, // 年龄
  // 基础属性
  CHR: 5, // 颜值
  INT: 5, // 智力
  MNY: 6, // 家境
  STR: 6, // 体质
  // 额外属性
  HAP: 0, // 心情
  LIF: 1 // 是否活着
}

let AgeEventsMap = {}

const AgeEventsMap = [[10001, 10002], [10003, 10004]]

function transSingleJurdgement(command = '', player) {
  const { CHR, INT, MNY, STR, HAP } = player
  const isFalseCommand = command.includes('!')
  const isTrueCommand = command.includes('?')
  if (isFalseCommand || isTrueCommand) {
    const cmd = command.split(/[\?\!]/)
    const cond = JSON.parse(cmd[1])
    switch (cmd[0]) {
      case 'EVT':
      case 'TLT':
        for (let i = 0; i < cond.length; i++) {
          if ((isFalseCommand && player[cmd[0]][cond[i]]) || (isTrueCommand && !player[cmd[0]][cond[i]])) {
            return false
          }
        }
        return true
      case 'AGE':
        return (isFalseCommand && !cond.includes(player[cmd[0]])) || (isTrueCommand && cond.includes(player[cmd[0]]))
    }
  }
  return eval(command)
}

function transJurdgement(command, player) {
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
  let randNum = Math.random() * RandomTotalWeight
  for (let i = 0; i < RandomEvents.length; i++) {
    randNum -= EventsData[RandomEvents[i]].weight
    if (randNum <= 0) return RandomEvents[i]
  }
  return DefaultEvent
}

function execEvent(EventsData, eid, player, recur = false) {
  const _player = JSON.parse(JSON.stringify(player))
  const { AGE } = _player
  const { event, defaultResult, resultEvents, effect } = EventsData[eid]
  const desc = [event]
  _player.EVT[eid].push(AGE)
  if (effect) {
    for (const key in effect) {
      _player[key] += effect[key]
    }
  }
  if (resultEvents) {
    const resultEventEids = transResultJurdgement(resultEvents)
    if (resultEventEids.length > 0) {
      if (defaultResult || recur) {
        const resultExecRes = execEvent(EventsData, resultEventEids[0], _player, true)
        desc.push(...resultExecRes.desc)
        _player = resultExecRes.player
      } else {
        _player.NextEvent = resultEventEids[0]
      }
    } else if (resultEventEids.length === 0 && (defaultResult || recur)) {
      desc.push(defaultResult)
    }
  } else if (!resultEvents && (defaultResult || recur)) {
    desc.push(defaultResult)
  }
  return { player: _player, desc }
}

const EventDomProto = document.getElementById('EventDomProto')
const EventSingleDescDomProto = EventDomProto.getElementById('EventBox_Desc')

const nextAge = () => {
  player.EVT = updateEventsMap(player)
  const CurrentEventsMap = getCurrentEventsMap(EventsData, AgeEventsMap, player)
  const CurrentEvent = getCurrentEvent(EventsData, CurrentEventsMap, player)
  const ExecEventRes = execEvent(EventsData, CurrentEvent, player)
  player = ExecEventRes.player
  const EventDom = EventDomProto.cloneNode(true)
  EventDom.style.display = 'display'
  const EventDomRandomId = Math.random().toString(36).slice(2)
  EventDom.setAttribute('id', `${player.AGE}-${EventDomRandomId}`)
  ExecEventRes.desc.forEach((desc, index) => {
    const EventSingleDescDom = EventSingleDescDomProto.cloneNode(true)
    EventSingleDescDom.setAttribute('id', `${player.AGE}-${EventDomRandomId}-${index}`)
    EventSingleDescDom.innerHTML = desc
    EventDom.appendChild(EventSingleDescDom)
  })
}

const initAgeEventsMap = () => {
  for (const eid in EventsData) {
    EventsData[eid].forEach(age => {
      AgeEventsMap[age] = Array.from(new Set((AgeEventsMap[age] || []).push(age)))
    })
  }
}

initAgeEventsMap()

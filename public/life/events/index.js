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

/**  用例
 * CHR>4
 * CHR>4&INT===5
 * CHR>4|INT===5
 * CHR>4&INT===5|STR<7
 * CHR>4&INT===5|STR<7&MNY>5
 * EVT?[10002]
 * EVT![10002]
 * TLT?[1001]
 * TLT![1002]
 * AGE?[10,20]
 * AGE![10,20]
 * EVT?[10002]&INT===5
 * TLT?[1002]&INT===5
 * AGE![10,20]&INT===5
 * EVT?[10002]&INT===5|STR<7&MNY>5
 * ['CHR>4:11005']
 * */
// console.log(transJurdgement('CHR>4', player))
// console.log(transJurdgement('CHR>4&INT===5', player))
// console.log(transJurdgement('CHR>4|INT===5', player))
// console.log(transJurdgement('CHR>4&INT===5|STR<7', player))
// console.log(transJurdgement('CHR>4&INT===5|STR<7&MNY>5', player))
// console.log(transJurdgement('EVT?[10002]', player))
// console.log(transJurdgement('EVT![10002]', player))
// console.log(transJurdgement('TLT?[1001]', player))
// console.log(transJurdgement('TLT![1002]', player))
// console.log(transJurdgement('AGE?[10,20]', player))
// console.log(transJurdgement('AGE![10,20]', player))
// console.log(transJurdgement('EVT?[10002]&INT===5', player))
// console.log(transJurdgement('TLT?[1002]&INT===5', player))
// console.log(transJurdgement('AGE![10,20]&INT===5', player))
// console.log(transJurdgement('EVT?[10002]&INT===5|STR<7&MNY>5', player))
// console.log(transResultJurdgement(['CHR>4:11005'], player))

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

function execEvent(EventsData, eid, player) {
  const _player = JSON.parse(JSON.stringify(player))
  const { AGE } = _player
  const { resultEvents, effect } = EventsData[eid]
  _player.EVT[eid].push(AGE)
  if (effect) {
    for (const key in effect) {
      _player[key] += effect[key]
    }
  }
  let result = null
  if (resultEvents) {
    result = transResultJurdgement(resultEvents, player)[0]
  }
}

const initPlayer = {
  DefaultEvent: 10000,
  NextEvent: null,
  // 自更属性
  EVT: {}, // 历史事件
  TLT: {}, // 天赋
  AGE: 0, // 年龄
  preAGE: [], // 旧年龄
  // 基础属性
  CHR: 5, // 颜值
  INT: 5, // 智力
  MNY: 5, // 家境
  STR: 5, // 体质
  // 额外属性
  SPR: 5, // 心情
  LIF: 1 // 是否活着
}

let player = {}

const GameWindowDom = document.getElementById('GameWindow')
const StartButton = document.getElementById('start')
const CHRDom = document.getElementById('CHR')
const INTDom = document.getElementById('INT')
const MNYDom = document.getElementById('MNY')
const STRDom = document.getElementById('STR')
const SPRDom = document.getElementById('SPR')
const ContentBoxDom = document.getElementById('ContentBox')
const EventDomProto = document.getElementById('EventDomProto')
const EventSingleDescDomProto = EventDomProto.getElementsByClassName('EventBox-desc')[0]

const AgeEventsMap = []

// 通用函数

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
  const results = []
  commands.forEach(command => {
    const cmdArr = command.split(':')
    const JurdgementCmd = cmdArr[0]
    const Result = parseInt(cmdArr[1])
    transJurdgement(JurdgementCmd, player) && results.push(Result)
  })
  return results
}

function execEffect(effect, player) {
  const _player = JSON.parse(JSON.stringify(player))
  const { AGE } = _player
  for (const key in effect) {
    if (key === 'AGE') _player.preAGE.push(AGE)
    _player[key] += effect[key]
  }
  return _player
}

// 点数函数

let points = 20

// 天赋函数

const RareMap = [100, 80, 60, 10]
const RequireSelectTenantNum = 3
const MaxTenantChoices = 8

let TotalTenantWeight = 0
const RealTenantsMap = JSON.parse(JSON.stringify(TenantsData))
const RareTenantsMap = {} // 只记录tid
const TenantChoices = [] // 只记录tid
const SelectedExcludeTenants = {} // 只记录tid

const initTenantsMap = () => {
  for (const tid in RealTenantsMap) {
    const { rare, weight, effect } = RealTenantsMap[tid]
    const realWeight = RareMap[rare] + weight
    if (!RareTenantsMap[rare]) RareTenantsMap[rare] = []
    RareTenantsMap[rare].push(tid)
    RealTenantsMap[tid].realWeight = realWeight > 0 ? realWeight : 1
    RealTenantsMap[tid].effected = !effect
    TotalTenantWeight += RealTenantsMap[tid].realWeight
  }
}

const getTenantChoices = () => {
  const IncludeTenants = JSON.parse(JSON.stringify(RealTenantsMap))
  let TotalTenantWeightTmp = TotalTenantWeight
  for (let i = 0; i < MaxTenantChoices; i++) {
    let excludeTenants = []
    let randNum = parseInt(Math.random() * TotalTenantWeightTmp)
    for (const tid in IncludeTenants) {
      const { realWeight, exclude } = IncludeTenants[tid]
      randNum = randNum - realWeight
      if (randNum <= 0) {
        TenantChoices.push(tid)
        excludeTenants = exclude
        TotalTenantWeightTmp = TotalTenantWeightTmp - realWeight
        break
      }
    }
    excludeTenants.forEach(tid => {
      if (IncludeTenants[tid]) delete IncludeTenants[tid]
    })
  }
}

function selectTenants(selectedTenants = [], player) {
  // selectedTenants只包含tid
  if (selectedTenants.length < RequireSelectTenantNum) return
  let _player = JSON.parse(JSON.stringify(player))
  selectedTenants.forEach(tid => {
    const { exclude } = RealTenantsMap[tid]
    _player.TLT[tid] = JSON.parse(JSON.stringify(RealTenantsMap[tid]))
    if (exclude) {
      exclude.forEach(tid => {
        SelectedExcludeTenants[tid] = true
      })
    }
  })
  return _player
}

function replaceTenant(player) {
  let _player = JSON.parse(JSON.stringify(player))
  const { TLT } = _player
  const ReplaceTenantsMap = {} // 只记录oldTid-newTid
  for (const tid in TLT) {
    const { replacement } = TLT[tid]
    if (!replacement) continue
    const AltReplaceTenants = {} // 只记录tid-weight
    for (const ReplaceType in replacement) {
      if (ReplaceType === 'tenant') {
        let replaceTenantTotalWeight = 0
        const IncludeTenants = {}
        replacement[ReplaceType].forEach(tinfo => {
          const tenantInfo = tinfo.split('*')
          const rtid = parseInt(tenantInfo[0])
          const weight = parseInt(tenantInfo[1] || 1)
          if (!SelectedExcludeTenants[rtid]) {
            IncludeTenants[rtid] = weight
            replaceTenantTotalWeight += weight
          }
        })
        let randNum = parseInt(Math.random() * replaceTenantTotalWeight)
        for (const itid in IncludeTenants) {
          randNum = randNum - IncludeTenants[itid]
          if (randNum <= 0) {
            AltReplaceTenants[itid] = RealTenantsMap[itid].realWeight
            break
          }
        }
      } else if (ReplaceType === 'rare') {
        let TotalRareWeight = 0
        const RareWeightMap = {}
        replacement[ReplaceType].forEach(rinfo => {
          const rareInfo = rinfo.split('*')
          const rare = rareInfo[0]
          RareWeightMap[rare] = parseInt((rareInfo[1] || 1)) * RareMap[rare]
          TotalRareWeight += RareWeightMap[rare]
        })
        let rareRandNum = parseInt(Math.random() * TotalRareWeight)
        let RareTenants = []
        for (const rare in RareWeightMap) {
          rareRandNum -= RareWeightMap[rare]
          if (rareRandNum <= 0) {
            RareTenants.push(...RareTenantsMap[rare].filter(rtid => !!SelectedExcludeTenants[rtid]))
            break
          }
        }
        let RareTenantsTotalWeight = 0
        RareTenants.forEach(rtid => {
          RareTenantsTotalWeight += RealTenantsMap[rtid].realWeight
        })
        let randNum = parseInt(Math.random() * RareTenantsTotalWeight)
        for (let i = 0; i < RareTenants.length; i++) {
          const { realWeight } = RealTenantsMap[RareTenants[i]]
          randNum -= realWeight
          if (randNum <= 0) {
            AltReplaceTenants[RareTenants[i]] = realWeight
            break
          }
        }
      }
    }
    // random => ReplaceTenantsMap
    let TotalAltTenantWeight = 0
    for (const atid in AltReplaceTenants) {
      TotalAltTenantWeight+=AltReplaceTenants[atid]
    }
    let randNum = parseInt(Math.random() * TotalAltTenantWeight)
    for (const atid in AltReplaceTenants) {
      randNum-=AltReplaceTenants[atid]
      if (randNum<=0) {
        ReplaceTenantsMap[atid] = tid
        break
      }
    }
  }
  for (const tid in ReplaceTenantsMap) {
    // delete _player[tid]  // 不用删也可以
    _player.TLT[tid] = RealTenantsMap[tid]
  }
  return _player
}

const execTenantPoints = () => {
  const { TLT } = player
  for (const tid in TLT) {
    points = points + (TLT[tid].points || 0)
  }
}

function execTenantEffect(player) {
  let _player = JSON.parse(JSON.stringify(player))
  const { TLT } = _player
  for (const tid in TLT) {
    const { effect, effected, condition } = TLT[tid]
    if (effected) continue
    if (transJurdgement(condition, _player)) {
      _player = execEffect(effect, _player)
      _player.TLT[tid].effected = true
    }
  }
  return _player
}

// 事件函数

function updateEventsMap(player) {
  const { AGE, EVT } = player
  const _EVT = {}
  for (const eid in EVT) {
    const records = EVT[eid].filter(age => (age < AGE || age === player.preAGE.at(-1)))
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
  if (effect) _player = execEffect(effect, _player)
  if (resultEvents) {
    const resultEventEids = transResultJurdgement(resultEvents, player)
    if (resultEventEids.length > 0) {
      if (defaultResult || resultEventEids[0] === 10000 || recur) {
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

// 游戏函数

const gameover = () => {
  document.body.removeEventListener('click', nextAge)
  // document.getElementById('next').removeEventListener('click', nextAge)
}

const setPlayer = (_player) => {
  // for (const key in _player) {
  //   player[key] = _player[key]
  // }
  player = _player
  CHRDom.innerHTML = player.CHR
  INTDom.innerHTML = player.INT
  MNYDom.innerHTML = player.MNY
  STRDom.innerHTML = player.STR
  SPRDom.innerHTML = player.SPR
}

const nextAge = () => {
  if (!player) return
  player.AGE++
  player.EVT = updateEventsMap(player)
  const CurrentEventsMap = getCurrentEventsMap(EventsData, AgeEventsMap, player)
  const CurrentEvent = getCurrentEvent(EventsData, CurrentEventsMap, player)
  console.log(CurrentEvent)
  const ExecEventRes = execEvent(EventsData, CurrentEvent, player)
  setPlayer(ExecEventRes.player)
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
  ContentBoxDom.scrollTop = ContentBoxDom.scrollHeight - ContentBoxDom.clientHeight
}

const startGame = () => {
  StartButton.style.display = 'none'
  GameWindowDom.style.display = 'flex'
  initAgeEventsMap()
  setPlayer(JSON.parse(JSON.stringify(initPlayer)))
  CHRDom.innerHTML = player.CHR
  INTDom.innerHTML = player.INT
  MNYDom.innerHTML = player.MNY
  STRDom.innerHTML = player.STR
  SPRDom.innerHTML = player.SPR
  document.body.addEventListener('click', nextAge)
}

StartButton.addEventListener('click', startGame)
// document.getElementById('next').addEventListener('click', nextAge)


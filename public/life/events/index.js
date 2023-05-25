const initPlayer = {
  DefaultEvent: 10000,
  NextEvent: null,
  // 自更属性
  EVT: {}, // 历史事件
  TLT: {}, // 天赋
  AGE: 0, // 年龄
  preAGE: [], // 旧年龄
  // 基础属性
  CHR: 0, // 颜值
  INT: 0, // 智力
  MNY: 0, // 家境
  STR: 0, // 体质
  // 额外属性
  SPR: 5, // 心情
  LIF: 1 // 是否活着
}

let player = {}

const BaseAttribute = ['CHR', 'INT', 'MNY', 'STR']

const RareMap = [100, 80, 60, 10] // 天赋稀有度对应权重
const RequireSelectTalentNum = 3 // 天赋最大可选数量
const MaxTalentChoices = 8 // 天赋选项数量

let RealTalentsMap = JSON.parse(JSON.stringify(TalentsData)) // 真实天赋对象Map
let TotalTalentWeight = 0 // 天赋总权重
let RareTalentsMap = {} // 各自稀有度对应的天赋tid，只记录rare-tids
let SelectedExcludeTalents = {} // 只记录tid

let TalentChoices = {} // 天赋选项，只记录tid-isSelected
let SelectedTalentChoicesNum = 0 // 天赋选项，只记录tid-isSelected
let CurrentTalentChoicesDoms = [] // 天赋选项的Doms

const AgeEventsMap = [] // 年龄对应的事件集只记录age-eids

let points = 20 // 可用点数

const ReincarnationButton = document.getElementById('Reincarnation')
const TalentWindowDom = document.getElementById('TalentWindow')
const TalentChoicesBoxDom = document.getElementById('TalentChoicesBox')
const TalentItemProto = document.getElementById('TalentItemProto')
const ConfirmTalentButton = document.getElementById('ConfirmTalent')

const PointsWindowDom = document.getElementById('PointsWindow')
const LastPointsDom = document.getElementById('LastPoints')
const PointerValueDoms = {
  CHR: document.getElementById('PointsItem-CHR'),
  INT: document.getElementById('PointsItem-INT'),
  MNY: document.getElementById('PointsItem-MNY'),
  STR: document.getElementById('PointsItem-STR')
}
const PointsItemCHRDecreaseButton = document.getElementById('PointsItem-CHR-decrease')
const PointsItemINTDecreaseButton = document.getElementById('PointsItem-INT-decrease')
const PointsItemMNYDecreaseButton = document.getElementById('PointsItem-MNY-decrease')
const PointsItemSTRDecreaseButton = document.getElementById('PointsItem-STR-decrease')
const PointsItemCHRIncreaseButton = document.getElementById('PointsItem-CHR-increase')
const PointsItemINTIncreaseButton = document.getElementById('PointsItem-INT-increase')
const PointsItemMNYIncreaseButton = document.getElementById('PointsItem-MNY-increase')
const PointsItemSTRIncreaseButton = document.getElementById('PointsItem-STR-increase')

const ContentBoxDom = document.getElementById('ContentBox')
const GameWindowDom = document.getElementById('GameWindow')
const StartGameButton = document.getElementById('StartGame')
const CHRDom = document.getElementById('CHR')
const INTDom = document.getElementById('INT')
const MNYDom = document.getElementById('MNY')
const STRDom = document.getElementById('STR')
const SPRDom = document.getElementById('SPR')
const EventDomProto = document.getElementById('EventDomProto')
const EventSingleDescDomProto = EventDomProto.getElementsByClassName('EventBox-desc')[0]

const RestartGameButton = document.getElementById('RestartGame')

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
    let ekey = key
    if (key === 'AGE') _player.preAGE.push(AGE)
    if (key === 'RDM') {
      const randNum = parseInt(Math.random() * BaseAttribute.length)
      ekey = BaseAttribute[randNum]
    }
    _player[ekey] += effect[key]
  }
  return _player
}

// 天赋函数

const initTalentsMap = () => {
  // 初始化天赋相关参数
  RealTalentsMap = JSON.parse(JSON.stringify(TalentsData))
  TotalTalentWeight = 0
  RareTalentsMap = {}
  for (const tid in RealTalentsMap) {
    const { rare, weight, effect } = RealTalentsMap[tid]
    const realWeight = RareMap[rare] + weight
    if (!RareTalentsMap[rare]) RareTalentsMap[rare] = []
    RareTalentsMap[rare].push(tid)
    RealTalentsMap[tid].realWeight = realWeight > 0 ? realWeight : 1
    RealTalentsMap[tid].effected = !effect
    TotalTalentWeight += RealTalentsMap[tid].realWeight
  }
}

const clearTalentButtonListener = () => {
  CurrentTalentChoicesDoms.forEach(dom => {
    dom.removeEventListener('click', toggleTalentItem)
    dom.remove()
  })
  CurrentTalentChoicesDoms = []
}

const toggleTalentItem = (e) => {
  const tid = parseInt(e.currentTarget.getAttribute('data-id'))
  let selectedTalentNum = 0
  for (const tid in TalentChoices) selectedTalentNum += TalentChoices[tid]
  SelectedTalentChoicesNum = selectedTalentNum
  if (SelectedTalentChoicesNum >= RequireSelectTalentNum && !TalentChoices[tid]) return
  TalentChoices[tid] = !TalentChoices[tid]
  SelectedTalentChoicesNum = SelectedTalentChoicesNum + (TalentChoices[tid] ? 1 : -1)
  e.currentTarget.setAttribute('class', `talentBox-item ${TalentChoices[tid] ? 'talentBox-item--selected' : ''}`)
}

const getTalentChoices = () => {
  ReincarnationButton.style.display = 'none'
  clearTalentButtonListener()
  TalentChoices = {}
  initTalentsMap()
  const IncludeTalents = JSON.parse(JSON.stringify(RealTalentsMap))
  let TotalTalentWeightTmp = TotalTalentWeight
  const excludeTalents = []
  for (let i = 0; i < MaxTalentChoices; i++) {
    let randNum = parseInt(Math.random() * TotalTalentWeightTmp)
    for (const tid in IncludeTalents) {
      const { name, description, realWeight, exclude } = IncludeTalents[tid]
      randNum = randNum - realWeight
      if (randNum <= 0) {
        excludeTalents.push(...(exclude || []), tid)
        TotalTalentWeightTmp = TotalTalentWeightTmp - realWeight
        TalentChoices[tid] = false
        // 更新html
        const TalentDomRandomId = Math.random().toString(36).slice(2)
        const TalentItemDom = TalentItemProto.cloneNode(true)
        TalentItemDom.setAttribute('id', `talentItem-${tid}-${TalentDomRandomId}`)
        TalentItemDom.setAttribute('data-id', tid)
        TalentItemDom.style.display = 'flex'
        const TalentNameDom = TalentItemDom.getElementsByClassName('talentBox-item-name')[0]
        const TalentDescDom = TalentItemDom.getElementsByClassName('talentBox-item-desc')[0]
        TalentNameDom.innerHTML = name
        TalentDescDom.innerHTML = description
        TalentItemDom.addEventListener('click', toggleTalentItem)
        TalentChoicesBoxDom.appendChild(TalentItemDom)
        CurrentTalentChoicesDoms.push(TalentItemDom)
        TalentWindowDom.style.display = 'flex'
        break
      }
    }
    excludeTalents.forEach(tid => {
      if (IncludeTalents[tid]) {
        TotalTalentWeightTmp = TotalTalentWeightTmp - IncludeTalents[tid].realWeight
        delete IncludeTalents[tid]
      }
    })
  }
  ConfirmTalentButton.style.display = 'flex'
}

function replaceTalent(player) {
  const _player = JSON.parse(JSON.stringify(player))
  const { TLT } = _player
  const ReplaceTalentsMap = {} // 只记录oldTid-newTid
  for (const tid in TLT) {
    const { replacement } = TLT[tid]
    if (replacement) {
      const AltReplaceTalents = {} // 只记录tid-weight
      for (const ReplaceType in replacement) {
        if (ReplaceType === 'talent') {
          let replaceTalentTotalWeight = 0
          const IncludeTalents = {}
          replacement[ReplaceType].forEach(tinfo => {
            const talentInfo = `${tinfo}`.split('*')
            const rtid = parseInt(talentInfo[0])
            const weight = parseInt(talentInfo[1] || 1)
            if (!SelectedExcludeTalents[rtid]) {
              IncludeTalents[rtid] = weight
              replaceTalentTotalWeight += weight
            }
          })
          let randNum = parseInt(Math.random() * replaceTalentTotalWeight)
          for (const itid in IncludeTalents) {
            randNum = randNum - IncludeTalents[itid]
            if (randNum <= 0) {
              AltReplaceTalents[itid] = RealTalentsMap[itid].realWeight
              break
            }
          }
        } else if (ReplaceType === 'rare') {
          let TotalRareWeight = 0
          const RareWeightMap = {}
          replacement[ReplaceType].forEach(rinfo => {
            const rareInfo = `${rinfo}`.split('*')
            const rare = rareInfo[0]
            RareWeightMap[rare] = parseInt((rareInfo[1] || 1)) * RareMap[rare]
            TotalRareWeight += RareWeightMap[rare]
          })
          let rareRandNum = parseInt(Math.random() * TotalRareWeight)
          const RareTalents = []
          for (const rare in RareWeightMap) {
            rareRandNum -= RareWeightMap[rare]
            if (rareRandNum <= 0) {
              RareTalents.push(...RareTalentsMap[rare].filter(rtid => !!SelectedExcludeTalents[rtid]))
              break
            }
          }
          let RareTalentsTotalWeight = 0
          RareTalents.forEach(rtid => {
            RareTalentsTotalWeight += RealTalentsMap[rtid].realWeight
          })
          let randNum = parseInt(Math.random() * RareTalentsTotalWeight)
          for (let i = 0; i < RareTalents.length; i++) {
            const { realWeight } = RealTalentsMap[RareTalents[i]]
            randNum -= realWeight
            if (randNum <= 0) {
              AltReplaceTalents[RareTalents[i]] = realWeight
              break
            }
          }
        }
      }
      // random => ReplaceTalentsMap
      let TotalAltTalentWeight = 0
      for (const atid in AltReplaceTalents) {
        TotalAltTalentWeight += AltReplaceTalents[atid]
      }
      let randNum = parseInt(Math.random() * TotalAltTalentWeight)
      for (const atid in AltReplaceTalents) {
        randNum -= AltReplaceTalents[atid]
        if (randNum <= 0) {
          ReplaceTalentsMap[atid] = tid
          break
        }
      }
    }
  }
  for (const tid in ReplaceTalentsMap) {
    // delete _player[tid]  // 不用删也可以
    _player.TLT[tid] = RealTalentsMap[tid]
  }
  return _player
}

const execTalentPoints = () => {
  const { TLT } = player
  for (const tid in TLT) {
    points = points + (TLT[tid].points || 0)
  }
}

const confirmTalentSelections = () => {
  if (SelectedTalentChoicesNum < RequireSelectTalentNum) {
    alert(`请选择3个天赋(${SelectedTalentChoicesNum})`)
    return
  }
  ConfirmTalentButton.style.display = 'none'
  SelectedExcludeTalents = {}
  let _player = JSON.parse(JSON.stringify(initPlayer))
  for (const tid in TalentChoices) {
    if (TalentChoices[tid]) {
      const { exclude } = RealTalentsMap[tid]
      _player.TLT[tid] = JSON.parse(JSON.stringify(RealTalentsMap[tid]))
      if (exclude) {
        exclude.forEach(tid => {
          SelectedExcludeTalents[tid] = true
        })
      }
    }
  }
  TalentWindowDom.style.display = 'none'
  _player = replaceTalent(_player)
  setPlayer(JSON.parse(JSON.stringify(_player)))
  execTalentPoints()
  initPointer()
}

function execTalentEffect(player) {
  let _player = JSON.parse(JSON.stringify(player))
  const { TLT } = _player
  for (const tid in TLT) {
    const { effect, effected, condition } = TLT[tid]
    if (effected) continue
    if ((effect && !condition) || (condition && transJurdgement(condition, _player))) {
      _player = execEffect(effect, _player)
      _player.TLT[tid].effected = true
    }
  }
  return _player
}

// 点数函数

const initPointer = () => {
  LastPointsDom.innerHTML = points
  for (const type in PointerValueDoms) {
    PointerValueDoms[type].innerHTML = player[type]
  }
  PointsWindowDom.style.display = 'flex'
  StartGameButton.style.display = 'flex'
}

const increasePoint = (e) => {
  const CurDom = e.currentTarget
  const type = CurDom.getAttribute('data-type')
  if (points > 0) {
    player[type]++
    points--
    LastPointsDom.innerHTML = points
    PointerValueDoms[type].innerHTML = player[type]
  }
}

const decreasePoint = (e) => {
  const CurDom = e.currentTarget
  const type = CurDom.getAttribute('data-type')
  if (player[type] > 0) {
    player[type]--
    points++
    LastPointsDom.innerHTML = points
    PointerValueDoms[type].innerHTML = player[type]
  }
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
  const RandomEvents = {}
  let RandomTotalWeight = 0
  const CertainEvents = []
  for (let i = 0; i < AgeEvents.length; i++) {
    const EventInfo = AgeEvents[i].split('*')
    const eid = EventInfo[0]
    const EventExtraWeight = parseInt(EventInfo[1] || 1)
    const { include, exclude, certainly } = EventsData[eid]
    if (
      // 没有排除条件 或 不符合排除条件
      (!exclude || !transJurdgement(exclude, player)) &&
      // 没有执行条件 或 符合执行条件
      (!include || transJurdgement(include, player))
    ) {
      if (certainly) {
        CertainEvents.push(eid)
        continue
      }
      const EventRealWeight = EventsData[eid].weight * EventExtraWeight
      RandomEvents[eid] = EventRealWeight
      RandomTotalWeight += EventRealWeight
    }
  }
  CertainEvents.sort((a, b) => EventsData[b].weight - EventsData[a].weight)
  return { RandomEvents, CertainEvents, RandomTotalWeight }
}

function getCurrentEvent({ RandomEvents = {}, CertainEvents = [], RandomTotalWeight = 0 }, player) {
  const { DefaultEvent, NextEvent } = player
  if (NextEvent) return NextEvent
  if (CertainEvents.length > 0) return CertainEvents[0]
  if (JSON.stringify(RandomEvents) === '{}') return DefaultEvent
  let randNum = parseInt(Math.random() * RandomTotalWeight)
  for (const eid in RandomEvents) {
    randNum -= RandomEvents[eid]
    if (randNum <= 0) return eid
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
    if (EventsData[eid].age) {
      EventsData[eid].age.forEach(ageInfo => {
        const AgeInfoArr = ageInfo.split('*')
        const age = AgeInfoArr[0]
        const AgeWeight = AgeInfoArr[1] || 0
        const ageEvents = AgeEventsMap[age] || []
        ageEvents.push(`${eid}${AgeInfoArr[1] ? '*' + AgeInfoArr[1] : ''}`)
        AgeEventsMap[age] = Array.from(new Set(ageEvents))
      })
    }
  }
}

// 游戏函数

const gameover = () => {
  document.body.removeEventListener('click', nextAge)
  RestartGameButton.style.display = 'flex'
}

const setPlayer = (_player) => {
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
  player = execTalentEffect(player)
  player.EVT = updateEventsMap(player)
  const CurrentEventsMap = getCurrentEventsMap(EventsData, AgeEventsMap, player)
  const CurrentEvent = getCurrentEvent(CurrentEventsMap, player)
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
  if (points > 0) {
    alert(`还有${points}点数没加完`)
    return
  }
  StartGameButton.style.display = 'none'
  PointsWindowDom.style.display = 'none'
  GameWindowDom.style.display = 'flex'
  initAgeEventsMap()
  CHRDom.innerHTML = player.CHR
  INTDom.innerHTML = player.INT
  MNYDom.innerHTML = player.MNY
  STRDom.innerHTML = player.STR
  SPRDom.innerHTML = player.SPR
  document.body.addEventListener('click', nextAge)
}

const restartGame = () => {
  RestartGameButton.style.display = 'none'
  ReincarnationButton.style.display = 'flex'
}

// 启动程序
ReincarnationButton.style.display = 'flex'
ReincarnationButton.addEventListener('click', getTalentChoices)
ConfirmTalentButton.addEventListener('click', confirmTalentSelections)
PointsItemCHRDecreaseButton.addEventListener('click', decreasePoint)
PointsItemINTDecreaseButton.addEventListener('click', decreasePoint)
PointsItemMNYDecreaseButton.addEventListener('click', decreasePoint)
PointsItemSTRDecreaseButton.addEventListener('click', decreasePoint)
PointsItemCHRIncreaseButton.addEventListener('click', increasePoint)
PointsItemINTIncreaseButton.addEventListener('click', increasePoint)
PointsItemMNYIncreaseButton.addEventListener('click', increasePoint)
PointsItemSTRIncreaseButton.addEventListener('click', increasePoint)
StartGameButton.addEventListener('click', startGame)
RestartGameButton.addEventListener('click', restartGame)

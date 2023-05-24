# 基础信息

## id定义

Telents: 四位数

Events: 五位数

---

## 事件属性

```js
[EventId]: {
  noRandom: Boolean, // 是否随机事件(true表示用于拼接的事件)
  event: String,  // 事件文字
  defaultResult: String,
  include: Jurgement,
  exclude: Jurgement,
  color: String, // 事件颜色
  resultEvents: [Jurgement:Event],
  effect: {}, // 属性影响

  weight: Number, // 事件权重（随机抽取事件时使用，及决定在多个达成条件必然发生的事件中的优先级）
  age: [] // 事件适龄
}
```

## 天赋属性

```js
[TenantId]:{
  name: String, // 天赋名称
  description: String, // 天赋描述
  rare: Number, // 天赋稀有度
  weight: Number, // 天赋额外权重
  exclude: Array(TenantId), // 互斥天赋 (选取可选天赋过程中，存在这些天赋时，该天赋不纳入其中)
  points: Number, // 天赋额外追加的初始点数
  effect: {}, // 天赋影响
  condition: Jurgement, // 天赋影响触发条件 (每回合均需进行判定)
  replacement: { // 天赋替换
    tenant: Array(TenantId*weight), // 按天赋限定列表进行权重随机
    rare: Array(TenantRare*weight) // 按稀有度进行随机 (非exclude的天赋)
  }
}
```

<!-- TenantRareMap -->
<!-- Tenant Exclude for Replacement And Get Tenant Choices -->
<!-- Tenant Effect for Player Before The Event -->

### rare 解析

事件/天赋的稀有度字段，不同的字段对应不同的主色或权重

[天赋总权重] = [稀有度基础权重] + [天赋额外权重]

补充逻辑: [天赋总权重]<=0 时，[天赋总权重]将被替换为 1

[Rare-Weight]Map数据结构:

```js
{
  [Rare1]: Number,
  ...
}
```

### include 解析

达成条件的，才能执行该事件

### exclude 解析

达成条件的，排除该事件

* 一般为 EVT? 或 TLT?

---

## Jurgement语法

* 普通的判断语句，如 a>1 b===1 等
* EVT?['eid1', 'eid2'] 表示发生过的事件包含eid1和eid2时，为true
* EVT!['eid1', 'eid2'] 表示没有发生过eid1和eid2时，为true
* AGE![10, 20] 表示不为10岁或20岁
* AGE?[10, 20] 表示恰满10岁或20岁
* TLT!['tid1', 'tid2'] 表示不存在天赋tid1和tid2时，为true
* TLT?['tid1', 'tid2'] 表示存在天赋tid1和tid2时，为true
* 多条判断语句，以 [|] 或 [&] 分隔，分别代表 [或] 和 [且]
* 每个判断语句须用括号()括起

### Jurgement:Event

* 符合条件则执行该事件

* 存在defaultResult的，则作为当前事件的补充文案，否则顺延为下一年的[顺延事件]

---

# 总体思路

## 数据结构

### 构建事件池

* 根据年龄引入[noRandom]为false的事件，从原始事件池排列组合获得

数据结构：

```js
{
  [age]: [eid, ...],
  ...
}
```

### 特殊事件池 - 被动事件池

[noRandom]为true的事件池，从原始事件池过滤获得

### 历史事件池 - EVT

已发送事件池，记录有该事件曾发生的年龄

数据结构：

```js
{
  [eid]: [age, ...],
  ...
}
```

---

## 回合逻辑

### 更新历史事件池

* for - [eid] - [EVT];
  * 判断[EVT][eid]是否存在 [age]>=[AGE] 的年龄记录;
  * [是] 移除 [age]>=[AGE] | [age]===[AGE] 的记录;
  * 判断是否[EVT][eid].length是否为0;
    * [是] 移除该[EVT][eid];
  * [否] [continue];

### 获取当前事件池

根据年龄从事件池中，取出对应当前年龄的事件池，并逐个进行include及exclude判断，将符合include的事件以certainly及weight进行排序（certainly排序优先级最高）

* [EventsTmp] = [Events][AGE] - [ExcludeEvents] - ![IncludeEvents];
* while - [EventsTmp] - item符合[include];
  * [是] 判断是否为[certainly]事件;
    * [是] [event]放入[CurrentCertainlyEvents];
    * [否] [event]放入[CurrentEvents];
  * [否] [continue];
* [CurrentCertainlyEvents].sort();

**注:[CurrentEvents]无需排序，从weight总和中获取随机数，按顺序减除每一个事件的weight，差值出现首个负数时，即可代表抽中了此事件**

### 获取回合事件

* 判断是否存在[顺延事件];
  * [是] [event] = [顺延事件];
  * [否] 判断是否存在[CurrentCertainlyEvents];
    * [是] [event] = [CurrentCertainlyEvents][0];
    * [否] [event] = [CurrentEvents][random];

### 执行回合事件

  * 清空[顺延事件]
  * 添加事件记录 -> 更新[EVT][eid].push([AGE]);
  * 执行[effect] -> 更新玩家属性;
  * 判断是否存在[resultEvents];
    * [是] 判断是否能够按顺序获取一个满足条件的[resultEvent];
      * [是] 判断是否存在[defaultResult]或[resultEvent]为[死亡事件-1000];
        * [是] 将[resultEvent]拼接于当前事件，并[recur] - [resultEvent];
        * 拼接[事件描述];
        * [否] 将[resultEvent]作为[顺延事件];
      * [否] 判断是否存在[defaultResult];
        * [是] 拼接[defaultResult];
    * [否] 判断是否存在[defaultResult];
      * [是] 拼接[defaultResult];
  * 事件内容DOM插入HTML

#### 岁数反转

* 变更[AGE]

---

## 天赋逻辑

### 生成真实天赋池/天赋稀有池

根据稀有度划分天赋池，用于天赋变异

**此处顺便获取了天赋总权重，及计算了每个天赋的真实权重**

数据结构:

```js
{
  [rare1]: [TenantId, ...],
  ...
}
```
逻辑:

  * [RealTenantsMap] = [Tenants]
  * for - [tid] - [Tenants]
    * [RareTenantsMap][Rare].push(tid)
    * [TotalTenantWeight] += [Rare]
    * [RealTenantsMap][tid].realWeight = ([RareWeightMap][Rare] + [Tenant].weight) | 1 -> RealRare<=0时，替换为1

### 获取天赋选项

默认获取8个天赋选项

* [includeTenants] = [RealTenantsMap]
* [TotalWeightTmp] = [TotalWeight]
* for - [8] - [index]
  * [TenantChoices].push([includeTenants][random])
  * [includeTenants] = [includeTenants] - [includeTenants][random].exclude
  * [TotalWeightTmp] = [TotalWeightTmp] - [includeTenants][random].realWeight

### 确认已选天赋

生成已选天赋的ExcludeTenantsMap

新建天赋对象 - 含有effected标记，表示天赋影响effect已生效过

  * for - [tid] - [SelectedTenants]
    * [TLT][tid] = [Tenants][tid]
    * [TLT][tid].effected = ![TLT][tid].effect
    * [ExcludeTenantsMap] = [ExcludeTenantsMap] + [TLT].exclude

### 天赋变异

  * [ReplaceTenantMap] = {}
  * for - [tid] - [TLT]
    * 判断 [TLT][tid] 是否存在 [replacement]
      * [是] [AltReplaceTenants] = []
      * for - [ReplaceType] - [replacement]
        * switch - [ReplaceType]
          * case 'tenant'
            * [includeTenants] = [tenant] - [ExcludeTenantsMap]
            * [AltReplaceTenants].push([includeTenants][random]) -> 根据[replacement][tenant]内配的weight随机
          * case 'rare'
            * [Rare] = [rare][random] -> rare根据 [稀有度基础权重] 去随机稀有类型
            * [includeRareTenantsMap] = [TenantRareMap][Rare] - [ExcludeTenantsMap]
            * [AltReplaceTenants].push([includeRareTenantsMap][random]) -> 根据realWeight随机
      * [ReplaceTenantMap][tid] = [AltReplaceTenants][random] -> 根据realWeight随机
      * [否] [continue]
  * for - [tid] - [ReplaceTenantMap]
    * [TLT] = [TLT] - [TLT][tid] + [ReplaceTenantMap][tid]

### 天赋初始点数生效

 * for - [tid] - [TLT]
   * 判断 [TLT][tid] 是否存在 [points]
     * [是] [InitPoints] = [InitPoints] + [points]
     * [否] [continue]

### 天赋影响生效

每回合均须进行判定

* for - [tid] - [TLT]
  * [是]判断 [TLT][tid].effected 是否为 [false]
    * [是] 判断当前[Player]是否符合 [condition]
      * [是] 执行[effect]
      * [否] [continue]
    * [否] [continue]

---

# 附录

## 测试用例

```js
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
console.log(transJurdgement('CHR>4', player))
console.log(transJurdgement('CHR>4&INT===5', player))
console.log(transJurdgement('CHR>4|INT===5', player))
console.log(transJurdgement('CHR>4&INT===5|STR<7', player))
console.log(transJurdgement('CHR>4&INT===5|STR<7&MNY>5', player))
console.log(transJurdgement('EVT?[10002]', player))
console.log(transJurdgement('EVT![10002]', player))
console.log(transJurdgement('TLT?[1001]', player))
console.log(transJurdgement('TLT![1002]', player))
console.log(transJurdgement('AGE?[10,20]', player))
console.log(transJurdgement('AGE![10,20]', player))
console.log(transJurdgement('EVT?[10002]&INT===5', player))
console.log(transJurdgement('TLT?[1002]&INT===5', player))
console.log(transJurdgement('AGE![10,20]&INT===5', player))
console.log(transJurdgement('EVT?[10002]&INT===5|STR<7&MNY>5', player))
console.log(transResultJurdgement(['CHR>4:11005'], player))
```

---

## 转化原版数据
```js
for (const age in ageData) {
  const { event } = ageData[age]
  event.forEach(eid => {
    const eventInfo = `${eid}`.split('*')
    const ageArr = eventsData[eventInfo[0]].age || []
    ageArr.push(parseInt(age))
    eventsData[eventInfo[0]].age = Array.from(new Set(ageArr))
    eventsData[eventInfo[0]].weight = eventInfo.length > 1 ? parseFloat(eventInfo[1]) * 10000 : 10
  })
}
for (const eid in eventsData) {
  const item = eventsData[eid]
  eventsData[eid] = {
    noRandom: item.NoRandom, // 是否随机事件(true表示用于拼接的事件)
    event: item.event,  // 事件文字
    defaultResult: item.postEvent,
    include: item.include,
    exclude: item.exclude,
    color: "#000", // 事件颜色
    resultEvents: item.branch,
    effect: item.effect, // 属性影响
    weight: item.weight, // 事件权重（随机抽取事件时使用，及决定在多个达成条件必然发生的事件中的优先级）
    age: item.age // 事件适龄
  }
}
const str = JSON.stringify(eventsData).replaceAll(/[\(\)]/g, '')
const blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
const downLink = document.createElement('a')
downLink.download = 'language.json'
downLink.href = URL.createObjectURL(blob)
document.body.appendChild(downLink)
downLink.click()
document.body.removeChild(downLink)
```
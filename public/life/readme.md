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

  certainly: Boolean, // 满足条件必然发生
  weight: Number, // 事件权重（随机抽取事件时使用，及决定在多个达成条件必然发生的事件中的优先级）
  age: [] // 事件适龄
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

#### 更新历史事件池

* for - [eid] - [EVT];
  * 判断[EVT][eid]是否存在 [age]>=[AGE] 的年龄记录;
  * [是] 移除 [age]>=[AGE] 的记录;
  * 判断是否[EVT][eid].length是否为0;
    * [是] 移除该[EVT][eid];
  * [否] [continue];

#### 获取当前事件池

根据年龄从事件池中，取出对应当前年龄的事件池，并逐个进行include及exclude判断，将符合include的事件以certainly及weight进行排序（certainly排序优先级最高）

* [EventsTmp] = [Events][AGE] - [ExcludeEvents];
* while - [EventsTmp] - item符合[include];
  * [是] 判断是否为[certainly]事件;
    * [是] [event]放入[CurrentCertainlyEvents];
    * [否] [event]放入[CurrentEvents];
  * [否] [continue];
* [CurrentCertainlyEvents] - sort;

**注:[CurrentEvents]无需排序，从weight总和中获取随机数，按顺序减除每一个事件的weight，差值出现首个负数时，即可代表抽中了此事件**

#### 获取回合事件

* 判断是否存在[顺延事件];
  * [是] [event] = [顺延事件];
  * [否] 判断是否存在[CurrentCertainlyEvents];
    * [是] [event] = [CurrentCertainlyEvents][0];
    * [否] [event] = [CurrentEvents][random];

#### 执行回合事件

  * 添加事件记录 -> 更新[EVT][eid].push([AGE]);
  * 执行[effect] -> 更新玩家属性;
  * 判断是否存在[resultEvents];
    * [是] 判断是否能够按顺序获取一个满足条件的[resultEvent];
      * [是] 判断是否存在[defaultResult];
        * [是] 将[resultEvent]拼接于当前事件，并[recur] - [resultEvent];
        * [否] 将[resultEvent]作为[顺延事件];
      * [否] 判断是否存在[defaultResult];
        * [是] 拼接[defaultResult];
    * [否] 判断是否存在[defaultResult];
      * [是] 拼接[defaultResult];
      * [否] 跳过当前[resultEvents]步骤;
  * 事件内容DOM插入HTML

#### 岁数反转

* 变更[AGE]
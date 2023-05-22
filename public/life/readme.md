## id定义

Telents: 四位数

Events: 五位数

## 事件属性

```js
[EventId]: {
  noRandom: Boolean, // 是否随机事件(true表示用于拼接的事件)
  event: String,  // 事件文字
  defaultEvent: String,
  include: Jurgement,
  exclude: Jurgement,
  color: String, // 事件颜色
  resultEvents: [Jurgement:Event],
  effect: {}, // 属性影响
}
```

## Jurgement语法

* 普通的判断语句，如 a>1&&b>0||a<1 等

* EVT?['eid1', 'eid2'] 表示发生过的事件包含eid1和eid2时，为true

* EVT!['eid1', 'eid2'] 表示没有发生过eid1和eid2时，为true

* AGE![10, 20] 表示不为10岁或20岁

* AGE?[10, 20] 表示恰满10岁或20岁

* 多条判断语句，以 [|] 或 [&] 分隔，分别代表 [或] 和 [且]

* 每个判断语句须用括号()括起

### Jurgement:Event

* 符合条件则执行该事件

* 存在defaultEvent的，则作为当前事件的补充文案，否则顺延为下一年的[顺延事件]

## include 解析

达成条件的，才能执行该事件

## exclude 解析

达成条件的，排除该事件

* 一般为 EVT? 或 TLT?

---

# 总体思路

完整集合 -> 逐步排除可发生事件

## 逻辑

### 构建事件池

* 根据年龄引入事件
* 根据天赋引入事件
* 事件池迭代 - 根据exlude排除事件

### 特殊事件池 - 被动事件池

noRandom为true的事件池

### exclude表

被排除的事件表

### 回合逻辑

#### 获取回合事件

* 判断是否存在[顺延事件]
  * [是] [CurrentEvent] = [顺延事件]
  * [否] 随机获取事件池任一事件
  * while - [event]是否符合include
    * [是] [CurrentEvent] = [event]; [break];
    * [否] [continue];

#### 执行回合事件

  * 执行exclude;
  * 执行effect;
  * 是否存在resultEvents;
    * [是] 获取一个满足条件的resultEvent;
    * 是否存在defaultEvent;
      * [是] 将resultEvent拼接于当前事件，并[recur]resultEvent;
      * [否] 将resultEvent作为[顺延事件];
    * [否] 是否存在defaultEvent;
      * [是] 拼接defaultEvent;
      * [否] -

#### 岁数反转

重置[事件池]和[exclude表]
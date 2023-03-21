const events = {}

// 将自定义事件转换
{
  const event = { ...this.eventObj }
  event.text = eval(event.text)

  events[event.key] = event
}

export default events

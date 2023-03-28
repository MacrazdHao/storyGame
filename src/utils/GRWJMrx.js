export class Oscilloscope {
  constructor({ fftSize = 1024, audioContext, sourceNode }) {
    this.destroyed = false
    this.canvases = []
    this.sourceNode = sourceNode
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftSize = fftSize
    console.log('fft size', fftSize)
    console.log('buffer length', this.analyser.frequencyBinCount)
    sourceNode.connect(this.analyser)
    requestAnimationFrame(this.plot.bind(this))
  }
  plot() {
    if (this.destroyed) {
      return
    }
    const bufferLength = this.analyser.frequencyBinCount
    const timeDomainDataArray = new Uint8Array(bufferLength)
    const frequencyDomainDataArray = new Uint8Array(bufferLength)
    this.analyser.getByteTimeDomainData(timeDomainDataArray)
    this.analyser.getByteFrequencyData(frequencyDomainDataArray)
    for (const item of this.canvases) {
      if (item.type === 'time') {
        this.drawTimeDomainCanvas(timeDomainDataArray, item.canvas)
      }
      if (item.type === 'frequency') {
        this.drawFrequencyDomainCanvas(frequencyDomainDataArray, item.canvas)
      }
    }
    requestAnimationFrame(this.plot.bind(this))
  }
  drawTimeDomainCanvas(dataArray, canvas) {
    const bufferLength = dataArray.length
    const canvasContext = canvas.getContext('2d')
    canvas.width = bufferLength
    canvas.height = 300
    if (!canvasContext) {
      return
    }
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.lineWidth = 2
    canvasContext.strokeStyle = '#00BCD4'
    canvasContext.beginPath()
    const sliceWidth = canvas.width / bufferLength
    let x = 0
    for (const item of dataArray) {
      let y = item / 128
      y = y * canvas.height / 2
      canvasContext.lineTo(x, y)
      x += sliceWidth
    }
    canvasContext.stroke()
  }
  drawFrequencyDomainCanvas(dataArray, canvas) {
    const bufferLength = dataArray.length
    const canvasContext = canvas.getContext('2d')
    canvas.width = bufferLength
    canvas.height = 300
    if (!canvasContext) {
      return
    }
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = '#00BCD4'
    const gap = 1
    const barWidth = canvas.width * 2 / bufferLength
    let barHeight = 0
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (canvas.height - 40) * (dataArray[i] || 1) / 255
      canvasContext.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight)
      x += barWidth + gap
    }
  }
  addCanvas(canvas, type) {
    const index = this.canvases.push({
      type,
      canvas
    })
    return () => this.canvases.splice(index, 1)
  }
  destroy() {
    this.destroyed = true
    this.canvases.length = 0
    this.sourceNode.disconnect(this.analyser)
    this.analyser.disconnect()
  }
}

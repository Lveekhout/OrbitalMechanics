const pi = Math.PI
const sin = Math.sin
const cos = Math.cos
const min = Math.min
const max = Math.max
const sqrt = Math.sqrt

let camera
let track

let animating = false
let tStart
let tCurrent

let carArray = []
let intervalArray = []

window.onload = () => {
    camera = new Camera(document.querySelector('canvas'))
    track = new Track(camera)
    carArray = generateCars()
    start()
    startInterval()
    startFirst()
}

const start = () => {
    if (!animating) {
        animating = true
        window.requestAnimationFrame(init)
    } else throw "Already started!!!"
}

const stop = () => {
    animating = false
}

const init = ms => {
    tStart = tCurrent = ms
    window.requestAnimationFrame(loop)
}

const loop = ms => {
    if (animating) window.requestAnimationFrame(loop)

    camera.preDraw()

    const ds = (ms - tCurrent) / 1000 // delta seconds
    tCurrent = ms

    track.draw()
    track.update(ds)

    carArray.forEach(car => {
        car.draw()
        car.update(ds)
    })

    camera.postDraw()

    camera.ctx.fillText(((ms - tStart) / 1000).toFixed(6), 10, 10)
    camera.ctx.fillText(`s = ${carArray[0].s.toFixed(6)}`, 10, 30)
    camera.ctx.fillText(`v = ${carArray[0].v.toFixed(6)}`, 10, 42)
    camera.ctx.fillText(`a = ${carArray[0].a.toFixed(6)}`, 10, 54)
}
const generateCars = () => {
    const result = []
    result.push(new Car(camera, track))
    result[0].v = 0

    const aantal = 16
    for (let i = 1; i < aantal; i++) {
        result.push(new Car(camera, track))
        result[i].s = -(2 * pi * i / aantal) * (200 / pi / 2)
        result[i].v = 0
        result[i].reaction = 1000 + random(300)
        result[i].color = 'blue'
    }
    return result
}

const startInterval = () => {
    for (let i = 1; i < carArray.length; i++) {
        setInterval(() => carArray[i].decide(carArray[i-1].s - 5, carArray[i-1].v), carArray[i].reaction)
    }
}

const startFirst = () => {
    const l = carArray.length - 1
    setInterval(() => carArray[0].decide(carArray[l].s - 5 + track.length, carArray[l].v), carArray[0].reaction)
}

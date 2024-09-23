const pi = Math.PI
const sin = Math.sin
const cos = Math.cos
const abs = Math.abs
const min = Math.min
const max = Math.max
const sqrt = Math.sqrt

let camera
let track
let car

let animating = false
let tStart
let tCurrent

window.onload = e => {
    camera = new Camera(document.querySelector('canvas'))
    track = new Track(camera)
    car = new Car(camera, track)
    start()
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

    car.draw()
    car.update(ds)

    camera.postDraw()

    camera.ctx.fillText(((ms - tStart) / 1000).toFixed(6), 10, 10)
    camera.ctx.fillText(`s = ${car.s.toFixed(6)}`, 10, 30)
    camera.ctx.fillText(`v = ${car.v.toFixed(6)}`, 10, 42)
    camera.ctx.fillText(`a = ${car.a.toFixed(6)}`, 10, 54)
}

// const run = () => { // Voor track.length = 1000
//     car.blip = 1
//     car.a = 1000/35
//     setTimeout(() => {
//         car.blip = 1
//         car.a = 0
//     }, 5000)
//     setTimeout(() => {
//         car.blip = 1
//         car.a = -1000/7
//     }, 9000)
//     setTimeout(() => {
//         car.blip = 1
//         car.a = 0
//     }, 10000)
// }

const run = () => {
    car.a = 20 / 3
    setTimeout(() => car.a = 0, 4000)
    setTimeout(() => car.a = -80 / 3, 9000)
}

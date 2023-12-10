const camera = {x: 1024 / 8, y: 768 / 2, scale: 35}
const visor = { x: null, y: null, visible: false }

let dt = 1 / 220
const repository = {}
const v = 10
let m = 1
let w = 2
let b = 1 / 2

window.onload = e => {
    window.requestAnimationFrame(draw)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        visor.x = event.offsetX
        visor.y = event.offsetY

        if (event.ctrlKey) {
            camera.x = event.offsetX
            camera.y = event.offsetY
        } else if (event.buttons === 1) {
            camera.x += event.movementX
            camera.y += event.movementY
        }
        doOutput()
    })

    document.getElementById('canvas').addEventListener('mousewheel', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

        camera.x = event.offsetX - (event.offsetX - camera.x) / scaleBefore * camera.scale
        camera.y = event.offsetY - (event.offsetY - camera.y) / scaleBefore * camera.scale
        doOutput()
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        window.requestAnimationFrame(draw)
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        window.requestAnimationFrame(draw)
        visor.visible = false
    })

    document.querySelectorAll('input[type=range]')[0].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        dt = 1 / Number(e.target.value)
        repository.s = generate()
        outputText('p004', `dt = 1 / ${e.target.value}`)
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        b = Number(e.target.value)
        outputText('p005', `b = ${b.toFixed(2)}`)
        repository.s = generate()
    })

    document.querySelectorAll('input[type=range]')[2].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        w = Number(e.target.value)
        outputText('p006', `w = ${w.toFixed(2)}`)
        repository.s = generate()
    })

    document.querySelectorAll('input[type=range]')[3].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        m = Number(e.target.value)
        outputText('p007', `m = ${m.toFixed(2)}`)
        repository.s = generate()
    })

    repository.s = generate()
}

const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        const view = getView()
        {
            ctx.save()

            ctx.beginPath()
            for (let x = Math.trunc(view.x1); x <= Math.trunc(view.x2); x++) {
                ctx.moveTo(x, view.y1)
                ctx.lineTo(x, view.y2)
            }
            for (let y = Math.trunc(view.y1); y <= Math.trunc(view.y2); y++) {
                ctx.moveTo(view.x1, y)
                ctx.lineTo(view.x2, y)
            }
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = '#ccc'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(view.x1, 0)
            ctx.lineTo(view.x2, 0)
            ctx.moveTo(0, view.y1)
            ctx.lineTo(0, view.y2)
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = '#f88'
            ctx.stroke()

            ctx.restore()
        } // Raster

        {
            ctx.save()
            ctx.lineWidth = 1 / camera.scale

            {
                ctx.fillStyle = 'red'
                repository.s.forEach(e => {
                    ctx.beginPath()
                    ctx.arc(e[0], -e[1], 3 / camera.scale, 0, Math.PI * 2)
                    ctx.fill()
                })
            } // Benaderde waarde

            {
                // https://www.desmos.com/calculator/ojgg62opno
                let toggle = false
                ctx.beginPath()
                for (let x = view.x1; x <= view.x2; x += 1 / camera.scale) {
                    const y = v * m / b * (1 - Math.pow(Math.E, -b / m * x))
                    if (Number.isFinite(y)) {
                        if (!toggle) {
                            ctx.moveTo(x, -y)
                            toggle = true
                        }
                        else ctx.lineTo(x, -y)
                    } else toggle = false
                }
                ctx.strokeStyle = 'purple'
                ctx.stroke()
            } // Grafiek

            ctx.restore()
        }
    } // Layers

    ctx.restore()
}

const outputText = (elementId, str) => {
    document.getElementById(elementId).innerHTML = str
}

const doOutput = () => {
    const afbeelding = { x: (visor.x - camera.x) / camera.scale, y: (visor.y - camera.y) / camera.scale }
    const view = getView()
    outputText('p001', `afbeelding: (${afbeelding.x.toFixed(2)}, ${afbeelding.y.toFixed(2)})`)
    outputText('p002', `camera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) - ${camera.scale.toFixed(2)}`)
    outputText('p003', `view: (${view.x1.toFixed(2)}, ${view.y1.toFixed(2)}) - (${view.x2.toFixed(2)}, ${view.y2.toFixed(2)})`)
}

const getView = () => {
    const canvas = document.getElementById('canvas')
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let a = -b * v_ / m - w
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        a = -b * v_ / m - w

        t += dt
    }
    return result
}

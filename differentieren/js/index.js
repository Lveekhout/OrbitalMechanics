const camera = {x: 1024 / 2, y: 768 / 3 * 2, scale: 100}
const visor = { x: null, y: null, visible: false }
const f = x => x * x / 4

let x0 = 2
let h = 2
let rc = (f(x0 + h) - f(x0)) / h
let b = f(x0) - rc * x0

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
        camera.scale = Math.min(Math.max(camera.scale, .1), 10000)

        camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
        camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale
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
        x0 = Number(e.target.value)
        rc = (f(x0 + h) - f(x0)) / h
        b = f(x0) - rc * x0
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        h = Number(e.target.value)
        rc = (f(x0 + h) - f(x0)) / h
        b = f(x0) - rc * x0
    })
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

            const step = (view.x2 - view.x1) / canvas.width
            ctx.beginPath()
            ctx.moveTo(view.x1, -f(view.x1))
            for (let x = view.x1 + step; x <= view.x2; x += step) {
                ctx.lineTo(x, -f(x))
            }
            ctx.lineWidth = 3 / camera.scale
            ctx.strokeStyle = '#8df'
            ctx.stroke()

            ctx.restore()
        } // Grafiek
        {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(view.x1, -(view.x1 * rc + b))
            ctx.lineTo(view.x2, -(view.x2 * rc + b))
            ctx.lineWidth = 3 / camera.scale
            ctx.strokeStyle = '#f8fd'
            ctx.stroke()
            ctx.restore()
        } // (Raak)lijn
        {
            ctx.save()
            ctx.beginPath()
            ctx.arc(x0, -f(x0), 3 / camera.scale, 0, Math.PI * 2)
            if (h !== 0) ctx.arc(x0 + h, -f(x0 + h), 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'purple'
            ctx.fill()
            ctx.restore()
        } // Puntjes
    } // Layers

    ctx.restore()

    // if (visor.visible) {
    //     ctx.save()
    //     ctx.beginPath()
    //     ctx.moveTo(visor.x, 0)
    //     ctx.lineTo(visor.x, canvas.height)
    //     ctx.moveTo(0, visor.y)
    //     ctx.lineTo(canvas.width, visor.y)
    //     ctx.strokeStyle = '#F003'
    //     ctx.lineWidth = 2
    //     ctx.stroke()
    //     ctx.restore()
    // }
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

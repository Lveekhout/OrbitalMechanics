const camera = { x: 512 /6, y: 384 * 1.8, scale: 90 }
const visor = { x: null, y: null, visible: false }

let dx = 1
let drawIntegral = false
let c = 2
let d = 0

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
        dx = Number(e.target.value)
        document.querySelector('#output-dx').innerText = `dx = ${dx}`
    })

    document.querySelectorAll('input[type=checkbox]')[0].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        drawIntegral = e.target.checked
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        c = Number(e.target.value)
        document.querySelector('#output-c').innerText = `c = ${c}`
    })

    document.querySelectorAll('input[type=range]')[2].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        d = Number(e.target.value)
        document.querySelector('#output-d').innerText = `d = ${d}`
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
        drawGraph(ctx, f, view, '#00f2')
        if (drawIntegral) drawGraph(ctx, g, view, '#f002')
        {
            ctx.save()
            ctx.lineWidth = 2 / camera.scale
            ctx.strokeStyle = '#00f'
            ctx.fillStyle = '#00f2'
            ctx.beginPath()
            for (let x = 0; x < view.x2; x += dx) {
                ctx.rect(x, 0, dx, -f(x + dx / 2))
            }
            ctx.fill()

            ctx.strokeStyle = '#f00'
            ctx.beginPath()
            let area = 0
            for (let x = 0; x < view.x2; x += dx) {
                area += dx * f(x + dx / 2)
                ctx.moveTo(x, -(area + c))
                ctx.lineTo(x + dx, -(area + c))
            }
            ctx.stroke()
            ctx.restore()
        } // dy / dx
    } // Layers
    ctx.restore()
}

const outputText = (elementId, str) => {
    document.getElementById(elementId).innerHTML = str
}

const doOutput = () => {
    const afbeelding = { x: (visor.x - camera.x) / camera.scale, y: (visor.y - camera.y) / camera.scale }
    const view = getView()
    outputText('p001', `afbeelding: (${afbeelding.x.toFixed(3)}, ${afbeelding.y.toFixed(3)})`)
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

const camera = {x: 1024 / 8, y: 768 / 2, scale: 35}
const visor = { x: null, y: null, visible: false }

let animating = true
let cms = 0

const is = 0
const iv = Math.sqrt(2) * 10
let im = 2
let ib = -2
let iw = 0
let s = is
let v = iv

window.onload = e => {
    window.requestAnimationFrame(draw)
    // setTimeout(() => animating = false, 10000)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        if (!animating) window.requestAnimationFrame(draw)
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
        if (!animating) window.requestAnimationFrame(draw)
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

        camera.x = event.offsetX - (event.offsetX - camera.x) / scaleBefore * camera.scale
        camera.y = event.offsetY - (event.offsetY - camera.y) / scaleBefore * camera.scale
        doOutput()
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        if (!animating) window.requestAnimationFrame(draw)
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        if (!animating) window.requestAnimationFrame(draw)
        visor.visible = false
    })

    document.querySelectorAll('input[type=range]')[0].addEventListener('input', e => {
        if (!animating) window.requestAnimationFrame(draw)
        ib = Number(e.target.value)
        outputText('p004', `b = ${ib.toFixed(2)}`)
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        iw = Number(e.target.value)
        outputText('p005', `w = ${iw.toFixed(2)}`)
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('mouseup', e => {
        iw = 0
        e.target.value = iw
        outputText('p005', `w = ${iw.toFixed(2)}`)
    })

    document.querySelectorAll('input[type=range]')[2].addEventListener('input', e => {
        if (!animating) window.requestAnimationFrame(draw)
        im = Number(e.target.value)
        outputText('p006', `m = ${im.toFixed(2)}`)
    })
}

const draw = ms => {
    if (animating) window.requestAnimationFrame(draw)

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
            ctx.beginPath()
            ctx.fillStyle = 'blue'
            ctx.arc(f(ms / 1000), 0, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
        } // Moving object f(t)
        {
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = 'red'
            // g((ms - cms) / 1000)
            const x = g((ms - cms) / 1000)
            ctx.arc(x, -1, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            let vectW = new Vector([s, 1], [iw, 0])
            let vectV = new Vector([s, 1], [v, 0])
            let vectB = new Vector([s, 1], [ib * v, 0])
            if (Math.abs(iw) * camera.scale >= 10) vectW.draw(ctx, 5, 'orange', 1 / 3)
            if (Math.abs(v) * camera.scale >= 10) vectV.draw(ctx, 5, 'green', 1 / 3)
            if (Math.abs(ib * v) * camera.scale >= 10) vectB.draw(ctx, 5, 'blue', 1 / 3)

            outputText('p007', `s = ${s.toFixed(64)}`)
            outputText('p008', `v = ${v.toFixed(64)}`)
        } // Moving object g(dt)
    } // Layers

    ctx.restore()

    ctx.save()
    ctx.font = "9px Verdana"
    ctx.fillStyle = 'black'
    ctx.fillText(`${ms.toFixed(3)} - ${(ms - cms).toFixed(3)}`, 10, 10)
    ctx.restore()

    if (visor.visible) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(visor.x, 0)
        ctx.lineTo(visor.x, canvas.height)
        ctx.moveTo(0, visor.y)
        ctx.lineTo(canvas.width, visor.y)
        ctx.strokeStyle = '#FF000030'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }
    cms = ms
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

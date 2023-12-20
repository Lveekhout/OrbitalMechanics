const camera = {x: 1024 / 2, y: 768 / 2, scale: 30}
const visor = { x: null, y: null, visible: false }

let animating = true

window.onload = e => {
    if (animating) window.requestAnimationFrame(draw)

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
}

const draw = ms => {
    const stopwatch = performance.now()

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
            let first = true
            ctx.save()
            ctx.strokeStyle = '#0002'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            for (let t = ms / 1000 - 1; t < ms / 1000 + 20; t += 1 / 10) {
                const r_ = r(t)
                const r_hat_ = r_hat(t)
                if (first) { ctx.moveTo(r_ * r_hat_[0], -r_ * r_hat_[1]); first = false }
                else ctx.lineTo(r_ * r_hat_[0], -r_ * r_hat_[1])
            }
            ctx.stroke()
            ctx.restore()
        } // Chemtrail

        const r_ = r(ms / 1000)
        const r_hat_ = r_hat(ms / 1000)
        {
            const vectR = new Vector([r_ * r_hat_[0], r_ * r_hat_[1]])
            // vectR.draw(ctx, 8, 'purple', 1)

            const vectV = new Vector(vectR.p, v(ms / 1000))
            vectV.draw(ctx, 8, 'green', 1)

            const vectA = new Vector(vectR.p, a(ms / 1000))
            vectA.draw(ctx, 8, 'blue', 1)
        }

        {
            ctx.save()
            ctx.fillStyle = 'red'
            ctx.beginPath()
            ctx.arc(r_ * r_hat_[0], -r_ * r_hat_[1], 3 / camera.scale, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
        }
    } // Layers

    ctx.restore()

    ctx.save()
    ctx.font = "9px Verdana"
    ctx.fillStyle = 'black'
    ctx.fillText(`${ms.toFixed(3)} - ${performance.now() - stopwatch}`, 10, 10)
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

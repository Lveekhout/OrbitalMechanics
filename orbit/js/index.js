const camera = {x: 512, y: 384, scale: 1 / 27000}
const visor = {x: null, y: null, visible: false}
// const orbit = new Orbit(new Vector(9000000, Math.PI / 4).p, new Vector(6650, Math.PI * (3 / 4)).p)
const orbit = new Orbit(new Vector(6378e3 + 400e3, Math.PI / 2).p, new Vector(7777, 0).p)

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
        camera.scale = Math.min(Math.max(camera.scale, 1 / 1000000), 10000)

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
}

const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    {
        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.scale, camera.scale)
        {
            {
                orbit.draw(ctx)
            } // Shape
        } // Layer
        ctx.restore()
    } // Scaled
    {
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
    } // NON-Scaled
}

const outputText = (elementId, str) => {
    document.getElementById(elementId).innerHTML = str
}

const doOutput = () => {
    const afbeelding = {x: (visor.x - camera.x) / camera.scale, y: (visor.y - camera.y) / camera.scale}
    const view = getView()
    const viewScale = camera.scale < 1 ? `1 : ${(1 / camera.scale).toFixed(2)}` : `${camera.scale.toFixed(2)} : 1`
    outputText('p001', `afbeelding: (${afbeelding.x.toFixed(2)}, ${afbeelding.y.toFixed(2)})`)
    outputText('p002', `camera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) - (${viewScale})`)
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

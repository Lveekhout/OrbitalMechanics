const camera = { x: 512, y: 384, scale: 30 }
const visor = { x: null, y: null, visible: false }

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

    document.getElementsByTagName('input')[0].addEventListener('input', e => window.requestAnimationFrame(draw))

    document.getElementsByTagName('input')[1].addEventListener('input', e => window.requestAnimationFrame(draw))
}

const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        {
            ctx.save()

            ctx.beginPath()
            ctx.moveTo(-10, 0)
            ctx.lineTo(10, 0)
            ctx.moveTo(0, 10)
            ctx.lineTo(0, -10)
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = 'gray'
            ctx.stroke()

            ctx.restore()
        } // Shapes
        {
            const angle = document.getElementsByTagName('input')[0].value
            const length = document.getElementsByTagName('input')[1].value
            const r1 = new Vector(Number(length), Number(angle))
            const r2 = new Vector(r1.p, [-6 - r1.p[0], 0 - r1.p[1]])
            const r1_ = new Vector(r1.p, Number(length), Number(angle))
            const r2_ = new Vector([r1_.o[0] + r1_.p[0], r1_.o[1] + r1_.p[1]], r1.length, r2.angle)
            // const m = new Vector(r1.p, 5, bepHoek(r1.angle, r2.angle))
            const m = new Vector(r1.p, 5, bepHoek2(r1.p, new Vector(r1.p, r1.length, r2.angle).p))

            r1.draw(ctx, 6, 'blue')
            r2.draw(ctx, 6, 'blue')
            r1_.draw(ctx, 6, '#ddd8')
            r2_.draw(ctx, 6, '#ddd8')
            m.draw(ctx, 6, 'green')
        }
    } // Layers
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

function bepHoek2(a, b) { // Array(2), Array(2)
    return Math.atan2(a[1] + b[1], a[0] + b[0])
}

function bepHoek(a, b) { // Number, Number
    let result
    a = Math.atan2(Math.sin(a), Math.cos(a))
    // b = Math.atan2(Math.sin(b), Math.cos(b))

    // if (a < 0) a += Math.PI * 2
    // if (b < 0) b += Math.PI * 2

    if (true) { // anti-clockwise
        if (a < b) result = b - (b - a) / 2
        else if (a > b) result = b - (b - a) / 2 + Math.PI
        else throw "Uitzonderlijk geval"
    } else { // clockwise
        if (a < b) result = b - (b - a) / 2 + Math.PI
        else if (a > b) result = b - (b - a) / 2
        else throw "Uitzonderlijk geval"
    }

    // if (result > Math.PI * 2) result -= Math.PI * 2

    outputText('pre001', a)
    outputText('pre002', b)
    outputText('pre003', result)

    return result
}

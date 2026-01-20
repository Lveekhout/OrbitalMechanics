const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const camera = {x: canvas.width / 2, y: canvas.height / 2, scale: 150}
const visor = {x: undefined, y: undefined, visible: false}
let isAnimating = true

let idx = 0

window.onload = e => {
    if (isAnimating) window.requestAnimationFrame(draw)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        if (!isAnimating) window.requestAnimationFrame(draw)
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
        if (!isAnimating) window.requestAnimationFrame(draw)
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

        camera.x = event.offsetX - (event.offsetX - camera.x) / scaleBefore * camera.scale
        camera.y = event.offsetY - (event.offsetY - camera.y) / scaleBefore * camera.scale
        doOutput()
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        if (!isAnimating) window.requestAnimationFrame(draw)
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        if (!isAnimating) window.requestAnimationFrame(draw)
        visor.visible = false
    })

    document.querySelectorAll('input[type=range]')[0].addEventListener('input', e => {
    })

    generate()
    console.log(`start: [${Date.now()}]`)
}

const draw = ms => {
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
        const object = universe.object.s
        // {
        //     ctx.save()
        //
        //     ctx.beginPath()
        //     ctx.moveTo(object[idx][1], -object[idx][2])
        //     ctx.lineTo(0, -0)
        //     ctx.strokeStyle = '#0f0'
        //     ctx.lineWidth = 1 / 1 / camera.scale
        //     ctx.stroke()
        //
        //     ctx.restore()
        // } // Green line between
        {
            ctx.save()
            universe.object.s.forEach(v => {
                ctx.beginPath()
                ctx.arc(v[0], -Math.sqrt(v[1]*v[1]+v[2]*v[2]), 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = 'pink'
                ctx.fill()
            })
            ctx.restore()
        } // Grafiek
        {
            ctx.save()
            universe.object.h.forEach(e => {
                ctx.beginPath()
                ctx.arc(e[0], -e[1], 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = 'yellow'
                ctx.fill()
            })
            ctx.restore()
        } // Grafiek 2
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(object[idx][1], -object[idx][2], Math.sqrt(universe.object.M) * 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'gray'
            ctx.fill()

            ctx.restore()
        } // Position object
        if (isAnimating) {
            idx++
            if (idx === universe.object.s.length) {
                idx-- // kan uiteindelijk weg
                isAnimating = false
                console.log(`stop: [${Date.now()}]`)
            }
            window.requestAnimationFrame(draw)
        }
    } // Layers

    ctx.restore()
}

const outputText = (elementId, str) => {
    document.getElementById(elementId).innerHTML = str
}

const doOutput = () => {
    const afbeelding = {x: (visor.x - camera.x) / camera.scale, y: (visor.y - camera.y) / camera.scale}
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
    const start = new Date()
    const grain = 1e6
    const dt = 1 / grain // hoe kleiner hoe fijner
    const time = 60 // seconden

    let idx = 1 // eerste element in de lijst universe.object.s is al gedefinieerd, dus beginnen bij 1
    const object = { s: { x: universe.object.s[0][1], y: universe.object.s[0][2] }, v: { x: universe.object.v[0][1], y: universe.object.v[0][2] } }
    for (let t = dt; t < time; t += dt) {
        const r2 = Math.pow(object.s.x, 2) + Math.pow(object.s.y, 2)
        const r = Math.sqrt(r2)
        const a = universe.G * universe.M  / r2
        // {
        //     const h = Math.atan2(object.s.y, object.s.x)
        //     object.v.x += -Math.cos(h) * dt * a
        //     object.v.y += -Math.sin(h) * dt * a
        // }
        {
            object.v.x += -a * object.s.x * dt / r
            object.v.y += -a * object.s.y * dt / r
        } // Zie IMG_20231112_002443.jpg in /documentation
        object.s.x += object.v.x * dt
        object.s.y += object.v.y * dt
        if (idx++ % (grain / 62.5) === 0) {
            universe.object.s.push([t, object.s.x, object.s.y])
            universe.object.v.push([t, object.v.x, object.v.y])
            universe.object.a.push([t, a])
            universe.object.r.push([t, r])
            universe.object.h.push([t, Math.atan2(object.s.y, object.s.x)])
        }
    }
    console.log(`generate.duur: ${new Date() - start}, idx: ${idx}, pos#: ${universe.object.s.length}`)
}

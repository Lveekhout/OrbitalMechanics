const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const camera = {x: canvas.width / 2, y: canvas.height / 2, scale: 30}
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
        const moon = universe.moon.s
        const earth = universe.earth.s
        const sun = universe.sun.s
        // {
        //     ctx.save()
        //
        //     ctx.beginPath()
        //     ctx.moveTo(moon[idx][1], -moon[idx][2])
        //     ctx.lineTo(earth[idx][1], -earth[idx][2])
        //     ctx.strokeStyle = '#0f0'
        //     ctx.lineWidth = 1 / 1 / camera.scale
        //     ctx.stroke()
        //
        //     ctx.restore()
        // } // Line between
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(moon[idx][1], -moon[idx][2], Math.sqrt(universe.moon.M) * 3 / camera.scale, 0, Math.PI * 2)
            // ctx.arc(moon[idx][1] - earth[idx][1], -moon[idx][2] + earth[idx][2], 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'gray'
            ctx.fill()

            ctx.restore()
        } // Position moon
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(earth[idx][1], -earth[idx][2], Math.sqrt(universe.earth.M) * 3 / camera.scale, 0, Math.PI * 2)
            // ctx.arc(earth[idx][1] - earth[idx][1], -earth[idx][2] + earth[idx][2], 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'blue'
            ctx.fill()

            ctx.restore()
        } // Position earth
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(sun[idx][1], -sun[idx][2], Math.sqrt(universe.sun.M) * 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'yellow'
            ctx.fill()

            ctx.restore()
        } // Position sun
        if (isAnimating) {
            idx++
            if (idx === universe.moon.s.length) {
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
    const grain = 1e5 // hoe hoger hoe verfijnder
    const dt = 1 / grain
    const time = 60 // seconden

    let idx = 1
    const moon = { s: { x: universe.moon.s[0][1], y: universe.moon.s[0][2] }, v: { x: universe.moon.v[0], y: universe.moon.v[1] } }
    const earth = { s: { x: universe.earth.s[0][1], y: universe.earth.s[0][2] }, v: { x: universe.earth.v[0], y: universe.earth.v[1] } }
    const sun = { s: { x: universe.sun.s[0][1], y: universe.sun.s[0][2] }, v: { x: universe.sun.v[0], y: universe.sun.v[1] } }
    for (let t = dt; t < time; t += dt) {
        {
            const r = Math.sqrt(Math.pow(moon.s.x - earth.s.x, 2) + Math.pow(moon.s.y - earth.s.y, 2))
            const F = universe.G * universe.earth.M * universe.moon.M / Math.pow(r, 2)

            let a = F / universe.moon.M
            let h = Math.atan2(moon.s.y - earth.s.y, moon.s.x - earth.s.x)
            moon.v.x += -Math.cos(h) * dt * a
            moon.v.y += -Math.sin(h) * dt * a
            moon.s.x += moon.v.x * dt
            moon.s.y += moon.v.y * dt

            a = F / universe.earth.M
            h = Math.atan2(earth.s.y - moon.s.y, earth.s.x - moon.s.x)
            earth.v.x += -Math.cos(h) * dt * a
            earth.v.y += -Math.sin(h) * dt * a
            earth.s.x += earth.v.x * dt
            earth.s.y += earth.v.y * dt
        } // moon / earth
        {
            // NB! KLOPT NIET WANT DE POSITIE VAN O.A. earth.s.x IS AL GEWIJZIGD HIER VLAK BOVEN
            const r = Math.sqrt(Math.pow(earth.s.x - sun.s.x, 2) + Math.pow(earth.s.y - sun.s.y, 2))
            const F = universe.G * universe.sun.M * universe.earth.M / Math.pow(r, 2)

            let a = F / universe.earth.M
            let h = Math.atan2(earth.s.y - sun.s.y, earth.s.x - sun.s.x)
            earth.v.x += -Math.cos(h) * dt * a
            earth.v.y += -Math.sin(h) * dt * a
            earth.s.x += earth.v.x * dt
            earth.s.y += earth.v.y * dt

            a = F / universe.sun.M
            h = Math.atan2(sun.s.y - earth.s.y, sun.s.x - earth.s.x)
            sun.v.x += -Math.cos(h) * dt * a
            sun.v.y += -Math.sin(h) * dt * a
            sun.s.x += sun.v.x * dt
            sun.s.y += sun.v.y * dt
        } // earth / sun
        {
            // NB! KLOPT NIET WANT DE POSITIE VAN O.A. sun.s.x IS AL GEWIJZIGD HIER VLAK BOVEN
            const r = Math.sqrt(Math.pow(moon.s.x - sun.s.x, 2) + Math.pow(moon.s.y - sun.s.y, 2))
            const F = universe.G * universe.sun.M * universe.moon.M / Math.pow(r, 2)

            let a = F / universe.moon.M
            let h = Math.atan2(moon.s.y - sun.s.y, moon.s.x - sun.s.x)
            moon.v.x += -Math.cos(h) * dt * a
            moon.v.y += -Math.sin(h) * dt * a
            moon.s.x += moon.v.x * dt
            moon.s.y += moon.v.y * dt

            a = F / universe.sun.M
            h = Math.atan2(sun.s.y - moon.s.y, sun.s.x - moon.s.x)
            sun.v.x += -Math.cos(h) * dt * a
            sun.v.y += -Math.sin(h) * dt * a
            sun.s.x += sun.v.x * dt
            sun.s.y += sun.v.y * dt
        } // sun / moon
        if (idx % 16e2 === 0) {
            universe.moon.s.push([t, moon.s.x, moon.s.y])
            universe.earth.s.push([t, earth.s.x, earth.s.y])
            universe.sun.s.push([t, sun.s.x, sun.s.y])
        }
        idx++
    }
}

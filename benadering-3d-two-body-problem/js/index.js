const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const camera = {x: canvas.width / 2, y: canvas.height / 2, scale: 200}
const visor = {x: undefined, y: undefined, visible: false}
let isAnimating = true
let depth = 1

let idx = 0
let angleX = 0
let angleY = 0
let angleZ = 0

window.onload = e => {
    window.requestAnimationFrame(draw)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        if (!isAnimating) window.requestAnimationFrame(draw)
        event.preventDefault()

        visor.x = event.offsetX
        visor.y = event.offsetY

        if (event.shiftKey) {
            angleX -= Number(event.movementY) / 250
            angleY -= Number(event.movementX) / 250
            if (angleX > Math.PI / 4) angleX = Math.PI / 4
            if (angleX < -Math.PI / 4) angleX = -Math.PI / 4
        } else if (event.ctrlKey) {
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
        camera.scale = Math.min(Math.max(camera.scale, 1), 10000)

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
        window.requestAnimationFrame(draw)
        angleX = Number(e.target.value)
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        angleY = Number(e.target.value)
    })

    document.querySelectorAll('input[type=range]')[2].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        angleZ = Number(e.target.value)
    })

    document.querySelectorAll('input[type=range]')[3].addEventListener('input', e => {
        if (!isAnimating) window.requestAnimationFrame(draw)
        depth = Number(e.target.value)
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
        {
            ctx.save()

            ctx.beginPath()
            const d = universe.moon.s[idx][3] / depth + 1
            ctx.arc(universe.moon.s[idx][1] / d, -universe.moon.s[idx][2] / d, Math.sqrt(universe.moon.M / 1000) / d, 0, Math.PI * 2)
            ctx.fillStyle = 'gray'
            ctx.fill()

            ctx.restore()
        } // Position moon
        {
            ctx.save()

            ctx.beginPath()
            const d = universe.earth.s[idx][3] / depth + 1
            ctx.arc(universe.earth.s[idx][1] / d, -universe.earth.s[idx][2] / d, Math.sqrt(universe.earth.M / 1000) / d, 0, Math.PI * 2)
            ctx.fillStyle = 'blue'
            ctx.fill()

            ctx.restore()
        } // Position earth
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
    const start = new Date()
    const grain = 1e5
    const dt = 1 / grain // hoe kleiner hoe fijner
    const time = 60 // seconden

    let idx = 1
    const moon = { s: { x: universe.moon.s[0][1], y: universe.moon.s[0][2], z: universe.moon.s[0][3] }, v: { x: universe.moon.v[0], y: universe.moon.v[1], z: universe.moon.v[2] } }
    const earth = { s: { x: universe.earth.s[0][1], y: universe.earth.s[0][2], z: universe.earth.s[0][3] }, v: { x: universe.earth.v[0], y: universe.earth.v[1], z: universe.earth.v[2] } }
    for (let t = dt; t < time; t += dt) {
        {
            const r2 = Math.pow(moon.s.x - earth.s.x, 2) + Math.pow(moon.s.y - earth.s.y, 2) + Math.pow(moon.s.z - earth.s.z, 2)
            const r = Math.sqrt(r2)
            let a = universe.G * universe.earth.M / r2
            let fac = -a * dt / r
            moon.v.x += fac * (moon.s.x - earth.s.x)
            moon.v.y += fac * (moon.s.y - earth.s.y)
            moon.v.z += fac * (moon.s.z - earth.s.z)

            a = universe.G * universe.moon.M / r2
            fac = -a * dt / r
            earth.v.x += fac * (earth.s.x - moon.s.x)
            earth.v.y += fac * (earth.s.y - moon.s.y)
            earth.v.z += fac * (earth.s.z - moon.s.z)

            moon.s.x += moon.v.x * dt
            moon.s.y += moon.v.y * dt
            moon.s.z += moon.v.z * dt
            earth.s.x += earth.v.x * dt
            earth.s.y += earth.v.y * dt
            earth.s.z += earth.v.z * dt
        } // moon / earth
        if (idx++ % 16e2 === 0) {
            universe.moon.s.push([t, moon.s.x, moon.s.y, moon.s.z])
            universe.earth.s.push([t, earth.s.x, earth.s.y, earth.s.z])
        }
    }
    console.log(`generate.duur: ${new Date() - start}, idx: ${idx}, pos#: ${universe.earth.s.length}`)
}

const rotatePointsX = (points, angle) => points.map(point => ({
    x: point.x,
    y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
    z: point.y * Math.sin(angle) + point.z * Math.cos(angle)
}))
const rotatePointsY = (points, angle) => points.map(point => ({
    x: point.x * Math.cos(angle) + point.z * Math.sin(angle),
    y: point.y,
    z: point.z * Math.cos(angle) - point.x * Math.sin(angle)
}))
const rotatePointsZ = (points, angle) => points.map(point => ({
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    z: point.z
}))

const camera = {x: 800, y: 384, scale: 1 / 37000}
const visor = {x: null, y: null, visible: false}
const orbit = new EarthOrbit(new Vector(6378e3 + 1400e3, 0).p, new Vector(9800, Math.PI * (1/2)).p, 'purple')
let orbits = [
    // orbit,
    new EarthOrbit(new Vector(6378e3, 0).p, new Vector(9730, Math.PI * (1/2)).p),                         // Twee orbits met dezelfde Major Axis
    new EarthOrbit(new Vector(13149225.020695394, 0).p, new Vector(5505.611023656417, Math.PI * (1/2)).p) // Twee orbits met dezelfde Major Axis
]
let cms // current miliseconds
let animating = false
let tijden = [0, 0]
let maxDms = 0

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

    document.getElementsByTagName('input')[0].oninput = e => {
        const lv = document.getElementsByTagName('input')[1].value
        const ar = document.getElementsByTagName('input')[2].value
        const lr = document.getElementsByTagName('input')[3].value
        orbits.pop()
        orbits.push(new EarthOrbit(new Vector(Number(lr), Number(ar)).p, new Vector(Number(lv), Number(e.target.value)).p, 'purple'))
        window.requestAnimationFrame(draw)
    }

    document.getElementsByTagName('input')[1].oninput = e => {
        const av = document.getElementsByTagName('input')[0].value
        const ar = document.getElementsByTagName('input')[2].value
        const lr = document.getElementsByTagName('input')[3].value
        orbits.pop()
        orbits.push(new EarthOrbit(new Vector(Number(lr), Number(ar)).p, new Vector(Number(e.target.value), Number(av)).p, 'purple'))
        window.requestAnimationFrame(draw)
    }

    document.getElementsByTagName('input')[2].oninput = e => {
        document.getElementsByTagName('input')[4].value = e.target.value
        const av = Number(document.getElementsByTagName('input')[0].value)
        const lv = Number(document.getElementsByTagName('input')[1].value)
        const lr = Number(document.getElementsByTagName('input')[3].value)
        orbits.pop()
        orbits.push(new EarthOrbit(new Vector(lr, Number(e.target.value)).p, new Vector(lv, av).p, 'purple'))
        window.requestAnimationFrame(draw)
    }

    document.getElementsByTagName('input')[3].oninput = e => {
        const av = document.getElementsByTagName('input')[0].value
        const lv = document.getElementsByTagName('input')[1].value
        const ar = document.getElementsByTagName('input')[2].value
        orbits.pop()
        orbits.push(new EarthOrbit(new Vector(Number(e.target.value), Number(ar)).p, new Vector(Number(lv), Number(av)).p, 'purple'))
        window.requestAnimationFrame(draw)
    }

    document.getElementsByTagName('input')[4].oninput = e => {
        const newOrbit = orbits.pop().copyOrbitFromRealAngle(Number(e.target.value))
        const newInfo = newOrbit.info()
        document.getElementsByTagName('input')[0].value = (newInfo.m.angle + Math.PI * 2) % (Math.PI * 2)
        document.getElementsByTagName('input')[1].value = newInfo.m.length
        document.getElementsByTagName('input')[2].value = e.target.value
        document.getElementsByTagName('input')[3].value = newInfo.r1.length
        orbits.push(newOrbit)
        window.requestAnimationFrame(draw)
    }
}

const draw = dms => { // delta miliseconds
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ctx.save()
    // ctx.translate(400, 300)
    // ctx.rotate(-Number(document.getElementsByTagName('input')[4].value))
    // ctx.beginPath()
    // ctx.moveTo(-100, 0)
    // ctx.lineTo(100, 0)
    // ctx.strokeStyle = 'white'
    // ctx.stroke()
    // ctx.restore()

    {
        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.scale, camera.scale)
        {
            {
                ctx.save()
                // ctx.globalAlpha = .3
                ctx.scale(6378e3 / 1638 * 2, 6378e3 / 1638 * 2)
                ctx.translate(-iEarth.width / 2, -iEarth.height / 2)
                ctx.drawImage(iEarth, 0, 0)
                ctx.restore()

                orbits.forEach(o => o.draw(ctx))
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
            ctx.strokeStyle = '#FF000080'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        }
    } // NON-Scaled

    outputText('text001', JSON.stringify(orbits[0].info(), null, 3))
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

//////////////////////////////////////////////////////////////////////////////////////////
// ANIMATION                                                                            //
//////////////////////////////////////////////////////////////////////////////////////////

const deltadraw = ms => {
    let start = performance.now() * 1000
    const dms = ms - cms
    cms = ms
    maxDms = Math.max(maxDms, dms)
    orbits = orbits.map(orb => orb.copyOrbitFromDeltaSeconds(dms))
    // const newOrbit = orbits.pop().copyOrbitFromDeltaSeconds(dms)
    const newInfo = orbits[orbits.length - 1].info()
    document.getElementsByTagName('input')[0].value = (newInfo.m.angle + Math.PI * 2) % (Math.PI * 2)
    document.getElementsByTagName('input')[1].value = newInfo.m.length
    document.getElementsByTagName('input')[2].value = (newInfo.r1.angle + Math.PI * 2) % (Math.PI * 2)
    document.getElementsByTagName('input')[3].value = newInfo.r1.length
    document.getElementsByTagName('input')[4].value = (newInfo.r1.angle + Math.PI * 2) % (Math.PI * 2)
    // orbits.push(newOrbit)
    draw()
    if (animating) window.requestAnimationFrame(deltadraw)
    tijden[0] += performance.now() * 1000 - start
    tijden[1]++
}

const init = ms => {
    cms = ms
    window.requestAnimationFrame(deltadraw)
}

const start = () => {
    animating = true
    window.requestAnimationFrame(init)
}

const stop = () => {
    animating = false
}

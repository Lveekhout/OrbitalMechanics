const camera = {x: 1024 / 2, y: 768 / 2, scale: 1 / 37000}
const visor = {x: null, y: null, visible: false}
const orbit = new EarthOrbit(new Vector(6378e3 + 1400e3, 0).p, new Vector(7158.493487102268, Math.PI * (1/2)).p)
const orbits = [
    orbit,
    orbit.copy().setCartesianAngle(0.01),
    // new EarthOrbit(new Vector(6378e3 + 35785280.291919015, 0).p, new Vector(3074.5984777015988, Math.PI * (1/2)).p), // Geosynchronous orbit
    // new EarthOrbit(new Vector(6378e3 + 433e3, 0).p, new Vector(7652.7777777, Math.PI * (1/2)).p), // ISS orbit
    // new EarthOrbit(new Vector(6378e3 + 2800e3, 0).p, new Vector(3000, Math.PI * (1 / 2)).p) // r=a (a=14775947.678937579)
    // new EarthOrbit(new Vector(6378e3 + 165e3, 0).p, new Vector(27337 / 3.6, Math.PI * (1 / 2)).p) // r=a (a=14775947.678937579)
]
let cms // current miliseconds
let animating = false
let tijden = [0, 0]
let maxDms = 0

window.onload = e => {
    window.requestAnimationFrame(() => draw(0))
    updateRangeInputsFromOrbit(orbits[0])

    document.getElementById('canvas').addEventListener('mousemove', event => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
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
        if (!animating) window.requestAnimationFrame(() => draw(0))
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, 1 / 1000000), 10000)

        camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
        camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale
        doOutput()
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        visor.visible = false
    })

    document.getElementsByTagName('input')[0].oninput = e => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        orbits[0].setAngleOfVelocity(Number(e.target.value))
    }

    document.getElementsByTagName('input')[1].oninput = e => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        orbits[0].setLengthOfVelocity(Number(e.target.value))
    }

    document.getElementsByTagName('input')[2].oninput = e => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        document.getElementsByTagName('input')[4].value = e.target.value
        orbits[0].setAngleOfMass(Number(e.target.value))
    }

    document.getElementsByTagName('input')[3].oninput = e => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        orbits[0].setLengthOfMass(Number(e.target.value))
    }

    document.getElementsByTagName('input')[4].oninput = e => {
        if (!animating) window.requestAnimationFrame(() => draw(0))
        orbits[0].setCartesianAngle(Number(e.target.value))
        updateRangeInputsFromOrbit(orbits[0])
    }
}

let earthrotation = 0
const draw = dms => { // delta miliseconds
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    {
        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.scale, camera.scale)
        // ctx.rotate(orbits[0].info().m.angle + Math.PI)
        {
            {
                ctx.save()
                // ctx.globalAlpha = .3
                ctx.scale(6378e3 / 1638 * 2, 6378e3 / 1638 * 2)
                earthrotation -= 2 * Math.PI * dms / 86184
                // ctx.rotate(earthrotation)
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
            ctx.strokeStyle = '#FF000050'
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
const updateRangeInputsFromOrbit = orbit => {
    const newInfo = orbit.info()
    document.getElementsByTagName('input')[0].value = (newInfo.m.angle + Math.PI * 2) % (Math.PI * 2)
    document.getElementsByTagName('input')[1].value = newInfo.m.length
    document.getElementsByTagName('input')[2].value = (newInfo.r1.angle + Math.PI * 2) % (Math.PI * 2)
    document.getElementsByTagName('input')[3].value = newInfo.r1.length
    document.getElementsByTagName('input')[4].value = (newInfo.r1.angle + Math.PI * 2) % (Math.PI * 2)
}

const deltadraw = ms => {
    const dms = ms - cms
    cms = ms
    maxDms = Math.max(maxDms, dms)
    if (navigator.getGamepads()[0]) {
        if (navigator.getGamepads()[0].buttons[4].value === 1) orbits[0].setAccelerationOfVelocity(-dms / 1)
        if (navigator.getGamepads()[0].buttons[5].value === 1) orbits[0].setAccelerationOfVelocity(dms / 1)
    }
    orbits.forEach(orb => orb.setDeltaSeconds(dms / 1))
    updateRangeInputsFromOrbit(orbits[0])
    const start = performance.now() * 1000                   // Tijdmeting
    draw(dms)
    tijden[0] += performance.now() * 1000 - start            // Tijdmeting
    tijden[1]++                                              // Tijdmeting
    if (animating) window.requestAnimationFrame(deltadraw)
}

const init = ms => {
    cms = ms
    window.requestAnimationFrame(deltadraw)
}

const start = () => {
    if (!animating) {
        animating = true
        window.requestAnimationFrame(init)
    }
}

const stop = () => {
    animating = false
}

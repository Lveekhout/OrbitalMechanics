const anim = new Animation2d()
const iEarth = new Image()
const iMoon = new Image()
iEarth.src = 'https://i.pinimg.com/originals/07/8a/b5/078ab50f97a4a8031c9a11b17324f22c.png' // 2048x2048 (1638x1638)
iMoon.src = 'https://www.freeiconspng.com/uploads/moon-png-no-background-15.png' // 800x800

let calc

window.onload = e => {
    calculateTrajactory()

    anim.registerCanvas(document.getElementById('canvas'), {x: 160, y: 320, scale: 3.5}, draw)
    anim.drawAll()
}

const draw = (canvas, ctx, camera, ms, dms) => {
    const begin = performance.now()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        const view = getView(canvas, camera)
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
        const idx = Number(document.getElementById('input').value)
        {
            ctx.save()
            ctx.translate(calc.earth[idx][0]/1000, -calc.earth[idx][1]/1000)
            ctx.scale(6.3781/819, 6.3568/819)
            ctx.translate(-iEarth.width / 2, -iEarth.height / 2)
            ctx.drawImage(iEarth, 0, 0)
            ctx.restore()
        } // iEarth
        {
            ctx.save()
            ctx.translate(calc.moon[idx][0]/1000, -calc.moon[idx][1]/1000)
            ctx.scale(1.738/400, 1.738/400)
            ctx.translate(-iMoon.width / 2, -iMoon.height / 2)
            ctx.drawImage(iMoon, 0, 0)
            ctx.restore()
        } // iMoon
        {
            ctx.save()
            // ctx.translate(calc.satelliet[idx][0]/1000, -calc.satelliet[idx][1]/1000)
            // ctx.scale(1.738/400, 1.738/400)
            // ctx.translate(-iMoon.width / 2, -iMoon.height / 2)
            ctx.beginPath()
            ctx.moveTo(calc.satelliet[0][0]/1000, -calc.satelliet[0][1]/1000)
            for (let i = 200; i < calc.satelliet.length; i += 200) {
                ctx.lineTo(calc.satelliet[i][0]/1000, -calc.satelliet[i][1]/1000)
            }
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = 'yellow'
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(calc.satelliet[idx][0]/1000, -calc.satelliet[idx][1]/1000, 3 / camera.scale, 0, 2 * pi)
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.restore()
        } // Satelliet
    } // Layers
    ctx.restore()

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
    ctx.font = "12.0px Courier"
    ctx.textBaseline = "top" // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    // ctx.textAlign = "start" // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
    ctx.fillText(`${(ms / 1000).toFixed(3)} s`, 10, 10)
    ctx.fillText(`${(performance.now() - begin).toFixed(3)} ms`, 10, 25)
    if (dms) ctx.fillText(`${dms.toFixed(3)} ms`, 10, 40)
}

const getView = (canvas, camera) => {
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

const handleInputEvent = e => {
    const inp = document.getElementById('input')
    const out = document.getElementById('output')
    out.textContent = `${(inp.value / inp.max * 5).toFixed(3)} dagen, t=${inp.value}`
    anim.drawAll()
}

const calculateTrajactory = () => {
    calc = euler()
    document.getElementById('input').max = calc.moon.length - 1
    anim.drawAll()
}

const copyPosition = () => {
    const pos = Number(document.getElementById('input').value)
    const satpos = calc.satelliet[pos]
    const satvel = calc.satellietvelocity[pos]
    document.getElementById('satx').value = satpos[0]
    document.getElementById('saty').value = satpos[1]
    document.getElementById('satspeed').value = sqrt(pow(satvel[0], 2) + pow(satvel[1], 2))
    document.getElementById('satdir').value = atan2(satvel[1], satvel[0]) * 180 / pi
    alert(sat)
}

const getSatelliteInput = () => {
    return {
        satx: Number(document.getElementById('satx').value),
        saty: Number(document.getElementById('saty').value),
        satspeed: Number(document.getElementById('satspeed').value),
        satdir: Number(document.getElementById('satdir').value) / 180 * pi
    }
}

const camera = {x: 1024 / 8, y: 768 / 2, scale: 35}
const visor = { x: null, y: null, visible: false }

let dt = 1 / 220

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
        camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

        camera.x = event.offsetX - (event.offsetX - camera.x) / scaleBefore * camera.scale
        camera.y = event.offsetY - (event.offsetY - camera.y) / scaleBefore * camera.scale
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

    document.querySelectorAll('input[type=range]')[0].addEventListener('input', e => {
        window.requestAnimationFrame(draw)
        dt = 1 / Number(e.target.value)
        outputText('p004', `dt = 1 / ${e.target.value}`)
    })
}

const draw = ms => {
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
            ctx.lineWidth = 1 / camera.scale

            let GM = 20
            let r = 10
            let v = 0
            let a = -GM / Math.pow(r, 2)
            let t = 0
            while (r >= 0) {
                ctx.beginPath()
                ctx.arc(t, -r, 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = 'red'
                ctx.fill()
                ctx.beginPath()
                ctx.arc(t, -v, 1 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = 'brown'
                ctx.fill()
                ctx.beginPath()
                ctx.arc(t, -a, 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = 'green'
                ctx.fill()
                v += a * dt
                r += v * dt
                a = -GM / Math.pow(r, 2)
                t += dt
            }
            outputText('p005', `t = ${t}`)
            // ctx.beginPath()
            // ctx.ellipse(0, 0, Math.sqrt(Math.pow(10, 4) / GM), 10, 0, 0, -Math.PI / 2, true)
            // ctx.strokeStyle = 'blue'
            // ctx.stroke()
            {
                // const dx = 5 / camera.scale
                let toggle = false
                ctx.beginPath()
                for (let x = view.x1; x <= view.x2; x += 1 / camera.scale) {
                    const y = Math.sqrt(100 - 20 * Math.pow(x, 2) / 100)
                    if (Number.isFinite(y)) {
                        if (!toggle) {
                            ctx.moveTo(x, -y)
                            toggle = true
                        }
                        else ctx.lineTo(x, -y)
                    } else toggle = false
                }
                ctx.strokeStyle = 'purple'
                ctx.stroke()
            }
            {
                // const dx = 5 / camera.scale
                let toggle = false
                ctx.beginPath()
                for (let x = view.x1; x <= view.x2; x += 1 / camera.scale) {
                    const y = -20 / Math.pow(Math.pow(10, 2) - 20 * Math.pow(x, 2) / Math.pow(10, 2), 3 / 2)
                    if (Number.isFinite(y)) {
                        if (!toggle) {
                            ctx.moveTo(x, -y)
                            toggle = true
                        }
                        else ctx.lineTo(x, -y)
                    } else toggle = false
                }
                ctx.strokeStyle = 'purple'
                ctx.stroke()
            }
            ctx.restore()
        }
    } // Layers

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
    outputText('p006', `${canvas.width / camera.scale}`)
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

const camera = { x: 512, y: 384, scale: 250 }
const visor = { x: null, y: null, visible: false }
const pi = Math.PI

var alpha = pi / 6
var dAlpha = 8 / 10

window.onload = e => {
    window.requestAnimationFrame(draw)
    window.requestAnimationFrame(draw2)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        event.preventDefault()
        if (!document.querySelectorAll('input[type=checkbox]')[0].checked) {
            window.requestAnimationFrame(draw)

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
        }
    })

    document.getElementById('canvas').addEventListener('mousewheel', event => {
        event.preventDefault()
        if (!document.querySelectorAll('input[type=checkbox]')[0].checked) {
            window.requestAnimationFrame(draw)

            const scaleBefore = camera.scale

            camera.scale *= 1 - event.deltaY / 1000
            // camera.scale = Math.min(Math.max(camera.scale, 10), 1000000)

            camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
            camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale
            doOutput()
        }
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        window.requestAnimationFrame(draw)
        // if (!document.querySelectorAll('input[type=checkbox]')[0].checked) visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        window.requestAnimationFrame(draw)
        visor.visible = false
    })

    document.querySelectorAll('input[type=checkbox]')[0].addEventListener('input', e => {
        if (document.querySelectorAll('input[type=checkbox]')[0].checked) {
            requestAnimationFrame(draw)
            camera.scale = 568 / (Math.sin(alpha + dAlpha) - Math.sin(alpha))
            camera.x = 80 - Math.cos(alpha+dAlpha)*camera.scale
            camera.y = 150 + Math.sin(alpha+dAlpha)*camera.scale
            doOutput()
        }
    })

    document.querySelectorAll('input[type=radio][name=radio1]')[0].addEventListener('input', e => {
        requestAnimationFrame(draw)
    })

    document.querySelectorAll('input[type=radio][name=radio1]')[1].addEventListener('input', e => {
        requestAnimationFrame(draw)
    })

    document.querySelectorAll('input[type=radio][name=radio1]')[2].addEventListener('input', e => {
        requestAnimationFrame(draw)
    })

    document.querySelectorAll('input[type=range]')[0].addEventListener('input', e => {
        requestAnimationFrame(draw)
        requestAnimationFrame(draw2)
        dAlpha = Number(e.target.value)

        if (document.querySelectorAll('input[type=checkbox]')[0].checked) {
            camera.scale = 568 / (Math.sin(alpha + dAlpha) - Math.sin(alpha))
            camera.x = 80 - Math.cos(alpha+dAlpha)*camera.scale
            camera.y = 150 + Math.sin(alpha+dAlpha)*camera.scale
        }

        document.querySelectorAll('label')[1].textContent = `delta alpha: ${dAlpha} rad`
        doOutput()
    })

    document.querySelectorAll('input[type=range]')[1].addEventListener('input', e => {
        requestAnimationFrame(draw)
        requestAnimationFrame(draw2)
        alpha = Number(e.target.value) * pi / 180

        if (document.querySelectorAll('input[type=checkbox]')[0].checked) {
            camera.scale = 568 / (Math.sin(alpha + dAlpha) - Math.sin(alpha))
            camera.x = 80 - Math.cos(alpha+dAlpha)*camera.scale
            camera.y = 150 + Math.sin(alpha+dAlpha)*camera.scale
        }

        document.querySelectorAll('label')[2].textContent = `alpha: ${e.target.value} deg`
        doOutput()
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
        {
            ctx.save()

            ctx.beginPath()
            ctx.moveTo(-1.5, 0)
            ctx.lineTo(1.5, 0)
            ctx.moveTo(0, 1.5)
            ctx.lineTo(0, -1.5)
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = 'gray'
            ctx.stroke()

            ctx.beginPath()
            if (document.querySelectorAll('input[name=radio1][type=radio]')[0].checked) {
                ctx.arc(0, 0, 1, 0, pi * 2)
            }
            if (document.querySelectorAll('input[name=radio1][type=radio]')[1].checked) {
                ctx.arc(0, 0, 1, 0, pi * 2)
            }
            if (document.querySelectorAll('input[name=radio1][type=radio]')[2].checked) {
                ctx.arc(0, 0, 1, -alpha, -(alpha + dAlpha))
            }
            ctx.lineWidth = 2 / camera.scale
            ctx.strokeStyle = 'blue'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(alpha), -Math.sin(alpha))
            ctx.lineTo(Math.cos(alpha), 0)
            ctx.lineWidth = 1.5 / camera.scale
            ctx.strokeStyle = 'red'
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(Math.cos(alpha), -Math.sin(alpha), 3 / camera.scale, 0, pi * 2)
            ctx.fillStyle = 'red'
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(alpha + dAlpha), -Math.sin(alpha + dAlpha))
            ctx.lineWidth = 1.5 / camera.scale
            ctx.strokeStyle = 'green'
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(Math.cos(alpha + dAlpha), -Math.sin(alpha + dAlpha), 3 / camera.scale, 0, pi * 2)
            ctx.fillStyle = 'green'
            ctx.fill()

            if (document.querySelectorAll('input[name=radio1][type=radio]')[1].checked) {
                ctx.beginPath()
                ctx.moveTo(Math.cos(alpha + dAlpha), -(-Math.cos(alpha) * Math.cos(alpha + dAlpha) + 1) / Math.sin(alpha)) // https://www.desmos.com/calculator/tpni5nt2we
                ctx.lineTo(Math.cos(alpha + dAlpha), -Math.sin(alpha))
                ctx.lineTo(Math.cos(alpha), -Math.sin(alpha))
                ctx.closePath()
                ctx.lineWidth = 1.5 / camera.scale
                ctx.strokeStyle = 'black'
                ctx.setLineDash([10/camera.scale, 5/camera.scale])
                ctx.stroke()
            }

            if (document.querySelectorAll('input[name=radio1][type=radio]')[2].checked) {
                ctx.beginPath()
                ctx.moveTo(Math.cos(alpha + dAlpha), -Math.sin(alpha + dAlpha)) // https://www.desmos.com/calculator/tpni5nt2we
                ctx.lineTo(Math.cos(alpha + dAlpha), -Math.sin(alpha))
                ctx.lineTo(Math.cos(alpha), -Math.sin(alpha))
                ctx.lineWidth = 1.5 / camera.scale
                ctx.strokeStyle = 'black'
                ctx.setLineDash([10/camera.scale, 5/camera.scale])
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(0, 0, 1, -alpha, -(alpha + dAlpha), true)
                ctx.stroke()
            }

            ctx.restore()
        } // Shapes
    } // Layers
    ctx.restore()

    ctx.font = '14pt Verdana'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText('\u{1d6fc}', camera.x + camera.scale * 1 / 10, camera.y - camera.scale / 40)

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

const draw2 = ms => {
    const canvas = document.getElementById('canvas2')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    // ctx.translate(camera.x, camera.y)
    // ctx.scale(camera.scale, camera.scale)
    {
        {
            ctx.save()

            ctx.translate(10, canvas.height / 2)
            ctx.scale(100, -100)

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(pi * 2, 0)
            ctx.lineWidth = 1 / 100
            ctx.strokeStyle = 'blue'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, 0)
            const dx = 1 / 30
            var x = dx
            while (x < pi * 2) {
                ctx.lineTo(x, Math.sin(x))
                x += dx
            }
            ctx.strokeStyle = 'black'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(alpha, 0)
            ctx.lineTo(alpha, Math.sin(alpha))
            ctx.strokeStyle= 'red'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(alpha + dAlpha, 0)
            ctx.lineTo(alpha + dAlpha, Math.sin(alpha + dAlpha))
            ctx.strokeStyle= 'green'
            ctx.stroke()

            ctx.restore()
        } // Shapes
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

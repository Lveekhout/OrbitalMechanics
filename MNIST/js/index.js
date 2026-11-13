// Draaien met IntelliJ -> open in... -> Chrome
// https://github.com/cvdfoundation/mnist
const anim = new Animation2d()

window.onload = e => {
    document.getElementsByTagName('canvas')[0].camera = {x: 500, y: 375, scale: 90}
    anim.registerCanvas(document.getElementsByTagName('canvas')[0], document.getElementsByTagName('canvas')[0].camera, draw)
    anim.start()

    networkInit()
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
        // {
        //     ctx.save()
        //     let plaatje
        //     ctx.fillStyle = 'black'
        //     for (let r = 0; r < 100; r++) {
        //         for (let c = 0; c < 100; c++) {
        //             plaatje = testImages[r * 100 + c]
        //             ctx.fillRect(c, r, 28 / 29, 28 / 29)
        //             for (let idx = 0; idx < plaatje.length; idx++) {
        //                 ctx.fillStyle = `#${plaatje[idx].toString(16)}${plaatje[idx].toString(16)}${plaatje[idx].toString(16)}`
        //                 ctx.fillRect(c + (idx % 28) / 29, r + Math.trunc(idx / 28) / 29, 1 / 29, 1 / 29)
        //             }
        //         }
        //     }
        //     ctx.restore()
        // } // image
        {
            drawNetworkSamples(canvas, ctx, camera)
        }
    } // Layers
    ctx.restore()

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
    ctx.font = '12.0px Courier'
    ctx.textBaseline = 'top' // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    // ctx.textAlign = 'start' // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
    ctx.fillText(`${(ms / 1000).toFixed(3)} s`, 10, 10)
    ctx.fillText(`${(performance.now() - begin).toFixed(3)} ms`, 10, 25)
    if (dms) ctx.fillText(`${dms.toFixed(3)} ms`, 10, 40)
    ctx.fillText(`learnidx = ${learnidx}`, 10, 55)
    ctx.fillText(`totalloss = ${totalloss.toFixed(8)}`, 10, 70)
}

const getView = (canvas, camera) => {
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

const checkArrayOfArray = (network) => {
    network.forEach(l => l.forEach((n, i) => {
        if (Number.isNaN(n)) throw `Geen nummer in layer ${l}: ${i}`
    }))
}

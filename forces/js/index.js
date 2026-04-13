let angle = 10 / 180 * pi
let mass = 40
const particle = 3
const g = 9.8
let W, N, R

const anim = new Animation2d()

window.onload = e => {
    anim.registerCanvas(document.getElementById('canvas'), {x: 300, y: 400, scale: 115}, draw)
    anim.start() //anim.drawAll()
}

const draw = (canvas, ctx, camera, ms, dms) => {
    const begin = performance.now()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, -camera.scale)
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
        {
            ctx.save()

            ctx.beginPath()
            ctx.moveTo(view.x1, 0)
            ctx.lineTo(0, 0)
            if (atan2(view.y2, view.x2) <= angle) ctx.lineTo(view.y2 / tan(angle), view.y2)
            else ctx.lineTo(view.x2, tan(angle) * view.x2)
            ctx.strokeStyle = '#444'
            ctx.setLineDash([10 / camera.scale])
            ctx.lineWidth = 1 / camera.scale
            ctx.stroke()

            ctx.restore()
        } // slope
        {
            const r = [particle * cos(angle), -particle * sin(angle)]
            W = new Vector(r, [0, mass * g])
            N = new Vector(r, mass * g * cos(angle), -(angle + pi/2))
            P = new Vector(r, Number(Pvect.value), -angle)
            W.draw(ctx, camera, 8, 'red', 1/200)
            N.draw(ctx, camera, 8, 'blue', 1/200)
            P.draw(ctx, camera, 8, 'orange', 1/200)

            R = W.makeCopy()
            R.addVector(N) // R.addPolar(N.length, N.angle)
            R.addVector(P) // R.addPolar(P.length, P.angle)
//            R.draw(ctx, camera, 8, 'green', 1/200)

            F = new Vector(r, min(R.length, 0.2 * N.length), R.angle + pi)
            F.draw(ctx, camera, 8, 'yellow', 1/200)

            R.addVector(F) // R.addPolar(F.length, F.angle)
            R.draw(ctx, camera, 8, 'purple', 1/200)
        } // vectors
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(particle * cos(angle), particle * sin(angle), 5 / camera.scale, 0, 2*pi)
            ctx.fill()

            ctx.restore()
        } // particle
    } // Layers
    ctx.restore()

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
    ctx.font = "12.0px Courier"
    ctx.textBaseline = "top" // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    // ctx.textAlign = "start" // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
    ctx.fillText(`${(ms / 1000).toFixed(3)} s`, 10, 10)
    ctx.fillText(`${(performance.now() - begin).toFixed(3)} ms`, 10, 25)
    ctx.fillText(`net force: ${R.length.toFixed(3)}`, 10, 40)
    if (dms) ctx.fillText(`${dms.toFixed(3)} ms`, 10, 55)

    angle = Number(Iangle.value) / 2000 * pi
//    angle = pi / 15 + sin(ms/1000) / 6
//    angle = pi / 4 + sin(ms/1000) / 1.3
}

//const getView = (canvas, camera) => {
//    return {
//        x1: -camera.x / camera.scale,
//        y1: -camera.y / camera.scale,
//        x2: (canvas.width - camera.x) / camera.scale,
//        y2: (canvas.height - camera.y) / camera.scale
//    }
//}

const getView = (canvas, camera) => { // getView met scale = -y
    return {
        x1: -camera.x / camera.scale,
        y1: (camera.y - canvas.height) / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: camera.y / camera.scale
    }
}

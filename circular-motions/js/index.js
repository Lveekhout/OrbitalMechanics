let r
let theta
let rx, ry, vx, vy, ax, ay, jx, jy

const anim = new Animation2d()

window.onload = e => {
    anim.registerCanvas(document.getElementById('canvas'), {x: 460, y: 320, scale: 100}, draw)

    document.querySelector('input#input1').dispatchEvent(new Event('input'))
    document.querySelector('input#input2').dispatchEvent(new Event('input'))
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
        if (r && theta) {
            ctx.save()

            const time = new Map([['t', ms / 1000]])
            const rxv = evaluate(rx, time); const ryv = evaluate(ry, time)
            const vxv = evaluate(vx, time); const vyv = evaluate(vy, time)
            const axv = evaluate(ax, time); const ayv = evaluate(ay, time)
            const jxv = evaluate(jx, time); const jyv = evaluate(jy, time)

            if (document.querySelector('input#sdi').checked) new Vector([rxv, ryv]).draw(ctx, camera, 8, 'red')
            if (document.querySelector('input#svi').checked) new Vector([rxv, ryv], [vxv, vyv]).draw(ctx, camera, 8, 'green', 1/5)
            if (document.querySelector('input#sai').checked) new Vector([rxv, ryv], [axv, ayv]).draw(ctx, camera, 8, 'blue', 1/5)
            if (document.querySelector('input#sji').checked) new Vector([rxv, ryv], [jxv, jyv]).draw(ctx, camera, 8, 'purple', 1/15)
            ctx.beginPath()
            ctx.arc(rxv, -ryv, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'black'
            ctx.fill()

            ctx.restore()
        } // Balletje
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

const parseExpr = e => {
    switch (e.target.id) {
        case 'input1':
            try {
                r = new Parser(e.target.value).expr
                e.target.classList.remove('syntax_error')
                document.querySelector('p#errormessage1').innerHTML = '&nbsp;'
            } catch (ex) {
                r = rx = ry = vx = vy = ax = ay = undefined
                e.target.classList.add('syntax_error')
                document.querySelector('p#errormessage1').innerHTML = ex.message
            }
            break
        case 'input2':
            try {
                theta = new Parser(e.target.value).expr
                e.target.classList.remove('syntax_error')
                document.querySelector('p#errormessage2').innerHTML = '&nbsp;'
            } catch (ex) {
                theta = rx = ry = vx = vy = ax = ay = undefined
                e.target.classList.add('syntax_error')
                document.querySelector('p#errormessage2').innerHTML = ex.message
            }
            break
        default:
    }

    if (r && theta) {
        rx = {type: 'multiply', values: [r, {type: 'function', function: 'cos', input: theta}]}
        ry = {type: 'multiply', values: [r, {type: 'function', function: 'sin', input: theta}]}
        vx = completeSimplify(derivativeExpr(rx, 't'))
        vy = completeSimplify(derivativeExpr(ry, 't'))
        ax = completeSimplify(derivativeExpr(vx, 't'))
        ay = completeSimplify(derivativeExpr(vy, 't'))
        jx = completeSimplify(derivativeExpr(ax, 't'))
        jy = completeSimplify(derivativeExpr(ay, 't'))
    }

    // draw()
}

let rc
let goal
let view // tijdelijk public
let vars = new Map([['x', 0], ['y', 0], ['a', 0], ['b', 0], ['c', 0]])

const anim = new Animation2d()

window.onload = e => {
    anim.registerCanvas(document.getElementById('canvas'), {x: 460, y: 520, scale: 100}, draw)

    document.querySelector('input#input1').dispatchEvent(new Event('input'))
    document.querySelector('input#input2').dispatchEvent(new Event('input'))

    document.querySelectorAll('[id^=input-]').forEach(i => {
        i.addEventListener('input', e => {
            e.target.previousSibling.previousSibling.previousSibling.innerHTML = `&nbsp;${e.target.name} = ${e.target.value}`
            vars.set(e.target.name, Number(e.target.value))
            anim.drawAll()
        })
        i.dispatchEvent(new Event('input'))
    })
}

const draw = (canvas, ctx, camera, ms, dms) => {
    const begin = performance.now()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        view = getView(canvas, camera)
        drawRaster(ctx, camera)
        {
            ctx.save()

            if (goal) {
                const stepsize = (view.x2 - view.x1) / canvas.width
                let move = true
                ctx.save()
                ctx.beginPath()
                ctx.strokeStyle = 'green'
                ctx.lineWidth = 3 / camera.scale
                for (let x = view.x1; x <= view.x2; x += stepsize) {
                    vars.set('x', x)
                    const y = evaluate(goal, vars)
                    if (Number.isFinite(y)) {
                        if (move) {
                            ctx.moveTo(x, -y)
                            move = false
                        } else ctx.lineTo(x, -y)
                    } else if (y === Infinity) {
                        if (move) {
                            ctx.moveTo(x, -Number.MAX_SAFE_INTEGER)
                            move = false
                        } else ctx.lineTo(x, -Number.MAX_SAFE_INTEGER)
                    } else if (y === -Infinity) {
                        if (move) {
                            ctx.moveTo(x, -Number.MIN_SAFE_INTEGER)
                            move = false
                        } else ctx.lineTo(x, -Number.MIN_SAFE_INTEGER)
                    } else move = true
                }
                ctx.globalAlpha = document.querySelector('#diralpha').value
                ctx.stroke()
                ctx.restore()
            } // grafiek

            if (rc) {
                ctx.save()
                const stepsize = Number(document.querySelector('#density').value)
                const startx = Math.trunc(view.x1 / stepsize) * stepsize
                const starty = Math.trunc(-view.y2 / stepsize) * stepsize
                for (let x = startx; x <= view.x2; x += stepsize ) {
                    for (let y = starty; y <= -view.y1; y += stepsize ) {
                        const m = f(x, y)
                        const l = document.querySelector('#dirlength').value
                        const h = l / sqrt(m * m + 1)
                        ctx.beginPath()
                        if (Number.isFinite(m)) {
                            ctx.moveTo(x - h, -y + h * m)
                            ctx.lineTo(x + h, -y - h * m)
                        } else if (m === Infinity || m === -Infinity) {
                            ctx.moveTo(x, y - l)
                            ctx.lineTo(x, y + l)
                        } else console.log(`unhandled type: [${m}] at (${x}, ${y})`)
                        ctx.lineWidth = 1 / camera.scale
                        ctx.globalAlpha = document.querySelector('#diralpha').value
                        ctx.strokeStyle = 'blue'
                        ctx.stroke()
                    }
                }
                ctx.restore()
            } // directional field

            if (rc && goal && document.querySelector('#showeuler').checked) {
                let h = Number(document.querySelector('#h').value)
                let x = 0
                vars.set('x', x)
                let y = evaluate(goal, vars)
                do {
                    // console.log(`(${x}, ${y})`)
                    drawDot(ctx, x, y, 3 / camera.scale, 'red')
                    y = y + h * f(x, y)
                    x += h
                } while (x <= view.x2)
            } // Euler's method

            if (rc && goal && document.querySelector('#showmidpoint').checked) {
                let h = Number(document.querySelector('#h').value)
                let x = 0
                vars.set('x', x)
                let y = evaluate(goal, vars)
                do {
                    // console.log(`(${x}, ${y})`)
                    drawDot(ctx, x, y, 3 / camera.scale, 'blue')
                    y = y + h * f(x + h / 2, y + (h / 2) * f(x, y))
                    x += h
                } while (x <= view.x2)
            } // Midpoint method

            if (rc && goal && document.querySelector('#showrk4').checked) {
                let h = Number(document.querySelector('#h').value)
                let x = 0
                vars.set('x', x)
                let y = evaluate(goal, vars)
                do {
                    drawDot(ctx, x, y, 3 / camera.scale, 'purple')
                    const m1 = f(x, y)
                    const m2 = f(x + h / 2, y + (h / 2) * m1)
                    const m3 = f(x + h / 2, y + (h / 2) * m2)
                    const m4 = f(x + h, y + h * m3)
                    y = y + (h / 6) * (m1 + 2 * m2 + 2 * m3 + m4)
                    x += h
                } while (x <= view.x2)
            } // Runge-Kutta method (RK4) https://www.youtube.com/watch?v=JhSzMifZWrI&t=636s

            ctx.restore()
        } // test
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
                rc = new Parser(e.target.value).expr
                e.target.classList.remove('syntax_error')
                document.querySelector('p#errormessage1').innerHTML = '&nbsp;'
            } catch (ex) {
                rc = undefined
                e.target.classList.add('syntax_error')
                document.querySelector('p#errormessage1').innerHTML = ex.message
            }
            break
        case 'input2':
            try {
                goal = new Parser(e.target.value).expr
                e.target.classList.remove('syntax_error')
                document.querySelector('p#errormessage2').innerHTML = '&nbsp;'
            } catch (ex) {
                goal = undefined
                e.target.classList.add('syntax_error')
                document.querySelector('p#errormessage2').innerHTML = ex.message
            }
            break
        default:
    }
    anim.drawAll()
}

const f = (x, y) => {
    vars.set('x', x)
    vars.set('y', y)
    return evaluate(rc, vars)
}

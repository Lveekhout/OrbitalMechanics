const camera = {x: 20, y: 20, scale: 30}
const visor = { x: null, y: null, visible: false }

let example
// let derivative

window.onload = e => {
    document.querySelector('input').dispatchEvent(new Event('input'))

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
    })

    document.getElementById('canvas').addEventListener('mousewheel', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

        camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
        camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale
    })

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        window.requestAnimationFrame(draw)
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        window.requestAnimationFrame(draw)
        visor.visible = false
    })
}

const parseExpr = e => {
    document.querySelector('td#variables').innerHTML = ''
    try {
        setExample(new Parser(e.target.value).expr)
        document.querySelector('input').classList.remove('syntax_error')
        document.querySelector('p#errormessage').innerHTML = '&nbsp;'

        getVariables(example).forEach(e => {
            if (e !== 'x') {
                document.querySelector('td#variables').innerHTML +=
                    `<div style="width: 100%"><span>${e} = 0</span><input oninput="handleRange(event)" type="range" min="-2" max="2" value="0" step="0.01" style="width: 100%; margin: 20px 0 0 0"></div>`
            }
        })
    } catch (e) {
        document.querySelector('input').classList.add('syntax_error')
        document.querySelector('p#errormessage').innerHTML = e.message
    }
}

const setExample = expr => {
    example = expr
    // derivative = wrapDerivative(example, {type:'variable',display:['x', String.fromCodePoint(119909), 'x']})

    window.requestAnimationFrame(draw)

    clearLatexContainer()
    postToLatexContainer(example)
    // postToLatexContainer(derivative)
    MathJax.typesetPromise()
}

const clearLatexContainer = () => {
    document.querySelector('#latexcontainer').innerHTML = ''
}

const postToLatexContainer = latex => {
    switch (latex.constructor.name) {
        case 'Object':
            document.querySelector('#latexcontainer').innerHTML += `<p class=\"latexrow\">\\[${toLatex(latex)}\\]</p>`
            break
        default:
            throw Error(`Onbekend type: [${latex.constructor.name}]`)
    }
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
            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
            ctx.font = "1.0px Courier"
            ctx.textBaseline = "top" // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
            // ctx.textAlign = "start" // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";

            const m = toCanvas(ctx, example, [0, 0])
        } // Text
        {
            // console.time('toGraph')
            const v = samenstellen()
            const stepsize = (view.x2 - view.x1) / canvas.width
            let move = true
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 3 / camera.scale
            for (let x = view.x1; x <= view.x2; x += stepsize) {
                v.set('x', x)
                const y = evaluate(example, v)
                if (Number.isFinite(y)) {
                    if (move) {
                        ctx.moveTo(x, -y)
                        move = false
                    } else ctx.lineTo(x, -y)
                } else move = true
            }
            ctx.stroke()
            ctx.restore()
            // console.timeEnd('toGraph')
        }
    } // Layers
    ctx.restore()
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

const tempCtxTest = (a = 1) => { // Voorbeeld voor hoe om te gaan met beginPath enzo
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    ctx.rotate(a)
    {
        ctx.save()
        ctx.lineWidth = 3 / camera.scale
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(2, 0)
        ctx.lineTo(2, 1/2)
        ctx.lineTo(3, 0)
        ctx.lineTo(2, -1/2)
        ctx.lineTo(2, 0)

        ctx.rect(9, 0, 1, 1)
        ctx.quadraticCurveTo(1,1, 4, 4)
        ctx.quadraticCurveTo(1,2, 5, 5)
        ctx.bezierCurveTo(1,2,3,4,5,6)

        ctx.moveTo(6, 0)
        ctx.lineTo(8, 0)
        ctx.lineTo(8, 1)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
    ctx.restore()
}

const samenstellen = () => {
    const result = new Map()
    document.querySelectorAll('td#variables div').forEach(e => {
        result.set(e.querySelector('span').textContent[0], Number(e.querySelector('input').value))
    })
    return result
}

const handleRange = e => {
    window.requestAnimationFrame(draw)
    const input = e.target
    const span = input.parentElement.querySelector('span')
    span.textContent = `${span.textContent.charAt(0)} = ${input.value}`
}

const tempProbeer = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    ctx.fillText('ZZZ', 0, 0)

    ctx.lineWidth = 1 / 10
    ctx.strokeStyle = 'green'
    const measure = ctx.measureText('ZZZ')
    ctx.strokeRect(0,0,measure.width, -measure.actualBoundingBoxAscent)

    ctx.restore()

    return measure
}

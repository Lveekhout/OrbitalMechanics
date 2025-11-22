const bgColorValue = '#48a957'
const bgColorOperator = '#d94141'
const bgColorFunction = '#4141d9'
const bgColorGroup = '#999'
let gapX = 0.2
let gapY = 0.2

const toCanvas = (ctx, expr, pos = [0, 0], level = 0) => {
    switch (expr.type) {
        case 'variable': {
            const m = ctx.measureText(expr.display[1])
            ctx.fillStyle = bgColorValue
            ctx.fillRect(pos[0], -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText(expr.display[1], pos[0], -pos[1])
            return [m.width, m.fontBoundingBoxDescent]
        }
        case 'constant': {
            const m = ctx.measureText(expr.display[1])
            ctx.fillStyle = bgColorValue
            ctx.fillRect(pos[0], -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText(expr.display[1], pos[0], -pos[1])
            return [m.width, m.fontBoundingBoxDescent]
        }
        case 'integer': {
            const m = ctx.measureText(expr.value)
            ctx.fillStyle = bgColorValue
            ctx.fillRect(pos[0], -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText(expr.value, pos[0], -pos[1])
            return [m.width, m.fontBoundingBoxDescent]
        }
        case 'add': {
            const m = ctx.measureText('+')

            let w = 0
            for (let i = 0; i < expr.values.length; i++) {
                const im = toCanvas(ctx, expr.values[i], [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
                w += im[0] + (i === expr.values.length - 1 ? 0 : gapX)
            }

            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('+', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'multiply': {
            const m = ctx.measureText('*')

            let w = 0
            for (let i = 0; i < expr.values.length; i++) {
                const im = toCanvas(ctx, expr.values[i], [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
                w += im[0] + (i === expr.values.length - 1 ? 0 : gapX)
            }

            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('*', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'fraction': {
            const m = ctx.measureText('/')
            let w = 0
            const m1 = toCanvas(ctx, expr.numerator, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            w += m1[0] + gapX
            const m2 = toCanvas(ctx, expr.denominator, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            w += m2[0]
            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('/', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'exponent': {
            const m = ctx.measureText('^')
            const m1 = toCanvas(ctx, expr.base, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            let w = m1[0] + gapX
            const m2 = toCanvas(ctx, expr.index, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            w += m2[0]
            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('^', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'negate': {
            const m = ctx.measureText('-')
            const m1 = toCanvas(ctx, expr.value, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            let w = m1[0]
            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('-', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'function': {
            const txt = expr.function === 'sqrt' ? String.fromCodePoint(0x221a) : expr.function
            const m = ctx.measureText(txt)
            const m1 = toCanvas(ctx, expr.input, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            let w = Math.max(m1[0], m.width)
            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorFunction
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText(txt, pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        case 'derivative': {
            const m = ctx.measureText('d')
            let w = 0
            const m1 = toCanvas(ctx, expr.expression, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            w += m1[0] + gapX
            const m2 = toCanvas(ctx, expr.variable, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            w += m2[0]
            ctx.fillStyle = bgColorGroup
            ctx.fillRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            ctx.fillStyle = bgColorOperator
            ctx.fillRect(pos[0] + (w - m.width) / 2, -pos[1], m.width, m.fontBoundingBoxDescent)
            ctx.fillStyle = 'white'
            ctx.fillText('d', pos[0] + (w - m.width) / 2, -pos[1])
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeRect(pos[0], -pos[1], w, m.fontBoundingBoxDescent)
            return [w, pos[1]]
        }
        default:
            throw `toCanvas: onbekend type: ${expr.type}`
    }
}

const toCanvasMeasured = (ctx, expr, pos = [0, 0], level = 0) => {
    switch (expr.type) {
        case 'variable': {
            const m = ctx.measureText(expr.display[1])
            return {expr: expr, children: [], measurement: {x: pos[0], y: pos[1], w: m.width, h: m.fontBoundingBoxDescent, sh: m.fontBoundingBoxDescent}}
        }
        case 'constant': {
            const m = ctx.measureText(expr.display[1])
            return {expr: expr, children: [], measurement: {x: pos[0], y: pos[1], w: m.width, h: m.fontBoundingBoxDescent, sh: m.fontBoundingBoxDescent}}
        }
        case 'integer': {
            const m = ctx.measureText(expr.value)
            return {expr: expr, children: [], measurement: {x: pos[0], y: pos[1], w: m.width, h: m.fontBoundingBoxDescent, sh: m.fontBoundingBoxDescent}}
        }
        case 'add': {
            const m = ctx.measureText('+')

            const children = []
            let w = 0
            let h = 0
            for (let i = 0; i < expr.values.length; i++) {
                const im = toCanvasMeasured(ctx, expr.values[i], [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
                children.push(im)
                w += im.measurement.w + (i === expr.values.length - 1 ? 0 : gapX)
                h = Math.max(h, m.fontBoundingBoxDescent + gapY + im.measurement.h)
            }
            return {expr: expr, children: children, measurement: {x: pos[0], y: pos[1], w: w, h: h, sh: m.fontBoundingBoxDescent}}
        }
        case 'multiply': {
            const m = ctx.measureText('*')

            const children = []
            let w = 0
            let h = 0
            for (let i = 0; i < expr.values.length; i++) {
                const im = toCanvasMeasured(ctx, expr.values[i], [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
                children.push(im)
                w += im.measurement.w + (i === expr.values.length - 1 ? 0 : gapX)
                h = Math.max(h, m.fontBoundingBoxDescent + gapY + im.measurement.h)
            }
            return {expr: expr, children: children, measurement: {x: pos[0], y: pos[1], w: w, h: h, sh: m.fontBoundingBoxDescent}}
        }
        case 'fraction': {
            const m = ctx.measureText('/')
            const children = []
            let w = 0
            const m1 = toCanvasMeasured(ctx, expr.numerator, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            children.push(m1)
            w += m1.measurement.w + gapX
            let h = m.fontBoundingBoxDescent + gapY + m1.measurement.h
            const m2 = toCanvasMeasured(ctx, expr.denominator, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            children.push(m2)
            w += m2.measurement.w
            h = Math.max(h, m.fontBoundingBoxDescent + gapY + m2.measurement.h)
            return {expr: expr, children: children, measurement: {x: pos[0], y: pos[1], w: w, h: h, sh: m.fontBoundingBoxDescent}}
        }
        case 'exponent': {
            const m = ctx.measureText('^')
            const children = []
            let w = 0
            const m1 = toCanvasMeasured(ctx, expr.base, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            children.push(m1)
            w += m1.measurement.w + gapX
            let h = m.fontBoundingBoxDescent + gapY + m1.measurement.h
            const m2 = toCanvasMeasured(ctx, expr.index, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1)
            children.push(m2)
            w += m2.measurement.w
            h = Math.max(h, m.fontBoundingBoxDescent + gapY + m2.measurement.h)
            return {expr: expr, children: children, measurement: {x: pos[0], y: pos[1], w: w, h: h, sh: m.fontBoundingBoxDescent}}

        }
        case 'negate': {
            const m = ctx.measureText('-')
            const m1 = toCanvasMeasured(ctx, expr.value, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1).measurement
            let w = m1[0]
            return {expr: expr, measurement: [w, pos[1]]}
        }
        case 'function': {
            const txt = expr.function === 'sqrt' ? String.fromCodePoint(0x221a) : expr.function
            const m = ctx.measureText(txt)
            const m1 = toCanvasMeasured(ctx, expr.input, [pos[0], pos[1] - m.fontBoundingBoxDescent - gapY], level + 1).measurement
            let w = Math.max(m1[0], m.width)
            return {expr: expr, measurement: [w, pos[1]]}
        }
        case 'derivative': {
            const m = ctx.measureText('d')
            let w = 0
            const m1 = toCanvasMeasured(ctx, expr.expression, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1).measurement
            w += m1[0] + gapX
            const m2 = toCanvasMeasured(ctx, expr.variable, [pos[0] + w, pos[1] - m.fontBoundingBoxDescent - gapY], level + 1).measurement
            w += m2[0]
            return {expr: expr, measurement: [w, pos[1]]}
        }
        default:
            throw `toCanvas: onbekend type: ${expr.type}`
    }
}

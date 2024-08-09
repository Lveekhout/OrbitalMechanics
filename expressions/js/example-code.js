const copyObj = obj => {
    switch (obj.constructor.name) {
        case "Number":
            break;
        case "Array":
            break;
        case "Array":
            break;
        case "Array":
            break;
    }
    console.info(`${typeof obj} - ${obj.constructor.name}`)
}

const bgColorValue = '#48a957'
const bgColorOperator = '#d94141'
const bgColorGroup = '#999'
let gapX = 0.2
let gapY = 0.2
const toCanvas = (ctx, expr, pos, level) => {
    if (!level) level = 0
    if (!pos) pos = [0, 0]
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
    }
}

const toString = (expr, level) => {
    if (!level) level = 0
    switch (expr.type) {
        case 'constant':
            return expr.display[0]
        case 'integer':
            return expr.value
        case 'add': {
            let result = ''
            if (level > 0) result += '('
            for (let i = 0; i < expr.values.length; i++) {
                result += toString(expr.values[i], level + 1)
                if (i < expr.values.length - 1) result += '+'
            }
            if (level > 0) result += ')'
            return result
        }
        case 'multiply': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                result += toString(expr.values[i], level + 1)
                if (i < expr.values.length - 1) {
                    if (expr.values[i+1].type === 'integer') result += '*'
                }
            }
            return result
        }
        case 'fraction': {
            let result = ''
            result += toString(expr.numerator)
            result += '/'
            result += toString(expr.denominator)
            return result
        }
        default:
            return `[error: unknown element: ${expr.type}]`
    }
}

const toLatex = (expr, level) => {
    if (!level) level = 0
    switch (expr.type) {
        case 'variable':
        case 'constant':
            return expr.display[2]
        case 'integer':
            return expr.value
        case 'add': {
            let result = ''
            if (level > 0) result += '\\left('
            for (let i = 0; i < expr.values.length; i++) {
                result += toLatex(expr.values[i], level + 1)
                if (i < expr.values.length - 1) result += '+'
            }
            if (level > 0) result += '\\right)'
            return result
        }
        case 'multiply': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                result += toLatex(expr.values[i], level + 1)
                if (i < expr.values.length - 1) {
                    if (expr.values[i+1].type === 'integer') result += '\\cdot'
                }
            }
            return result
        }
        case 'fraction': {
            let result = '\\frac{'
            result += toLatex(expr.numerator, level + 1)
            result += '}{'
            result += toLatex(expr.denominator, level + 1)
            result += '}'
            return result
        }
        case 'derivative': {
            return `\\frac{d}{d${toLatex(expr.variable, level + 1)}}\\left[${toLatex(expr.expression, level + 1)}\\right]`
        }
        default:
            return `[error: unknown element: ${expr.type}]`
    }
}

const evaluate = expr => {
    switch (expr.type) {
        case 'constant':
        case 'integer':
            return expr
        case 'add':
            return expr.values.reduce((a, b) => {
                return { type: 'integer', value: evaluate(a).value + evaluate(b).value }
            })
        default:
            throw `Onbekend expression type: ${expr.type}`
    }
}

const wrapDerivative = (expr, variable) => {
    return { type: 'derivative', expression: JSON.parse(JSON.stringify(expr)), variable: JSON.parse(JSON.stringify(variable)) }
}

const takeDerivative = expr => {
    switch (expr.expression.type) {
        case 'add':
            return { type: 'add', values: expr.expression.values.map(e => wrapDerivative(e, expr.variable))}
        default:
            throw Error(`Onbekend type: [${expr.expression.type}]`)
    }
}

const normalize = (expr, level) => {
    if (!level) level = 0
    console.log(`${"".padStart(level, '\t')}${expr.type}`)
    switch (expr.type) {
        case 'variable':
        case 'constant':
        case 'integer':
            break
        case 'add':
        case 'multiply':
            expr.values.forEach(e => normalize(e, level + 1))
            break
        case 'fraction':
            normalize(expr.numerator, level + 1)
            normalize(expr.denominator, level + 1)
            break
        case 'derivative':
            normalize(expr.expression, level + 1)
            normalize(expr.variable, level + 1)
            break
        default:
            throw Error(`normalize: Onbekende expr.type: [${expr.type}]`)
    }
}

const parse = expr => {

}

const getCtx = () => document.getElementById('canvas').getContext('2d')

const toImage = () => {
    const canvas = document.getElementById('canvas')
    // const ctx = canvas.getContext('2d')
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    window.location.href = image
}

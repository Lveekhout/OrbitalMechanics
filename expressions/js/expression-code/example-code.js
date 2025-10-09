const getVariables = expr => {
    const result = new Set()
    const recurs = (expr, level) => {
        switch (expr.type) {
            case 'variable':
                result.add(expr.display[0])
                break
            case 'constant':
            case 'integer':
                break
            case 'add':
                expr.values.forEach(e => recurs(e, level + 1))
                break
            case 'multiply':
                expr.values.forEach(e => recurs(e, level + 1))
                break
            case 'exponent':
                recurs(expr.base, level + 1)
                recurs(expr.index, level + 1)
                break
            case 'fraction':
                recurs(expr.numerator, level + 1)
                recurs(expr.denominator, level + 1)
                break
            case 'function':
                recurs(expr.input, level + 1)
                break
            case 'negate':
                recurs(expr.value, level + 1)
                break
            default:
                throw Error(`normalize: Onbekende expr.type: [${expr.type}], level: [${level}]`)
        }
    }
    recurs(expr, 0)
    return result
}

const show = expr => {
    console.log(JSON.stringify(expr, null, 4))
}

// const duplicateExpr = expr => {
//     switch(expr.type) {
//         case 'integer':
//             return createExpr(expr.value.toString())
//         case 'constant':
//         case 'variable':
//             return createExpr(expr.display[0])
//         case 'add':
//         case 'multiply':
//             return {type: expr.type, values: expr.values.map(e => duplicateExpr(e))}
//         case 'exponent':
//             return {type: expr.type, base: duplicateExpr(expr.base), index: duplicateExpr(expr.index)}
//         case 'fraction':
//             return {type: expr.type, numerator: duplicateExpr(expr.numerator), denominator: duplicateExpr(expr.denominator)}
//         case 'function':
//             return {type: expr.type, function: expr.function, input: duplicateExpr(expr.input)}
//         case 'negate':
//             return {type: expr.type, value: duplicateExpr(expr.value)}
//         default:
//             throw `duplicateExpr: onbekend type: ${expr.type}`
//     }
// }

const getCanvas = () => document.getElementById('canvas')

const getCtx = () => document.getElementById('canvas').getContext('2d')

const toImage = () => {
    const canvas = document.getElementById('canvas')
    window.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
}

const xor = (x, y) => (x || y) && !(x && y)

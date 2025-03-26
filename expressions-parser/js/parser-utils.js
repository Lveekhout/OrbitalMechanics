const negate = expr => {
    switch (expr.type) {
        case 'integer':
            expr.value = -expr.value
            break
        case 'variable':
            expr.minus = true
            break
        case 'multiply':
        case 'add':
            expr = {type: 'multiply', values: [{type: 'integer', value: -1}, expr]}
            break
        case 'fraction':
            expr = {type: 'multiply', values: [{type: 'integer', value: -1}, expr]}
            // expr.numerator = negate(expr.numerator)
            break
        case 'exponent':
            expr = {type: 'multiply', values: [{type: 'integer', value: -1}, expr]}
            break
        default:
            throw Error(`negate: unhandled type: [${expr.type}]`)
    }
    return expr
}
 const addMultiply = (expr, multiply) => {
    if (expr.type === 'multiply') {
        expr.values.push(multiply)
        return expr
    } else {
        return {type: 'multiply', values: [expr, multiply]}
    }
 }

 const  createNumber = str => {
    if (str.includes('.')) {
        const part = str.split('.')
        const factor = Math.pow(10, part[1].length)
        return {
            type: 'fraction',
            numerator: {type: 'integer', value: Number(part[0] * factor + Number(part[1]))},
            denominator: {type: 'integer', value: factor}
        }
    } else {
        const num = Number(str)
        if (isFinite(num)) return {type: 'integer', value: num}
        else throw Error(`createNumber: not finite: [${str}]`)
    }
 }

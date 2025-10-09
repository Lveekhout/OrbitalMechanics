const negate = expr => {
    switch (expr.type) {
        case 'integer':
            expr.value = -expr.value
            return expr
        case 'constant':
        case 'variable':
        case 'multiply':
        case 'add':
        case 'fraction':
        case 'exponent':
        case 'function':
            return {type: 'negate', value: expr}
        case 'negate':
            return expr.value
        default:
            throw Error(`negate: unhandled type: [${expr.type}]`)
    }
}

const addMultiply = (expr, multiply) => {
    if (expr.type === 'multiply') {
        expr.values.push(multiply)
        return expr
    } else {
        return {type: 'multiply', values: [expr, multiply]}
    }
 }

const createNumber = str => {
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

const map2PowerTower = a => {
    let result = a[a.length - 1]
    for (let i = a.length - 2; i >= 0 ; i--) {
        if (a[i] === '-') {
            result = negate(result)
        } else result = {type: 'exponent', base: a[i], index: result}
    }
    return result
 }

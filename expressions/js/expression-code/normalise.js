const normaliseExpr = expr => {
    switch(expr.type) {
        case 'integer':
        case 'constant':
        case 'variable':
            return JSON.parse(JSON.stringify(expr))
        case 'add':
        case 'multiply':
            let result = []
            expr.values.forEach(e => e.type === expr.type ?
                result = result.concat(normaliseExpr(e).values) :
                result.push(normaliseExpr(e)))
            return {type: expr.type, values: result}
        case 'exponent':
            return {type: expr.type, base: normaliseExpr(expr.base), index: normaliseExpr(expr.index)}
        case 'fraction':
            return {type: expr.type, numerator: normaliseExpr(expr.numerator), denominator: normaliseExpr(expr.denominator)}
        case 'function':
            return {type: expr.type, function: expr.function, input: normaliseExpr(expr.input)}
        case 'negate':
            return {type: expr.type, value: normaliseExpr(expr.value)}
        default:
            throw `normaliseExpr: onbekend type: ${expr.type}`
    }
}


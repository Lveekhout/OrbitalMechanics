const substitute = (expr = {type: "integer", value: 0}, vars = new Map()) => {
    const recurs = expr => {
        switch (expr.type) {
            case 'variable': {
                if (vars.has(expr.display[0])) return JSON.parse(JSON.stringify(vars.get(expr.display[0])))
                else return JSON.parse(JSON.stringify(expr))
            }
            case 'constant':
            case 'integer':
                return JSON.parse(JSON.stringify(expr))
            case 'add':
            case 'multiply':
                return {type: expr.type, values: expr.values.map(e => recurs(e))}
            case 'exponent':
                return {type: expr.type, base: recurs(expr.base), index: recurs(expr.index)}
            case 'fraction':
                return {type: expr.type, numerator: recurs(expr.numerator), denominator: recurs(expr.denominator)}
            case 'function':
                return {type: expr.type, function: expr.function, input: recurs(expr.input)}
            case 'negate':
                return {type: expr.type, value: recurs(expr.value)}
            default:
                throw `substitute: onbekend type: ${expr.type}`
        }
    }
    return recurs(expr)
}

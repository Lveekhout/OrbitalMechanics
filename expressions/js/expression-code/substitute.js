const substitute = (expr = {type: "integer", value: 0}, vars = new Map()) => {
    const recurs = expr => {
        switch (expr.type) {
            case 'variable': {
                if (vars.has(expr.display[0])) return JSON.parse(JSON.stringify(vars.getAsExpr(expr.display[0])))
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

Object.defineProperty(Map.prototype, "getAsExpr", {
    value: function (input) {
        const value = this.get(input)
        switch (value.constructor.name) {
            case 'Number':
                return createExpr(String(value))
            case 'Object':
                return value
            default:
                throw(`getAsExpr: unknown value.constructor.name: [${value.constructor.name}]`)
        }
    },
    writable: true,
    configurable: false,
    enumerable: false // zodat hij niet in for..in loops verschijnt
})

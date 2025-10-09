const evaluate = (expr, vars) => {
    const recurs = expr => {
        switch (expr.type) {
            case 'variable':
                return vars.get(expr.display[0])
            case 'constant':
            case 'integer':
                return expr.value
            case 'add':
            {
                let result = 0
                for (let i = 0; i < expr.values.length; i++) result += recurs(expr.values[i])
                return result
            }
            case 'multiply':
            {
                let result = 1
                for (let i = 0; i < expr.values.length; i++) result *= recurs(expr.values[i])
                return result
            }
            case 'fraction':
                return recurs(expr.numerator) / recurs(expr.denominator)
            case 'exponent':
                return Math.pow(recurs(expr.base), recurs(expr.index))
            case 'function':
                switch (expr.function) {
                    case 'sqrt':
                        return Math.sqrt(recurs(expr.input))
                    case 'sin':
                        return Math.sin(recurs(expr.input))
                    case 'cos':
                        return Math.cos(recurs(expr.input))
                    case 'ln':
                        return Math.log(recurs(expr.input))
                    default:
                        throw `Onbekend function: ${expr.type}`
                }
            case 'negate':
                return -recurs(expr.value)
            default:
                throw `Onbekend expression type: ${expr.type}`
        }
    }
    return recurs(expr)
}

const speedTest = value => {
    if (!value) value = 100
    const example = new Parser('x^2+6x-5')
    const map = new Map()
    console.time('speedTest')
    for (let i = 0; i < value; i++) {
        map.set('x', i)
        evaluate(example.expr, map)
    }
    console.timeEnd('speedTest')
}

const speedTest2 = value => {
    if (!value) value = 100
    console.time('speedTest2')
    for (let i = 0; i < value; i++) {
        x = i
        const y = Math.pow(x, 2) + 6*x - 5
    }
    console.timeEnd('speedTest2')
}

const speedTest3 = value => {
    if (!value) value = 100
    console.time('speedTest3')
    for (let i = 0; i < value; i++) {
        x = i
        const y = eval('Math.pow(x, 2) + 6*x - 5')
    }
    console.timeEnd('speedTest3')
}

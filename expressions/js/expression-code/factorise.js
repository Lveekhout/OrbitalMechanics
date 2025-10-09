const factorise = p => {
    const result = []
    let i = 2
    while (i * i <= p && i === 2) {
        if (p % i === 0) {
            result.push(i)
            p /= i
        } else i++
    }
    while (i * i <= p) {
        if (p % i === 0) {
            result.push(i)
            p /= i
        } else i += 2
    }
    result.push(p)
    return result
}

const factorise2 = p => {
    const result = new Map()
    let i = 2
    while (i * i <= p && i === 2) {
        if (p % i === 0) {
            result.add(i)
            p /= i
        } else i++
    }
    while (i * i <= p) {
        if (p % i === 0) {
            result.add(i)
            p /= i
        } else i += 2
    }
    result.add(p)
    return result
}

const factorise_speedTest = (value = 100) => {
    let result = {}
    const nu = new Date().getTime()
    for (let i = 2; i < value; i++) {
        factorise(i).forEach(v => result[v] = result[v] === undefined ? 1 : result[v] + 1)
    }
    console.log(`duur: ${new Date().getTime() - nu} ms`)
    return result
}

const factorise2_speedTest = (value = 100) => {
    let result = {}
    const nu = new Date().getTime()
    for (let i = 2; i < value; i++) {
        factorise2(i).forEach(v => result[v] = result[v] === undefined ? 1 : result[v] + 1)
    }
    console.log(`duur: ${new Date().getTime() - nu} ms`)
    return result
}

const factoriseExpr = expr => {
    switch (expr.type) {
        case 'integer':
            if (expr.value < 0) {
                const f = factorise(-expr.value)
                return f.length === 1 ? JSON.parse(JSON.stringify(expr)) : negate({type: 'multiply', values: f.map(e => ({type: 'integer', value: e}))})
            } else {
                const f = factorise(expr.value)
                return f.length === 1 ? JSON.parse(JSON.stringify(expr)) : {type: 'multiply', values: f.map(e => ({type: 'integer', value: e}))}
            }
        case 'constant':
        case 'variable':
            return JSON.parse(JSON.stringify(expr))
        case 'add':
        case 'multiply':
            return {type: expr.type, values: expr.values.map(e => factoriseExpr(e))}
        case 'exponent':
            return {type: expr.type, base: factoriseExpr(expr.base), index: factoriseExpr(expr.index)}
        case 'fraction':
            return {type: expr.type, numerator: factoriseExpr(expr.numerator), denominator: factoriseExpr(expr.denominator)}
        case 'function':
            return {type: expr.type, function: expr.function, input: factoriseExpr(expr.input)}
        case 'negate':
            return {type: expr.type, value: factoriseExpr(expr.value)}
        default:
            throw `factoriseExpr: onbekend type: ${expr.type}`
    }
}

const simplifyExpr = expr => {
    switch(expr.type) {
        case 'integer':
        case 'constant':
            return JSON.parse(JSON.stringify(expr))
        case 'variable':
            return JSON.parse(JSON.stringify(expr)) // substitude eventuele variabele waarde
        case 'add':
            return simplifyAdd(normaliseExpr(expr))
        case 'multiply':
            return simplifyMultiply(normaliseExpr(expr))
        case 'exponent':
            return simplifyExponent(expr)
        case 'fraction':
            return simplifyFraction(expr)
        case 'function':
            return simplifyFunction(expr)
        case 'negate':
            return simplifyNegate(expr)
        default:
            throw `simplifyExpr: onbekend type: ${expr.type}`
    }
}

const completeSimplify = (expr, max = 3) => {
    let before = JSON.stringify(expr)
    let after = JSON.stringify(simplifyExpr(JSON.parse(before)))

    while (after !== before) {
        max--
        if (max < 0) throw 'completeSimplify: max attempts reached'
        before = after
        after = JSON.stringify(simplifyExpr(JSON.parse(before)))
    }
    return JSON.parse(after)
}

const simplifyAdd = expr => {
    if (expr.type === 'add') {
        const rest = expr.values.map(e => simplifyExpr(e))
        const integers = rest.filterInPlace(e => e.type === 'integer' || (e.type === 'negate' && e.value.type === 'integer'))
        const fract_int = rest.filterInPlace(e => isIntegerFraction(e))

        let sum = 0
        integers.forEach(e => sum += e.type === 'negate' ? -e.value.value : e.value)

        let num = 0
        let den = 1
        fract_int.forEach(e => den *= e.type === 'negate' ? e.value.denominator.value : e.denominator.value)
        fract_int.forEach(e => num += e.type === 'negate' ? -e.value.numerator.value * den / e.value.denominator.value : e.numerator.value * den / e.denominator.value)
        const answer = {type: 'fraction', numerator: createExpr(String(num)), denominator: createExpr(String(den))}
        answer.numerator.value += sum * answer.denominator.value

        let result
        if (answer.numerator.value === 0) result = {type: 'add', values: rest}
        else result = {type: 'add', values: [simplifyFraction(answer)].concat(rest)}

        if (result.values.length === 0) return {type: 'integer', value: 0}
        else if (result.values.length === 1) return result.values[0]
        else return result
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyMultiply = expr => {
    if (expr.type === 'multiply') {
        const rest = expr.values.map(e => simplifyExpr(e))
        if (rest.anyMatch(e => e.type === 'integer' && e.value === 0)) return {type: 'integer', value: 0}
        const integers = rest.filterInPlace(e => e.type === 'integer' || (e.type === 'negate' && e.value.type === 'integer'))
        const fract_int = rest.filterInPlace(e => isIntegerFraction(e))

        let prod = 1
        integers.forEach(e => prod *= e.type === 'negate' ? -e.value.value : e.value)

        let num = 1
        let den = 1
        fract_int.forEach(e => num *= e.type === 'negate' ? -e.value.numerator.value : e.numerator.value)
        fract_int.forEach(e => den *= e.type === 'negate' ? e.value.denominator.value : e.denominator.value)
        const answer = {type: 'fraction', numerator: createExpr(String(num)), denominator: createExpr(String(den))}
        answer.numerator.value *= prod
        const result = {type: 'multiply', values: [simplifyFraction(answer)].concat(rest)}

        if (result.values.length === 0) return {type: 'integer', value: 0}
        else if (result.values.length === 1) return result.values[0]
        else {
            if (result.values.length > 1) {
                result.values.filterInPlace(e => e.type === 'integer' && e.value === 1)
                if (result.values.length === 1) return result.values[0]
                else return result
            }
            return result
        }
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyMultiply_OG = expr => {
    if (expr.type === 'multiply') {
        const map = new Map()
        expr.values.forEach(e => map.add(JSON.stringify(simplifyExpr(e))))

        const first = Array.from(map).map(e =>
            e[1] === 1 ?
                JSON.parse(e[0]) :
                ({type: 'exponent', base: JSON.parse(e[0]), index: {type: 'integer', value: e[1]}}))

        let prod = 1
        const result = []
        first.forEach(e => {
            if (e.type === 'integer') prod *= e.value
            else if (e.type === 'negate' && e.value.type === 'integer') prod *= -e.value.value
            else result.push(e)
        })

        if (prod === 0) return {type: 'integer', value: 0}
        if (prod !== 1 || result.length === 0) result.unshift({type: 'integer', value: prod})
        if (result.length === 1) return result[0]
        else return {type: expr.type, values: result}
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyExponent = expr => {
    if (expr.type === 'exponent') {
        const b = simplifyExpr(expr.base)
        const i = simplifyExpr(expr.index)

        if (b.type === 'integer' && i.type === 'integer' && (b.value !== 0 || i.value !== 0)) return {type: 'integer', value: Math.pow(b.value, i.value)}
        if (b.type !== 'integer' && i.type === 'integer' && i.value === 0) return {type: 'integer', value: 1}
        if (i.type === 'integer' && i.value === 1) return b
        return {type: expr.type, base: b, index: i}
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyFraction = expr => {
    if (expr.type === 'fraction') {
        const n = simplifyExpr(expr.numerator)
        const d = simplifyExpr(expr.denominator)

        if (d.type === 'integer' && d.value === 0) {
            return {type: 'fraction', numerator: n, denominator: d}
            // return createExpr('0')
        } else if (d.type === 'integer' && d.value === 1) {
            return n
        } else if (n.type === 'integer' && d.type === 'integer') {
            if (n.value % d.value === 0) return {type: 'integer', value: n.value / d.value}
            else {
                const hcf = factorise2(n.value).hcf(factorise2(d.value))
                return {type: 'fraction', numerator: {type: 'integer', value: n.value / hcf}, denominator: {type: 'integer', value: d.value / hcf}}
            }
        } else if (n.type === 'fraction' && d.type === 'fraction') {
            return {
                type: 'fraction',
                numerator: {type: 'multiply', values: [n.numerator, d.denominator]},
                denominator: {type: 'multiply', values: [n.denominator, d.numerator]}
            }
        } else if (n.type !== 'fraction' && d.type === 'fraction') {
            return {
                type: 'fraction',
                numerator: {type: 'multiply', values: [n, d.denominator]},
                denominator: d.numerator
            }
        } else if (n.type === 'fraction' && d.type !== 'fraction') {
            return {
                type: 'fraction',
                numerator: n.numerator,
                denominator: {type: 'multiply', values: [n.denominator, d]}
            }
        } else return {type: expr.type, numerator: n, denominator: d}
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyFunction = expr => {
    if (expr.type === 'function') {
        const inp = simplifyExpr(expr.input)
        if (expr.function === 'ln' && inp.type === 'constant' && inp.display[0] === 'e') return createExpr('1')
        if (expr.function === 'ln' && inp.type === 'integer' && inp.value === 1) return createExpr('0')
        if (expr.function === 'sqrt' && inp.type === 'integer' && Number.isInteger(Math.sqrt(inp.value))) return createExpr(String(Math.sqrt(inp.value)))
        return {type: expr.type, function: expr.function, input: simplifyExpr(inp)}
    } else return JSON.parse(JSON.stringify(expr))
}

const simplifyNegate = expr => {
    if (expr.type === 'negate') {
        const v = simplifyExpr(expr.value)
        if (v.type === 'negate') return v.value
        return {type: expr.type, value: v}
    } else return JSON.parse(JSON.stringify(expr))
}

const isIntegerFraction = expr => {
    switch (expr.type) {
        case 'fraction':
            return expr.numerator.type === 'integer' && expr.denominator.type === 'integer' && expr.denominator.value !== 0
        case 'negate':
            return isIntegerFraction(expr.value)
        case 'default':
            return false
    }
}

Object.defineProperty(Array.prototype, "filterInPlace", {
    value: function (predicate) {
        let removed = []
        for (let i = this.length - 1; i >= 0; i--) {
            if (predicate(this[i], i, this)) {
                removed.push(this[i])
                this.splice(i, 1)
            }
        }
        return removed.reverse()
    },
    writable: true,
    configurable: false,
    enumerable: false // zodat hij niet in for..in loops verschijnt
})

Object.defineProperty(Array.prototype, "anyMatch", {
    value: function (predicate) {
        for(let i = 0; i < this.length; i++) {
            if (predicate(this[i])) return true
        }
        return false
    },
    writable: true,
    configurable: false,
    enumerable: false // zodat hij niet in for..in loops verschijnt
})

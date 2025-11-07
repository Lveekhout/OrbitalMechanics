const wrapDerivative = (expr, variable) => {
    return { type: 'derivative', expression: JSON.parse(JSON.stringify(expr)), variable: JSON.parse(JSON.stringify(variable)) }
}

const takeDerivative = expr => {
    if (expr.type === 'derivative') {
        if (!isFunctionOf(expr.expression, expr.variable.display[0])) {
            return {type: 'integer', value: 0}
        }
        switch (expr.expression.type) {
            case 'add':
                return { type: 'add', values: expr.expression.values.map(e => wrapDerivative(e, expr.variable))}
            default:
                throw Error(`Onbekend expression.type: [${expr.expression.type}]`)
        }
    } else {
        throw Error(`takeDerivative: onbekend type: [${expr.type}]. Moet derivative zijn.`)
    }
}

const identifyDerivative = expr => {
    if (expr.type === 'derivative') {
        switch (expr.expression.type) {
            case 'add':
                return 'sumrule'
            case 'exponent':
                return 'powerrule'
            case 'multiply':
                return 'productrule'
            case 'fraction':
                return 'quotientrule'
            default:
                throw `identifyDerivative: onbekende expressie: ${expr.expression.type}`
        }
    }
    else throw `identifyDerivative: onbekend type: ${expr.type}. Moet derivative zijn`
}

const isFunctionOf = (expr, v) => Array.from(getVariables(expr)).includes(v)

const derivativeExpr = (expr, v = 'x') => {
    if (!isFunctionOf(expr, v)) return {type: 'integer', value: 0}

    switch(expr.type) {
        // case 'integer':
        // case 'constant':
        case 'variable':
            if (expr.display[0] === v) return {type: 'integer', value: 1}
            return {type: 'integer', value: 0}
        case 'add':
            return {type: expr.type, values: expr.values.map(e => derivativeExpr(e, v))}
        case 'multiply':
            const terms = []
            for (let y = 0; y < expr.values.length; y++) {
                let factors = []
                for (let x = 0; x < expr.values.length; x++) {
                    if (x === y) factors.push(derivativeExpr(expr.values[x], v))
                    else factors.push(expr.values[x])
                }
                terms.push({type: 'multiply', values: factors})
            }
            return {type: 'add', values: terms}
        case 'exponent':
            return {type: 'add', values: [
                    {type: 'multiply', values: [
                            {type: 'exponent', base: JSON.parse(JSON.stringify(expr.base)), index: {type: 'add', values: [JSON.parse(JSON.stringify(expr.index)), {type: 'integer', value: -1}]}},
                            JSON.parse(JSON.stringify(expr.index)),
                            derivativeExpr(expr.base, v)
                        ]},
                    {type: 'multiply', values: [
                            JSON.parse(JSON.stringify(expr)),
                            derivativeExpr(expr.index, v),
                            {type: 'function', function: 'ln', input: JSON.parse(JSON.stringify(expr.base))}
                        ]}
                ]}
        case 'fraction':
            return {
                type: 'fraction',
                numerator: {
                    type: 'add', values: [
                        {
                            type: 'multiply', values: [
                                JSON.parse(JSON.stringify(expr.denominator)),
                                derivativeExpr(expr.numerator, v)
                            ]
                        },
                        negate(
                            {
                                type: 'multiply', values: [
                                    JSON.parse(JSON.stringify(expr.numerator)),
                                    derivativeExpr(expr.denominator, v)
                                ]
                            }
                        )
                    ]
                },
                denominator: {
                    type: 'exponent', base: JSON.parse(JSON.stringify(expr.denominator)), index: {type: 'integer', value: 2}
                }
            }
        case 'function':
            if (expr.function === 'sin') return {type: 'multiply', values: [{type: "function", function: "cos", input: JSON.parse(JSON.stringify(expr.input))}, derivativeExpr(expr.input, v)]}
            if (expr.function === 'cos') return {type: 'multiply', values: [negate({type: "function", function: "sin", input: JSON.parse(JSON.stringify(expr.input))}), derivativeExpr(expr.input, v)]}
            if (expr.function === 'ln') return {type: 'fraction', numerator: derivativeExpr(expr.input, v), denominator: expr.input}
            else throw `derivativeExpr: not yet implemented: ${expr.function}`
        case 'negate':
            return {type: expr.type, value: derivativeExpr(expr.value, v)}
        default:
            throw `derivativeExpr: onbekend type: ${expr.type}`
    }
}

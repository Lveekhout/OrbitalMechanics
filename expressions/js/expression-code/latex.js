const toLatex = (expr, level = 0) => {
    switch (expr.type) {
        case 'variable':
        case 'constant':
            return ` ${expr.display[2]} `
        case 'integer':
            return ` ${expr.value} `
        case 'add': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                result += toLatex(expr.values[i], level + 1)
                if (i < expr.values.length - 1 && !isNegative(expr.values[i + 1])) result += '+'
            }
            return result
        }
        case 'multiply': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                if (expr.values[i].type === 'add') result += ' \\left( ' + toLatex(expr.values[i], level + 1) + ' \\right) '
                else result += toLatex(expr.values[i], level + 1)

                if (i < expr.values.length - 1) {
                    // if (['integer', 'variable', 'constant', 'exponent', 'fraction', 'function'].includes(expr.values[i].type)) {
                        if (['integer', 'fraction', 'negate'].includes(firstDisplayableWithinMultiply(expr.values[i + 1])))
                            result += ' \\cdot '
                    // }
                }

                // if (i < expr.values.length - 1) {
                //     switch (true) {
                //         case firstNonMultiply(expr.values[i+1]) === 'integer':
                //         case firstNonExponent(expr.values[i+1]) === 'integer':
                //         case firstNonMultiply(expr.values[i+1]) === 'negate':
                //         case firstNonExponent(expr.values[i+1]) === 'negate':
                //         case lastNonMultiply(expr.values[i]) === 'integer' && firstNonMultiply(expr.values[i+1]) === 'fraction':
                //             result += ' \\cdot '
                //             break
                //         default:
                //     }
                // }
            }
            return result
        }
        case 'fraction': {
            return ` \\frac{${toLatex(expr.numerator, level + 1)}}{${toLatex(expr.denominator, level + 1)}} `
        }
        case 'exponent': {
            if (['add', 'multiply', 'exponent', 'fraction'].includes(expr.base.type))
                return ` \\left( ${toLatex(expr.base, level + 1)} \\right) ^ {${toLatex(expr.index, level + 1)}}`
            else
                return `{${toLatex(expr.base, level + 1)}} ^ {${toLatex(expr.index, level + 1)}}`
        }
        case 'negate': {
            if (['add'].includes(expr.value.type)) return `- \\left( {${toLatex(expr.value, level + 1)}} \\right) `
            else return ` -{${toLatex(expr.value, level + 1)}} `
        }
        case 'function': {
            switch (expr.function) {
                case 'sqrt':
                    return ` \\${expr.function}{${toLatex(expr.input)}} `
                default:
                    return ` \\${expr.function} \\left( ${toLatex(expr.input)} \\right) `
            }
        }
        case 'derivative': {
            return ` \\frac{\\textbf{d}}{\\textbf{d}${toLatex(expr.variable, level + 1)}}\\left[${toLatex(expr.expression, level + 1)}\\right] `
        }
        default:
            return `[error: unknown element: ${expr.type}]`
    }
}

const isNegative = expr => expr.type === 'negate' || (expr.type === 'integer' && expr.value < 0)

// const firstNonMultiply = expr => expr.type === 'multiply' ? firstNonMultiply(expr.values[0]) : expr.type

// const lastNonMultiply = expr => expr.type === 'multiply' ? lastNonMultiply(expr.values[expr.values.length-1]) : expr.type

// const firstNonExponent = expr => expr.type === 'exponent' ? firstNonExponent(expr.base) : expr.type

// const lastNonExponent = expr => expr.type === 'exponent' ? lastNonExponent(expr.index) : expr.type

const firstDisplayableWithinMultiply = expr => {
    switch (expr.type) {
        case 'multiply':
            return firstDisplayableWithinMultiply(expr.values[0])
        case 'exponent':
            return firstDisplayableWithinMultiply(expr.base)
        default:
            return expr.type
    }
}

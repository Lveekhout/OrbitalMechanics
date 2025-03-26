const toLatex = (expr, level) => {
    if (!level) level = 0
    switch (expr.type) {
        case 'variable':
        case 'constant':
            return expr.display[2]
        case 'integer':
            return expr.value
        case 'add': {
            let result = ''
            if (level > 0) result += '\\left('
            for (let i = 0; i < expr.values.length; i++) {
                result += toLatex(expr.values[i], level + 1)
                if (i < expr.values.length - 1) result += '+'
            }
            if (level > 0) result += '\\right)'
            return result
        }
        case 'multiply': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                result += toLatex(expr.values[i], level + 1)
                if (i < expr.values.length - 1) {
                    if (expr.values[i+1].type === 'integer') result += '\\cdot'
                }
            }
            return result
        }
        case 'fraction': {
            let result = '\\frac{'
            result += toLatex(expr.numerator, level + 1)
            result += '}{'
            result += toLatex(expr.denominator, level + 1)
            result += '}'
            return result
        }
        case 'exponent': {
            let result = `{${toLatex(expr.base, level + 1)}}^{${toLatex(expr.index, level + 1)}}`
            return result
        }
        case 'derivative': {
            return `\\frac{\\textbf{d}}{\\textbf{d}${toLatex(expr.variable, level + 1)}}\\left[${toLatex(expr.expression, level + 1)}\\right]`
        }
        default:
            return `[error: unknown element: ${expr.type}]`
    }
}

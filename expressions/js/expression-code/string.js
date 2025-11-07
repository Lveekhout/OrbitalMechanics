const toString = (expr, level) => {
    if (!level) level = 0
    switch (expr.type) {
        case 'constant':
            return expr.display[0]
        case 'integer':
            return expr.value
        case 'add': {
            let result = ''
            if (level > 0) result += '('
            for (let i = 0; i < expr.values.length; i++) {
                result += toString(expr.values[i], level + 1)
                if (i < expr.values.length - 1) {
                    if (expr.values[i+1].type !== 'integer') {
                        result += '+'
                    } else if (expr.values[i+1].value >= 0) {
                        result += '+'
                    }
                }
            }
            if (level > 0) result += ')'
            return result
        }
        case 'multiply': {
            let result = ''
            for (let i = 0; i < expr.values.length; i++) {
                result += toString(expr.values[i], level + 1)
                if (i < expr.values.length - 1) {
                    if (expr.values[i+1].type === 'integer') result += '*'
                }
            }
            return result
        }
        case 'fraction': {
            let result = ''
            result += toString(expr.numerator)
            result += '/'
            result += toString(expr.denominator)
            return result
        }
        default:
            return `[error: unknown element: ${expr.type}]`
    }
}

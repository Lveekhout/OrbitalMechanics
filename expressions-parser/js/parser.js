function Parser(str) {
    let pos = 0
    this.expr = undefined

    const isVariable = () => ['a', 'b', 'c', 'n', 'r', 't', 'x', 'y', 'z'].includes(str.charAt(pos))
    const isDigit = () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(str.charAt(pos))
    const isNumber = () => isDigit()
    const isConstant = () => 'e' === str.charAt(pos) || 'i' === str.charAt(pos) || 'pi' === str.slice(pos, pos + 2)
    const isFunction = () => 'sin' === str.slice(pos, pos + 3)
        || 'cos' === str.slice(pos, pos + 3)
        || 'tan' === str.slice(pos, pos + 3)
        || 'ln' === str.slice(pos, pos + 2)
        || 'log' === str.slice(pos, pos + 3)
        || 'sqrt' === str.slice(pos, pos + 4)
    const isPower = () => '(' === str.charAt(pos) || isConstant() || isNumber() || isVariable() || isFunction()
    const isFactor = () => isPower()
    const isTerm = () => '-' === str.charAt(pos) || isFactor()
    const isExpression = () => isTerm()

    const parseVariable = level => {
        let result
        if (isVariable()) {
            result = {type: 'variable', display: [str.charAt(pos), String.fromCodePoint(119789 + str.charCodeAt(pos)), str.charAt(pos)]}
            pos++
        } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
        return result
    }

    const parseNumber = level => {
        let result
        if (isNumber()) {
            const x = pos
            do pos++; while (isDigit())
            if ('.' === str.charAt(pos)) {
                pos++
                if (isDigit()) {
                    do pos++; while (isDigit())
                } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
            }
            result = createNumber(str.substring(x, pos))
        } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
        return result
    }

    const parseConstant = level => {
        // https://codepoints.net/mathematical_operators
        let result
        if (isConstant()) {
            if ('e' === str.charAt(pos)) {
                result = {type: 'constant', value: Math.E, display: [str.charAt(pos), String.fromCodePoint(119789 + str.charCodeAt(pos)), str.charAt(pos)]}
                pos++
            } else if ('i' === str.charAt(pos)) {
                result = {type: 'constant', value: Math.sqrt(-1), display: [str.charAt(pos), String.fromCodePoint(119789 + str.charCodeAt(pos)), str.charAt(pos)]}
                pos++
            } else if ('pi' === str.slice(pos, pos + 2)) {
                result = {type: 'constant', value: Math.PI, display: ['pi', '\u{1d70b}', '\\pi']}
                pos += 2
            }
        } else throw Error(`parseConstant: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Constant expected`)
        return result
    }

    const parseFunction = level => {
        let result
        if (isFunction()) {
            const x = pos
            do pos++; while(str.charCodeAt(pos) >= 97 && str.charCodeAt(pos) <= 122)
            result = {type: 'function', function: str.substring(x, pos)}
            if ('(' === str.charAt(pos)) {
                pos++
                const input = parseExpression(level + 1)
                if (')' === str.charAt(pos)) {
                    result.input = input
                    pos++
                } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. ')' expected`)
            } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '(' expected`)
        } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Function expected`)
        return result
    }

    const parsePower = level => {
        if (isPower()) {
            let result
            if ('(' === str.charAt(pos)) {
                pos++
                result = parseExpression(level + 1)
                if (')' === str.charAt(pos)) {
                    pos++
                } else throw Error(`parsePower: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. ')' expected`)
            } else if (isFunction()) {
                result = parseFunction(level)
            } else if (isConstant()) {
                result = parseConstant(level)
            } else if (isNumber()) {
                result = parseNumber(level)
            } else if (isVariable()) {
                result = parseVariable(level)
            }
            return result
        } else throw Error(`parsePower: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '(', number or variable expected`)
    }

    const parseFactor = level => {
        if (isFactor()) {
            let result
            result = [parsePower(level)]
            while ('^' === str.charAt(pos)) {
                pos++
                if ('-' === str.charAt(pos)) {
                    pos++
                    result.push('-')
                }
                result.push(parsePower(level))
            }
            return map2PowerTower(result)
        } else throw Error(`parseFactor: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Power expected`)
    }

    const parseTerm = level => {
        if (isTerm()) {
            let result
            let neg = false
            if ('-' === str.charAt(pos)) {
                pos++
                neg = true
            }
            result = parseFactor(level)
            while (['*', '/'].includes(str.charAt(pos)) || isFactor()) {
                if ('*' === str.charAt(pos)) {
                    pos++
                    result = addMultiply(result, parseFactor(level))
                } else if ('/' === str.charAt(pos)) {
                    pos++
                    result = {type: 'fraction', numerator: result, denominator: parseFactor(level)}
                } else result = addMultiply(result, parseFactor(level))
            }
            return neg ? negate(result) : result
        } else throw Error(`parseTerm: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '-' or Factor expected`)
    }

    const parseExpression = level => {
        if (isExpression()) {
            let result = parseTerm(level)
            if (['+', '-'].includes(str.charAt(pos))) {
                result = {type: 'add', values: [result]}
                while (['+', '-'].includes(str.charAt(pos))) {
                    if ('-' === str.charAt(pos)) {
                        pos++
                        result.values.push(negate(parseTerm(level)))
                    } else if ('+' === str.charAt(pos)) {
                        pos++
                        result.values.push(parseTerm(level))
                    } else throw Error(`parseExpression: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '+' or '-' expected`)
                }
            }
            return result
        } else throw Error(`parseExpression: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Minus or Term expected`)
    }

    const parse = () => {
        this.expr = parseExpression(0)
    }

    str = str.replace(/\s/g, '')
    parse()
    if (str.charAt(pos) !== '') {
        throw Error(`Syntax error op pos: [${pos}]: [${str.charAt(pos)}]. End expected`)
    }
}

const createExpr = str => new Parser(str).expr

const createAdd = (...exprs) => ({type: 'add', values: exprs.map(e => JSON.parse(JSON.stringify(e)))})

const createMultiply = (...exprs) => {
    console.log(exprs)
    return {type: 'multiply', values: exprs.map(e => JSON.parse(JSON.stringify(e)))}
}

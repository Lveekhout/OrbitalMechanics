function Parser(str) {
    let pos = 0
    this.expr = undefined

    const isFunction = () => 'sin' === str.slice(pos, pos + 3)
        || 'cos' === str.slice(pos, pos + 3)
        || 'tan' === str.slice(pos, pos + 3)
        || 'ln' === str.slice(pos, pos + 2)
        || 'log' === str.slice(pos, pos + 3)
        || 'sqrt' === str.slice(pos, pos + 4)
    const isVariable = () => str.charCodeAt(pos) >= 97 && str.charCodeAt(pos) <= 122 && str.charAt(pos) != 'e'
    const isDigit = () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(str.charAt(pos))
    const isNumber = () => '-' === str.charAt(pos) || isDigit()
    const isConstant = () => 'e' === str.charAt(pos) || 'pi' === str.slice(pos, pos + 2)
    const isPower = () => '(' === str.charAt(pos) || isConstant() || isNumber() || isVariable() || isFunction()
    const isFactor = () => isPower()
    const isTerm = () => isFactor()
    const isExpression = () => '-' === str.charAt(pos) || isTerm()

    const parseWhitespace = () => {
        while ([' ', '\t', '\n'].includes(str.charAt(pos))) pos++
    }

    const parseVariable = level => {
        let result
        if (isVariable()) {
            result = {type: 'variable', display: [str.charAt(pos), String.fromCodePoint(119789 + str.charCodeAt(pos)), str.charAt(pos)]}
            pos++
            parseWhitespace()
        } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
        return result
    }

    const parseNumber = level => {
        let result
        if (isNumber()) {
            const x = pos
            if ('-' === str.charAt(pos)) pos++
            do pos++; while (isDigit())
            if ('.' === str.charAt(pos)) {
                pos++
                if (isDigit()) {
                    do pos++; while (isDigit())
                } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
            }
            result = createNumber(str.substring(x, pos))
            parseWhitespace()
        } else throw Error(`parseNumber: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Digit expected`)
        return result
    }

    const parseConstant = level => {
        let result
        if (isConstant()) {
            if ('e' === str.charAt(pos)) {
                result = {type: 'constant', value: Math.E, display: [str.charAt(pos), String.fromCodePoint(119789 + str.charCodeAt(pos)), str.charAt(pos)]}
                pos++
            } else if ('pi' === str.slice(pos, pos + 2)) {
                result = {type: 'constant', value: Math.PI, display: ['pi', '\u{1d70b}', '\\pi']}
                pos += 2
            }
            parseWhitespace()
        } else throw Error(`parseConstant: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Constant expected`)
        return result
    }

    const parseFunction = level => {
        let result
        if (isFunction()) {
            const x = pos
            do pos++; while(str.charCodeAt(pos) >= 97 && str.charCodeAt(pos) <= 122)
            result = {type: str.substring(x, pos)}
            parseWhitespace()
            if ('(' === str.charAt(pos)) {
                pos++
                parseWhitespace()
                const input = parseExpression(level + 1)
                parseWhitespace()
                if (')' === str.charAt(pos)) {
                    result.input = input
                    pos++
                    parseWhitespace()
                } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. ')' expected`)
            } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '(' expected`)
        } else throw Error(`parseFunction: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Function expected`)
        return result
    }

    const parsePower = level => {
        let result
        if (isPower()) {
            if ('(' === str.charAt(pos)) {
                pos++
                parseWhitespace()
                result = parseExpression(level + 1)
                parseWhitespace()
                if (')' === str.charAt(pos)) {
                    pos++
                    parseWhitespace()
                } else throw Error(`parsePower: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. ')' expected`)
            } else if (isFunction()) {
                result = parseFunction(level)
                parseWhitespace()
            } else if (isConstant()) {
                result = parseConstant(level)
                parseWhitespace()
            } else if (isNumber()) {
                result = parseNumber(level)
                parseWhitespace()
            } else if (isVariable()) {
                result = parseVariable(level)
                parseWhitespace()
            }
        } else throw Error(`parsePower: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '(', number or variable expected`)
        return result
    }

    const parseFactor = level => {
        let result
        if (isFactor()) {
            result = parsePower(level)
            parseWhitespace()
            while ('^' === str.charAt(pos)) {
                pos++
                parseWhitespace()
                result = {type: 'exponent', base: result, index: parsePower(level)}
                parseWhitespace()
            }
        } else throw Error(`parseFactor: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Power expected`)
        return result
    }

    const parseTerm = level => {
        let result
        if (isTerm()) {
            result = parseFactor(level)
            parseWhitespace()
            while (['*', '/'].includes(str.charAt(pos))) {
                if ('*' === str.charAt(pos)) {
                    pos++
                    parseWhitespace()
                    result = addMultiply(result, parseFactor(level))
                    // result = {type: 'multiply', values: [result, parseFactor(level)]}
                } else if ('/' === str.charAt(pos)) {
                    pos++
                    parseWhitespace()
                    result = {type: 'fraction', numerator: result, denominator: parseFactor(level)}
                }
                parseWhitespace()
            }
        } else throw Error(`parseTerm: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Factor expected`)
        return result
    }

    const parseExpression = level => {
        let result
        if (isExpression()) {
            if ('-' === str.charAt(pos)) {
                pos++
                result = negate(parseTerm(level))
            } else {
                result = parseTerm(level)
            }
            parseWhitespace()
            if (['+', '-'].includes(str.charAt(pos))) {
                result = {type: 'add', values: [result]}
                while (['+', '-'].includes(str.charAt(pos))) {
                    if ('-' === str.charAt(pos)) {
                        pos++
                        parseWhitespace()
                        result.values.push(negate(parseTerm(level)))
                        parseWhitespace()
                    } else if ('+' === str.charAt(pos)) {
                        pos++
                        parseWhitespace()
                        result.values.push(parseTerm(level))
                        parseWhitespace()
                    } else throw Error(`parseExpression: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. '+' or '-' expected`)
                }
            }
        } else throw Error(`parseExpression: unknown character at pos: [${pos}]: [${str.charAt(pos)}]. Minus or Term expected`)
        return result
    }

    const parse = () => {
        parseWhitespace()
        this.expr = parseExpression(0)
    }

    parse()
    if (str.charAt(pos) !== '') {
        throw Error(`Syntax error op pos: [${pos}]: [${str.charAt(pos)}]. End expected`)
    }
}

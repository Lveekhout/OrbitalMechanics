const example = new Parser('cos(-ab-sin(x-ln(e^x^2+x^2+x/3-8)))').expr

const derivative = wrapDerivative(example, {type: 'variable', display: ['x', '\u{1d465}', 'x']}) // [string, canvas, latex]

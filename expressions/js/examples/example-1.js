const example = {
    type: 'add',
    values: [{
        type: 'constant',
        value: Math.PI,
        display: ['pi', '\u{1d70b}', '\\pi'] // [string, canvas, latex]
    }, {
        type: 'add',
        values: [{
            type: 'integer',
            value: 12
        }, {
            type: 'integer',
            value: 24
        }]
    }, {
        type: 'integer',
        value: 2
    }, {
        type: 'integer',
        value: 30
    }, {
        type: 'add',
        values: [{
            type: 'integer',
            value: 1
        }, {
            type: 'add',
            values: [{
                type: 'integer',
                value: 1
            }, {
                type: 'add',
                values: [{
                    type: 'integer',
                    value: 16
                }, {
                    type: 'integer',
                    value: 32
                }]
            }]
        }, {
            type: 'add',
            values: [{
                type: 'integer',
                value: 3
            }, {
                type: 'integer',
                value: 3
            }]
        }]
    }, {
        type: 'multiply',
        values: [
            {
                type: 'integer',
                value: 321
            }, {
                type: 'integer',
                value: 321
            }
        ]
    }]
}
const quotient = {
    type: 'fraction',
    numerator: example,
    denominator: {
        type: 'integer',
        value: 321
    }
}
const derivative = wrapDerivative(example, {
    type: 'variable',
    display: ['x', '\u{1d465}', 'x'] // [string, canvas, latex]
})

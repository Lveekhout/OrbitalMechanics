const example = {
    type: 'multiply',
    values: [
        {
            type: 'fraction',
            numerator: {
                type: 'integer',
                value: 1
            },
            denominator: {
                type: 'integer',
                value: 3
            }
        },
        {
            type: 'add',
            values: [
                {
                    type: 'integer',
                    value: 1
                },
                {
                    type: 'multiply',
                    values: [
                        {
                            type: 'variable',
                            display: ['x', '\u{1d465}', 'x'] // [string, canvas,latex]
                        },
                        {
                            type: 'integer',
                            value: 2
                        },
                        {
                            type: 'constant',
                            value: Math.PI,
                            display: ['pi', '\u{1d70b}', '\\pi'] // [string, canvas,latex]
                        }
                    ]
                }
            ]
        }
    ]
}

const derivative = {
    type: 'derivative',
    expression: JSON.parse(JSON.stringify(example)),
    variable: {
        type: 'add',
        values: [{
            type: 'integer',
            value: 2
        }, {
            type: 'variable',
            display: ['x', '\u{1d465}', 'x'] // [string, canvas, latex]
        }]
    }
}

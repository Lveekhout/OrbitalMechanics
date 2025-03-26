const example = {
    type: "add",
    values: [{
        type: "integer",
        value: 1
    }, {
        type: "integer",
        value: 2
    }, {
        type: "add",
        values: [{
            type: "integer",
            value: 3
        }, {
            type: "constant",
            value: Math.PI,
            display: ['pi', '\u{1d70b}', '\\pi'] // [string, canvas, latex]
        }, {
            type: "add",
            values: [{
                type: "integer",
                value: 11
            }, {
                type: "integer",
                value: 12
            }]
        }]
    }]
}

const derivative = {
    type: 'derivative',
    expression: JSON.parse(JSON.stringify(example)),
    variable: {
        type: 'variable',
        display: ['x', '\u{1d465}', 'x'] // [string, canvas, latex]
    }
}

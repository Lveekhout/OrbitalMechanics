const example = {
    type: 'add',
    values: [
        {
            type: 'add',
            values: [{
                type: 'add',
                values: [
                    {
                        type: 'add',
                        values: [
                            {
                                type: 'integer',
                                value: 1
                            },
                            {
                                type: 'integer',
                                value: 2
                            }
                        ]
                    },
                    {
                        type: 'add',
                        values: [
                            {
                                type: 'integer',
                                value: 8
                            },
                            {
                                type: 'integer',
                                value: 9
                            }
                        ]
                    }
                ]
            }, {
                type: 'integer',
                value: 123
            }]
        }, {
           type: 'integer',
           value: 999
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

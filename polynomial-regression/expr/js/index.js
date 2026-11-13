const camera = {x: 130, y: 540, scale: 70}
const anim = new Animation2d()

window.onload = e => {
    coeff = solveMatrix(mapToMatrixNumeric())
    anim.registerCanvas(document.getElementById('canvas'), camera, draw)
    canvas.addEventListener('mousemove', event => {
        const selected = points.find(p => p.selected)
        const coord = [(event.offsetX - camera.x) / camera.scale, (event.offsetY - camera.y) / -camera.scale]
        if (selected && event.buttons === 1) {
            event.stopImmediatePropagation()
            selected.x += event.movementX / camera.scale
            selected.y -= event.movementY / camera.scale
            coeff = solveMatrix(mapToMatrixNumeric())
            anim.drawAll()
        } else {
            const selected = findSelected(coord)
            if (selected) {
                canvas.style.cursor = 'default'
                selected.selected = true
            } else {
                canvas.style.cursor = 'move'
                points.forEach(p => p.selected = false)
            }
        }
    }, true) // true zorgt ervoor dat deze listener in de capture phase wordt uitgevoerd, dus vóór de anderen

    document.querySelector('#points').innerHTML = ""
    for (let n = 1; n <= 20; n++) document.querySelector('#points').add(new Option(n))
    document.querySelector('#points').querySelectorAll('option')[19].selected = true

    coeff = solveMatrix(mapToMatrixNumeric())
    anim.drawAll()
}

// x = [
//     [
//         {"type": "variable", "display": ["p0", "𝑝0", "p0"]},
//         {"type": "variable", "display": ["p1", "𝑝1", "p1"]},
//         {"type": "variable", "display": ["p2", "𝑝2", "p2"]},
//         {"type": "variable", "display": ["r0", "𝑟0", "r0"]}
//     ],
//     [
//         {"type": "variable", "display": ["p1", "𝑝1", "p1"]},
//         {"type": "variable", "display": ["p2", "𝑝2", "p2"]},
//         {"type": "variable", "display": ["p3", "𝑝3", "p3"]},
//         {"type": "variable", "display": ["r1", "𝑟1", "r1"]}
//     ],
//     [
//         {"type": "variable", "display": ["p2", "𝑝2", "p2"]},
//         {"type": "variable", "display": ["p3", "𝑝3", "p3"]},
//         {"type": "variable", "display": ["p4", "𝑝4", "p4"]},
//         {"type": "variable", "display": ["r2", "𝑟2", "r2"]}
//     ]
// ]
x = [
    [
        {"type": "integer", "value": 2},
        {"type": "integer", "value": 3},
        {"type": "integer", "value": 5},
        {"type": "integer", "value": 29}
    ],
    [
        {"type": "integer", "value": 7},
        {"type": "integer", "value": 11},
        {"type": "integer", "value": 13},
        {"type": "integer", "value": 31}
    ],
    [
        {"type": "integer", "value": 17},
        {"type": "integer", "value": 19},
        {"type": "integer", "value": 23},
        {"type": "integer", "value": 37}
    ]
]

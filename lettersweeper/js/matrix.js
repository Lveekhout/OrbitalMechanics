const matrix = [
    [null, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, 'A', undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
]
const selected = {x: undefined, y: undefined}

const getOmliggend = (rij, cell) => {
    return [[rij - 1, cell - 1], [rij - 1, cell], [rij - 1, cell + 1], [rij, cell - 1], [rij, cell + 1], [rij + 1, cell - 1], [rij + 1, cell], [rij + 1, cell + 1]]
        .filter(v => v[0] > -1 && v[0] < 10 && v[1] > -1 && v[1] < 10)
}
const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const cellWidth = canvas.width / 10
    const cellHeight = canvas.height / 10
    let rectColor
    matrix.forEach((rij, rij_idx) => {
        rij.forEach((cell, cell_idx) => {
            rectColor = 'green'
            if (typeof matrix[rij_idx][cell_idx] === 'number') rectColor = 'yellow'
            if (typeof matrix[rij_idx][cell_idx] === 'string') rectColor = 'blue'
            if (typeof matrix[rij_idx][cell_idx] === 'object') rectColor = 'orange'
            roundRect(ctx, cell_idx * cellWidth + 2, rij_idx * cellHeight + 2, cellWidth - 4, cellHeight - 4, 15, rectColor)
            ctx.save()
            if (matrix[rij_idx][cell_idx] !== undefined && matrix[rij_idx][cell_idx] !== null) {
                ctx.font = '30pt Verdana'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(matrix[rij_idx][cell_idx], cell_idx * cellWidth + cellWidth / 2, rij_idx * cellHeight + cellHeight / 2)
            }
            ctx.restore()
        })
    })
}

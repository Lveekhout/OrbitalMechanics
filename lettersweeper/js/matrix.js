//const matrix = [
//    [1, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
//]

const matrix = [[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,1,0],[undefined,undefined,undefined,undefined,2,undefined,undefined,undefined,2,1],[undefined,undefined,undefined,undefined,4,"R",undefined,undefined,undefined,undefined],[undefined,undefined,undefined,"R",4,"N",undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined,undefined,4,undefined,2,undefined,undefined],[undefined,undefined,undefined,undefined,undefined,"E","F",undefined,"F",1],[undefined,undefined,1,undefined,"P",undefined,"E",4,1,1],[undefined,undefined,undefined,"G",undefined,undefined,"U",2,0,0],[undefined,undefined,undefined,undefined,undefined,undefined,undefined,2,1,0],[undefined,undefined,undefined,undefined,undefined,undefined,undefined,"H",1,0]]

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

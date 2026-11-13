// const showMatrix = (matrix, padding = 20) => {
//     let str = ""
//     for (let r = 0; r < matrix.length; r++) {
//         for (let c = 0; c < matrix[r].length; c++) {
//             str += (Math.round(matrix[r][c] * 1e15) / 1e15).toFixed(15).replace(/\.?0+$/, '').padStart(padding)
//         }
//         str += `\n`
//     }
//     console.log(str)
// }

const exMultiplyRow = (matrix, row, factor) => {
    for (let c = 0; c < matrix[row].length; c++) matrix[row][c] = createMultiply(matrix[row][c], factor)
}

const exSubtractRow = (matrix, rowDest, rowSource) => {
    for (let c = 0; c < matrix[rowDest].length; c++) matrix[rowDest][c] = createAdd(matrix[rowDest][c], negate(matrix[rowSource][c]))
}

const exEliminate_down = matrix => {
    for (let r = 0; r < matrix.length - 1; r++) {
        for (let ri = r + 1; ri < matrix.length; ri++) {
            exMultiplyRow(matrix, ri, createFraction(matrix[r][r], matrix[ri][r]))
            exSubtractRow(matrix, ri, r)
        }
    }
}

const exEliminate_up = matrix => {
    for (let r = matrix.length - 1; r > 0; r--) {
        for (let ri = r - 1; ri >= 0; ri--) {
            exMultiplyRow(matrix, ri, createFraction(matrix[r][r], matrix[ri][r]))
            exSubtractRow(matrix, ri, r)
        }
    }
}

const exDivide_through = matrix => {
    for (let ri = 0; ri < matrix.length; ri++) {
        matrix[ri][matrix.length] = createFraction(matrix[ri][matrix.length], matrix[ri][ri])
        matrix[ri][ri] = createFraction(matrix[ri][ri], matrix[ri][ri])
    }
}

const exSolveMatrix = matrix => {
    exEliminate_down(matrix)
    exEliminate_up(matrix)
    exDivide_through(matrix)
    return matrix.map(r => r[r.length - 1])
}

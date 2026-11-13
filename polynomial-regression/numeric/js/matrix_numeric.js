const solveMatrix = matrix => {
    eliminate_down(matrix)
    eliminate_up(matrix)
    divide_through(matrix)
    return matrix.map(r => r[r.length - 1])
}

const showMatrix = (matrix, padding = 20) => {
    let str = ""
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            str += (Math.round(matrix[r][c] * 1e15) / 1e15).toFixed(15).replace(/\.?0+$/, '').padStart(padding)
        }
        str += `\n`
    }
    console.log(str)
}

const multiplyRow = (matrix, row, factor) => {
    for (let c = 0; c < matrix[row].length; c++) matrix[row][c] *= factor
}

const subtractRow = (matrix, rowDest, rowSource) => {
    for (let c = 0; c < matrix[rowDest].length; c++) {
        matrix[rowDest][c] -= matrix[rowSource][c]
    }
    if (matrix[rowDest][rowDest] === 0) {
        showMatrix(matrix)
        throw `ERROR`
    }
}

const eliminate_down = (matrix) => {
    for (let r = 0; r < matrix.length - 1; r++) {
        for (let ri = r + 1; ri < matrix.length; ri++) {
            multiplyRow(matrix, ri, matrix[r][r] / matrix[ri][r])
            subtractRow(matrix, ri, r)
        }
    }
}

const eliminate_up = (matrix) => {
    for (let r = matrix.length - 1; r > 0; r--) {
        for (let ri = r - 1; ri >= 0; ri--) {
            multiplyRow(matrix, ri, matrix[r][r] / matrix[ri][r])
            subtractRow(matrix, ri, r)
        }
    }
}

const divide_through = matrix => {
    for (let ri = 0; ri < matrix.length; ri++) {
        matrix[ri][matrix.length] /= matrix[ri][ri]
        matrix[ri][ri] /= matrix[ri][ri]
    }
}

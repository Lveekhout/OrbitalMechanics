const determinant_evaluate = (matrix, level = 0) => {
    // console.log(`${level} - ${JSON.stringify(matrix)}`)
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    } else if (matrix.length > 2) {
        let result = 0
        for (let m = 0; m < matrix.length; m++) {
            const submatrix = getSubMatrix(matrix, m, 0)
            if (m%2 === 0) result += matrix[m][0] * determinant_evaluate(submatrix, level + 1)
            if (m%2 === 1) result -= matrix[m][0] * determinant_evaluate(submatrix, level + 1)
        }
        return result
    } else throw `not yet implemented`
}

const determinant_str = (matrix, level = 0) => {
    if (matrix.length === 2) {
        return `${matrix[0][0]}${matrix[1][1]} - ${matrix[0][1]}${matrix[1][0]}`
    } else if (matrix.length > 2) {
        let result = ""
        for (let m = 0; m < matrix.length; m++) {
            const submatrix = getSubMatrix(matrix, m, 0)
            if (m%2 === 0) result += ` + ${matrix[m][0]}(${determinant_str(submatrix, level + 1)})`
            if (m%2 === 1) result += ` - ${matrix[m][0]}(${determinant_str(submatrix, level + 1)})`
        }
        return result.substring(3)
    } else throw `not yet implemented`
}

const getSubMatrix = (matrix, r, c) => {
    // console.log(JSON.stringify(matrix))
    const sub = JSON.parse(JSON.stringify(matrix))
    sub.splice(r, 1)
    // console.log(JSON.stringify(sub))
    sub.forEach(e => e.splice(c, 1))
    // console.log(JSON.stringify(sub))
    return sub
}

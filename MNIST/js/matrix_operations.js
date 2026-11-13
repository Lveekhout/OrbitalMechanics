const matrix_multiply_output = (matrix, input, output) => {
    let idx = 0
    for (let r = 0; r < output.length; r++) {
        let sub = 0
        for (let c = 0; c < input.length; c++) {
            sub += matrix[idx] * input[c]
            idx++
        }
        output[r] = sub
    }
}

const create_matrix_gen3 = (...node) => { // voorbeeld: create_matrix_gen3(784, 16, 16, 10)
    let product = 1
    for (let n = 1; n < node.length - 1; n++) product *= node[n]
    // console.log(`product = ${product}`)

    const result = []
    result.push(Array.from({length: node[0]}, () => 0)) // input
    for (let n = 1; n < node.length; n++) {
        result.push(Array.from({length: node[n - 1] * node[n]}, () => Math.random() * 2 - 1)) // weights
        // result.push(Array.from({length: node[n - 1] * node[n]}, (_, a) => Math.sin(a*n))) // weights
        result.push(Array.from({length: node[n]}, () => 0)) // matrix-result
        result.push(Array.from({length: node[n]}, () => 0)) // bias
        result.push(Array.from({length: node[n]}, () => 0)) // hidden / output
    }
    return result
}

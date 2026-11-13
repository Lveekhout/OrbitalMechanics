let track
let car
let volgauto

let activations

// const trainingdata = []

const initScenario = camera => {
    track = new Track(camera)

    car = new Car(camera, track)
    car.color = 'red'

    volgauto = new Car(camera, track)
    volgauto.s = -2
    volgauto.color = 'blue'

    activations = [tanh, x => x]

    setInterval(() => {
        car.a = Math.random() * 8 - 4
    }, 2000)
}

const scenarioDraw = (ctx, camera, ds) => {
    track.draw(ctx)

    car.draw(ctx)
    volgauto.draw(ctx)

    network[0][0] = car.s - volgauto.s
    network[0][1] = car.v
    network[0][2] = volgauto.v
    forward(network)
    volgauto.a = network[network.length - 1][0]

    car.update(ds, 12)
    volgauto.update(ds, 15)
}

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
    const result = []
    result.push(Array.from({length: node[0]}, () => 0)) // input
    for (let n = 1; n < node.length; n++) {
        result.push(Array.from({length: node[n - 1] * node[n]}, () => Math.random() * 2 - 1)) // weights
        result.push(Array.from({length: node[n]}, () => 0)) // matrix-result
        result.push(Array.from({length: node[n]}, () => 0)) // bias
        result.push(Array.from({length: node[n]}, () => 0)) // hidden / output
    }
    return result
}

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = activations[idx / 4](network[idx + 2][n] + network[idx + 3][n])
    }
}

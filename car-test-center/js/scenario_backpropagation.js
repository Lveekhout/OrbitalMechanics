let network
let activations = [tanh, tanh, tanh, tanh, x => x]
let activationsdiv = [tanhdiv, tanhdiv, tanhdiv, tanhdiv, x => 1]
let learningrate = 100000

const initScenario = camera => {
    network = create_matrix_gen3(2, 64, 64, 64, 64, 1)
    // trainingdata = trainingdata.map(e => ([tanh(e[0]), tanh(e[1] - e[2]), tanh(e[3])]))

    const button = document.createElement('button')
    button.textContent = 'Copy Network to Clipboard'
    button.addEventListener('click', () => setClipboard(downloadNetwork()))
    document.body.appendChild(button)
}

const scenarioDraw = (ctx, camera, view, ds) => {
    {
        ctx.save()

        ctx.beginPath()
        for (let x = Math.trunc(view.x1); x <= Math.trunc(view.x2); x++) {
            ctx.moveTo(x, view.y1)
            ctx.lineTo(x, view.y2)
        }
        for (let y = Math.trunc(view.y1); y <= Math.trunc(view.y2); y++) {
            ctx.moveTo(view.x1, y)
            ctx.lineTo(view.x2, y)
        }
        ctx.lineWidth = 1 / camera.scale
        ctx.strokeStyle = '#ccc'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(view.x1, 0)
        ctx.lineTo(view.x2, 0)
        ctx.moveTo(0, view.y1)
        ctx.lineTo(0, view.y2)
        ctx.lineWidth = 1 / camera.scale
        ctx.strokeStyle = '#f88'
        ctx.stroke()

        ctx.restore()
    } // Raster
    // {
    //     trainingdata.forEach(e => {
    //         const x = e[0]
    //         const y = e[1] - e[2]
    //         ctx.beginPath()
    //         ctx.arc(x, -y, 9 / camera.scale, 0, Math.PI * 2)
    //         ctx.globalAlpha = (e[3] + 10) / 20 + 1/4
    //         ctx.fillStyle = 'red'
    //         ctx.fill()
    //         // ctx.beginPath()
    //         // ctx.arc(x, -y, 3 / camera.scale, 0, Math.PI * 2)
    //         // ctx.globalAlpha = 1
    //         // ctx.fillStyle = 'red'
    //         // ctx.fill()
    //     })
    // } // rode balletjes
    {
        trainingdata.forEach((e, i) => {
            const x = i
            const y = e[3]
            ctx.beginPath()
            ctx.arc(x, -y, 2 / camera.scale, 0, Math.PI * 2)
            ctx.globalAlpha = 1
            ctx.fillStyle = 'red'
            ctx.fill()
        })
    } // rode balletjes
}

const epoch = () => {
    for (let idx = 0; idx < trainingdata.length; idx++) {
        network[0][0] = trainingdata[idx][0]
        network[0][1] = trainingdata[idx][1]
        forward(network)
        backward(network, [trainingdata[idx][2]])
    }
}

const train = (n = 10) => {
    for (let idx = 0; idx < n; idx++) {
        console.log(`totalloss: ${totalloss()}`)
        epoch()
    }
    console.log(`totalloss: ${totalloss()}`)
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

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = activations[idx / 4](network[idx + 2][n] + network[idx + 3][n])
    }
}

const totalloss = () => {
    let loss = 0
    for (let idx = 0; idx < trainingdata.length; idx++) {
        network[0][0] = trainingdata[idx][0]
        network[0][1] = trainingdata[idx][1]
        forward(network)
        loss += 1 / 2 * Math.pow(network[network.length - 1][0] - trainingdata[idx][2], 2)
    }
    return loss
}

const backward = (network, target) => {
    const slopes = JSON.parse(JSON.stringify(network))

    const output = slopes[slopes.length - 1]
    for (let idx = 0; idx < output.length; idx++) output[idx] -= target[idx]

    for (let s = slopes.length - 4; s > 0; s -= 4) {
        let idx = 0
        for (let a = 0; a < slopes[s + 2].length; a++) {
            slopes[s + 2][a] = activationsdiv[(s - 1) / 4](network[s + 1][a] + network[s + 2][a]) * slopes[s + 3][a] // bias
            slopes[s + 1][a] = slopes[s + 2][a] // matrix-result
            for (let h = 0; h < slopes[s - 1].length; h++) {
                slopes[s][idx] = network[s - 1][h] * slopes[s + 1][a] // weights
                idx++
            }
        }
        if (s - 1 > 0) {
            for (let h = 0; h < slopes[s - 1].length; h++) slopes[s - 1][h] = 0
            idx = 0
            for (let a = 0; a < slopes[s + 2].length; a++) {
                for (let h = 0; h < slopes[s - 1].length; h++) {
                    slopes[s - 1][h] += network[s][idx] * slopes[s + 1][a] // hidden
                    idx++
                }
            }
        }
    }
    for (let s = network.length - 4; s > 0; s -= 4) {
        for (let idx = 0; idx < network[s + 2].length; idx++) {
            network[s + 2][idx] -= slopes[s + 2][idx] / learningrate
        }
        for (let idx = 0; idx < network[s].length; idx++) {
            network[s][idx] -= slopes[s][idx] / learningrate
        }
    }
}

const maxTrainingData = (element = 0) => {
    let min = Infinity
    let max = -Infinity
    trainingdata.forEach(e => {
        if (e[element] < min) min = e[element]
        if (e[element] > max) max = e[element]
    })
    return [min, max]
}

const uniqueTrainingValues = (element = 0) => {
    const result = new Set()
    trainingdata.forEach(e => result.add(e[element]))
    return result
}

const downloadNetwork = () => {
    return `const network = ${JSON.stringify(network)}`
}

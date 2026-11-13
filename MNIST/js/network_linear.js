let learning = false
let learnidx = 0
const y = x => [-x, x / 2]
const network = [
    [0], // input
    // Array.from({length: 4}, () => Math.random() * 2 - 1), // weights
    // Array.from({length: 4}, () => 0),  // hidden
    Array.from({length: 2}, () => Math.random() * 2 - 1), // weights
    [0, 0]  // output
]

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 2) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
    }
}

const loss = (network, target) => {
    let loss = 0
    const output_layer = network[network.length - 1]
    for (let idx = 0; idx < output_layer.length; idx++) {
        loss += Math.pow(output_layer[idx] - target[idx], 2) / 2
    }
    return loss
}

const backward = (network, target) => {
    const slopes = JSON.parse(JSON.stringify(network))
    const output = slopes[slopes.length - 1]
    for (let idx = 0; idx < output.length; idx++) output[idx] -= target[idx]
    for (let s = slopes.length - 2; s > 0; s -= 2) {
        let idx = 0
        for (let a = 0; a < slopes[s + 1].length; a++)
            for (let h = 0; h < slopes[s - 1].length; h++) {
                slopes[s][idx] = slopes[s - 1][h] * slopes[s + 1][a]
                idx++
            }
        if (s - 1 > 0) {
            idx = 0
            for (let h = 0; h < slopes[s - 1].length; h++) slopes[s - 1][h] = 0
            for (let a = 0; a < slopes[s + 1].length; a++) {
                for (let h = 0; h < slopes[s - 1].length; h++) {
                    slopes[s - 1][h] += network[s][idx] * slopes[s + 1][a]
                    idx++
                }
            }
        }
    }
    for (let s = network.length - 2; s > 0; s -= 2) {
        for (let idx = 0; idx < network[s].length; idx++) {
            network[s][idx] -= slopes[s][idx] / 1000
        }
    }
}

// const learnNegative = () => {
//     console.time()
//     for (let n = 0; n < 60000; n++) {
//         const input = Math.random() * Math.PI * 2 - Math.PI
//         network[0][0] = input
//         forward(network)
//         backward(network, [-input + 1])
//     }
//     forward(network)
//     console.timeEnd()
// }

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    if (learning) {
        const input = Math.random() * Math.PI * 2 - Math.PI
        network[0][0] = input
        forward(network)
        backward(network, y(input))
        learnidx++
    }

    ctx.save()
    ctx.fillStyle = 'black'
    for (let x = -5; x < 6; x++) {
        network[0][0] = x
        forward(network)
        ctx.beginPath()
        ctx.arc(x, -network[network.length - 1][1], 3 / camera.scale, 0, Math.PI * 2)
        ctx.fillStyle = 'blue'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, -network[network.length - 1][0], 3 / camera.scale, 0, Math.PI * 2)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'red'
        ctx.fill()
    }
    ctx.restore()
}

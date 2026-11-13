let learnidx = 0

const network = [
    [0], // input
    Array.from({length: 3}, () => Math.random() * 2 - 1), // weights
    Array.from({length: 3}, () => 0),  // hidden
    Array.from({length: 6}, () => Math.random() * 2 - 1), // weights
    Array.from({length: 2}, () => 0),  // hidden
    Array.from({length: 2}, () => Math.random() * 2 - 1), // weights
    [0]  // output
]

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 2) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
    }
}

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    ctx.save()
    ctx.fillStyle = 'black'
    for (let x = -5; x <= 5; x += 1 / 10) {
        network[0][0] = x
        forward(network)
        ctx.beginPath()
        ctx.arc(x, -network[network.length - 1][0], 3 / camera.scale, 0, Math.PI * 2)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'red'
        ctx.fill()
    }
    ctx.restore()
}

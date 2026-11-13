let learning = false
let learnidx = 0
const domain = [-2, 2]

const func = x => [-x]

const network = [
    [0], // input
    [1], // weights
    [0], // hidden
    [2], // weights
    [0]  // output
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

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    if (learning) {
        const input = Math.random() * (domain[1] - domain[0]) + domain[0]
        network[0][0] = input
        forward(network)
        backward(network, func(input))
        learnidx++
    }

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
    {
        const view = getView(canvas, camera)
        const stepsize = (view.x2 - view.x1) / canvas.width
        let move = true
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = 'green'
        // ctx.setLineDash([5 / camera.scale])
        ctx.lineWidth = 2 / camera.scale
        for (let x = view.x1; x <= view.x2; x += stepsize) {
            const y = func(x)[0]
            if (Number.isFinite(y)) {
                if (move) {
                    ctx.moveTo(x, -y)
                    move = false
                } else ctx.lineTo(x, -y)
            } else move = true
        }
        ctx.stroke()
        ctx.restore()
    } // grafiek
    ctx.restore()
}

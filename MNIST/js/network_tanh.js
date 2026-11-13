let learning = false
let learnidx = 0
let domain = [-5, 5]
let grafiek = false
let learningrate = 1000
let totalloss = Infinity

const func = x => [Math.sin(x)]
const tanh = Math.tanh
const sech2 = x => 4 / Math.pow(Math.pow(Math.E, x) + Math.pow(Math.E, -x), 2)

// const network = create_matrix_gen3(1, 16, 16, 1)
const network = [
    [0], // input
    Array.from({length: 16}, () => Math.random() * 2 - 1), // weights
    Array.from({length: 16}, () => 0), // matrix-result
    Array.from({length: 16}, () => 0), // bias
    Array.from({length: 16}, () => 0), // hidden
    Array.from({length: 256}, () => Math.random() * 2 - 1), // weights
    Array.from({length: 16}, () => 0), // matrix-result
    Array.from({length: 16}, () => 0), // bias
    Array.from({length: 16}, () => 0), // hidden
    Array.from({length: 16}, () => Math.random() * 2 - 1), // weights
    Array.from({length: 1}, () => 0), // matrix-result
    Array.from({length: 1}, () => 0), // bias
    [0]  // output
]

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = tanh(network[idx + 2][n] + network[idx + 3][n])
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

    for (let s = slopes.length - 4; s > 0; s -= 4) {
        let idx = 0
        for (let a = 0; a < slopes[s + 2].length; a++) {
            slopes[s + 2][a] = sech2(network[s + 1][a] + network[s + 2][a]) * slopes[s + 3][a] // bias
            slopes[s + 1][a] = slopes[s + 2][a] // matrix-result
            for (let h = 0; h < slopes[s - 1].length; h++) {
                slopes[s][idx] = network[s - 1][h] * slopes[s + 1][a]
                idx++
            }
        } // weights
        if (s - 1 > 0) {
            for (let h = 0; h < slopes[s - 1].length; h++) slopes[s - 1][h] = 0
            idx = 0
            for (let a = 0; a < slopes[s + 2].length; a++) {
                for (let h = 0; h < slopes[s - 1].length; h++) {
                    slopes[s - 1][h] += network[s][idx] * slopes[s + 1][a]
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

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    let input = 0
    if (learning) {
        for (let n = 0; n < 1; n++) {
            input = Math.random() * (domain[1] - domain[0]) + domain[0]
            network[0][0] = input
            forward(network)
            backward(network, func(input))
            learnidx++
        }
        // for (let n = domain[0]; n <= domain[1]; n += 1 / 20) {
        //     network[0][0] = n
        //     forward(network)
        //     backward(network, func(n))
        //     learnidx++
        // }
        // {
        //     input = learnidx % 20 / 20 * (domain[1] - domain[0]) + domain[0]
        //     network[0][0] = input
        //     forward(network)
        //     backward(network, func(input))
        //     learnidx++
        // }
    }

    ctx.save()
    if (grafiek) {
        const view = getView(canvas, camera)
        const stepsize = (view.x2 - view.x1) / canvas.width
        let move = true
        const kopie = JSON.parse(JSON.stringify(network))
        ctx.beginPath()
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 2 / camera.scale
        for (let x = view.x1; x <= view.x2; x += stepsize) {
            kopie[1][0] = x
            forward(kopie)
            const y = loss(kopie, func(kopie[0][0]))
            if (Number.isFinite(y)) {
                if (move) {
                    ctx.moveTo(x, -y)
                    move = false
                } else ctx.lineTo(x, -y)
            } else move = true
        }
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(network[1][0], 0, 3 / camera.scale, 0, Math.PI * 2)
        ctx.globalAlpha = 1
        ctx.fillStyle = 'blue'
        ctx.fill()
    } else {
        {
            ctx.beginPath()
            ctx.arc(input, -func(input), 13 / camera.scale, 0, Math.PI * 2)
            ctx.globalAlpha = 1
            ctx.fillStyle = 'black'
            ctx.fill()
        }
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
        }
        ctx.restore()
    } // grafiek
    ctx.restore()
}

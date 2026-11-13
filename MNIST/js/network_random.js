let learnidx = 0
let learningrate = 10000
let totalloss = Infinity

const network = create_matrix_gen3(1, 80, 1)
const activations = [sigmoid, sigmoid]
const activationsdiv = [sigmoiddiv, sigmoiddiv]

const networkInit = () => {}

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = activations[idx / 4](network[idx + 2][n] + network[idx + 3][n])
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

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    if (document.querySelector('#grafiek').checked) {
        totalloss = 0
        points.forEach(e => {
            network[0][0] = e.x
            forward(network)
            totalloss += loss(network, [e.y])
            backward(network, [e.y])
            learnidx++
        })
        // if (totalloss < 0.001) document.querySelector('#grafiek').checked = false
    }

    ctx.save()
    {
        // for (let x = -50; x <= 50; x += 1 / 10) {
        //     network[0][0] = x
        //     forward(network)
        //     ctx.beginPath()
        //     ctx.arc(x, -network[network.length - 1][0], 3 / camera.scale, 0, Math.PI * 2)
        //     ctx.globalAlpha = 1
        //     ctx.fillStyle = 'green'
        //     ctx.fill()
        // }
        {
            ctx.save()
            ctx.fillStyle = 'red'
            ctx.lineWidth = 2 / camera.scale
            points.forEach(e => {
                ctx.beginPath()
                ctx.arc(e.x, -e.y, 9 / camera.scale, 0, Math.PI * 2)
                ctx.globalAlpha = 1 / 4
                ctx.fill()
                ctx.beginPath()
                ctx.arc(e.x, -e.y, 3 / camera.scale, 0, 2 * Math.PI)
                ctx.globalAlpha = 1
                ctx.fill()
            })
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
                network[0][0] = x
                forward(network)
                const y = network[network.length - 1][0]
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
    } // grafiek
    ctx.restore()
}

let learnidx = 0
let totalloss = Infinity
let learning = false
let learningrate = 1000

const newInput = document.createElement('input')

const func = (x, y) => (Math.pow(x, 2) + Math.pow(y, 2)) / 5
const network = create_matrix_gen3(2, 16, 16, 1)
const activations = [swish, swish, x => x]
const activationsdiv = [swishdiv, swishdiv, x => 1]

const networkInit = () => {
    document.body.removeChild(document.querySelector('#grafiek').nextElementSibling)
    document.body.removeChild(document.querySelector('#grafiek'))

    // const newInput = document.createElement('input')
    newInput.type = 'range'
    newInput.style.width = '300px'
    newInput.min = -15
    newInput.max = 15
    newInput.step = 1 / 100
    newInput.value = 0
    // newInput.addEventListener('input', e => console.log())
    document.body.appendChild(newInput)
}

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = activations[idx / 4](network[idx + 2][n] + network[idx + 3][n])
    }
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

const drawNetworkSamples = (canvas, ctx, camera) => {
    if (learning) {
        totalloss = 0
        for (let y = -5; y <= 5; y++) {
            for (let x = -5; x <= 5; x++) {
                network[0][0] = x
                network[0][1] = y
                forward(network)
                totalloss += Math.pow(network[network.length - 1][0] - func(x, y), 2) / 2
                backward(network, [func(x, y)])
            }
        }
    }

    const view = getView(canvas, camera)
    const stepsize = (view.x2 - view.x1) / canvas.width
    let move = true
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 2 / camera.scale
    for (let x = view.x1; x <= view.x2; x += stepsize) {
        network[0][0] = x
        network[0][1] = Number(newInput.value)
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
}

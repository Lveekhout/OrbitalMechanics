let learnidx = 0
let grafiek = false
let grafieklayer = 11
let grafiekelement = 0
let totalloss = Infinity

// const sigmoid = x => 1 / (1 + Math.pow(Math.E, -x))
// const sigmoidderivative = x => Math.pow(Math.E, -x) / Math.pow(1 + Math.pow(Math.E, -x), 2)

const network = create_matrix_gen3(784, 16, 16, 10)
// const network = [
//     Array.from({length: 784}, () => 0), // input
//     Array.from({length: 784 * 16}, () => Math.random() * 2 - 1), // weights
//     Array.from({length: 16}, () => 0), // matrix-result
//     Array.from({length: 16}, () => 0), // bias
//     Array.from({length: 16}, () => 0), // hidden
//     Array.from({length: 16 * 16}, () => Math.random() * 2 - 1), // weights
//     Array.from({length: 16}, () => 0), // matrix-result
//     Array.from({length: 16}, () => 0), // bias
//     Array.from({length: 16}, () => 0), // hidden
//     Array.from({length: 16 * 10}, () => Math.random() * 2 - 1), // weights
//     Array.from({length: 10}, () => 0), // matrix-result
//     Array.from({length: 10}, () => 0), // bias
//     Array.from({length: 10}, () => 0)  // output
// ]

const forward = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        matrix_multiply_output(network[idx + 1], network[idx], network[idx + 2])
        for (let n = 0; n < network[idx + 4].length; n++) network[idx + 4][n] = sigmoid(network[idx + 2][n] + network[idx + 3][n])
    }
}

const backward = (network, target) => {
    const slopes = JSON.parse(JSON.stringify(network))

    const output = slopes[slopes.length - 1]
    for (let idx = 0; idx < output.length; idx++) output[idx] -= target[idx]

    for (let s = slopes.length - 4; s > 0; s -= 4) {
        let idx = 0
        for (let a = 0; a < slopes[s + 2].length; a++) {
            slopes[s + 2][a] = sigmoiddiv(network[s + 1][a] + network[s + 2][a]) * slopes[s + 3][a] // bias
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
            network[s + 2][idx] -= slopes[s + 2][idx] / 10
        }
        for (let idx = 0; idx < network[s].length; idx++) {
            network[s][idx] -= slopes[s][idx] / 10
        }
    }
}

const loss = (network, idx) => {
    const target = Array.from({length: 10}, () => 0)
    target[idx] = 1
    const output = network[network.length - 1]
    for (let n = 0; n < output.length; n++) {
        target[n] = Math.pow(target[n] - output[n], 2)
    }
    return target.reduce((a, b) => a + b)
}

const drawNetworkSamples = (canvas, ctx, camera, ms, dms) => {
    {
        // if (learning && learnidx < 60000) {
        //     const target = Array.from({length: 10}, () => 0)
        //     target[setTrainingImageAsInput(learnidx)] = 1
        //     forward(network)
        //     backward(network, target)
        //     learnidx++
        // }

        ctx.save()
        if (grafiek) {
            const kopie = JSON.parse(JSON.stringify(network))
            const view = getView(canvas, camera)
            const stepsize = (view.x2 - view.x1) / canvas.width
            let move = true

            ctx.beginPath()
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 2 / camera.scale
            for (let x = view.x1; x <= view.x2; x += stepsize) {
                kopie[grafieklayer][grafiekelement] = x
                forward(kopie)
                const y = loss(kopie, testLabels[learnidx]) * 5
                if (Number.isFinite(y)) {
                    if (move) {
                        ctx.moveTo(x, -y)
                        move = false
                    } else ctx.lineTo(x, -y)
                } else move = true
            }
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(network[grafieklayer][grafiekelement], 0, 3 / camera.scale, 0, Math.PI * 2)
            ctx.globalAlpha = 1
            ctx.fillStyle = 'red'
            ctx.fill()
        } // grafiek
        else {
            ctx.fillStyle = 'black'
            const plaatje = network[0]
            ctx.fillRect(0, 0, 28 / 29, 28 / 29)
            ctx.fillStyle = 'white'
            for (let idx = 0; idx < plaatje.length; idx++) {
                // ctx.fillStyle = `#${plaatje[idx].toString(16)}${plaatje[idx].toString(16)}${plaatje[idx].toString(16)}`
                ctx.globalAlpha = plaatje[idx]
                ctx.fillRect((idx % 28) / 29, Math.trunc(idx / 28) / 29, 1 / 29, 1 / 29)
            } // image
            {
                ctx.globalAlpha = 1
                ctx.font = '.15pt Courier'
                ctx.textBaseline = 'top'
                ctx.textAlign = 'center'
                const soft = softmax(network[network.length - 1])
                let max = 0
                soft.forEach(e => max = Math.max(e, max))
                const index = soft.findIndex(e => e === max)
                for (let idx = 0; idx < network[network.length - 1].length; idx++) {
                    ctx.fillStyle = 'blue'
                    if (idx === index) ctx.fillStyle = 'red'
                    ctx.fillText(`${soft[idx]}%`, -4.5 + idx, 1.25)
                    ctx.fillText(`${idx}`, -4.5 + idx, 1.6)
                }
            } // percentages
        }
        ctx.restore()
    }
}

const setTrainingImageAsInput = idx => {
    for (let i = 0; i < trainImages[idx].length; i++) {
        network[0][i] = trainImages[idx][i] / 255
    }
    return trainLabels[idx]
}

const setTestImageAsInput = idx => {
    for (let i = 0; i < testImages[idx].length; i++) {
        network[0][i] = testImages[idx][i] / 255
    }
    learnidx = idx
    return testLabels[idx]
}

const epoch = () => {
    for (let n = 0; n < 60000; n++) {
        const target = Array.from({length: 10}, () => 0)
        target[setTrainingImageAsInput(n)] = 1
        forward(network)
        backward(network, target)
    }
}

const train = (n = 10) => {
    for (e = 0; e < n; e++) {
        console.log(`epoch = ${e}`)
        console.time()
        epoch()
        console.timeEnd()
    }
    beep()
}

const clean_network = network => {
    for (let idx = 0; idx < network.length - 1; idx += 4) {
        for (let n = 0; n < network[idx + 0].length; n++) network[idx + 0][n] = 0
        for (let n = 0; n < network[idx + 2].length; n++) network[idx + 2][n] = 0
    }
    for (let n = 0; n < network[network.length - 1].length; n++) network[network.length - 1][n] = 0
}

const probabilities = network => {
    const output_layer = network[network.length - 1]
    return output_layer.map(e => Math.round(e * 1000) / 10)
}

// const softmax = reeks => {
//     const sum = reeks.reduce((a, b) => a + b)
//     return reeks.map(e => Math.round(e / sum * 1000) / 10)
// }

const softmax = reeks => {
    const map = reeks.map(x => Math.pow(Math.E, x))
    const sum = map.reduce((a, b) => a + b)
    return map.map(e => Math.round(e / sum * 1000) / 10)
}

function beep() {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();

    oscillator.frequency.value = 800; // Frequentie in Hz
    oscillator.connect(audio.destination);

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.2); // 200 ms

    oscillator.onended = () => audio.close();
}

const testNetwork = () => {
    let goed = 0
    let fout = 0
    for (let idx = 0; idx < 10000; idx++) {
        setTestImageAsInput(idx)
        forward(network)
        const max = Math.max(...network[network.length - 1])
        const index = network[network.length - 1].findIndex(e => e === max)
        index === testLabels[idx] ? goed++ : fout++
    }
    console.log(`goed: [${goed}], fout: [${fout}]`)
}

setTimeout(() => {
    document.querySelector('canvas').addEventListener('mousemove', event => {
        if (event.shiftKey) {
            const camera = document.querySelector('canvas').camera
            const coord = [(event.offsetX - camera.x) / camera.scale, (event.offsetY - camera.y) / -camera.scale]
            if (coord[0] <= 28 / 29 && coord[1] <= 28 / 29) {
                const x = Math.round(coord[0] * 28)
                const y = Math.round(coord[1] * 28)
                for (let t = 0; t < Math.PI * 2; t += .2) {
                    const x1 = Math.round(x + Math.cos(t))
                    const y1 = Math.round(y + Math.sin(t))
                    network[0][y1 * -28 + x1] = .85
                }
                forward(network)
            }
        }
    }, true)
}, 100)


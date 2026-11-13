const trainImages = []
const trainLabels = []
const testImages = []
const testLabels = []

fetch('./files/mnist/train-images.idx3-ubyte')
    .then(
        fulfilled => {
            if (fulfilled.ok) {
                fulfilled.arrayBuffer().then(content => {
                    const images = new Uint8Array(content).subarray(16)
                    for (let idx = 0; idx < 60000; idx++) {
                        trainImages.push(Array.from(images.subarray(784 * idx, 784 * (idx + 1))))
                    }
                })
            } else {
                console.log(`NOT ok: ${fulfilled.status} ${fulfilled.statusText}`)
            }
        },
        rejected => console.log(`rejected: ${rejected.constructor.name}`)
    )

fetch('./files/mnist/train-labels.idx1-ubyte')
    .then(
        fulfilled => {
            if (fulfilled.ok) {
                fulfilled.arrayBuffer().then(content => {
                    const labels = new Uint8Array(content).subarray(8)
                    for (let idx = 0; idx < 60000; idx++) {
                        trainLabels.push(labels[idx])
                    }
                })
            } else {
                console.log(`NOT ok: ${fulfilled.status} ${fulfilled.statusText}`)
            }
        },
        rejected => console.log(`rejected: ${rejected.constructor.name}`)
    )

fetch('./files/mnist/t10k-images.idx3-ubyte')
    .then(
        fulfilled => {
            if (fulfilled.ok) {
                fulfilled.arrayBuffer().then(content => {
                    const images = new Uint8Array(content).subarray(16)
                    for (let idx = 0; idx < 10000; idx++) {
                        testImages.push(Array.from(images.subarray(784 * idx, 784 * (idx + 1))))
                    }
                })
            } else {
                console.log(`NOT ok: ${fulfilled.status} ${fulfilled.statusText}`)
            }
        },
        rejected => console.log(`rejected: ${rejected.constructor.name}`)
    )

fetch('./files/mnist/t10k-labels.idx1-ubyte')
    .then(
        fulfilled => {
            if (fulfilled.ok) {
                fulfilled.arrayBuffer().then(content => {
                    const labels = new Uint8Array(content).subarray(8)
                    for (let idx = 0; idx < 10000; idx++) {
                        testLabels.push(labels[idx])
                    }
                })
            } else {
                console.log(`NOT ok: ${fulfilled.status} ${fulfilled.statusText}`)
            }
        },
        rejected => console.log(`rejected: ${rejected.constructor.name}`)
    )

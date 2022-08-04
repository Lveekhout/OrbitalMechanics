const res = [0, 0]

const randompointoncircle = () => {
    let x, y, len = 2
    while (len > 1) {
        x = 1 - Math.random() * 2
        y = 1 - Math.random() * 2
        len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }
    return [x, y]
}

console.log(4 / Math.PI)

for (let x = -1; x <= 1; x += 0.001) {
    for (let y = -1; y <= 1; y += 0.001) {
        const len = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        if (len > 1) res[0]++
        else res[1]++
    }
}

console.log((res[0] + res[1]) / res[1])

res[0] = 0
res[1] = 0
for (let x = 0; x < 1000000; x++) {
    const coord = [1 - Math.random() * 2, 1 - Math.random() * 2]
    const len = Math.sqrt(Math.pow(coord[0], 2) + Math.pow(coord[1], 2))
    if (len > 1) res[0]++
    else res[1]++
}
console.log((res[0] + res[1]) / res[1])

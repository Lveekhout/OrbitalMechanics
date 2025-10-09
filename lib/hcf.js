const euclid = (a, n) => {
    // let q = Math.trunc(a / n)
    let r = a % n
    // if (r < 0) {
    //     q -= 1
    //     r += n
    // }
    // console.log(`${a} = ${q} x ${n} + ${r}`)
    if (r === 0) return n
    else return euclid(n, r)
}

const euclid2 = (a, n) => { // FASTER
    let r = a % n
    while (r > 0) {
        a = n
        n = r
        r = a % n
    }
    return n
}

const generateSpeedtestArray = (n = 100) => {
    seed = 2
    const result = []
    for (let i = 0; i < n; i++) {
        const x = random(1000 - 49) + 50
        const y = random(x - 1) + 2
        result.push([x, y])
    }
    return result
}

const speedtest_euclid = (n = 3) => {
    console.time()
    const bron = generateSpeedtestArray(n)
    console.timeEnd()
    console.time()
    for (let i = 0; i < n; i++) {
        // euclid(bron[i][0], bron[i][1])
        // euclid2(bron[i][0], bron[i][1])
        factorise2(bron[i][0]).hcf(factorise2(bron[i][1]))
    }
    console.timeEnd()
}

window.onload = e => {
    // const population = Array.from({length: 100}, (_, i) => Math.trunc(Math.random()*100) + 1)
    // const population = [1,7,21,35,35,21,7,1]
    // const population = [1,
    //     2,2,2,2,2,2,2,
    //     3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
    //     4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
    //     5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
    //     6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
    //     7,7,7,7,7,7,7,
    //     8]

    // console.log(`population = ${JSON.stringify(population)}`)
    // console.log(`n = ${JSON.stringify(population.length)}`)
    // console.log(`stats = ${JSON.stringify(getStats(population))}`)
    //
    // const sampling = sampling2(population)
    // console.log(`sampling2 = ${JSON.stringify(sampling)}`)
    // console.log(`n = ${JSON.stringify(sampling.length)}`)
    // console.log(`stats = ${JSON.stringify(getStats(sampling))}`)
    //
    // const sampling_3 = sampling3(population)
    // console.log(`sampling3 = ${JSON.stringify(sampling_3)}`)
    // console.log(`n = ${JSON.stringify(sampling_3.length)}`)
    // console.log(`stats = ${JSON.stringify(getStats(sampling_3))}`)
    // console.dir(boxplot(sampling_3))
}

const getStats = p => {
    const mean = p.reduce((a,b) => a + b) / p.length
    let variance = 0
    for (let idx = 0; idx < p.length; idx++) {
        variance += Math.pow(p[idx] - mean, 2)
    }
    return [mean, Math.sqrt(variance / (p.length))]
}

const sampling2 = p => {
    const result = []
    for (let n = 0; n < p.length - 1; n++)
        for (let m = n + 1; m < p.length - 0; m++)
            result.push((p[n] + p[m]) / 2)
    return result
}

const sampling3 = p => {
    const result = []
    for (let o = 0; o < p.length - 2; o++)
        for (let n = o +1 ; n < p.length - 1; n++)
            for (let m = n + 1; m < p.length - 0; m++)
                result.push((p[o] + p[n] + p[m]) / 3)
    return result
}

const boxplot = p => {
    const result = new Map()
    p.forEach(k => {
        const v = result.get(k)
        if (v) result.set(k, v + 1)
        else result.set(k, 1)
    })
    return result
}

const nchoosek = (n, k, f) => {
    const perm = Array.from({length: k}, (_, idx) => idx)

    const next = idx => {
        perm[idx] += 1
        if (perm[idx] === n - k + 1 + idx) perm[idx] = next(idx - 1) + 1
        return perm[idx]
    }

    let a = 0
    do {
        a++
        f === undefined ? console.log(perm) : f(perm)
    } while (next(k - 1) < n)
    return a
}

const role_dice = (n, k) => {
    if (!n) n = 10
    if (!k) k = 1

    const dice = n => Math.floor(Math.random() * 6) + 1
    const output = []
    for (let x = 0; x < n; x++) {
        let total = 0
        for (let y = 0; y < k; y++) total += dice()
        output.push(total)
    }
    // console.log(`stats = ${JSON.stringify(getStats(output))}`)
    const result = boxplot(output.sort((a, b) => a - b))
    // console.log(result)
    return result
}

const boxplot2coords = b => {
    result = ""
    b.entries().forEach(e => result += `(${e[0]},${e[1]}),`)
    return result.substring(0, result.length - 1)
}

const xxx = (p, k) => { // Voorbeeld: xxx(Array.from({length: 100}, (_, i) => i + 1), 3)
    const r = new Map()
    nchoosek(p.length, k, d => {
        let sum = 0
        d.forEach(idx => sum += p[idx])
        sum = sum / d.length

        const v = r.get(sum)
        if (v) r.set(sum, v + 1)
        else r.set(sum, 1)
    })
    return boxplot2coords(r)
}
const genPop = () => {
    return Array.from({length: 10}, () => 1)
        .concat(Array.from({length: 9}, () => 2))
        .concat(Array.from({length: 8}, () => 3))
        .concat(Array.from({length: 7}, () => 4))
        .concat(Array.from({length: 6}, () => 5))
        .concat(Array.from({length: 5}, () => 6))
}

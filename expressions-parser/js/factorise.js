const factorise = p => {
    const result = []
    let i = 2
    while (i * i <= p && i === 2) {
        if (p % i === 0) {
            result.push(i)
            p /= i
        } else i++
    }
    while (i * i <= p) {
        if (p % i === 0) {
            result.push(i)
            p /= i
        } else i += 2
    }
    result.push(p)
    return result
}

const speedTest = value => {
    if (!value) value = 100
    let result = {}
    const nu = new Date().getTime()
    for (let i = 2; i < value; i++) {
        factorise(i).forEach(v => result[v] = result[v] === undefined ? 1 : result[v] + 1)
    }
    console.log(`duur: ${new Date().getTime() - nu} ms`)
    return result
}

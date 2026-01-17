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

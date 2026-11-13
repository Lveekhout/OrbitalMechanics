const n = 6
const X = [0,1,2,3,6,10]
const Y = [0,-1,-2,-1,2,1]

// https://www.desmos.com/calculator/augauraz6c

const sigma = (n, f, b = 1) => {
    let result = 0
    for (let k = b; k <= n; k++) result += f(k)
    return result
}

const source = Array.from({ length: 6 }, () => Array.from({length: 7}, () => 0))
{
    for (let r = 0; r < source.length; r++) {
        for (let c = 0; c < source[r].length - 1; c++) {
            source[r][c] = sigma(n, k => Math.pow(X[k-1], r + c))
        }
    }
    for (let r = 0; r < source.length; r++) {
        source[r][source[r].length-1] = sigma(n, k => Math.pow(X[k - 1], r) * Y[k-1])
    }
}

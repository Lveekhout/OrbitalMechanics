const stap1 = () => {
    const result = []
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            if (typeof matrix[row][col] === 'number') result.push([row, col])
        }
    }
    return result
}

const getOmliggend = ([rij, cell]) => { // Voorbeeld: getOmliggend([2,3])
    return [[rij - 1, cell - 1], [rij - 1, cell], [rij - 1, cell + 1], [rij, cell - 1], [rij, cell + 1], [rij + 1, cell - 1], [rij + 1, cell], [rij + 1, cell + 1]]
        .filter(v => v[0] > -1 && v[0] < 10 && v[1] > -1 && v[1] < 10)
}

const oplossing = (idx = 0) => {
    const bekenden = stap1()
    const solutions = []
    const geraakten = new Set()

    const recurs = (idx = 0, partialArray = [], solutionArray = []) => {
        const cell = bekenden[idx]
        const doelAantal = matrix[cell[0]][cell[1]]

        const omliggendenArray = getOmliggend(bekenden[idx])
        const lettersArray = omliggendenArray.filter(e => typeof matrix[e[0]][e[1]] === 'string')
        const solutionLetters = omliggendenArray.filter(e => solutionArray.map(t => JSON.stringify(t)).includes(JSON.stringify(e)))
        const mogelijkArray = omliggendenArray
                                .filter(e => typeof matrix[e[0]][e[1]] === 'undefined')
                                .filter(e => !partialArray.map(t => JSON.stringify(t)).includes(JSON.stringify(e)))
        mogelijkArray.forEach(e => geraakten.add(JSON.stringify(e)))

        const n = mogelijkArray.length
        const k = doelAantal - (lettersArray.length + solutionLetters.length)

        if (k >= 0 && n >= k) {
            nchoosek(n, k, p => {
                const partialSolutionArray = solutionArray.concat(p.map(e => mogelijkArray[e]))
                if (idx + 1 < bekenden.length) {
                    recurs(idx + 1, partialArray.concat(mogelijkArray), partialSolutionArray)
                } else {
                    solutions.push(partialSolutionArray)
                }
            })
        }
    }

    recurs(idx)
    const grouped = new Map()
    geraakten.forEach(k => grouped.set(k, 0))
    solutions.forEach((o, i) => {
        o.forEach(c => {
            const str = JSON.stringify(c)
            if (grouped.has(str)) grouped.set(str, grouped.get(str) + 1)
            else grouped.set(str, 1)
        })
    })

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = "middle" // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    ctx.textAlign = "center" // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
    grouped.forEach((v, k) => {
        if (k) {
            const cell = JSON.parse(k)
            ctx.save()
            ctx.fillStyle = 'white'
            ctx.fillText(`${(v / solutions.length * 100).toFixed(0)}%`, 24+cell[1]*48, 24+cell[0]*48)
            ctx.restore()
        }
    })

    return solutions
}
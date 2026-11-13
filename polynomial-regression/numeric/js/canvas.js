// let points = [
//     {x:  0, y:  1, selected: false},
//     {x:  1, y:  2, selected: false},
//     {x:  2, y:  3, selected: false},
//     {x:  3, y:  4, selected: false},
//     {x:  4, y:  5, selected: false},
//     {x:  5, y:  6, selected: false},
//     {x:  6, y:  7, selected: false},
//     {x:  7, y:  8, selected: false},
//     {x:  8, y:  9, selected: false},
//     {x:  9, y: 10, selected: false},
//     {x: 10, y: 11, selected: false},
//     {x: 11, y: 12, selected: false},
//     {x: 12, y: 13, selected: false},
//     {x: 13, y: 14, selected: false},
//     {x: 14, y: 15, selected: false},
//     {x: 15, y: 16, selected: false},
//     {x: 16, y: 17, selected: false},
//     {x: 17, y: 18, selected: false},
//     {x: 18, y: 19, selected: false},
//     {x: 19, y: 20, selected: false}
// ]
let points = [
    {"x":8.586492206573098,"y":4.977661508844587,"selected":false},
    {"x":8.980137001122397,"y":4.345899412662049,"selected":false},
    {"x":9.80361212165991,"y":5.590676786144707,"selected":false},
    {"x":-0.32874073026654727,"y":0.3765172247088664,"selected":false},
    {"x":1.2115585879042674,"y":0.11890285530398145,"selected":false},
    {"x":0.5002794129975303,"y":0.937040663177045,"selected":false},
    {"x":1.4073141684530988,"y":1.43656058726501,"selected":false},
    {"x":7.549783047167248,"y":4.33301582365795,"selected":false},
    {"x":2.923213619914494,"y":1.7069681178191627,"selected":false},
    {"x":3.401328114137502,"y":2.528544930167452,"selected":false},
    {"x":4.256171253444001,"y":1.7406002410008647,"selected":false},
    {"x":5.068079741070876,"y":3.129329455554071,"selected":false},
    {"x":9.911453939281182,"y":4.326456806451803,"selected":false},
    {"x":1.5456695368150928,"y":1.1340162371042781,"selected":false},
    {"x":6.098930334618136,"y":3.7480237858751604,"selected":false},
    {"x":5.923743636555636,"y":2.3431674918384746,"selected":false},
    {"x":7.393039181209874,"y":3.459680070961244,"selected":false},
    {"x":2.171992970633324,"y":0.4621402736657889,"selected":false},
    {"x":8.065876898129298,"y":5.530879184915236,"selected":false},
    {"x":8.713929122207016,"y":3.843225074317009,"selected":false}
]
let pointsnum = 20
let polydegree = 0
let coeff

const draw = (canvas, ctx, camera, ms, dms) => {
    const begin = performance.now()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        const view = getView(canvas, camera)
        {
            ctx.save()

            ctx.beginPath()
            for (let x = Math.trunc(view.x1); x <= Math.trunc(view.x2); x++) {
                ctx.moveTo(x, view.y1)
                ctx.lineTo(x, view.y2)
            }
            for (let y = Math.trunc(view.y1); y <= Math.trunc(view.y2); y++) {
                ctx.moveTo(view.x1, y)
                ctx.lineTo(view.x2, y)
            }
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = '#ccc'
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(view.x1, 0)
            ctx.lineTo(view.x2, 0)
            ctx.moveTo(0, view.y1)
            ctx.lineTo(0, view.y2)
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = '#88f'//'#f88'
            ctx.stroke()

            ctx.restore()
        } // Raster
        {
            const stepsize = (view.x2 - view.x1) / canvas.width
            let move = true
            ctx.save()
            ctx.beginPath()
            ctx.strokeStyle = 'green'
            // ctx.setLineDash([5 / camera.scale])
            ctx.lineWidth = 2 / camera.scale
            for (let x = view.x1; x <= view.x2; x += stepsize) {
                const y = coeff.reduce((a, b, i) => a + b * Math.pow(x, i))
                if (Number.isFinite(y)) {
                    if (move) {
                        ctx.moveTo(x, -y)
                        move = false
                    } else ctx.lineTo(x, -y)
                } else move = true
            }
            ctx.stroke()
            ctx.restore()
        } // grafiek
        {
            ctx.save()

            for (let idx = 0; idx < pointsnum; idx++) {
                const p = points[idx]
                ctx.beginPath()
                ctx.arc(p.x, -p.y, 9 / camera.scale, 0, Math.PI * 2)
                ctx.globalAlpha = 1 / 4
                ctx.fillStyle = 'red'
                ctx.fill()
                ctx.beginPath()
                ctx.arc(p.x, -p.y, 3 / camera.scale, 0, Math.PI * 2)
                ctx.globalAlpha = 1
                ctx.fill()
                if (p.selected) {
                    ctx.beginPath()
                    ctx.rect(p.x - 7 / camera.scale, -p.y - 7 / camera.scale, 14 / camera.scale, 14 / camera.scale);
                    ctx.strokeStyle = 'blue'
                    ctx.lineWidth = 1 / camera.scale
                    ctx.stroke()
                }
            }

            ctx.restore()

        } // bolletjes
    } // Layers
    ctx.restore()

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
    ctx.font = "12.0px Courier"
    ctx.textBaseline = "top" // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    // ctx.textAlign = "start" // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
    ctx.fillText(`${(ms / 1000).toFixed(3)} s`, 10, 10)
    ctx.fillText(`${(performance.now() - begin).toFixed(3)} ms`, 10, 25)
    if (dms) ctx.fillText(`${dms.toFixed(3)} ms`, 10, 40)
    ctx.fillText(`loss = ${loss().toFixed(15)}`, 10, 55)
}

const getView = (canvas, camera) => {
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

const findSelected = ([x, y]) => {
    const margin = 9 / camera.scale
    return points.find(p => (x >= p.x - margin && x <= p.x + margin && y >= p.y - margin && y <= p.y + margin))
}

const mapToMatrixNumeric = () => {
    const X = points.slice(0, pointsnum).map(p => p.x)
    const Y = points.slice(0, pointsnum).map(p => p.y)
    const source = Array.from({length: polydegree + 1}, () => Array.from({length: polydegree + 1 + 1}, () => 0))
    for (let r = 0; r < polydegree + 1; r++) {
        for (let c = 0; c < polydegree + 1; c++) {
            source[r][c] = sigma(X.length, k => Math.pow(X[k - 1], r + c))
        }
    }
    for (let r = 0; r < polydegree + 1; r++) {
        source[r][polydegree + 1] = sigma(X.length, k => Math.pow(X[k - 1], r) * Y[k - 1])
    }
    return source
}

const sigma = (n, f, b = 1) => {
    let result = 0
    for (let k = b; k <= n; k++) result += f(k)
    return result
}

const loss = () => {
    let result = 0
    for (let idx = 0; idx < pointsnum; idx++) {console.log()
        const y = coeff.reduce((a, b, i) => a + b * Math.pow(points[idx].x, i))
        result += Math.pow(y - points[idx].y, 2)
    }
    return result
}

const points = [
    {x: 0, y: 0, selected: false},
    {x: 0, y: 2, selected: false},
    {x: 4, y: 0, selected: false}
]
const lines = [
    {p1: points[0], p2: points[1]},
    {p1: points[1], p2: points[2]},
    {p1: points[2], p2: points[0]}
]
const angles = [
    {p1: points[2], p2: points[0], p3: points[1]},
    {p1: points[0], p2: points[1], p3: points[2]},
    {p1: points[1], p2: points[2], p3: points[0]}
]

const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        const view = getView()
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
            ctx.strokeStyle = '#f88'
            ctx.stroke()

            ctx.restore()
        } // Raster
        {
            ctx.save()
            ctx.strokeStyle = '#5b75ef'
            ctx.lineWidth = 2 / camera.scale
            lines.forEach(l => {
                ctx.beginPath()
                ctx.moveTo(l.p1.x, -l.p1.y)
                ctx.lineTo(l.p2.x, -l.p2.y)
                ctx.stroke()
            })
            ctx.restore()
        } // Shapes Lines between points
        {
            ctx.save()
            points.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, -p.y, 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = '#e11919'
                ctx.fill()
                if (p.selected) {
                    ctx.beginPath()
                    ctx.rect(p.x - 7 / camera.scale, -p.y - 7 / camera.scale, 14 / camera.scale, 14 / camera.scale);
                    ctx.strokeStyle = '#e11919'
                    ctx.lineWidth = 1 / camera.scale
                    ctx.stroke()
                }
            })
            ctx.restore()
        } // Shapes Points
    } // Layers
    ctx.restore()
    ctx.save()
    ctx.font = '10pt Courier New'
    angles.forEach(a => {
        // const M = solveBissectricePoint(a.p1, a.p2, a.p3)
        // const x = camera.x + camera.scale * (a.p2.x + M[0]) / 2
        // const y = camera.y + camera.scale * -(a.p2.y + M[1]) / 2
        const x = camera.x + camera.scale * a.p2.x
        const y = camera.y + camera.scale * -a.p2.y
        ctx.fillText(calcAngle2({x: a.p1.x - a.p2.x, y: a.p1.y - a.p2.y}, {x: a.p3.x - a.p2.x, y: a.p3.y - a.p2.y}).toFixed(2), x, y)
    })
    ctx.restore()
}

// Speedtest: now = performance.now(); for (let i = 0; i < 1000000001; i++) calcAngle({x: i, y: 2+i}, {x: 2-i, y: i-2}); console.log(((performance.now() - now) / 1000).toFixed(2))
// const calcAngle = (a, b) => { // input: calcAngle({x: 1, y: 4}, {x: 3, y: 9})
//     let cartesianAngleA = Math.atan2(a.y, a.x)
//     let cartesianAngleB = Math.atan2(b.y, b.x)
//     let result = cartesianAngleB - cartesianAngleA
//     if (result < 0) result += Math.PI * 2
//     return result * 180 / Math.PI
// }
// Speedtest: now = performance.now(); for (let i = 0; i < 1000000001; i++) calcAngle2({x: i, y: 2+i}, {x: 2-i, y: i-2}); console.log(((performance.now() - now) / 1000).toFixed(2))
// Speedtest: now = performance.now(); for (let i = 0; i < 1000000001; i++) calcAngle2({x: 1, y: 2}, {x: 2, y: 1}); console.log(((performance.now() - now) / 1000).toFixed(2))
const calcAngle2 = (a, b) => { // input: calcAngle2({x: 1, y: 4}, {x: 3, y: 9})
    const la = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2))
    const lb = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2))
    return 180 * Math.acos((a.x * b.x + a.y * b.y) / (la * lb)) / Math.PI
}
const speedTest = () => {
    const amount = 30000001
    const set = []
    const result = [0, 0, 0]
    let now = performance.now()
    for (let i = 0; i < amount; i++) set.push([{x: 1-Math.random()*2, y: 1-Math.random()*2}, {x: 1-Math.random()*2, y: 1-Math.random()*2}])
    console.log(((performance.now() - now) / 1000).toFixed(2))
    now = performance.now()
    for (let i = 0; i < amount; i++) result[0] += calcAngle(set[i][0], set[i][1])
    console.log(((performance.now() - now) / 1000).toFixed(2))
    now = performance.now()
    for (let i = 0; i < amount; i++) result[1] += calcAngle2(set[i][0], set[i][1])
    console.log(((performance.now() - now) / 1000).toFixed(2))
    now = performance.now()
    set.forEach(a => result[2] += calcAngle2(a[0], a[1]))
    console.log(((performance.now() - now) / 1000).toFixed(2))
    console.log(result)
}
const solveBissectricePoint = (p1, p2, p3) => {
    const l1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    const l2 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))
    const dx = p3.x - p1.x
    const dy = p3.y - p1.y
    const x = p1.x + dx * l1 / (l1 + l2)
    const y = p1.y + dy * l1 / (l1 + l2)
    return [x, y]
}
const solveDistanceBetweenPointAndLinesegment = (p, l) => { // ({x: ..., y: ...}, {p1: ..., p2: ...})
    const rc1 = (l.p1.y - l.p2.y) / (l.p1.x - l.p2.x)
    const rc2 = (l.p2.x - l.p1.x) / (l.p1.y - l.p2.y)
    const b1 = l.p1.y - rc1 * l.p1.x
    const b2 = p.y - rc2 * p.x
    const x = (b2 - b1) / (rc1 - rc2)
    const y = rc1 * x + b1
    return [Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))]
}
//
// const setPoint = (idx, a) => {  // input: setPoint(1, {x: 1, y: 2})
//     points[idx] = a
//     window.requestAnimationFrame(draw)
// }
//
// const detLengths = () => {
//     const AB = Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))
//     const BC = Math.sqrt(Math.pow(points[2].x - points[1].x, 2) + Math.pow(points[2].y - points[1].y, 2))
//     const CD = Math.sqrt(Math.pow(points[3].x - points[2].x, 2) + Math.pow(points[3].y - points[2].y, 2))
//     const DA = Math.sqrt(Math.pow(points[0].x - points[3].x, 2) + Math.pow(points[0].y - points[3].y, 2))
//     const AC = Math.sqrt(Math.pow(points[0].x - points[2].x, 2) + Math.pow(points[0].y - points[2].y, 2))
//     const BD = Math.sqrt(Math.pow(points[1].x - points[3].x, 2) + Math.pow(points[1].y - points[3].y, 2))
//     return [AB * CD + BC * DA, AC * BD]
// }
//
// const detCrossPoint = () => {
//     const rc1 = (points[2].y - points[0].y) / (points[2].x - points[0].x)
//     const rc2 = (points[3].y - points[1].y) / (points[3].x - points[1].x)
//     const b1 = -rc1 * points[0].x + points[0].y
//     const b2 = -rc2 * points[1].x + points[1].y
//     const x = (b2 - b1) / (rc1 - rc2)
//     const y = rc1 * x + b1
//     return {x: x, y: y}
// }
//
// const detLengthToCrossPoint = () => {
//     const CP = detCrossPoint()
//     const A = Math.sqrt(Math.pow(CP.x - points[0].x, 2) + Math.pow(CP.y - points[0].y, 2))
//     const B = Math.sqrt(Math.pow(CP.x - points[1].x, 2) + Math.pow(CP.y - points[1].y, 2))
//     const C = Math.sqrt(Math.pow(CP.x - points[2].x, 2) + Math.pow(CP.y - points[2].y, 2))
//     const D = Math.sqrt(Math.pow(CP.x - points[3].x, 2) + Math.pow(CP.y - points[3].y, 2))
//     return [A * C, B * D]
// }

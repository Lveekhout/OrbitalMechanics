const points = [
    {x: 1, y: 0},
    {x: Math.sqrt(1 / 2), y: Math.sqrt(1 / 2)},
    {x: -Math.sqrt(1 / 3), y: Math.sqrt(2 / 3)},
    {x: -Math.sqrt(1 / 4), y: -Math.sqrt(3 / 4)}
]

const draw = ms => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        {
            ctx.save()

            ctx.beginPath()
            ctx.moveTo(-10, 0)
            ctx.lineTo(10, 0)
            ctx.moveTo(0, 10)
            ctx.lineTo(0, -10)
            ctx.lineWidth = 1 / camera.scale
            ctx.strokeStyle = '#0002'
            ctx.stroke()

            ctx.restore()
        } // Shapes Cartesian Plane
        {
            ctx.save()

            ctx.beginPath()
            ctx.arc(0, 0, 1, 0, Math.PI * 2)
            ctx.strokeStyle = '#eeeaec'
            ctx.lineWidth = 2 / camera.scale
            ctx.stroke()

            ctx.restore()
        } // Shapes Unit Circle
        {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(points[0].x, -points[0].y)
            ctx.lineTo(points[2].x, -points[2].y)
            ctx.moveTo(points[1].x, -points[1].y)
            ctx.lineTo(points[3].x, -points[3].y)
            ctx.strokeStyle = '#5b75ef30'
            ctx.lineWidth = 2 / camera.scale
            ctx.setLineDash([10 / camera.scale, 10 / camera.scale])
            ctx.stroke()

            ctx.beginPath()
            const p = detCrossPoint()
            ctx.arc(p.x, -p.y, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = '#5b75ef'
            ctx.fill()
            ctx.restore()
        } // Shapes Cross-lines
        {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(points[0].x, -points[0].y)
            ctx.lineTo(points[1].x, -points[1].y)
            ctx.lineTo(points[2].x, -points[2].y)
            ctx.lineTo(points[3].x, -points[3].y)
            ctx.closePath()
            ctx.strokeStyle = '#5b75ef'
            ctx.lineWidth = 2 / camera.scale
            ctx.stroke()
            ctx.restore()
        } // Shapes Lines between points
        {
            ctx.save()
            ctx.fillStyle = 'black'
            ctx.fillText(detAngle(points[3], points[0], points[1]).toFixed(2), points[0].x * .85, -points[0].y * .85)
            ctx.fillText(detAngle(points[0], points[1], points[2]).toFixed(2), points[1].x * .85, -points[1].y * .85)
            ctx.fillText(detAngle(points[1], points[2], points[3]).toFixed(2), points[2].x * .85, -points[2].y * .85)
            ctx.fillText(detAngle(points[2], points[3], points[0]).toFixed(2), points[3].x * .85, -points[3].y * .85)
            ctx.restore()
        } // Shapes Angles
        {
            ctx.save()
            points.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, -p.y, 3 / camera.scale, 0, Math.PI * 2)
                ctx.fillStyle = '#e11919'
                ctx.fill()
            })
            ctx.restore()
        } // Shapes Points
    } // Layers
    ctx.restore()

    if (visor.visible) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(visor.x, 0)
        ctx.lineTo(visor.x, canvas.height)
        ctx.moveTo(0, visor.y)
        ctx.lineTo(canvas.width, visor.y)
        ctx.strokeStyle = '#FF000030'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }
}

const detAngle = (a, b, c) => { // input: detAngle({x: 1, y: 4}, {x: 3, y: 9})
    let cartesianAngleA = Math.atan2(b.y - a.y, b.x - a.x)
    let cartesianAngleB = Math.atan2(c.y - b.y, c.x - b.x)
    let result = cartesianAngleB - cartesianAngleA
    if (result < 0) result += Math.PI * 2
    return result * 180 / Math.PI
}

const setPoint = (idx, a) => {  // input: setPoint(1, {x: 1, y: 2})
    points[idx] = a
    window.requestAnimationFrame(draw)
}

const detLengths = () => {
    const AB = Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))
    const BC = Math.sqrt(Math.pow(points[2].x - points[1].x, 2) + Math.pow(points[2].y - points[1].y, 2))
    const CD = Math.sqrt(Math.pow(points[3].x - points[2].x, 2) + Math.pow(points[3].y - points[2].y, 2))
    const DA = Math.sqrt(Math.pow(points[0].x - points[3].x, 2) + Math.pow(points[0].y - points[3].y, 2))
    const AC = Math.sqrt(Math.pow(points[0].x - points[2].x, 2) + Math.pow(points[0].y - points[2].y, 2))
    const BD = Math.sqrt(Math.pow(points[1].x - points[3].x, 2) + Math.pow(points[1].y - points[3].y, 2))
    return [AB * CD + BC * DA, AC * BD]
}

const detCrossPoint = () => {
    const rc1 = (points[2].y - points[0].y) / (points[2].x - points[0].x)
    const rc2 = (points[3].y - points[1].y) / (points[3].x - points[1].x)
    const b1 = -rc1 * points[0].x + points[0].y
    const b2 = -rc2 * points[1].x + points[1].y
    const x = (b2 - b1) / (rc1 - rc2)
    const y = rc1 * x + b1
    return {x: x, y: y}
}

const detLengthToCrossPoint = () => {
    const CP = detCrossPoint()
    const A = Math.sqrt(Math.pow(CP.x - points[0].x, 2) + Math.pow(CP.y - points[0].y, 2))
    const B = Math.sqrt(Math.pow(CP.x - points[1].x, 2) + Math.pow(CP.y - points[1].y, 2))
    const C = Math.sqrt(Math.pow(CP.x - points[2].x, 2) + Math.pow(CP.y - points[2].y, 2))
    const D = Math.sqrt(Math.pow(CP.x - points[3].x, 2) + Math.pow(CP.y - points[3].y, 2))
    return [A * C, B * D]
}

// const f = x => Math.pow(x, 2) / c
// const g = x => x / 5 / c
//----------------------------------------------------------------
// const f = x => Math.atan(x) + c
// const g = x => 1 / (Math.pow(x, 2) + 1)
//----------------------------------------------------------------
// const f = x => x + c
// const g = x => 1
//----------------------------------------------------------------
// const f = x => Math.pow(Math.E, x) + c
// const g = x => Math.pow(Math.E, x) * Math.log(Math.E)
//----------------------------------------------------------------
// const f = x => -Math.cos(x) + c
// const g = x => Math.sin(x)
//----------------------------------------------------------------
// const f = x => Math.log(x) + c
// const g = x => {
//     if (x < 0) return undefined
//     return 1 / x
// }
//----------------------------------------------------------------
// const f = x => Math.log(Math.pow(x, 2)) + c
// const g = x => 2 * x / Math.pow(x, 2)
//----------------------------------------------------------------
const f = x => 2 * Math.sqrt(x) + c
const g = x => 1 / (1 * Math.sqrt(x))
//----------------------------------------------------------------
// const f = x => Math.pow(x, x) + c
// const g = x => Math.pow(x, x) * (Math.log(x) + 1)
//----------------------------------------------------------------
// const f = x => Math.tan(x) + c
// const g = x => 1 / Math.pow(Math.cos(x), 2)
//----------------------------------------------------------------
// const f = x => 1 / Math.pow(Math.cos(x), 2) + c
// const g = x => 2 * Math.tan(x) * (1 / Math.pow(Math.cos(x), 2))
//----------------------------------------------------------------
// const f = x => Math.sqrt(9 - Math.pow(x, 2)) + c
// const g = x => -2 * x / (2 * Math.sqrt(9 - Math.pow(x, 2)))
//----------------------------------------------------------------
// const f = x => 5*(-x / Math.sqrt(c) + Math.sqrt(x))
// const g = x => -1 / Math.sqrt(c) + 1 / (2 * Math.sqrt(x))
//----------------------------------------------------------------

const drawGraph = (ctx, functionOfX, view, color) => {
    ctx.save()
    ctx.lineWidth = 3 / camera.scale

    {
        let toggle = false
        ctx.beginPath()
        for (let x = view.x1; x <= view.x2; x += 3 / camera.scale) {
            const y = functionOfX(x)
            if (Number.isFinite(y)) {
                if (!toggle) {
                    ctx.moveTo(x, -y)
                    toggle = true
                }
                else ctx.lineTo(x, -y)
            } else toggle = false
        }
        ctx.strokeStyle = color
        ctx.stroke()
    } // Grafiek

    ctx.restore()
}

// const f = x => x / 5 + d
// const g = x => Math.pow(x, 2) / 10 + c
//----------------------------------------------------------------
// const f = x => Math.sin(x) + d
// const g = x => -Math.cos(x) + d * x
//----------------------------------------------------------------
// const f = x => Math.sin(Math.pow(x, 2)) + d
// const g = x => undefined
//----------------------------------------------------------------
// const f = x => d
// const g = x => d * x + c
//----------------------------------------------------------------
// const f = x => Math.atan(x) + d
// const g = x => x * Math.atan(x) - Math.log(Math.pow(x, 2) + 1 ) / 2 + d * x + c // https://www.integral-calculator.com/
//----------------------------------------------------------------
// const f = x => Math.pow(x, x) + d
// const g = x => undefined
//----------------------------------------------------------------
// const f = x => Math.atan(Math.sqrt(x+d + 1))
// const g = x => (x+d + 2) * Math.atan(Math.sqrt(x+d + 1)) - Math.sqrt(x+d + 1)
//----------------------------------------------------------------
// const f = x => x * Math.atan(x) + d
// const g = x => (Math.pow(x, 2)+1)/2*Math.atan(x)-x/2
//----------------------------------------------------------------
// const f = x => 1 / (Math.pow(x,2) - 8 * x + 1)
// const g = x => undefined
//----------------------------------------------------------------
// const f = x => -x * x + 4 * x
// const g = x => -(1/3)*x*x*x +2*x*x
//----------------------------------------------------------------
// const f = x => Math.sqrt(1 + 4 * Math.pow(x, 2)) + d
// const g = x => undefined
//----------------------------------------------------------------
const f = x => 1 / Math.pow(Math.cos(x), 3)
const g = x => undefined

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

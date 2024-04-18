const f = x => Math.tan(x)
const g = x => -Math.log(Math.abs(Math.cos(x))) + c
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

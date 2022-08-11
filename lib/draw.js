const drawVector = (ctx, len, angle, point, color) => {
    ctx.save()
    ctx.rotate(-angle)

    {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(len - point, 0)
        ctx.strokeStyle = color
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(len - point, -point * (3/5))
        ctx.lineTo(len, 0)
        ctx.lineTo(len - point, point * (3/5))
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
    }
    {
        ctx.beginPath()
        ctx.arc(0, 0, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
    }

    ctx.restore()
}
const drawPositionedVector = (ctx, pos, len, angle, point, color) => {
    ctx.save()
    ctx.translate(pos[0], -pos[1])
    drawVector(ctx, len, angle, point,  color)
    ctx.restore()
}
const drawLijnstuk = (ctx, len, angle, color) => {
    ctx.save()
    ctx.rotate(-angle)
    ctx.beginPath()
    ctx.moveTo(-len, 0)
    ctx.lineTo(len, 0)
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.restore()
}
const drawPositionedLijnstuk = (ctx, pos, len, angle, color) => {
    ctx.save()
    ctx.translate(pos[0], -pos[1])
    drawLijnstuk(ctx, len, angle, color)
    ctx.restore()
}

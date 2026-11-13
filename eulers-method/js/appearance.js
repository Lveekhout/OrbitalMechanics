const drawRaster = (ctx, camera) => {
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
}

const drawDot = (ctx, x, y, r, color = 'black') => {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, -y, r, 0, 2 * pi)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
}

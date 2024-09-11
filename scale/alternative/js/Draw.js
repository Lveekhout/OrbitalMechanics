function Draw(camera) {
    let angle = 0

    this.draw = ms => {
        window.requestAnimationFrame(this.draw)

        camera.preDraw()
        const ctx = camera.ctx

        ctx.save()
        {
            ctx.beginPath()
            ctx.arc(0, 0, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'red'
            ctx.fill()
        }
        ctx.restore()

        ctx.save()
        {
            ctx.translate(1, 1)
            ctx.rotate(angle)
            ctx.beginPath()
            ctx.rect(-1/2, -1/4, 1, 1/2)
            ctx.fill()
        }
        ctx.restore()

        camera.postDraw(ms)

        angle += 0.01
    }
}

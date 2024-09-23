function Track(camera) {

    this.length = 100

    this.draw = () => {
        const ctx = camera.ctx

        ctx.save()
        {
            ctx.lineWidth = 8
            ctx.strokeStyle = '#aaa'
            ctx.beginPath()
            ctx.moveTo(-camera.x / camera.scale, 0)
            ctx.lineTo((camera.canvas.width - camera.x) / camera.scale, 0)
            ctx.stroke()
        }
        ctx.restore()

        ctx.save() // Start / Finish line
        {
            ctx.fillStyle = '#0088'
            ctx.beginPath()
            ctx.rect(this.length - 1, -6, 2, 12)
            ctx.fill()

            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            ctx.moveTo(0, 6)
            ctx.lineTo(0, -6)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(this.length, 6)
            ctx.lineTo(this.length, -6)
            ctx.stroke()
        }
        ctx.restore()
    }

    this.getCartesianCoordinates = s => {
        return {x: s, y: 0, angle: 0}
    }
}

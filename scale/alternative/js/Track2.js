function Track(camera) {

    this.length = 2000
    const radius = this.length / (2 * pi + 2)

    this.draw = () => {
        const ctx = camera.ctx

        ctx.save()
        {
            ctx.lineWidth = 8
            ctx.strokeStyle = '#aaa'
            ctx.beginPath()
            ctx.arc(radius, radius, radius, 0, 2 * pi)
            ctx.stroke()
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
            ctx.rect(2 * radius - 1, -6, 2, 12)
            ctx.fill()

            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            ctx.moveTo(0, 6)
            ctx.lineTo(0, -6)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(2 * radius, 6)
            ctx.lineTo(2 * radius, -6)
            ctx.stroke()
        }
        ctx.restore()
    }

    this.getCartesianCoordinates = s => {
        if (s < radius) {
            return {x: s, y: 0, angle: 0}
        } else if (s > (this.length - radius)) {
            return {x: s - (2 * pi * radius), y: 0, angle: 0}
        } else {
            const alpha = s / radius - pi / 2 - 1
            return {x: radius + cos(alpha) * radius, y: radius + sin(alpha) * radius, angle: s / radius - 1}
        }
    }
}

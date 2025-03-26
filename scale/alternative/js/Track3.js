function Track(camera) {

    this.length = 200
    let radius = 200 / pi / 2
    this.velocity = 0

    this.draw = () => {
        const ctx = camera.ctx

        ctx.save()
        {
            ctx.lineWidth = 8
            ctx.strokeStyle = '#aaa'
            ctx.beginPath()
            ctx.arc(0, 0, radius, 0, 2 * pi)
            ctx.stroke()
        }
        ctx.restore()

        ctx.save() // Start line
        {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            ctx.moveTo(radius - 6, 0)
            ctx.lineTo(radius + 6, 0)
            ctx.stroke()
        }
        ctx.restore()

        ctx.save() // Finish line
        {
            const coords = this.getCartesianCoordinates(this.length)
            ctx.translate(coords.x, coords.y)
            ctx.rotate(coords.angle)
            ctx.fillStyle = '#0088'
            ctx.beginPath()
            ctx.rect( - 1, -6, 2, 12)
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(0, -6)
            ctx.lineTo(0, 6)
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.stroke()
        }
        ctx.restore()
    }

    this.update = ds => {
        this.length += this.velocity * ds
    }

    this.getCartesianCoordinates = s => {
        const alpha = s / radius
        return {x: cos(alpha) * radius, y: sin(alpha) * radius, angle: alpha + pi / 2}
    }
}

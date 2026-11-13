function Car(camera, track) {
    this.a = 0
    this.v = 0
    this.s = 0

    this.blip = 0
    this.reaction = 900
    this.color = 'black'

    this.draw = ctx => {
        ctx.save()
        {
            const coords = track.getCartesianCoordinates(this.s)
            ctx.translate(coords.x, -coords.y)
            ctx.rotate(-coords.angle)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(1, 0)
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 1 / camera.scale
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(0, 0, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = this.color
            ctx.fill()
            // ctx.beginPath()
            // ctx.rect(-1, 1 / 2, 2, 1)
            // ctx.fillStyle = this.color
            // ctx.fill()
            // ctx.beginPath()
            // ctx.arc(3 / 2, 0, 1 / 2, 0, Math.PI * 2)
            // ctx.fillStyle = '#f33'
            // ctx.fill()
            // ctx.beginPath()
            // ctx.arc(3 / 2, 0, 1 / 2, 0, Math.PI * 2)
            // ctx.globalAlpha = this.blip
            // ctx.fillStyle = 'yellow'
            // ctx.fill()
        }
        ctx.restore()

        this.blip = Math.max(this.blip - 1 / 10, 0)
    }

    this.update = (ds, maxv) => {
        this.s = this.a * ds * ds / 2 + this.v * ds + this.s
        this.v = this.a * ds + this.v
        if (this.v < 0) {
            this.v = 0
            this.a = 0
        }
        if (this.v >= maxv) {
            this.v = maxv
            this.a = 0
        }
    }
}

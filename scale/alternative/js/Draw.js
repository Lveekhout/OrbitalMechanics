function Draw(camera) {
    let angle = 0

    this.a = 0
    this.v = 0
    this.s = 0

    let currentTime = window.performance.now()
    let radius = 1000 / (2 * pi + 2)

    this.draw = ms => {
        if (Math.abs(this.s) < 5000) window.requestAnimationFrame(this.draw)

        camera.preDraw()
        const ctx = camera.ctx

        ctx.save()
        {
            ctx.translate(10, 10)
            ctx.rotate(angle)
            ctx.beginPath()
            ctx.rect(-2, -1, 4, 2)
            ctx.fill()
        }
        ctx.restore()

        ctx.save()
        {
            ctx.lineWidth = 12
            ctx.strokeStyle = '#aaa'
            ctx.beginPath()
            ctx.arc(radius, radius, radius, 0, 2 * pi)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(2 * radius, 0)
            ctx.stroke()
        }
        ctx.restore()

        ctx.save()
        {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            ctx.moveTo(2 * radius, 10)
            ctx.lineTo(2 * radius, -10)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, 10)
            ctx.lineTo(0, -10)
            ctx.stroke()
        }
        ctx.restore()

        ctx.save()
        {
            ctx.fillStyle = 'purple'
            if (this.s < radius) {
                ctx.save()
                ctx.translate(this.s, 0)
                ctx.rect(-4, -1, 4, 2)
                ctx.fill()
                ctx.restore()
            } else if (this.s > (1000 - radius)) {
                ctx.save()
                ctx.translate(this.s - (2 * pi * radius), 0)
                ctx.rect(-4, -1, 4, 2)
                ctx.fill()
                ctx.restore()
            } else {
                const angle = this.s / radius - pi / 2 - 1
                ctx.translate(radius, radius)
                ctx.translate(cos(angle) * radius, sin(angle) * radius)
                ctx.rotate(angle+pi/2)
                ctx.beginPath()
                ctx.rect(-4, -1, 4, 2)
                ctx.fill()
            }
        }
        ctx.restore()

        camera.postDraw(ms)

        angle += 0.05

        ctx.fillText(`s = ${this.s.toFixed(6)}, v = ${this.v.toFixed(6)}`, 10, 30)
        const t = (ms - currentTime) / 1000
        currentTime = ms
        this.s = this.a * t * t / 2 + this.v * t + this.s
        this.v = this.a * t + this.v
    }

    this.run = () => {
        this.s = 0
        this.v = 0
        this.a = 1000/35
        setTimeout(() => {
            this.a = 0
        }, 5000)
        setTimeout(() => {
            this.a = -1000/7
        }, 9000)
        setTimeout(() => {
            this.a = 0
            this.v = 0
        }, 10000)
    }
}

function Vector() {
    if (arguments.length === 1 && arguments[0].constructor.name === 'Array') {
        this.o = [0, 0]
        this.p = arguments[0]
        this.length = Math.sqrt(Math.pow(this.p[0], 2) + Math.pow(this.p[1], 2))
        this.angle = Math.atan2(this.p[1], this.p[0])
    } else if (arguments.length === 2 && arguments[0].constructor.name === 'Number' && arguments[1].constructor.name === 'Number') {
        this.o = [0, 0]
        this.length = arguments[0]
        this.angle = arguments[1]
        this.p = [Math.cos(this.angle) * this.length, Math.sin(this.angle) * this.length]
    } else if (arguments.length === 2 && arguments[0].constructor.name === 'Array' && arguments[1].constructor.name === 'Array') {
        this.o = arguments[0]
        this.p = arguments[1]
        this.length = Math.sqrt(Math.pow(this.p[0], 2) + Math.pow(this.p[1], 2))
        this.angle = Math.atan2(this.p[1], this.p[0])
    } else if (arguments.length === 3 && arguments[0].constructor.name === 'Array' && arguments[1].constructor.name === 'Number' && arguments[2].constructor.name === 'Number') {
        this.o = arguments[0]
        this.length = arguments[1]
        this.angle = arguments[2]
        this.p = [Math.cos(this.angle) * this.length, Math.sin(this.angle) * this.length]
    } else {
        throw `Vector: geen overload voor: (${Array.from(arguments).map(e => e.constructor.name).join(', ')})`
    }
    // if (this.angle < 0) this.angle += Math.PI * 2

    this.draw = (ctx, camera, point, color, scale = 1) => {
        point = Math.min(point / camera.scale, this.length * scale / 2)
        ctx.save()
        ctx.translate(this.o[0], -this.o[1])
        ctx.rotate(-this.angle)

        {
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(this.length * scale - point, 0)
            ctx.strokeStyle = color
            ctx.lineWidth = 2 / camera.scale
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(this.length * scale - point, -point * (1 / 2))
            ctx.lineTo(this.length * scale, 0)
            ctx.lineTo(this.length * scale - point, point * (1 / 2))
            ctx.closePath()
            ctx.fillStyle = color
            ctx.fill()
        }
        {
            ctx.beginPath()
            ctx.arc(0, 0, 3 / camera.scale, 0, Math.PI * 2)
            ctx.fillStyle = 'red'
            ctx.fill()
        }

        ctx.restore()
    }

    this.info = () => {
        return {o: this.o, p: this.p, length: this.length, angle: this.angle}
    }

    // function normalize(a) {
    //     return (a + Math.PI * 2) % (Math.PI * 2)
    //     // a = Math.atan2(Math.sin(a), Math.cos(a))
    //     // if (a < 0) a += Math.PI * 2
    //     // return a
    // }
}

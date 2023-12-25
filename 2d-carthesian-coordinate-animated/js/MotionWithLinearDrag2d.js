function MotionWithLinearDrag2d(s, v, m, b, w) {

    const x = new MotionWithLinearDrag1d(s[0], v[0], m, b, w[0])
    const y = new MotionWithLinearDrag1d(s[1], v[1], m, b, w[1])

    this.setM = value => {
        m = value
        x.setM(value)
        y.setM(value)
    }
    this.setB = value => {
        b = value
        x.setB(value)
        y.setB(value)
    }
    this.setW = value => {
        w = value
        x.setW(value[0])
        y.setW(value[1])
    }

    this.info = () => ({s: s, v: v, m: m, b: b, w: w})

    this.update = ds => { // https://www.desmos.com/calculator/gvy3l2yamb
        x.update(ds)
        y.update(ds)
        if (y.info().s < 0) {
            y.setS(-y.info().s / 2)
            y.setV(-y.info().v / 2)
        }
    }

    this.drawPosition = ctx => {
        drawDrag(ctx)
        drawVelocity(ctx)
        drawForce(ctx)
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.arc(x.info().s, -y.info().s, Math.sqrt(2) * m / camera.scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }

    const drawDrag = ctx => {
        const vect = new Vector([x.info().s, y.info().s], [x.info().b*x.info().v, y.info().b*y.info().v])
        if (vect.length > .3) vect.draw(ctx, 8, 'blue', 1 / 3)
    }

    const drawVelocity = ctx => {
        const vect = new Vector([x.info().s, y.info().s], [x.info().v, y.info().v])
        if (vect.length > .3) vect.draw(ctx, 8, 'green', 1 / 3)
    }

    const drawForce = ctx => {
        const vect = new Vector([x.info().s, y.info().s], [x.info().w, y.info().w])
        if (vect.length > .3) vect.draw(ctx, 8, 'orange', 1 / 3)
    }
}

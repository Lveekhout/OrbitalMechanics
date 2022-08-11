const iEarth = new Image()
iEarth.src = 'https://i.pinimg.com/originals/07/8a/b5/078ab50f97a4a8031c9a11b17324f22c.png' // 2048x2048 (1638x1638)

function Orbit(vr, vv) {
    const M = 5.972e24 // https://en.wikipedia.org/wiki/Earth_mass
    const G = 6.67408e-11
    const mu = M * G // https://nl.wikipedia.org/wiki/Gravitatieconstante
    const r1 = new Vector(vr)
    const m = new Vector(vr, vv)
    const a = -mu / (m.length * m.length - 2 * mu / r1.length)
    const a2 = a * 2
    const r2 = new Vector(vr, a2 - r1.length, m.angle * 2 - r1.angle)
    const o = new Vector([(r2.p[0] + vr[0]) / 2, (r2.p[1] + vr[1]) / 2])
    const b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))

    this.draw = ctx => {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(o.p[0], -o.p[1], a, b, -o.angle, 0, Math.PI * 2)
        ctx.globalAlpha = .3
        ctx.lineWidth = 2 / camera.scale
        ctx.strokeStyle = 'yellow'
        ctx.stroke()
        ctx.restore()

        ctx.save()
        // ctx.globalAlpha = .3
        ctx.scale(6378e3 / 1638 * 2, 6378e3 / 1638 * 2)
        ctx.translate(-iEarth.width / 2, -iEarth.height / 2)
        ctx.drawImage(iEarth, 0, 0)
        ctx.restore()

        {
            ctx.save()
            ctx.globalAlpha = .3
            new Vector(o.p, a, Math.atan2(o.p[1], o.p[0])).draw(ctx, 6, 'blue')
            new Vector(o.p, a, Math.atan2(-o.p[1], -o.p[0])).draw(ctx, 6, 'blue')

            r2.draw(ctx, 6, 'white')
            r1.draw(ctx, 6, 'white')
            ctx.restore()
        }

        m.draw(ctx, 6, 'green', 256)
    }
}

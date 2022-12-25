const iEarth = new Image()
iEarth.src = 'https://i.pinimg.com/originals/07/8a/b5/078ab50f97a4a8031c9a11b17324f22c.png' // 2048x2048 (1638x1638)

EarthOrbit.createCircularOrbit = (vr, color) => {
    const M = 5.972e24 // https://en.wikipedia.org/wiki/Earth_mass
    const G = 6.67408e-11
    const mu = M * G // https://nl.wikipedia.org/wiki/Gravitatieconstante
    const v = Math.sqrt(mu / Math.sqrt(Math.pow(vr[0], 2) + Math.pow(vr[1], 2)))
    return new EarthOrbit(vr, new Vector(v, Math.atan2(vr[1], vr[0]) + Math.PI / 2).p, color)
}

function EarthOrbit(vr, vv, color) { // Array, Array, String
    if (!color) color = 'yellow'
    const M = 5.972e24 // https://en.wikipedia.org/wiki/Earth_mass
    const G = 6.67408e-11
    const mu = M * G // https://nl.wikipedia.org/wiki/Gravitatieconstante

    const r1 = new Vector(vr)
    const m = new Vector(r1.p, vv)
    // const m = { x: 3, y: 4, l: 5, a: Math.PI / 2 }
    let a = -mu / (m.length * m.length - 2 * mu / r1.length)
    let T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu)

    const r2 = new Vector(r1.p, 2 * a - r1.length, m.angle * 2 - r1.angle)
    const o = new Vector([(r2.p[0] + r1.p[0]) / 2, (r2.p[1] + r1.p[1]) / 2])
    let b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
    let c = o.length //Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2))
    let e = c / a

    let trueAnomaly = r1.angle - (o.angle - Math.PI)
    let E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
    let Me = E - e * Math.sin(E) // (11)
    let t = Me / (Math.PI * 2) * T
    let L = m.o[0] * m.p[1] - m.o[1] * m.p[0]

    this.draw = ctx => {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(o.p[0], -o.p[1], a, b, -o.angle, 0, Math.PI * 2)
        ctx.globalAlpha = .5
        ctx.lineWidth = 2 / camera.scale
        ctx.strokeStyle = color
        ctx.stroke()
        // ctx.beginPath()
        // ctx.arc(o.p[0], -o.p[1], a, 0, Math.PI * 2)
        // ctx.stroke()
        ctx.restore()

        // {
        //     ctx.save()
        //     ctx.globalAlpha = .3
        //     new Vector(o.p, a, Math.atan2(o.p[1], o.p[0])).draw(ctx, 6, 'blue')
        //     new Vector(o.p, a, Math.atan2(-o.p[1], -o.p[0])).draw(ctx, 6, 'orange')
        //     ctx.restore()
        // }

        m.draw(ctx, 6, 'green', 256)
        // r2.draw(ctx, 6, 'white')
        // r1.draw(ctx, 6, 'white')
        // new Vector(o.p, a, E + o.angle - Math.PI).draw(ctx, 6, 'red')
        // new Vector(o.p, a, Me + o.angle - Math.PI).draw(ctx, 6, 'white')
    }

    this.copy = () => new EarthOrbit([r1.p[0], r1.p[1]], [m.p[0], m.p[1]])

    this.setAngleOfVelocity = angle => {
        m.angle = angle
        m.p[0] = Math.cos(m.angle) * m.length
        m.p[1] = Math.sin(m.angle) * m.length
        r2.angle = m.angle * 2 - r1.angle
        r2.p[0] = Math.cos(r2.angle) * r2.length
        r2.p[1] = Math.sin(r2.angle) * r2.length
        o.p[0] = (r2.p[0] + r1.p[0]) / 2
        o.p[1] = (r2.p[1] + r1.p[1]) / 2
        o.length = Math.sqrt(Math.pow(o.p[0], 2) + Math.pow(o.p[1], 2))
        o.angle = Math.atan2(o.p[1], o.p[0])
        b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
        c = o.length
        e = c / a
        trueAnomaly = r1.angle - (o.angle - Math.PI)
        E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
        Me = E - e * Math.sin(E) // (11)
        t = Me / (Math.PI * 2) * T
        L = m.o[0] * m.p[1] - m.o[1] * m.p[0]
    }

    this.setLengthOfVelocity = length => {
        m.length = length
        m.p[0] = Math.cos(m.angle) * m.length
        m.p[1] = Math.sin(m.angle) * m.length
        a = -mu / (m.length * m.length - 2 * mu / r1.length)
        T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu)
        r2.length = 2 * a - r1.length
        r2.p[0] = Math.cos(r2.angle) * r2.length
        r2.p[1] = Math.sin(r2.angle) * r2.length
        o.p[0] = (r2.p[0] + r1.p[0]) / 2
        o.p[1] = (r2.p[1] + r1.p[1]) / 2
        o.length = Math.sqrt(Math.pow(o.p[0], 2) + Math.pow(o.p[1], 2))
        o.angle = Math.atan2(o.p[1], o.p[0])
        b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
        c = o.length //Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2))
        e = c / a
        trueAnomaly = r1.angle - (o.angle - Math.PI)
        E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
        Me = E - e * Math.sin(E) // (11)
        t = Me / (Math.PI * 2) * T
        L = m.o[0] * m.p[1] - m.o[1] * m.p[0]
    }

    this.setAngleOfMass = angle => {
        r1.angle = angle
        r1.p[0] = Math.cos(r1.angle) * r1.length
        r1.p[1] = Math.sin(r1.angle) * r1.length
        // m.o = r1.p // Gebeurt impliciet
        r2.angle = m.angle * 2 - r1.angle
        // r2.o = r1.p // Gebeurt impliciet
        r2.p[0] = Math.cos(r2.angle) * r2.length
        r2.p[1] = Math.sin(r2.angle) * r2.length
        o.p[0] = (r2.p[0] + r1.p[0]) / 2
        o.p[1] = (r2.p[1] + r1.p[1]) / 2
        o.length = Math.sqrt(Math.pow(o.p[0], 2) + Math.pow(o.p[1], 2))
        o.angle = Math.atan2(o.p[1], o.p[0])
        b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
        c = o.length
        e = c / a
        trueAnomaly = r1.angle - (o.angle - Math.PI)
        E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
        Me = E - e * Math.sin(E) // (11)
        t = Me / (Math.PI * 2) * T
        L = m.o[0] * m.p[1] - m.o[1] * m.p[0]
    }

    this.setLengthOfMass = length => {
        r1.length = length
        r1.p[0] = Math.cos(r1.angle) * r1.length
        r1.p[1] = Math.sin(r1.angle) * r1.length
        // m.o = r1.p // Gebeurt impliciet
        a = -mu / (m.length * m.length - 2 * mu / r1.length)
        T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu)
        r2.length = 2 * a - r1.length
        // r2.o = r1.p // Gebeurt impliciet
        r2.p[0] = Math.cos(r2.angle) * r2.length
        r2.p[1] = Math.sin(r2.angle) * r2.length
        o.p[0] = (r2.p[0] + r1.p[0]) / 2
        o.p[1] = (r2.p[1] + r1.p[1]) / 2
        o.length = Math.sqrt(Math.pow(o.p[0], 2) + Math.pow(o.p[1], 2))
        o.angle = Math.atan2(o.p[1], o.p[0])
        b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
        c = o.length
        e = c / a
        trueAnomaly = r1.angle - (o.angle - Math.PI)
        E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
        Me = E - e * Math.sin(E) // (11)
        t = Me / (Math.PI * 2) * T
        L = m.o[0] * m.p[1] - m.o[1] * m.p[0]
    }

    this.setCartesianAngle = angle => {
        this.setTrueAnomaly(angle - (o.angle - Math.PI))
        return this
    }

    this.setTrueAnomaly = angle => {
        trueAnomaly = angle
        E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
        Me = E - e * Math.sin(E) // (11)
        t = Me / (Math.PI * 2) * T
        // r1.length = L * (L / mu) / (1 + e * Math.cos(newTrueAnomaly))
        r1.length = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(trueAnomaly)) // 2:32 minuut https://www.youtube.com/watch?v=Am7EwmxBAW8&t=1285s
        r1.angle = trueAnomaly + (o.angle - Math.PI)
        r1.p[0] = Math.cos(r1.angle) * r1.length
        r1.p[1] = Math.sin(r1.angle) * r1.length
        r2.p[0] = o.p[0] * 2 - r1.p[0]
        r2.p[1] = o.p[1] * 2 - r1.p[1]
        r2.length = Math.sqrt(Math.pow(r2.p[0], 2) + Math.pow(r2.p[1], 2))
        r2.angle = Math.atan2(r2.p[1], r2.p[0])
        m.length = Math.sqrt(2 * (mu / r1.length - mu / (2 * a)))
        m.angle = bepHoek(r1.angle, r2.angle)
        m.p[0] = Math.cos(m.angle) * m.length
        m.p[1] = Math.sin(m.angle) * m.length
    }

    this.setDeltaSeconds = ds => {
        t = (L < 0 ? t - ds : t + ds) % T
        Me = t * Math.PI * 2 / T
        E = newtonsMethod(Me, e)
        trueAnomaly = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)) // (27:26 minuut filmpje)
        r1.length = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(trueAnomaly)) // 2:32 minuut https://www.youtube.com/watch?v=Am7EwmxBAW8&t=1285s
        r1.angle = trueAnomaly + (o.angle - Math.PI)
        r1.p[0] = Math.cos(r1.angle) * r1.length
        r1.p[1] = Math.sin(r1.angle) * r1.length
        r2.p[0] = o.p[0] * 2 - r1.p[0]
        r2.p[1] = o.p[1] * 2 - r1.p[1]
        r2.length = Math.sqrt(Math.pow(r2.p[0], 2) + Math.pow(r2.p[1], 2))
        r2.angle = Math.atan2(r2.p[1], r2.p[0])
        m.length = Math.sqrt(2 * (mu / r1.length - mu / (2 * a)))
        m.angle = bepHoek(r1.angle, r2.angle)
        m.p[0] = Math.cos(m.angle) * m.length
        m.p[1] = Math.sin(m.angle) * m.length
    }

    this.setAccelerationOfVelocity = ds => {
        this.setLengthOfVelocity(m.length + 10 * ds) // m/s/s
    }

    this.info = () => {
        return {
            a: a,
            b: b,
            c: c,
            e: e,
            m: m.info(),
            r1: r1.info(),
            h: r1.length - 6378e3,
            r2: r2.info(),
            o: o,
            trueAnomaly: trueAnomaly,
            T: T,
            t: t,
            L: L
        }
    }

    function bepHoek(a, b) {
        let result

        a = Math.atan2(Math.sin(a), Math.cos(a))
        // b = Math.atan2(Math.sin(b), Math.cos(b))
        // if (a < 0) a += Math.PI * 2
        // if (b < 0) b += Math.PI * 2

        if (L > 0) { // anti-clockwise
            if (a < b) result = b - (b - a) / 2
            else if (a > b) result = b - (b - a) / 2 + Math.PI
            else throw "Uitzonderlijk geval"
        } else { // clockwise
            if (a < b) result = b - (b - a) / 2 + Math.PI
            else if (a > b) result = b - (b - a) / 2
            else throw "Uitzonderlijk geval"
        }

        // if (result > Math.PI * 2) result -= Math.PI * 2

        return result
    }

    const newtonsMethod = (Me, e) => {
        let cE = Me
        let nE = cE - ((Me - cE + e * Math.sin(cE)) / (-1 + e * Math.cos(cE)))
        while (Math.abs(cE - nE) > 1e-6) {
            cE = nE
            nE = cE - ((Me - cE + e * Math.sin(cE)) / (-1 + e * Math.cos(cE)))
        }
        return nE
    }
}

const iEarth = new Image()
iEarth.src = 'https://i.pinimg.com/originals/07/8a/b5/078ab50f97a4a8031c9a11b17324f22c.png' // 2048x2048 (1638x1638)

function EarthOrbit(vr, vv, color) { // Array, Array, String
    if (!color) color = 'yellow'
    const M = 5.972e24 // https://en.wikipedia.org/wiki/Earth_mass
    const G = 6.67408e-11
    const mu = M * G // https://nl.wikipedia.org/wiki/Gravitatieconstante

    const r1 = new Vector(vr)
    const m = new Vector(vr, vv)
    const a = -mu / (m.length * m.length - 2 * mu / r1.length)
    const a2 = a * 2
    const L = m.o[0] * m.p[1] - m.o[1] * m.p[0]
    const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu)

    const r2 = new Vector(vr, a2 - r1.length, m.angle * 2 - r1.angle)
    const o = new Vector([(r2.p[0] + vr[0]) / 2, (r2.p[1] + vr[1]) / 2])
    const b = Math.sqrt(Math.pow(a, 2) - Math.pow(o.length, 2))
    const c = o.length //Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2))
    const e = c / a

    const trueAnomaly = r1.angle - (o.angle - Math.PI)
    const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(trueAnomaly / 2)) // (10b)
    const Me = E - e * Math.sin(E) // (11)
    const t = Me / (Math.PI * 2) * T

    this.draw = ctx => {
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(o.p[0], -o.p[1], a, b, -o.angle, 0, Math.PI * 2)
        // ctx.arc(o.p[0], -o.p[1], a, 0, Math.PI * 2)
        ctx.globalAlpha = .5
        ctx.lineWidth = 2 / camera.scale
        ctx.strokeStyle = color
        ctx.stroke()
        ctx.restore()

        // {
        //     ctx.save()
        //     ctx.globalAlpha = .3
        //     new Vector(o.p, a, Math.atan2(o.p[1], o.p[0])).draw(ctx, 6, 'blue')
        //     new Vector(o.p, a, Math.atan2(-o.p[1], -o.p[0])).draw(ctx, 6, 'orange')
        //
        //     r2.draw(ctx, 6, 'white')
        //     r1.draw(ctx, 6, 'white')
        //     ctx.restore()
        // }

        m.draw(ctx, 6, 'green', 256)
        // new Vector(o.p, a, E + o.angle - Math.PI).draw(ctx, 6, 'red')
        // new Vector(o.p, a, Me + o.angle - Math.PI).draw(ctx, 6, 'white')
    }

    this.copyOrbitFromTrueAnomaly = trueAnomaly => {
        const realAngle = trueAnomaly + (o.angle - Math.PI)
        // const nafstand = L * (L / mu) / (1 + e * Math.cos(newTrueAnomaly))
        const nafstand = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(trueAnomaly)) // 2:32 minuut https://www.youtube.com/watch?v=Am7EwmxBAW8&t=1285s
        const vr1 = new Vector(nafstand, realAngle)
        const vr2 = new Vector(vr1.p, [r2.o[0] + r2.p[0] - vr1.p[0], r2.o[1] + r2.p[1] - vr1.p[1]])
        const lv = Math.sqrt(2 * (mu / vr1.length - mu / a2))
        const av = bepHoek(vr1.angle, vr2.angle)

        return new EarthOrbit(vr1.p, new Vector(lv, av).p, 'purple')
    }

    this.copyOrbitFromRealAngle = realAngle => {
        return this.copyOrbitFromTrueAnomaly(realAngle - (o.angle - Math.PI))
    }

    this.copyOrbitFromDeltaSeconds = deltaSeconds => {
        const newTime = L < 0 ? t - deltaSeconds : t + deltaSeconds
        const Me = newTime * Math.PI * 2 / T
        const E = newtonsMethod(Me, e)
        const trueAnomaly = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)) // (27:26 minuut filmpje)

        return this.copyOrbitFromTrueAnomaly(trueAnomaly)
    }

    this.info = () => {
        return {
            a: a,
            b: b,
            c: c,
            e: e,
            m: m.info(),
            r1: r1.info(),
            r: L * (L / mu) / (1 + e * Math.cos(trueAnomaly)),
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
        while (Math.abs(cE-nE) > 1e-6) {
            cE = nE
            nE = cE - ((Me - cE + e * Math.sin(cE)) / (-1 + e * Math.cos(cE)))
        }
        return nE
    }
}

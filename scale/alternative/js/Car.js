function Car(camera, track) {
    this.a = 0
    this.v = 0
    this.s = 0

    this.blip = 0
    this.reaction = 900
    this.color = 'black'

    this.draw = () => {
        const ctx = camera.ctx

        ctx.save()
        {
            const coords = track.getCartesianCoordinates(this.s - 2)
            ctx.translate(coords.x, coords.y)
            ctx.rotate(coords.angle)
            ctx.beginPath()
            ctx.rect(-2, -1, 4, 2)
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.beginPath()
            ctx.arc(3 / 2, 0, 1 / 2, 0, pi * 2)
            ctx.fillStyle = '#f33'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(3 / 2, 0, 1 / 2, 0, pi * 2)
            ctx.globalAlpha = this.blip
            ctx.fillStyle = 'yellow'
            ctx.fill()
        }
        ctx.restore()

        this.blip = max(this.blip - 1 / 10, 0)
    }

    this.update = ds => {
        this.s = this.a * ds * ds / 2 + this.v * ds + this.s
        this.v = this.a * ds + this.v
        if (this.v < 0) this.v = this.a = 0
    }

    this.decide = (distance, ve) => {
        this.blip = 4 / 5

        const d = distance - this.s
        if (d > 0) {
            // const ve = track.velocity // eind-snelheid
            const p = -9 // max rem-slope
            const q = -3 // relaxte rem-slope
            const r = 4 // vol-gas(gemiddeld)
            const m = (ve * ve - this.v * this.v) / 2 / d
            if (m > q) {
                const t = 2 * this.reaction / 1000
                const vm = 100 / 3.6
                // https://www.wolframalpha.com/input?i=v_1t%2Bv_2%28%28v_2-h%29%2Fm%29%2B1%2F2t%28h-v_1%29%2B1%2F2%28h-v_2%29%28%28v_2-h%29%2Fm%29%3Dd+for+h
                // https://www.desmos.com/calculator/tobug20hlt
                const h = (1 / 2) * (sqrt(-8 * d * p + p * p * t * t + 4 * p * t * this.v + 4 * ve * ve) + p * t) // IMG_20240918_142821.jpg
                this.a = min((vm - this.v) / t, r, (h - this.v) / t)
            } else {
                this.a = max(m, p)
            }
        } else this.a = 0
    }

    // this.decide = () => { // Uitgaande van eind-snelheid = 0
    //     this.blip = 4 / 5
    //
    //     const d = track.length - this.s
    //     if (d > 0) {
    //         const p = -9 // max rem-slope
    //         const q = -3 // relaxte rem-slope
    //         const r = 4 // vol-gas(gemiddeld)
    //         const m = -this.v * this.v / 2 / d
    //         if (m > q) {
    //             const t = 2 * this.reaction / 1000
    //             const vm = 100 / 3.6
    //             const h = (1 / 2) * (sqrt(p * (t * (p * t + 4 * this.v) - 8 * d)) + p * t) // IMG_20240918_142821.jpg
    //             this.a = min((vm - this.v) / t, r, (h - this.v) / t)
    //         } else {
    //             this.a = max(m, p)
    //         }
    //     } else this.a = 0
    // }

    // this.decide = () => {
    //     this.blip = 1
    //     const t = this.reaction / 500
    //     const d = track.length - this.s
    //     const c = t * this.v
    //     if (d < c) {
    //         this.a = (-this.v * this.v ) / d / 2
    //     } else {
    //         const dv = 2 * (d - c) / t
    //         this.a = min(dv / t, 50)
    //     }
    // }
}

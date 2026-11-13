const euler = () => {
    const earthresult = []
    const moonresult = []
    const satellietresult = []
    const satellietvelocity = []
    const satellietacceleration = []
    const M = 5.972e24 // massa aarde
    const m = 7.34767309e22 // massa maan
    const GM = G * M
    const Gm = G * m

    const satinfo = getSatelliteInput()
    // const moon = {x: 384400, y: 0, vx: 0, vy: 3680 / 3600}
    const moon = {x: 159494.64580444398, y: -351726.0159623003, vx: 0.923589281403921, vy: 0.42692615853090776}
    const earth = {x: 0, y: 0, vx: 0, vy: 0}
    const satellite = {x: satinfo.satx, y: satinfo.saty, vx: satinfo.satspeed * cos(satinfo.satdir), vy: satinfo.satspeed * sin(satinfo.satdir)}

    let dx = earth.x - moon.x // van de maan naar de aarde
    let dy = earth.y - moon.y
    let s2 = dx * dx + dy * dy
    let s = sqrt(s2) // afstand aarde -> maan in km

    let am = GM / s2
    let axm = am * dx / s
    let aym = am * dy / s
    // let ae = Gm / s2
    // let axe = ae * -dx / s
    // let aye = ae * -dy / s

    dx = earth.x - satellite.x
    dy = earth.y - satellite.y
    s2 = dx * dx + dy * dy
    s = sqrt(s2) // afstand satelliet -> aarde in km

    let as = GM / s2
    let axs = as * dx / s
    let ays = as * dy / s

    const dt = 1 / 20 // seconden
    let t = 0
    let idx = 0

    while (t < 60*60*24*5) {
        earthresult.push([earth.x, earth.y])
        moonresult.push([moon.x, moon.y])
        satellietresult.push([satellite.x, satellite.y])
        satellietvelocity.push([satellite.vx, satellite.vy])
        satellietacceleration.push([axs, ays])


        moon.x += 1 / 2 * axm * dt * dt + moon.vx * dt
        moon.y += 1 / 2 * aym * dt * dt + moon.vy * dt
        moon.vx += axm * dt
        moon.vy += aym * dt

        // earth.x += 1 / 2 * axe * dt * dt + earth.vx * dt
        // earth.y += 1 / 2 * aye * dt * dt + earth.vy * dt
        // earth.vx += axe * dt
        // earth.vy += aye * dt

        satellite.x += 1 / 2 * axs * dt * dt + satellite.vx * dt
        satellite.y += 1 / 2 * ays * dt * dt + satellite.vy * dt
        satellite.vx += axs * dt
        satellite.vy += ays * dt

        dx = earth.x - moon.x
        dy = earth.y - moon.y
        s2 = dx * dx + dy * dy
        s = sqrt(s2)

        am = GM / s2
        axm = am * dx / s
        aym = am * dy / s
        // ae = Gm / s2
        // axe = ae * -dx / s
        // aye = ae * -dy / s

        dx = earth.x - satellite.x
        dy = earth.y - satellite.y
        s2 = dx * dx + dy * dy
        s = sqrt(s2) // afstand satelliet -> aarde in km

        as = GM / s2
        axs = as * dx / s
        ays = as * dy / s

        dx = moon.x - satellite.x
        dy = moon.y - satellite.y
        s2 = dx * dx + dy * dy
        s = sqrt(s2) // afstand satelliet -> maan in km

        as = Gm / s2
        axs += as * dx / s
        ays += as * dy / s

        if (idx >= 1426491 && idx < 1428000) ays += 1 / 1000

        t += dt
        idx++
    }
    console.log(`aantal: ${moonresult.length}, eindsnelheid: ${sqrt(moon.vx * moon.vx + moon.vy * moon.vy)}`)
    return {
        earth: earthresult,
        moon: moonresult,
        satelliet: satellietresult,
        satellietvelocity: satellietvelocity,
        satellietacceleration: satellietacceleration
    }
}

const displacement = t => {
    const y = v * m / b * (1 - Math.pow(Math.E, -b / m * t))
    return y
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let a = -b * v_ / m
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        a = -b * v_ / m

        t += dt
    }
    return result
}

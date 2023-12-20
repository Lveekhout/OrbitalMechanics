const displacement = t => {
    // const y = v * m / b * (1 - Math.pow(Math.E, -b / m * x))

    // https://www.desmos.com/calculator/ojgg62opno
    const p = m / -b * (v - w / -b)
    const y = p * (Math.pow(Math.E, -b / m * t) - 1) + w / -b * t
    return y
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let a = (-b * v_ - w) / m
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        a = (-b * v_ - w) / m

        t += dt
    }
    return result
}

const displacement = t => {
    // return m / b * Math.log(Math.abs(b * t + m / v)) - m / b * Math.log(m / v) // Deze werkt ook op de één of andere manier
    return m / b * Math.log(Math.abs(b * v * t + m)) - m / b * Math.log(m) // Deze komt van Wolfram Alfa
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let a = (-b * v_ * Math.abs(v_)) / m
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        a = (-b * v_ * Math.abs(v_)) / m

        t += dt
    }
    return result
}

const displacement = t => {
    return m/b * Math.log(b*t+m/v)
    // return m / b * Math.log(Math.abs(b * v * t + m)) - m / b * Math.log(m)
    // return v*t
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let a = ((-b * v_ * Math.abs(v_)) - w) / m
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        a = ((-b * v_ * Math.abs(v_)) - w) / m

        t += dt
    }
    return result
}

// Met veranderende massa in de tijd

const displacement = t => {
    const x = v * t + 10 * Math.log(5) * t - 10 * (-t - Math.log(5 - t) * (5 - t)) // https://www.integral-calculator.com/
    const c = -50 * Math.log(5)
    return x + c
}

const generate = () => {
    const result = []

    let idx = 0
    let t = 0
    const time = 60 // seconden
    let s = 0
    let v_ = v
    let m_ = 5-t//w * Math.log(t + Math.E) - w + m
    let a = 10 / m_
    while (t < time) {
        if (idx++ % 10 === 0) result.push([t, s])

        v_ += a * dt
        s += v_ * dt
        m_ = 5-t//w * Math.log(t + Math.E) - w + m
        a = 10 / m_

        t += dt
    }
    return result
}

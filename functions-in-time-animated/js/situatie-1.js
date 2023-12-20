function f(t) {
    const s = -2 * Math.pow(t, 2) + iv * t + is
    return s
}

function g(dt) {
    s += -2 * dt * dt + v * dt
    v += -4 * dt
    return s
}

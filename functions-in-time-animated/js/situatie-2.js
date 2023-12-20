function f(t) {
    const s = im * iv / ib * (Math.pow(Math.E, ib * t / im) - 1) + is
    return s
}

function g(dt) {
    s += im * v / ib * (Math.pow(Math.E, ib * dt / im) - 1)
    v = v * Math.pow(Math.E, ib * dt / im)
    return s
}

function f(t) {
    return im / ib * (iv + iw / ib) * (Math.pow(Math.E, ib * t / im) - 1) - iw / ib * t + is
}

function g(dt) {
    s += im / ib * (v + iw / ib) * (Math.pow(Math.E, ib * dt / im) - 1) - iw / ib * dt
    v = (v + iw / ib) * Math.pow(Math.E, ib * dt / im) - iw / ib
    return s
}

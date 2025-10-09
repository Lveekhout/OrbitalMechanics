const ggd = (t, n) => {
    if (n == 0) return t
    else return ggd(n, t%n)
}

const kgv = (t, n) => {
    return t * n / ggd(t, n)
}
// ------------------------------------------------------------------------
const fraqvereenvoudigen = p => {
    const ggd_ = ggd(p[0], p[1])
    return [p[0]/ggd_, p[1]/ggd_]
}

const fraqsqr = p => {
    const q = [p[0]*p[0], p[1]*p[1]]
    const ggd_ = ggd(q[0], q[1])
    return fraqvereenvoudigen([q[0]/ggd_, q[1]/ggd_])
}

const fraqkeer = (p, q) => {
    return fraqvereenvoudigen([p[0]*q[0],p[1]*q[1]])
}

const fraqdelen = (p, q) => {
    return fraqvereenvoudigen([p[0]*q[1],p[1]*q[0]])
}

const fraqsqrt = p => {
    const approach = [Math.sqrt(p[0]/p[1]), Math.sqrt(p[0]), Math.sqrt(p[1])]
    if (Number.isInteger(approach[0])) return approach[0]
    if (Number.isInteger(approach[1]) && Number.isInteger(approach[2])) return fraqvereenvoudigen([approach[1], approach[2]])
    if (Number.isInteger(approach[1])) return approach[1] + "/w(" + p[1] + ")"
    if (Number.isInteger(approach[2])) return "w(" + p[0] + ")/" + approach[2]
    return "w(" + p[0] + "/" + p[1] + ")"
}

const fraqplus = (p, q) => {
    const kgv_ = kgv(p[1], q[1])
    const p_ = p[0]*(kgv_/p[1])
    const q_ = q[0]*(kgv_/q[1])
    const som = [p_+q_, kgv_]
    return fraqvereenvoudigen(som)
}

const fraqmin = (p, q) => {
    const kgv_ = kgv(p[1], q[1])
    const p_ = p[0]*(kgv_/p[1])
    const q_ = q[0]*(kgv_/q[1])
    const som = [p_-q_, kgv_]
    return fraqvereenvoudigen(som)
}

const dec2fraq = p => {
    const aantalDecimalen = p => {
        if (Math.floor(p) !== p) return p.toString().split(".")[1].length || 0
        return 0
    }
    const ad = aantalDecimalen(p)
    const n = Math.pow(10, ad)
    return fraqvereenvoudigen([Math.round(p*n), n])
}

const fraq2string = p => {
    const fraction = p[0] / p[1]
    if (fraction < 0) {
        if (Number.isInteger(fraction)) return fraction.toString()
        else return "(-" + Math.abs(p[0]) + "/" + Math.abs(p[1]) + ")"
    } else {
        if (Number.isInteger(fraction)) return fraction.toString()
        else return "(" + Math.abs(p[0]) + "/" + Math.abs(p[1]) + ")"
    }
}
// ------------------------------------------------------------------------
const fac = k => {
    if (k < 0 || !Number.isInteger(k)) {
        throw `Ongeldige input: [${k}]`
    }
    if (k > 1) return k * fac(k - 1)
    return 1
}

const nchoosek = (n, k) => {
    const nchoosek_1 = (n, k) => {
        let result = 1
        for (let i = 0; i < k; i++) {
            result *= n - i
        }
        return result / fac(k)
    }

    const nchoosek_2 = (n, k) => {
        let result = [1, 1]
        for (let i = 0; i < k; i++) {
            result = fraqkeer(result, fraqmin(n, [i, 1]))
        }
        // return fraqvereenvoudigen(fraqdelen(result, [fac(k), 1]))
        return fraqvereenvoudigen(fraqdelen(result, [fac(k), 1]))
    }

    if (Number.isInteger(n) && Number.isInteger(k) && k >= 0) {
        return nchoosek_1(n, k)
    } else if (n.constructor.name === 'Array' && n.length === 2 &&  Number.isInteger(n[0]) && Number.isInteger(n[1]) && Number.isInteger(k) && k >= 0) {
        return nchoosek_2(n, k)
    } else {
        throw `Ongeldige input n:[${n}], k:[${k}]`
    }
}

const binomexp = (a, b, n, e) => {
    if (Number.isInteger(n) && !e) {
        for (let k = 0; k <= n; k++) {
            console.log(`${k.toString().padStart(3)} - ${nchoosek(n, k).toString().padStart(18)}`)
        }
    } else if (n.constructor.name === 'Array' && n.length === 2 &&  Number.isInteger(n[0]) && Number.isInteger(n[1]) && Number.isInteger(e) && e > 0) {
        for (let k = 0; k <= e; k++) {
            const result = nchoosek(n, k)
            console.log(`${k.toString().padStart(3)} - ${fraq2string(result)}`)
        }
    } else {
        throw `Onbekende combi (n, e): (${JSON.stringify(n)}, ${JSON.stringify(e)})`
    }
}
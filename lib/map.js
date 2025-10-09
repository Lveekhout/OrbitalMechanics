Object.defineProperty(Map.prototype, 'add',  {
    value: function(v) {
        this.has(v) ? this.set(v, this.get(v) + 1) : this.set(v, 1)
    },
    writable: false,
    configurable: false,
    enumerable: false // zodat hij niet in for..in loops verschijnt
})

Object.defineProperty(Map.prototype, 'hcf', {
    value: function (other) {
        if (other instanceof Map) {
            let prod = 1
            this.forEach((a, b) => {
                if (other.has(b)) prod *= Math.pow(b, Math.min(a, other.get(b)))
            })
            return prod
        } else throw 'hcf: argument should be Map'
    },
    writable: false,
    configurable: false,
    enumerable: false // zodat hij niet in for..in loops verschijnt
})

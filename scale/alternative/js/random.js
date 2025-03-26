var seed = 1
function random(max) {
    var x = Math.sin(seed++) * 10000
    return Math.floor(max*(x - Math.floor(x)))
}
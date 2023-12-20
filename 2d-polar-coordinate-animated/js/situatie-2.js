// https://www.derivative-calculator.net/
// Input: x -> 10cos((2pi)/50t)
// Input: y -> 10sin((2pi)/50t)
// Of gewoon met de hand. Is easy.

const ir = 10
const iv = 10

function r(t) {
    return ir
}

function theta(t) {
    return 2 * Math.PI / iv * t
}

function r_hat(t) {
    return [Math.cos(theta(t)), Math.sin(theta(t))]
}

function v(t) {
    const x = -ir * 2 * Math.PI / iv * Math.sin(2 * Math.PI / iv * t)
    const y = ir * 2 * Math.PI / iv * Math.cos(2 * Math.PI / iv * t)
    return [x, y]
}

function a(t) {
    const x = ir * Math.pow(2 * Math.PI / iv, 2) * -Math.cos(theta(t))
    const y = ir * Math.pow(2 * Math.PI / iv, 2) * -Math.sin(theta(t))
    return [x, y]
}

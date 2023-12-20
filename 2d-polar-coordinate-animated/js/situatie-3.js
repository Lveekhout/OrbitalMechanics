// https://www.youtube.com/watch?v=3oGATSP1KJ0&t=466s
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
// Afgeleiden
function r_dot(t) {
    return 0
}
function theta_hat(t) {
    return [-Math.sin(theta(t)), Math.cos(theta(t))]
}
function theta_dot(t) {
    return 2 * Math.PI / iv
}
function r_dot2(t) {
    return 0
}
function theta_dot2(t) {
    return 0
}
/////////////
function v(t) {
    const x = r_dot(t) * r_hat(t)[0] + r(t) * theta_hat(t)[0] * theta_dot(t)
    const y = r_dot(t) * r_hat(t)[1] + r(t) * theta_hat(t)[1] * theta_dot(t)
    return [x, y]
}

function a(t) {
    const x = r_hat(t)[0] * (r_dot2(t) - r(t) * Math.pow(theta_dot(t), 2)) + theta_hat(t)[0] * (2 * r_dot(t) * theta_dot(t) + r(t) * theta_dot2(t))
    const y = r_hat(t)[1] * (r_dot2(t) - r(t) * Math.pow(theta_dot(t), 2)) + theta_hat(t)[1] * (2 * r_dot(t) * theta_dot(t) + r(t) * theta_dot2(t))
    return [x, y]
}

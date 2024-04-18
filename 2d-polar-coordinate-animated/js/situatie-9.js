// Raakvlakken met situatie-8.js
const ia = -1
const ir = 5
function r(t) {
    return ir * -ia
}

function theta(t) {
    return 1 / Math.sqrt(r(t)) * t
}

function r_hat(t) {
    return [Math.cos(theta(t)), Math.sin(theta(t))]
}
function theta_hat(t) {
    return [-Math.sin(theta(t)), Math.cos(theta(t))]
}
// Afgeleiden
function r_dot(t) {
    return 0
}
function theta_dot(t) {
    return 1 / Math.sqrt(r(t))
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

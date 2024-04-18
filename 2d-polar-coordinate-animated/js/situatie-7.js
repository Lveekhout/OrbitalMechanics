const b = 2
const c = 1 / 3
const d = Math.PI / 2
function r(t) {
    return 10 + Math.sin(b * t)
}

function theta(t) {
    return Math.sin(c * t) * d
}

function r_hat(t) {
    return [Math.cos(theta(t)), Math.sin(theta(t))]
}
function theta_hat(t) {
    return [-Math.sin(theta(t)), Math.cos(theta(t))]
}
// Afgeleiden
function r_dot(t) {
    return Math.cos(b * t) * b
}
function theta_dot(t) {
    return Math.cos(c * t) * d * c
}
function r_dot2(t) {
    return -Math.sin(b * t) * b * b
}
function theta_dot2(t) {
    return -Math.sin(c * t) * d * c * c
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

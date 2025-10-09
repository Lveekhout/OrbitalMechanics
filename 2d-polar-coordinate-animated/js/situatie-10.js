const q = 1

function r(t) {
    return 10
}

function theta(t) {
    return 1 / q * Math.sin(t/q) + t/4/q
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
    return (Math.cos(t/q)+1)/2/q
}
function r_dot2(t) {
    return 0
}
function theta_dot2(t) {
    return -Math.sin(t/q)/4/q/q
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

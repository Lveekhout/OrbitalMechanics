// Dit is situatie-7 van 2d-polar-coordinate-animated
const b = 2
const c2 = 1 / 3
const d2 = Math.PI / 2
function r(t) {
    return 10 + Math.sin(b * t)
}

function theta(t) {
    return Math.sin(c2 * t) * d2
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
    return Math.cos(c2 * t) * d2 * c2
}
function r_dot2(t) {
    return -Math.sin(b * t) * b * b
}
function theta_dot2(t) {
    return -Math.sin(c2 * t) * d2 * c2 * c2
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

const f = x => v(x)[1]//Math.sqrt(Math.pow(v(x)[0], 2) + Math.pow(v(x)[1], 2))
const g = x => undefined
//----------------------------------------------------------------

const drawGraph = (ctx, functionOfX, view, color) => {
    ctx.save()
    ctx.lineWidth = 3 / camera.scale

    {
        let toggle = false
        ctx.beginPath()
        for (let x = view.x1; x <= view.x2; x += 3 / camera.scale) {
            const y = functionOfX(x)
            if (Number.isFinite(y)) {
                if (!toggle) {
                    ctx.moveTo(x, -y)
                    toggle = true
                }
                else ctx.lineTo(x, -y)
            } else toggle = false
        }
        ctx.strokeStyle = color
        ctx.stroke()
    } // Grafiek

    ctx.restore()
}

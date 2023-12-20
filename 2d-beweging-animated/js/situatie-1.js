// https://www.derivative-calculator.net/
// Input: x -> 10cos((2pi)/50t)+3sin(t)cos((2pi)/50t)
// Input: y -> 10sin((2pi)/50t)+3sin(t)sin((2pi)/50t)

function r(t) {
    return 10 + 3 * Math.sin(t * 1)
}

function theta(t) {
    return 2 * Math.PI / 50 * t
}

function r_hat(t) {
    return [Math.cos(theta(t)), Math.sin(theta(t))]
}

function v(t) {
    const x = -((3 * Math.PI * Math.sin(t) + 10 * Math.PI) * Math.sin((Math.PI * t) / 25) - 75 * Math.cos(t) * Math.cos((Math.PI * t) / 25)) / 25
    const y = (75 * Math.cos(t) * Math.sin((Math.PI * t) / 25) + (3 * Math.PI * Math.sin(t) + 10 * Math.PI) * Math.cos((Math.PI * t) / 25)) / 25
    return [x, y]
}

function a(t) {
    const x = -(150 * Math.PI * Math.cos(t) * Math.sin((Math.PI * t) / 25) + ((3 * Math.pow(Math.PI, 2) + 1875) * Math.sin(t) + 10 * Math.pow(Math.PI, 2)) * Math.cos((Math.PI * t) / 25)) / 625
    const y = -(((3 * Math.pow(Math.PI, 2) + 1875) * Math.sin(t) + 10 * Math.pow(Math.PI, 2)) * Math.sin((Math.PI * t) / 25) - 150 * Math.PI * Math.cos(t) * Math.cos((Math.PI * t) / 25)) / 625
    return [x, y]
}

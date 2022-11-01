const pos = [0, 0]
const vel = [0, 0]
let gIdx
let joystick = 1

window.onload = e => {
    window.addEventListener("gamepadconnected", controller => {
        window.requestAnimationFrame(draw)
        gIdx = navigator.getGamepads().findIndex(c => c === controller.gamepad)
    })

    window.addEventListener("gamepaddisconnected", controller => {
        window.requestAnimationFrame(clear)
        gIdx = undefined
    })

    document.getElementsByName('joystick').forEach(r => r.addEventListener('input', i => {
        joystick = Number(i.target.value)
    }))

    window.requestAnimationFrame(clear)
}

const draw = ms => {
    if (gIdx !== undefined) window.requestAnimationFrame(draw)

    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()

    ctx.textBaseline = 'top'
    ctx.fillText(ms, 0, 0)

    ctx.translate(canvas.width / 2, canvas.height / 2)

    const activeController = navigator.getGamepads()[gIdx]
    if (activeController) {
        switch (joystick) {
            case 1:
                vel[0] = 0; pos[0] = activeController.axes[2] * canvas.width / 2
                vel[0] = 0; pos[1] = activeController.axes[3] * canvas.height / 2
                break;
            case 2:
                vel[0] = activeController.axes[2]; pos[0] += vel[0] * 15
                vel[1] = activeController.axes[3]; pos[1] += vel[1] * 15
                break;
            case 3:
                vel[0] += 2 * activeController.axes[2]; pos[0] += vel[0] / 10
                vel[1] += 2 * activeController.axes[3]; pos[1] += vel[1] / 10
        }

        if (pos[0] < -canvas.width / 2) { pos[0] = -canvas.width / 2; vel[0] = 0 }
        if (pos[0] > canvas.width / 2) { pos[0] = canvas.width / 2; vel[0] = 0 }
        if (pos[1] < -canvas.height / 2) { pos[1] = -canvas.height / 2; vel[1] = 0 }
        if (pos[1] > canvas.height / 2) { pos[1] = canvas.height / 2; vel[1] = 0 }

        ctx.beginPath()
        ctx.arc(pos[0], pos[1], 10, 0, Math.PI * 2)
        ctx.fillStyle = 'black'
        ctx.fill()
    }

    ctx.restore()
}

const clear = ms => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '48pt Verdana'
    ctx.fillText('Connect game controller!!!', 0, 0)
    ctx.restore()
}

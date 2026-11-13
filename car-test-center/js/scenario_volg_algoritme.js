let track
let car
// let volgauto

const initScenario = camera => {
    // const button = document.createElement('button')
    // button.textContent = 'Copy Training Data to Clipboard'
    // button.addEventListener('click', () => setClipboard(downloadTraining()))
    // document.body.appendChild(button)

    track = new Track(camera)

    car = new Car(camera, track)
    car.color = 'red'

    volgauto = new Car(camera, track)
    volgauto.s = -2
    volgauto.color = 'blue'

    // setInterval(() => {
    //     volgauto.a = decide(car.s - volgauto.s, car.v, volgauto.v)
    // }, 100)
}

const scenarioDraw = (ctx, camera, view, ds) => {
    {
        ctx.save()

        ctx.beginPath()
        for (let x = Math.trunc(view.x1); x <= Math.trunc(view.x2); x++) {
            ctx.moveTo(x, view.y1)
            ctx.lineTo(x, view.y2)
        }
        for (let y = Math.trunc(view.y1); y <= Math.trunc(view.y2); y++) {
            ctx.moveTo(view.x1, y)
            ctx.lineTo(view.x2, y)
        }
        ctx.lineWidth = 1 / camera.scale
        ctx.strokeStyle = '#ccc'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(view.x1, 0)
        ctx.lineTo(view.x2, 0)
        ctx.moveTo(0, view.y1)
        ctx.lineTo(0, view.y2)
        ctx.lineWidth = 1 / camera.scale
        ctx.strokeStyle = '#f88'
        ctx.stroke()

        ctx.restore()
    } // Raster

    track.draw(ctx)

    car.draw(ctx)
    volgauto.draw(ctx)

    const controller = navigator.getGamepads().find(g => g !== null)
    if (controller) car.a = 5 * (controller.buttons[7].value - 2 * controller.buttons[6].value)
    car.update(ds, 12)

    volgauto.a = decide(car.s - volgauto.s, car.v, volgauto.v)
    volgauto.update(ds, 15)

    canvasmonitor.push(`distance = ${(car.s - volgauto.s).toFixed(2)}`)
    canvasmonitor.push(`car.v = ${car.v.toFixed(2)}`)
    canvasmonitor.push(`car.a = ${car.a.toFixed(2)}`)
    canvasmonitor.push(`volgauto.v = ${volgauto.v.toFixed(2)}`)
    canvasmonitor.push(`volgauto.a = ${volgauto.a.toFixed(2)}`)
}
// https://hardwaretester.com/gamepad

const decide = (da, v1, v2) => {
    const t = 3
    const dg = 3//Math.max(3, v1)
    return Math.max(-10, Math.min(5, ((v1 - v2) * t + da - dg) / Math.pow(t, 2)))
}

let track
let car
let volgauto

const trainingdata = new Set()

const initScenario = camera => {
    const button = document.createElement('button')
    button.textContent = 'Copy Training Data to Clipboard'
    button.addEventListener('click', () => setClipboard(downloadTraining()))
    document.body.appendChild(button)

    track = new Track(camera)

    car = new Car(camera, track)
    car.color = 'red'

    volgauto = new Car(camera, track)
    volgauto.s = -2
    volgauto.color = 'blue'

    setInterval(() => {
        car.a = Math.random() * 8 - 4
    }, 2000)
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
    {
        trainingdata.forEach(e => {
            ctx.beginPath()
            const x = JSON.parse(`[${e}]`)[0]
            const y = JSON.parse(`[${e}]`)[1]
            ctx.arc(x, -y, 3 / camera.scale, 0, 2 * Math.PI)
            ctx.fillStyle = 'red'
            ctx.fill()
        })
    }
    if (trainingdata.size < 60000) {
        const controller = navigator.getGamepads().find(g => g !== null)
        if (controller) volgauto.a = 5 * (controller.buttons[7].value - 2 * controller.buttons[6].value)
        // trainingdata.push([car.s - volgauto.s, car.v, volgauto.v, volgauto.a])
        trainingdata.add(`${(car.s - volgauto.s).toFixed(2)},${(car.v - volgauto.v).toFixed(2)},${volgauto.a.toFixed(2)}`)

        track.draw(ctx)

        car.draw(ctx)
        volgauto.draw(ctx)

        car.update(ds, 12)
        volgauto.update(ds, 15)

        canvasmonitor.push(`distance = ${(car.s - volgauto.s).toFixed(2)}`)
        canvasmonitor.push(`car.v = ${car.v.toFixed(2)}`)
        canvasmonitor.push(`car.a = ${car.a.toFixed(2)}`)
        canvasmonitor.push(`trainingdata = ${trainingdata.size}`)

        const desireddistance = 6 * (Math.tanh(car.v / 3 - 2) - Math.tanh(-2))
        // {
        //     ctx.beginPath()
        //     ctx.moveTo(19, -8 + desireddistance)
        //     ctx.lineTo(21, -8 + desireddistance)
        //     ctx.strokeStyle = 'red'
        //     ctx.lineWidth = 1 / camera.scale
        //     ctx.stroke()
        //     ctx.beginPath()
        //     ctx.arc(20, -10, 3 / camera.scale, 0, 2 * Math.PI)
        //     ctx.fillStyle = 'red'
        //     ctx.fill()
        //     ctx.beginPath()
        //     ctx.arc(20, -10 + (car.s - volgauto.s), 3 / camera.scale, 0, 2 * Math.PI)
        //     ctx.fillStyle = 'blue'
        //     ctx.fill()
        // }
        // {
        //     ctx.beginPath()
        //     ctx.moveTo(-1, -8)
        //     ctx.lineTo(1, -8)
        //     ctx.strokeStyle = 'red'
        //     ctx.lineWidth = 1 / camera.scale
        //     ctx.stroke()
        //     ctx.beginPath()
        //     ctx.arc(0, -10 - desireddistance, 3 / camera.scale, 0, 2 * Math.PI)
        //     ctx.fillStyle = 'red'
        //     ctx.fill()
        //     ctx.beginPath()
        //     ctx.arc(0, -10 - desireddistance + (car.s - volgauto.s), 3 / camera.scale, 0, 2 * Math.PI)
        //     ctx.fillStyle = 'blue'
        //     ctx.fill()
        // }
    }
}
// https://hardwaretester.com/gamepad

const downloadTraining = () => {
    return JSON.stringify(Array.from(trainingdata).map(e => JSON.parse(`[${e}]`)))
}

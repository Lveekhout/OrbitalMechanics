const camera = {x: 512, y: 768 / 2, scale: 20}
const cameraFIFO = []

const updateCamera = ms => {
    if (cameraFIFO.length > 0) {
        if (ms < cameraFIFO[0].start + cameraFIFO[0].duration) {
            camera.x = cameraFIFO[0].pos.x((ms - cameraFIFO[0].start))
            camera.y = cameraFIFO[0].pos.y((ms - cameraFIFO[0].start))
        } else {
            const element = cameraFIFO.shift()
            if (cameraFIFO.length > 0) {
                updateCamera(ms)
            } else {
                camera.x = element.pos.x((element.duration))
                camera.y = element.pos.y((element.duration))
            }
        }
    }
}

const testQ = (x, y, d) => {
    if (!d) d = 3000
    const len = cameraFIFO.length
    const start = len > 0 ? cameraFIFO[len - 1].start + cameraFIFO[len - 1].duration : performance.now()
    const currentX = camera.x
    const currentY = camera.y
    cameraFIFO.push(
        {
            start: start,
            duration: d,
            pos: {
                // x: dms => Math.cos(dms / d * Math.PI * 2) * 256 + 256,
                // x: dms => -Math.pow(dms / 1000, 5) * (512 / Math.pow(d / 1000,5)) + 512,
                x: dms => -Math.pow(dms / 1000, 3) * (currentX - x) / Math.pow(d / 1000,3) + currentX,
                y: dms => -Math.pow(dms / 1000, 3) * (currentY - y) / Math.pow(d / 1000,3) + currentY
            }
        }
    )
}

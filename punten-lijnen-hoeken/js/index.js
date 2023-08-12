const camera = { x: 512, y: 384, scale: 50 }
const visor = { x: null, y: null, visible: false }

window.onload = () => {
    document.getElementById('canvas').getContext('2d').font = '.08pt Courier New'
    document.getElementById('canvas').getContext('2d').textBaseline = 'middle'
    document.getElementById('canvas').getContext('2d').textAlign = 'center'

    window.requestAnimationFrame(draw)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        visor.x = event.offsetX
        visor.y = event.offsetY

        const pIdx = points.findIndex(p => p.selected)
        if (pIdx == -1) {
            if (event.ctrlKey) {
                camera.x = event.offsetX
                camera.y = event.offsetY
            } else if (event.buttons === 1) {
                camera.x += event.movementX
                camera.y += event.movementY
            }
        } else {
            if (event.buttons === 1) {
                const p = points[pIdx]
                p.x = (visor.x - camera.x) / camera.scale
                p.y = -(visor.y - camera.y) / camera.scale
            }
        }
        doOutput()
    })
    document.getElementById('canvas').addEventListener('mousewheel', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        const scaleBefore = camera.scale

        camera.scale *= 1 - event.deltaY / 1000
        camera.scale = Math.min(Math.max(camera.scale, .1), 10000)

        camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
        camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale
        doOutput()
    })
}

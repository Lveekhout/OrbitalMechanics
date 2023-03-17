const camera = { x: 512, y: 384, scale: 300 }
const visor = { x: null, y: null, visible: false }

window.onload = () => {
    document.getElementById('canvas').getContext('2d').font = '.03pt Courier New'
    document.getElementById('canvas').getContext('2d').textBaseline = 'middle'
    document.getElementById('canvas').getContext('2d').textAlign = 'center'

    window.requestAnimationFrame(draw)

    document.getElementById('canvas').addEventListener('mousemove', event => {
        window.requestAnimationFrame(draw)
        event.preventDefault()

        visor.x = event.offsetX
        visor.y = event.offsetY

        if (event.ctrlKey) {
            camera.x = event.offsetX
            camera.y = event.offsetY
        } else if (event.buttons === 1) {
            camera.x += event.movementX
            camera.y += event.movementY
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

    document.getElementById('canvas').addEventListener('mouseenter', () => {
        window.requestAnimationFrame(draw)
        visor.visible = true
    })

    document.getElementById('canvas').addEventListener('mouseleave', () => {
        window.requestAnimationFrame(draw)
        visor.visible = false
    })

    document.getElementById('p0').addEventListener('input', event => {
        const angle = Math.PI * 2 * event.target.value / 100
        setPoint(0, {x: Math.cos(angle), y: Math.sin(angle)})
        doOutput()
    })

    document.getElementById('p1').addEventListener('input', event => {
        const angle = Math.PI * 2 * event.target.value / 100
        setPoint(1, {x: Math.cos(angle), y: Math.sin(angle)})
        doOutput()
    })

    document.getElementById('p2').addEventListener('input', event => {
        const angle = Math.PI * 2 * event.target.value / 100
        setPoint(2, {x: Math.cos(angle), y: Math.sin(angle)})
        doOutput()
    })

    document.getElementById('p3').addEventListener('input', event => {
        const angle = Math.PI * 2 * event.target.value / 100
        setPoint(3, {x: Math.cos(angle), y: Math.sin(angle)})
        doOutput()
    })
}

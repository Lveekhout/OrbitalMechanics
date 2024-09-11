let camera

window.onload = e => {
    camera = new Camera(document.querySelector('canvas'))
    const draw = new Draw(camera)

    window.requestAnimationFrame(draw.draw)
}

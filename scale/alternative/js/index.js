const pi = Math.PI
const sin = Math.sin
const cos = Math.cos
let camera
let draw

window.onload = e => {
    camera = new Camera(document.querySelector('canvas'))
    draw = new Draw(camera)

    window.requestAnimationFrame(draw.draw)
}

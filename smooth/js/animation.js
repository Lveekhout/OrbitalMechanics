// const visor = { x: null, y: null, visible: false }
const layers = [{
    draw: () => {
        ctx.save()

        ctx.beginPath()
        ctx.moveTo(-10, 0)
        ctx.lineTo(10, 0)
        ctx.moveTo(0, 10)
        ctx.lineTo(0, -10)
        ctx.lineWidth = 1 / camera.scale
        ctx.strokeStyle = 'gray'
        ctx.stroke()

        ctx.restore()
    }
}, {
    draw: dms => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(anim.pos.x(dms), anim.pos.y(dms), .1, 0, Math.PI * 2)
        ctx.fillStyle = 'green'
        ctx.fill()
        ctx.restore()
    }
}]

const anim = {
    start: undefined,
    duration: 3000,
    pos: {
        x: dms => 0,
        y: dms => 8 * Math.cos(dms / anim.duration * (Math.PI)) - 8
    }
}

const mainloop = ms => {
    if (anim.start) {
        window.requestAnimationFrame(mainloop)

        const dms = ms - anim.start

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        updateCamera(ms)
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.scale, camera.scale)

        layers.forEach(l => l.draw(dms))

        ctx.restore()

        // document.getElementById('p001').innerHTML = `start: ${anim.start}, delta: ${(dms).toFixed(3)}, y: ${y.toFixed(3)}`
    }
}

const initAnimation = ms => {
    anim.start = ms
    window.requestAnimationFrame(mainloop)
}

const startAnimating = () => {
    console.log('yes')
    window.requestAnimationFrame(initAnimation)
}

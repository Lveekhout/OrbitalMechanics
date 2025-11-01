function Animation2d() {

    let animating = false
    let currenttime

    this.t = 0

    const set = new Set()

    this.start = () => {
        if (!animating) {
            animating = true
            window.requestAnimationFrame(startAnimation)
        }
    }

    this.stop = () => {
        if (animating) animating = false
        else this.t = 0
    }

    const startAnimation = ms => {
        currenttime = ms
        animation(currenttime)
    }

    const animation = ms => {
        this.t += ms - currenttime
        if (animating) window.requestAnimationFrame(animation)

        // if (ms - currenttime < 200) return
        set.forEach(e => {
            e.draw(e.canvas, e.ctx, e.camera, this.t, ms - currenttime)
        })

        currenttime = ms
    }

    this.registerCanvas = (canvas, camera, draw) => {
        if (canvas.constructor.name === 'HTMLCanvasElement') {
            set.add({
                canvas: canvas, ctx: canvas.getContext('2d'),
                camera: camera, draw: draw
            })
            canvas.addEventListener('mousemove', event => {
                event.preventDefault()

                if (event.ctrlKey) {
                    camera.x = event.offsetX
                    camera.y = event.offsetY
                } else if (event.buttons === 1) {
                    camera.x += event.movementX
                    camera.y += event.movementY
                }
                if (!animating) draw(canvas, canvas.getContext('2d'), camera, this.t, 0)
            })
            canvas.addEventListener('mousewheel', event => {
                event.preventDefault()

                const scaleBefore = camera.scale

                camera.scale *= 1 - event.deltaY / 1000
                camera.scale = Math.min(Math.max(camera.scale, 10), 10000)

                camera.x = event.offsetX - ((event.offsetX - camera.x) / scaleBefore) * camera.scale
                camera.y = event.offsetY - ((event.offsetY - camera.y) / scaleBefore) * camera.scale

                if (!animating) draw(canvas, canvas.getContext('2d'), camera, this.t, 0)
            })
            canvas.addEventListener('mouseenter', () => {
                if (!animating) draw(canvas, canvas.getContext('2d'), camera, this.t, 0)
            })
            canvas.addEventListener('mouseleave', () => {
                if (!animating) draw(canvas, canvas.getContext('2d'), camera, this.t, 0)
            })
        } else throw `registerCanvas: unknown type: [${canvas.constructor.name}]`
    }
}

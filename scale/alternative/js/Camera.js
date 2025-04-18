function Camera(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.scale = 10

    this.preDraw = () => {
        this.ctx.save()
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.ctx.translate(this.x, this.y)
        this.ctx.scale(this.scale, -this.scale)
    }

    this.postDraw = ms => {
        this.ctx.restore()
    }

    canvas.addEventListener('mousemove', e => {
        e.preventDefault()

        if (e.ctrlKey) {
            this.x = e.offsetX
            this.y = e.offsetY
        } else if (e.buttons === 1) {
            this.x += e.movementX
            this.y += e.movementY
        }
    })

    canvas.addEventListener('mousewheel', e => {
        e.preventDefault()

        const scaleBefore = this.scale

        this.scale *= 1 - e.deltaY / 1000
        this.scale = Math.min(Math.max(this.scale, 1/10), 10000)

        this.x = e.offsetX - ((e.offsetX - this.x) / scaleBefore) * this.scale
        this.y = e.offsetY - ((e.offsetY - this.y) / scaleBefore) * this.scale
    })
}

function Track(camera) {

    this.radius = 100 / Math.PI / 2

    this.draw = (ctx) => {
        ctx.save()
        {
            ctx.lineWidth = 2
            ctx.strokeStyle = '#aaa'
            ctx.beginPath()
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI)
            ctx.stroke()
        } // Road

        {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 1 / camera.scale
            ctx.beginPath()
            ctx.moveTo(this.radius - 2, 0)
            ctx.lineTo(this.radius + 2, 0)
            ctx.stroke()
        } // Start line
        ctx.restore()
    }

    this.getCartesianCoordinates = s => {
        const alpha = s / this.radius
        return {x: Math.cos(alpha) * this.radius, y: Math.sin(alpha) * this.radius, angle: alpha + Math.PI / 2}
    }
}

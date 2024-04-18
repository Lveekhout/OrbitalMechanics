// https://docs.google.com/document/d/1x6fIm0pKHp9FtglQX1mAWlBdegk15Fyb7s3Ji5nOOuY/edit?usp=share_link
function MotionWithLinearDrag1d(s, v, m, b, w) {

    this.setS = value => s = value
    this.setV = value => v = value
    this.setM = value => m = value
    this.setB = value => b = value
    this.setW = value => w = value

    this.info = () => ({s: s, v: v, m: m, b: b, w: w})

    this.update = ds => { // https://www.desmos.com/calculator/gvy3l2yamb
        s = m / b * (v + w / b) * (Math.pow(Math.E, b * ds / m) - 1) - w / b * ds + s
        v = (v + w / b) * Math.pow(Math.E, b * ds / m) - w / b
    }

    this.peek = t => m / b * (v + w / b) * (Math.pow(Math.E, b * t / m) - 1) - w / b * t + s

    this.drawPosition = ctx => {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.arc(s, -2, Math.sqrt(2) * m / camera.scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}

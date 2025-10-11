function Animation() {

    let animating = false
    let starttime
    let currenttime

    this.set = new Set()

    this.start = () => {
        if (!animating) {
            animating = true
            window.requestAnimationFrame(startAnimation)
        } else throw 'Animation: already started animating'
    }

    this.stop = () => {
        if (animating) animating = false
        else throw 'Animation: already stopped animating'
    }

    const startAnimation = ms => {
        starttime = ms
        currenttime = ms
        animation(starttime)
    }

    const animation = ms => {
        if (animating) window.requestAnimationFrame(animation)

        // if (ms - currenttime < 200) return
        this.set.forEach(e => {
            e(ms - starttime, ms - currenttime)
        })

        currenttime = ms
    }
}

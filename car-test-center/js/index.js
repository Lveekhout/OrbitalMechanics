const anim = new Animation2d()
const controllerImage = new Image()
const canvasmonitor = []

window.onload = e => {
    const camera = {x: 500, y: 375, scale: 21}
    initScenario(camera)
    anim.registerCanvas(document.getElementsByTagName('canvas')[0], camera, draw)
    anim.start()

    controllerImage.src = 'images/360-controller-clipart-9.png'
}

const draw = (canvas, ctx, camera, ms, dms) => {
    const begin = performance.now()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvasmonitor.length = 0
    canvasmonitor.push(`t = ${(ms / 1000).toFixed(3)} s`)
    if (dms) canvasmonitor.push(`dms = ${dms.toFixed(3)} ms`)

    ctx.save()
    ctx.translate(camera.x, camera.y)
    ctx.scale(camera.scale, camera.scale)
    {
        const view = getView(canvas, camera)
        {
            scenarioDraw(ctx, camera, view, dms / 1000)
        } // drawTrack
    } // Layers
    ctx.restore()

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
    ctx.font = '12.0px Courier'
    ctx.textBaseline = 'top' // type CanvasTextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    // ctx.textAlign = 'start' // type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";

    canvasmonitor.push(`performance = ${(performance.now() - begin).toFixed(3)} ms`)
    {
        canvasmonitor.forEach((e, i) => {
            ctx.fillText(e, 10, 10 + i * 15)
        })
    }
    if (navigator.getGamepads().find(g => g !== null)) {
        ctx.drawImage(controllerImage, 1000 - 10 - 1024 / 20, 10, 1024 / 20, 731 / 20)
    }
}

const getView = (canvas, camera) => {
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

async function setClipboard(text) {
    const type = "text/plain";
    const clipboardItemData = {
        [type]: text,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
}

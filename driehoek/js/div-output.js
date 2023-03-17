const outputText = (elementId, str) => {
    document.getElementById(elementId).innerHTML = str
}

const doOutput = () => {
    const afbeelding = {x: (visor.x - camera.x) / camera.scale, y: (visor.y - camera.y) / camera.scale}
    const view = getView()
    outputText('p001', `afbeelding: (${afbeelding.x.toFixed(2)}, ${afbeelding.y.toFixed(2)})`)
    outputText('p002', `camera: (${camera.x.toFixed(2)}, ${camera.y.toFixed(2)}) - ${camera.scale.toFixed(2)}`)
    outputText('p003', `view: (${view.x1.toFixed(2)}, ${view.y1.toFixed(2)}) - (${view.x2.toFixed(2)}, ${view.y2.toFixed(2)})`)

    points.forEach((p, idx) => {
        const dist = Math.sqrt(Math.pow(p.x - afbeelding.x, 2) + Math.pow(p.y - -afbeelding.y, 2))
        if (dist * camera.scale < 10) p.selected = true
        else p.selected = false
        if (idx === 2) outputText('p004', `real: ${dist.toFixed(6)}, scaled: ${(dist * camera.scale).toFixed(6)}`)
    })
}

const getView = () => {
    const canvas = document.getElementById('canvas')
    return {
        x1: -camera.x / camera.scale,
        y1: -camera.y / camera.scale,
        x2: (canvas.width - camera.x) / camera.scale,
        y2: (canvas.height - camera.y) / camera.scale
    }
}

const selected = {x: undefined, y: undefined}

window.onload = e => {
    window.requestAnimationFrame(draw)
    document.getElementById('canvas').addEventListener('mousemove', e => {
        selected.x = Math.floor(e.offsetX * 10 / e.target.width)
        selected.y = Math.floor(e.offsetY * 10 / e.target.height)
        document.getElementById('output').innerHTML = `x: ${selected.x}, y: ${selected.y}, value: ${matrix[selected.y][selected.x]}`
    })
    document.getElementById('canvas').addEventListener('mouseenter', e => {
        document.getElementById('output').style = 'display: block'
    })
    document.getElementById('canvas').addEventListener('mouseleave', e => {
        document.getElementById('output').style = 'display: none'
        selected.x = undefined
        selected.y = undefined
    })
    document.addEventListener('keypress', e => {
        const keyCode = e.keyCode & 223
        if (keyCode >= 65 && keyCode <= 90  && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
            matrix[selected.y][selected.x] = String.fromCharCode(keyCode)
            window.requestAnimationFrame(doe)
        }
        if (e.keyCode >= 48 && e.keyCode <= 57 && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
            matrix[selected.y][selected.x] = parseInt(String.fromCharCode(e.keyCode), 10)
            window.requestAnimationFrame(doe)
        }
        if (e.keyCode === 32 && Number.isInteger(selected.x) && Number.isInteger(selected.y)) {
            matrix[selected.y][selected.x] = undefined
            window.requestAnimationFrame(doe)
        }
    })
}

const doe = () => {
//    document.getElementsByTagName('body')[0].style.backgroundColor = '#abc'
    draw()
    setTimeout(() => {
        oplossing()
        document.getElementsByTagName('body')[0].style.backgroundColor = ''
    })
}
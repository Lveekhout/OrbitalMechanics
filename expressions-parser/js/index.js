window.onload = e => {
    document.querySelector('input').dispatchEvent(new Event('input'))
}

let expr

const checkSyntax = e => {
    try {
        expr = new Parser(e.target.value).expr
        // expr = wrapDerivative(expr, {type: 'variable', display: ['x', '\u{1d465}', 'x']})
        // expr = takeDerivative(expr)
        document.querySelector('input').classList.remove('syntax_error')
        document.querySelector('textarea').textContent = JSON.stringify(expr, null, 2)
        document.querySelector('#latex-compiled').innerHTML = `\\[${toLatex(expr)}\\]`
        MathJax.typesetPromise()
    } catch (e) {
        document.querySelector('input').classList.add('syntax_error')
        document.querySelector('textarea').textContent = e.message

        document.querySelector('#latex-compiled').innerHTML = ''
    }
}

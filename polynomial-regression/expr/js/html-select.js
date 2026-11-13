const select1Click = e => {
    pointsnum = e.target.selectedIndex + 1
    if (e.target.selectedIndex < document.querySelector('#degree').selectedIndex) {
        document.querySelector('#degree').selectedIndex = e.target.selectedIndex
        polydegree = e.target.selectedIndex
    }
    coeff = solveMatrix(mapToMatrixNumeric())
    anim.drawAll()
}

const select2Click = e => {
    polydegree = e.target.selectedIndex
    if (e.target.selectedIndex > document.querySelector('#points').selectedIndex) {
        document.querySelector('#points').selectedIndex = e.target.selectedIndex
        pointsnum = e.target.selectedIndex + 1
    }
    coeff = solveMatrix(mapToMatrixNumeric())
    anim.drawAll()
}

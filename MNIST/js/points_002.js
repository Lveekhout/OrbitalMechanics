const points = Array.from({length: 20}, (_, a) => ({x: -3 + .3 * a, y: 0}))

points[0].y = 1
points[12].y = 1
points[6].x = points[12].x
points[6].y = points[12].y / 2

// for (let idx = 0; idx < points.length; idx += 2) points[idx].y = 1

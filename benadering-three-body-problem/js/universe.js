const universe = {
    G: 1, // 6.67408e-11,
    sun: {
        M: 11,
        s: [[0, 0, 3]],
        v: [-1, 0]
    },
    earth: {
        M: 11,
        s: [[0, -3 * Math.cos(Math.PI / 6), -3 * Math.sin(Math.PI / 6)]],
        v: [Math.cos(Math.PI / 3), -Math.sin(Math.PI / 3)]
    },
    moon: {
        M: 11,
        s: [[0, 3 * Math.cos(Math.PI / 6), -3 * Math.sin(Math.PI / 6)]],
        v: [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)]
    }
}
// const universe = {
//     G: 1, // 6.67408e-11,
//     sun: {
//         M: 5,
//         s: [[0, 0, 0]],
//         v: [0, 0]
//     },
//     earth: {
//         M: 3,
//         s: [[0, -9, 0]],
//         v: [0, -0.5]
//     },
//     moon: {
//         M: 1,
//         s: [[0, 3, 0]],
//         v: [0, 1.1]
//     }
// }
// const universe = {
//     G: 1, // 6.67408e-11,
//     sun: {
//         M: 1, // 1.98847e+30
//         s: [[0, 0, 0]],
//         v: [0, 0]
//     },
//     earth: {
//         M: 5, // 5.972e+24
//         s: [[0, -1 / 5, 0]],
//         v: [0, -1 / Math.pow(287 / 2, 1 / 5)]
//     },
//     moon: {
//         M: 1, // 7.34767309e+22
//         s: [[0, 1, 0]],
//         v: [0, 5 / Math.pow(287 / 2, 1 / 5)]
//     }
// }

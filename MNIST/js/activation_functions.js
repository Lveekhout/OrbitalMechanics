const relu = x => x < 0 ? 0 : x
const reludiv = x => x < 0 ? 0 : 1

const softplus = x => Math.log(1 + Math.pow(Math.E, x))
const softplusdiv = x => 1 / (1 + Math.pow(Math.E, -x))// Math.pow(Math.E, x) / (1 + Math.pow(Math.E, x))

const sigmoid = x => 1 / (1 + Math.pow(Math.E, -x))
const sigmoiddiv = x => Math.pow(Math.E, -x) / Math.pow(1 + Math.pow(Math.E, -x), 2)

const swish = x => x * sigmoid(x)
const swishdiv = x => x * sigmoid(x) * (1 - sigmoid(x)) + sigmoid(x)

const tanh = Math.tanh
const tanhdiv = x => 4 / Math.pow(Math.pow(Math.E, x) + Math.pow(Math.E, -x), 2)

const path = require("path")

module.exports = {
    mode: "development",
    entry: {
        'checkUserStatus': './views/checkUserStatus.js',
        'userTroll': './views/userTroll.js',
        'userHaroba': './views/userHaroba.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    }
}
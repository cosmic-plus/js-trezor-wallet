module.exports = {
  entry: "./es5/index.js",
  output: {
    path: __dirname + "/web/",
    filename: "trezor-wallet.js",
    library: "trezorWallet",
    libraryTarget: "umd"
  },
  devtool: "source-map"
}

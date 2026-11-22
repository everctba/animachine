var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: __dirname,
  // sem `eval`: o export injeta JSON literal e aspas em nomes de track nao quebram o arquivo
  devtool: false,
  entry: path.join(__dirname, 'src/rocks/create-bundle-file/bundle.template.js'),
  output: {
    path: path.join( __dirname, '/src/rocks/create-bundle-file/bundled/'),
    filename: 'bundle.js',
    library: 'PLACEHOLDER_LIBRARY_NAME',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'animachine-connect': path.join(__dirname, 'src/animachine-connect'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false
    //   }
    // })
  ]
}

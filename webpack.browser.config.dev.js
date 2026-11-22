var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    publicPath: '/',
    path: path.join( __dirname, '/browser'),
    filename: 'animachine.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'animachine-connect': path.join(__dirname, 'src/animachine-connect'),
      'react': path.join(__dirname, './node_modules/react'),
      'react-dom': path.join(__dirname, './node_modules/react-dom'),
      'spaceman': path.join(__dirname, '../spaceman/src'),
      'quick-interface': path.join(__dirname, '../quick-interface/src'),
    }
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, '../spaceman/src'),
          path.join(__dirname, '../quick-interface/src')
        ],
        // o bundle bruto do export (raw!./bundled/bundle.js) NAO pode passar pelo babel:
        // ele adiciona 'use strict' e transforma o `this` do UMD em undefined
        exclude: [
          path.join(__dirname, 'src/rocks/create-bundle-file/bundled')
        ],
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SKIP_AUTO_INIT_ANIMACHINE: false,
      __BUILD_STAMP__: JSON.stringify(new Date().toISOString()),
    })
  ],
}

var path = require('path');
var webpack = require('webpack');

var package = require('./package.json');

var config = {
  context: path.join(__dirname, 'app'),
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: path.join(__dirname, 'app', 'assets'),
    filename: 'bundle.js?v=' + package.version
  },
  plugins: [
    function () {
      this.plugin('watch-run', function (watching, callback) {
        console.log('\n\n---- ' + new Date().toISOString().replace('T', ' ').replace(/\.[0-9]+Z/, '') + ' ----');
        callback();
      })
    }
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'ng-annotate',
      },
      {
        test: /\.html?$/, loader: 'raw'
      },
      {
        test: /\.css$/, loader: 'style!css'
      },
      {
        test: /\.scss$/, loader: 'style!css!sass'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'
      }
    ]
  }
};

var ENV = process.env.NODE_ENV;
if (ENV === 'prod' || ENV === 'dev') {
  config.output = {
    path: path.join(__dirname, 'app'),
    publicPath: 'assets/',
    filename: 'bundle.min.js?v=' + package.version
  };
  config.plugins = [
    new ngAnnotatePlugin({
      add: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: false
    })
  ];
}

module.exports = config;

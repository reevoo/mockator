const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const Clean = require('clean-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app/js');
const APP_PATH_ENTRY = APP_PATH + '/app.js';
const STYLES_PATH = path.resolve(ROOT_PATH, 'app/styles');
const IMAGES_PATH = path.resolve(ROOT_PATH, 'app/img');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

const REEVOO_ENV = process.env.REEVOO_ENV || 'development';
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

// const cssExtract = new ExtractTextPlugin('mockator.css');

const getPublicPath = env => 'http://localhost:8080/';

const common = {
  entry: APP_PATH_ENTRY,
  output: {
    path: BUILD_PATH,
    publicPath: getPublicPath(REEVOO_ENV),
    filename: 'mockator.js',
  },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.jsx?$/,
    //     loaders: ['jscs'],
    //     include: APP_PATH,
    //   },
    // ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: APP_PATH,
      },
      {
        test: /\.scss$/,
        // loader: cssExtract.extract('style-loader', 'css-loader!postcss-loader!sass-loader'),
        loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        include: STYLES_PATH,
      },
      {
        test: /\.(woff|ttf|eot|svg)$/,
        loader: 'file-loader',
        include: STYLES_PATH,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?limit=10000',
        include: IMAGES_PATH,
      },
    ],
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules'],
  },
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: false,
      inline: true,
      progress: true,
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   CONFIG: JSON.stringify(require(path.join(__dirname, './config/development.js'))),
      // }),
      // cssExtract,
    ],
  });
}

if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
      new Clean(['dist']),
      // cssExtract,
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     // This affects react lib size
      //     NODE_ENV: JSON.stringify('production'),
      //   },
      //   // CONFIG: JSON.stringify(require(path.join(__dirname, './config/', REEVOO_ENV))),
      // }),
    //  new webpack.optimize.UglifyJsPlugin({
    //    compress: {
    //      warnings: false,
    //    },
    //  }),
   ],
  });
}

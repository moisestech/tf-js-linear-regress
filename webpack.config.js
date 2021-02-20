const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devServer: {
    contentBase:'./dist',
    port: 3030,
    hot: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test:/\.js$/,
        exclude:/node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-pipeline-operator', {proposal:'minimal'}],
              "@babel/plugin-syntax-dynamic-import"
            ]
          }
        }
      },
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test:/\.mp4/,
        loader: 'file-loader',
        options: {
          name:'[name].[ext]',
          outputPath:'video/'
        }
      },
      {
        test:/\.(jpg|jpeg|png|gif)$/,
        loader:'file-loader',
        options: {
          name:'[name].[ext]',
          outPath:'image/'
        }
      },
      {
        test:/\.ico$/,
        loader:'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "./public/index.html",
      favicon: './public/favicon.ico'
    }),
    new CopyPlugin({
      patterns: [{ from: "./public/_redirects" }],
    })
  ]
}
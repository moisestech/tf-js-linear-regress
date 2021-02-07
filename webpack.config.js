const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename:'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode:'development',
  modules: {
    rules: [
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test:/\/mp4$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'video/'
        }
      },
      {
        test:/\.(jpg|jpeg|png|gif)$/,
        loader:'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'image/'
        }
      },
      {
        test:/\.ico$/,
        loader:'file-loader'
      }
    ]
  }
}
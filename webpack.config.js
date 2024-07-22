const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      xano: path.resolve(__dirname, 'public/libs/xano.min.js'),
    },
  },
  externals: {
    xano: 'XanoClient',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    watchFiles: ['public/**/*'],
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: {
      index: '/index.html',
    },
  },
};

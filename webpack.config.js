const path = require('path');

module.exports = {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
					options: {
						presets: ['es2015', 'react']
					}
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: {index: '/index.html'},
    contentBase: './',
  },
};

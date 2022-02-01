const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Web3Modal',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'ts-loader'},
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65535,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: [require.resolve('./src/providers/providers/index.ts'), require.resolve('./src/providers/injected/index.ts')],
        use: [
          {
            loader: 'val-loader',
            options: {
              executableFile: path.resolve(__dirname, 'src/generateColorFromProvider.js')
            }
          }
        ]
      }
    ]
  }
}

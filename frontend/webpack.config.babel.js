import path from 'path';
import webpack from 'webpack';

const config = {
  context: __dirname,
  entry: {
    sessions: './src/sessions.js',
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    filename: '[name].js',
    publicPath: '/static/',
  },
  resolve: {
    root: [
      path.join(__dirname, 'src/'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      { test: /\.(png|jpg)$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.jsx?$/, loader: 'babel!webpack-module-hot-accept', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      ISDEV: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ],
  externals: {
    jquery: 'jQuery',
  },
  devServer: {
    port: 8080,
    devtool: true,
    colors: true,
    progress: true,
    host: '0.0.0.0',
    proxy: {
      '*': 'http://127.0.0.1:3000',
    },
  },
};

export default config;

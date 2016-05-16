import path from 'path';
import webpack from 'webpack';

const ISDEV = process.env.NODE_ENV !== 'production';

const config = {
  context: __dirname,
  entry: {
    sessions: './src/sessions.js',
    user: './src/user.js',
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    filename: '[name].js',
    publicPath: '/static/',
  },
  resolve: {
    root: [
      path.resolve('./src'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      { test: /\.(png|jpg)$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.jsx?$/, loader: ISDEV ? 'react-hot!babel' : 'babel', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ISDEV: JSON.stringify(ISDEV),
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
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

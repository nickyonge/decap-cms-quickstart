// extreme minimal webpack.config.js file
// for more details, see: https://webpack.js.org/configuration/
// for webpack.config.cjs template, see: https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39
// for full webpack template, see: https://github.com/nickyonge/webpack-template

const path = require('path');

module.exports = {
  
  mode: 'development', // default is 'production'
  
  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  
  module: {
    rules: [
      // example CSS module, requiring the css-loader package 
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },

  plugins: [
    // example HTML plugin, requiring the html-webpack-plugin package 
    // new HtmlWebpackPlugin({ title: 'My Webpack Site` }),
  ],
};

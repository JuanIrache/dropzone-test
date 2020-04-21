const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () {
                // post css plugins, can be exported to postcss.config.js
                return [precss, autoprefixer];
              }
            }
          },
          'sass-loader' // compiles Sass to CSS
        ]
      }
    ]
  }
};

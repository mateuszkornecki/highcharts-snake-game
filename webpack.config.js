const { resolve } = require('path');

module.exports = {
  entry: './dist/main.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },
};

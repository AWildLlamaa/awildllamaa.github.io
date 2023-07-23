const path = require('path');

module.exports = {
  entry: './guesscard.js',  // Replace 'guesscard.js' with your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
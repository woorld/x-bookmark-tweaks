const configCommon = require('./webpack.common');

module.exports = {
  ...configCommon,
  mode: 'development',
  devtool: 'inline-source-map',
};

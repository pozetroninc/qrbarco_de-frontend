var sass = require('node-sass');
var sassUtils = require('node-sass-utils')(sass);
var configs = require(__dirname + '/src/configs.json');


module.exports = {
  css: {
    loaderOptions: {
      sass: {
        functions: {
          'getJsSassVars($key: \'\')': function (key) {
            key = key.getValue().split('.');
            var result = configs.SASS_VARS;
            for (var i = 0; i < key.length; i++) {
              result = result[key[i]];
            }
            return sassUtils.castToSass(result);
          }
        }
      }
    }
  }
};

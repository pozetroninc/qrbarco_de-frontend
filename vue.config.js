var sass = require('node-sass');
var sassUtils = require('node-sass-utils')(sass);
var config = require(__dirname + '/app.config.json');


module.exports = {
  css: {
    loaderOptions: {
      sass: {
        functions: {
          'getJsSassVars($key: \'\')': function (key) {
            key = key.getValue().split('.');
            var result = config.SASS_VARS;
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

var sass = require('node-sass');
var sassUtils = require('node-sass-utils')(sass);
var appSassConfig = require(__dirname + '/app.sass.config.json');


module.exports = {
  css: {
    loaderOptions: {
      sass: {
        functions: {
          'getJsSassVars($key: \'\')': function (key) {
            key = key.getValue().split('.');
            var result = appSassConfig;
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

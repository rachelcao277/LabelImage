const autoprefixer = require('autoprefixer');
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist:[
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
      ]
    }),
    IS_PROD ? require('cssnano') : null
  ].filter(Boolean),//移除里面的所有null字段
};

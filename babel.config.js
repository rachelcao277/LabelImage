const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry"
      }
    ]
  ],
  plugins: [
    // ['import', {
    //   libraryName: 'vant',
    //   libraryDirectory: 'es',
    //   // 指定样式路径
    //   style: (name) => `${name}/style/less`
    // }, 'vant'],
    // ['import', {
    //   libraryName: '@lhb/ui',
    //   style: (name) => `${name}/less/index.less`
    // }, '@lhb/ui'],
    IS_PROD ? "transform-remove-console" : null
  ].filter(Boolean)
};

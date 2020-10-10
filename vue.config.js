// vue.config.js
const path = require("path");
const webpack = require("webpack");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); //打包进度展示
const postcssOptions = require("./config/postcss.config");
const devServer = require("./config/dev-server.config");
// 组装pagelist信息 start
const { pathJoin } = require('./libs/helpers/path');
const glob = require('glob');
const projectPathRoot = process.cwd();
const viewPath = pathJoin(projectPathRoot, 'src/views');
const entryPath = pathJoin(viewPath, '**/entry.vue');
const files = glob.sync(entryPath);
const pageList = files.map(file => {
  const relativePath = file.slice(viewPath.length).slice(1, -10);
  return {
    relativePath,
  };
});
// 组装pagelist信息 end
module.exports = {
  
  // 公共路径
  // publicPath: IS_PROD ? '/site/vue-demo/': '/',
  // publicPath: './',
  // 相对于打包路径index.html的路径
  // indexPath: 'public/index.html',
  // 'dist', 生产环境构建文件的目录
  outputDir: process.env.outputDir || "dist",
  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  assetsDir: "static",
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: !IS_PROD,
  // 是否使用包含运行时编译器的 Vue 构建版本
  // runtimeCompiler: true,
  // 生产环境的 source map
  productionSourceMap: !IS_PROD,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require("os").cpus().length > 1,

  // 向 PWA 插件传递选项。
  // pwa: {},
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    // config.plugin("html").tap(args =>{
    //     // 修复 Lazy loading routes Error
    //     args[0].chunksSortMode = "none";
    //     return args;
    // });
    config.resolve.alias // 添加别名
      .set("@", resolve("src"))
      .set("src", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"))
      .set("@statics", resolve("src/store"))
      // .set('dolabel_operator', resolve('src/assets/dolabel/js/operator')
      // .set('dolabel_colorPicker', resolve('src/assets/dolabel/js/colorPicker')
      // .set('dolabel_webAnnotate', resolve('src/assets/dolabel/js/webAnnotate')
      // .set('dolabel_preloader', resolve('src/assets/dolabel/js/preloader')
      .end()
      .end()
      .stats({ timings: true }) // stats
      .externals({
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        axios: 'axios',
        "ant-design-vue": 'ant-design-vue',
      })
      .plugin("progress-bar-webpack-plugin") // progress-bar-webpack-plugin;
      .use(ProgressBarPlugin)
      .end()
      .plugins.delete("preload") // delete preload
      .delete("prefetch"); // delete prefetch
    // 引入类似vant这种三方插件
    // config.module.rule({
    //   transpileOnly: true,
    //   getCustomTransformers: () => ({
    //     before: [
    //       tsImportPluginFactory({
    //         libraryName: "vant",
    //         libraryDirectory: "es",
    //         style: (name) => `${name}/style/less`,
    //       }),
    //       tsImportPluginFactory({
    //         libraryName: "@lhb/ui",
    //         style: (name) => `${name}/less/index.less`,
    //       }),
    //     ],
    //   }),
    //   compilerOptions: {
    //     module: "es2015",
    //   },
    // });
    // vant内部的引用不够规范，会导致min-css 警告
    // config.when(IS_PROD, config => {
    //   config.plugin('extract-css').tap(options => {
    //     options[0].ignoreOrder = true;
    //     return options
    //   })
    // })
  },
  css: {
    requireModuleExtension: false,
    loaderOptions: {
      postcss: postcssOptions,
      // less: {
      //   modifyVars: {
      //     // less 文件覆盖（文件路径为绝对路径）
      //     'hack': `true; @import "${resolve('src/common/styles/var.less')}";`
      //   },
      //   javascriptEnabled: true
      // }
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "./src/common/styles/mixin.less")
      ]
    }
  },
  configureWebpack: config => {
      // loaders: [
      //   {
      //     test: /\.(png|jpg|gif)$/,
      //     loader: 'url-loader?limit=800&name=images/[name].[ext]'
      //   }
      // ],
    config.plugins = config.plugins.concat(
      [
        new webpack.DefinePlugin({
          "process.env": {
            npm_config_env: JSON.stringify(process.env.npm_config_env),
            NODE_ENV:JSON.stringify(IS_PROD ? 'production' : 'development'),
            PAGE_LIST: JSON.stringify(pageList),
          }
        }),
        IS_PROD ? new webpack.optimize.RuntimeChunkPlugin({
              name: "manifest"
            })
          : undefined
      ].filter(Boolean)
    );
  },
  devServer: devServer
};

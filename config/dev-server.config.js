module.exports = {
  disableHostCheck: true,//关闭ip检测
  overlay: { // 让浏览器 overlay 同时显示警告和错误
    warnings: true,
    errors: true
  },
  host: "0.0.0.0",
  // 端口号
  port: 8080,
  // https:{type:Boolean}
  https: false,
  //配置自动启动浏览器
  open: false,
  // 热更新
  hotOnly: true,
  // proxy: 'http://localhost:8080' // 配置跨域处理,只有一个代理
  proxy: { //配置多个跨域 
    '/api': {
      target: 'http://localhost:8181/',
      changOrigin: true,  //允许跨域
      secure: false,  // 如果是https接口，需要配置这个参数
      ws: true   //如果要代理 websockets，配置这个参数
      // pathRewrite:{
      //   '^/api':''
      // }
    },
    '/static/dataset/': {
      target: 'http://localhost:8181/',
      changOrigin: true,  //允许跨域
      secure: false,  // 如果是https接口，需要配置这个参数
      ws: true   //如果要代理 websockets，配置这个参数
      // pathRewrite:{
      //   '^/api':''
      // }
    },
    '/static': {
      target: 'http://localhost:8181/',
      changOrigin: true,  //允许跨域
      secure: false,  // 如果是https接口，需要配置这个参数
      ws: true   //如果要代理 websockets，配置这个参数
      // pathRewrite:{
      //   '^/api':''
      // }
    },
    // "/api": {
    //   target: "http://localhost:8080/mock/36",
    //   changeOrigin: true,//如果接口跨域，需要进行这个参数配置
    //   // ws: true,//websocket支持
    //   // pathRewrite: {　　　　　　　　　　　　　　　　　　　　　　　
    //   //   // 这里重写路径，如果monitor本身不存在接口路径中，一定要写成空！！！
    //   //   '^/api': ''
    //   // },
    // },
    // "/api2": {
    //   target: "https://172.12.12.12:2018",
    //   changeOrigin: true,//如果接口跨域，需要进行这个参数配置
    //   //ws: true,//websocket支持
    //   secure: false,//是否验证SSL Certs.  如果是https接口，需要配置这个参数
    //   pathRewrite: {
    //     "^/api2": "/"
    //   }
    // },
    '/dev': {
      target: 'http://localhost:8080/api',
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      ws: false, // websocket支持
      pathRewrite: {
        '^/dev': '/',
      },
    },
    '/mock': {
      target: "http://localhost:8080/mock/103/api",
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      ws: false, // websocket支持
      pathRewrite: {
        '^/mock': '/',
      },
    },
  }
}
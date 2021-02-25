module.exports = {
    transpileDependencies: ['vue-carousel-list','element-ui'],
    //开发时
  devServer: {
        host: '127.0.0.1',
        port: 4000,
    proxy:{
      //cli3代理是proxy没有Table
      '/getAddress': {//请求遇到/getAddress就进行代理
          target: 'http://freeapi.ipip.net',//接口地址，其实是代理地址
          changeOrigin: true,
          pathRewrite: {
            '^/getAddress': 'http://freeapi.ipip.net',//重写地址
        },
      }
    }
  },
}

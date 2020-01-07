module.exports = {
  devServer: {
    proxy:{
      //cli3是proxy没有Table！！！！
      '/getAddress': {
          target: 'http://freeapi.ipip.net',//接口地址，其实是代理地址
          changeOrigin: true,//是否允许跨越
          pathRewrite: {
            '^/getAddress': 'http://freeapi.ipip.net',//重写地址
        },
      }

    }

  }
}

# eleme仿饿了么移动端

## Project setup
npm install

Compiles and hot-reloads for development

npm run serve

http://127.0.0.1:4000/   打开

Compiles and minnpmifies for production

npm run build

### introduction

vue vuex vue-router写的仿饿了么app的移动端（手机端）网页

主要页面：首页、菜单页、选址页。

主要功能：购物车功能、选择城市、搜索城市、各种app上的效果……

使用到的第三方插件：

vue-awesome-swiper

pinyin-match

菜单页由于我只找到其中一家店的api，所以首页内每一家店铺点进去暂时都只是同一家。

效果展示

首页

![](https://github.com/xxxxxyn/vueElm/blob/master/imgForShow/home.gif?raw=true)

地址页

![](https://github.com/xxxxxyn/vueElm/blob/master/imgForShow/address.gif?raw=true)

菜单页

![](https://github.com/xxxxxyn/vueElm/blob/master/imgForShow/menu.gif?raw=true)





## 项目树状结构



|   |-- App.vue
|   |-- assets
|   |   `-- logo.png
|   |-- components
|   |   |-- NavBar.vue-----------通用组件-下栏导航
|   |   |-- home
|   |   |   `-- ShopIntro.vue------------首页点击能跳到商铺菜单页面的组件
|   |   `-- shop
|   |       |-- Comments.vue-------------商铺评论组件
|   |       |-- OrderMenu.vue------------商铺菜单组件
|   |       |-- OrderMenuFood.vue--------商铺菜单组件--每个商品组件
|   |       |-- OrderMenuFoodSelect.vue--商铺菜单组件--每个商品组件--选择属性组件
|   |       `-- ShopDetail.vue----------商铺详情组件
|   |-- main.js
|   |-- router
|   |   `-- index.js
|   |-- store
|   |   `-- index.js
|   `-- views
|       |-- Address.vue--------选址页
|       |-- Discover.vue-------发现页
|       |-- Home.vue-------首页
|       |-- Mine.vue-------我的页面
|       |-- Order.vue------订单页面
|       `-- ShopMenu.vue---------单个商铺菜单页
`-- vue.config.js



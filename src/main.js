import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
//axios要结合VueAxios才能全局使用
import axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import less from 'less'
Vue.use(less)

Vue.use(ElementUI);

Vue.use(VueAwesomeSwiper)

Vue.use(VueAxios,axios);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

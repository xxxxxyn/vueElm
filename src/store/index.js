import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    city: '',
    cityList: '',
    cart: [],//无论哪家店所有购物车内的商品
    currentShopID:'',//正在逛的店铺id
    currentReduceObj:'',//正在逛的店铺的满减规则
    currentMinPrice:'',//正在逛的店铺的最低配送费
    handlingFoodid:'',
    emptyShopid:'',

    //样式类控制
    //点餐、评论、商家是否已吸附
    isStickNav: false,
    //侧栏index
    sideBarIndex:0
  },
  getter: {

  },

  mutations: {

  },
  actions: {},
  modules: {}
})

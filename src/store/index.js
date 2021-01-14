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
    SET_CITY(state,city){
      state.city=city
    },
    //购物车操作
    //添加商品到购物车
    ADD_IN_CART(state,food){
      state.cart.push(food)
    },
    // this.$store.state.cart[this.$store.state.cart.length - 1]["attrs"] = obj
    //添加选择的attrs
    ADD_ATTRS(state,attrs){
      state.cart[state.cart.length - 1]["attrs"] = attrs
    },
    //按索引删除购物车某商品
    DELET_CART_ITEM(state,index){
      state.cart.splice(index, 1)
    },

  },
  actions: {},
  modules: {}
})

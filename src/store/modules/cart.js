import Vue from 'vue'

const cart = {
    state: {
        cart:[]
    },

    mutations: {
        //购物车操作
        //添加商品到购物车
        ADD_IN_CART(state,food){
            console.log('111')
            // state.cart.push(food)
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

    actions: {


    }
}

export default cart
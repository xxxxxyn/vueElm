<template>
    <div ref="menu" :class="{menu:!this.$store.state.isStickNav}">
        <div v-if="this.$store.state.isStickNav" class="placeholder"></div>
        <!--侧栏菜单分类-->
        <div :class="{sideBar:!this.$store.state.isStickNav,sideBarStick:this.$store.state.isStickNav}">
      <span :class="{sideBarTag:true,sideBarSelected:targetIndex===index}"
            v-for="(category,index) in menuList" @click="targetClick(index)" :key="index">{{category.name}}</span>
        </div>

        <!--放商品的盒子-->
        <div class="foodMenuBox" ref="foodMenuBox">
            <div v-for="(category,index) in menuList" ref="foodBoxList" :key="index">
                <h2>{{category.name}}</h2>
                <!--每一款食物-->
                <OrderMenuFood ref='eachFood' v-for="(food,index) in category.foods"
                               v-bind:foodFromParent="food"
                               v-if="food"
                               :key="index"
                >
                </OrderMenuFood>
            </div>


            <!--点击购物车底栏显示的操作增加或减少商品弹窗-->
          <transition name="fade"
                      enter-class="fade-in-enter"
                      enter-active-class="fade-in-active">
            <!--购物车去结算底栏-->
            <div class="currentShopCart" @click="showCart(e)">
              <svg t="1579082870492" class="icon" viewBox="0 0 1024 1024" version="1.1"
                   xmlns="http://www.w3.org/2000/svg"
                   p-id="17335" width="64" height="64">
                <path
                        d="M535.872 531.968L534.144 1024 1024 775.744V283.712zM512 0L25.6 245.312 512 492.032l486.464-246.72zM0 775.744l483.008 243.84 1.664-490.56L0 283.712z"
                        p-id="17336" fill="#3B86F7"></path>
              </svg>
              <span>¥{{totalPrice}}</span>
              <span class="dFee">另需配送费¥{{shopInfo.float_delivery_fee}}</span>
              <button :disabled="notReachMiniAmount">{{shopInfo.float_minimum_order_amount}}起送</button>
              <button v-if="!notReachMiniAmount" @click="goToPay">去结算</button>
            </div>
          </transition>
            <div>
                <div class="maskForSelect" v-show="showAdjustCart"></div>
                <div class="adjustCart" v-show="showAdjustCart">
                    <div class="adjustCartTop">已选商品
                        <button @click="emptyCurrentFood">清空</button>
                    </div>
                    <div v-for="(item,index) in currentShopFood" :key="index">
                        <div v-if="item!==undefined">
                            <span>{{item.name}}</span>
                            <span>¥{{item.price}}</span>
                            <span>
                <button @click="minusOne(item.sku_id,item.attrs)">-</button>
                {{item.num}}
                <button @click="plusOne(item.sku_id,item.attrs)">+</button></span>
                        </div>
                        <div v-if="item!==undefined">
                            <span v-if="item.specs.length>0">{{item.specs[0].value}}</span>
                            <span v-if="item.attrs!==undefined">
                <span v-for="(attr,index) in item.attrs" :key="index">/{{attr}}</span>
              </span>
                        </div>
                    </div>
                    <div><span>餐盒¥{{packingFee}}</span></div>
                </div>
            </div>
        </div>


    </div>

</template>

<script>
    import OrderMenuFood from './OrderMenuFood'

    export default {
        name: "OrderMenu",
        components: {
            OrderMenuFood
        },
        props: {
            shopInfo: '',
            // 满减对象
            reduceObj: ''
        },

        data() {
            return {
                menuList: '',
                //当前店铺的相关数据
                shopID: '',
                //未满足起送，默认就是未满足
                notReachMiniAmount: true,
                //需要显示的本商店购物车内数据
                //一个食物一个对象
                currentShopFood: [],
                //总餐盒费
                packingFee: 0,
                totalPrice: 0,
                //显示下栏调整购物车数量
                showAdjustCart: false,
                //控制侧栏选中样式的index
                targetIndex: 0
            }
        },
        methods: {
            goToPay(e) {
                e.stopPropagation()
                if (this.$store.state.user.token) {
                } else {
                    this.$router.push({name: 'login'})
                }
            },
            getMenu: function () {
                let arr
                this.axios
                    .get('http://localhost:8080/api/api_shop_menu.json')
                    .then(res => (
                        console.log("api_shop_menu.json请求成功"),
                            arr = res.data,
                            this.menuList = arr
                    ))
                    .catch(function (err) {
                        console.log(err);
                    })
            },

            goAnchor(selector) {
                let anchor = this.$el.querySelector(selector)
                document.body.scrollTop = anchor.offsetTop
            },

            showCart: function (e) {
                this.showAdjustCart = !this.showAdjustCart
                console.log(this.$store.state.cart)
            },


            //满减计算
            deductionCount: function (attribute, price) {
                let arrReduce = []
                for (let key in attribute) {
                    if (price > key) {
                        arrReduce.push(attribute[key]["1"])
                    } else {
                        //确保arrReduce至少有个0，arrReduce为空的话不够满减时候就是NaN了
                        arrReduce.push(0)
                    }
                }
                arrReduce.sort(function (a, b) {
                    return b - a
                })
                return arrReduce[0]
            },

            //计算价格
            countCurrentShop: function () {
                // console.log('开始执行countCurrentShop',this.$store.state.currentShopID)
                //在vuex里找到相应的id
                for (let i = 0; i < this.$store.state.cart.length; i++) {
                    if (this.$store.state.cart[i].restaurant_id === this.$store.state.currentShopID) {
                        //如没有num属性，说明该商品是新添加的，加上num属性初始化为1
                        if (!this.$store.state.cart[i].num) {
                            this.$store.state.cart[i].num = 1;
                        }
                    }
                }

                //比较是否是一样的商品只需要拿最后一个元素跟前面全部元素比较即可
                for (let i = 0; i < this.$store.state.cart.length - 1; i++) {
                    if (this.$store.state.cart[this.$store.state.cart.length - 1].sku_id === this.$store.state.cart[i].sku_id && this.$store.state.cart[this.$store.state.cart.length - 1].restaurant_id === this.$store.state.currentShopID) {
                        //对比attrs,因为key顺序一致，所以可以直接转化成字符串对比
                        //没有attrs即undefined===undefined，也成立
                        if (JSON.stringify(this.$store.state.cart[this.$store.state.cart.length - 1].attrs) === JSON.stringify(this.$store.state.cart[i].attrs)) {
                            this.$store.state.cart[i].num++
                            console.log(this.$store.state.cart)
                            this.$store.state.cart.pop()
                        }
                    }
                }

                //购物车内属于本店的商品
                let currentShopFood = []
                let packingFee = 0
                for (let i = 0; i < this.$store.state.cart.length; i++) {
                    if (this.$store.state.cart[i].restaurant_id === this.$store.state.currentShopID) {
                        currentShopFood.push(this.$store.state.cart[i])
                        // console.log('属于本店')
                    }
                }
                // 如果没有这家店（初始状态）的不用继续，数据传给data，没有商品不满足配送
                if (currentShopFood.length === 0) {
                    this.totalPrice = 0
                    this.packingFee = packingFee
                    this.currentShopFood = currentShopFood
                    this.notReachMiniAmount = true
                } else {
                    //计算总价格
                    // 找出非特价商品，这些要参与满减，
                    // 但是如果有一个是特价的，所有商品不参与满减
                    let originalPriceFood = []
                    let originalTotalPrice = 0
                    let salePrice = 0
                    let reduceAllow = true
                    for (let i = 0; i < currentShopFood.length; i++) {
                        if (currentShopFood[i].original_price !== null) {
                            //是特价产品
                            reduceAllow = false
                            salePrice += currentShopFood[i].price * currentShopFood[i].num
                            packingFee += currentShopFood[i].packing_fee * currentShopFood[i].num
                        } else if (currentShopFood[i].original_price == null) {
                            originalPriceFood.push(currentShopFood[i])
                            packingFee += currentShopFood[i].packing_fee * currentShopFood[i].num
                        }

                    }

                    //计算非特价产品总价
                    for (let i = 0; i < originalPriceFood.length; i++) {
                        originalTotalPrice += originalPriceFood[i].price * originalPriceFood[i].num
                    }

                    //要付的总金额（不含运费
                    let totalPrice = 0
                    //有满减活动并且没有特价商品就要计算
                    if (this.$store.state.currentReduceObj && reduceAllow) {
                        // 总的满减去掉的价格
                        let deductionPrice = this.deductionCount(this.$store.state.currentReduceObj, originalTotalPrice)
                        totalPrice = originalTotalPrice - deductionPrice + packingFee
                    } else {
                        // 有特价产品或者该商店没有满减活动
                        totalPrice = originalTotalPrice + salePrice + packingFee
                    }

                    if (totalPrice >= this.$store.state.currentMinPrice) {
                        this.notReachMiniAmount = false
                    } else {
                        this.notReachMiniAmount = true
                    }

                    //传给显示数据
                    this.packingFee = packingFee.toFixed(2)
                    this.currentShopFood = currentShopFood
                    // console.log("计算一次")
                    this.totalPrice = totalPrice.toFixed(2)
                }


            },

            //商品减一加一
            minusOne: function (sku_id, attrs) {

                //减到num=1时再减就是删除
                // this.$store.state.handlingFoodid用来更新OrderMenuFood的foodNum
                if (!attrs) {
                    for (let i = 0; i < this.$store.state.cart.length; i++) {
                        if (this.$store.state.cart[i].sku_id === sku_id) {
                            this.$store.state.handlingFoodid = this.$store.state.cart[i].virtual_food_id
                            let num0 = this.$store.state.cart[i].num
                            if (this.$store.state.cart[i].num === 1) {
                                //减到num=1时再减就是删除
                                this.$store.state.cart.splice(i, 1)
                            } else {
                                // this.$store.state.cart[i].num--
                                this.$set(this.$store.state.cart[i], "num", num0 - 1)
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.$store.state.cart.length; i++) {
                        if (this.$store.state.cart[i].sku_id === sku_id) {
                            if (JSON.stringify(this.$store.state.cart[i].attrs) === JSON.stringify(attrs)) {
                                this.$store.state.handlingFoodid = this.$store.state.cart[i].virtual_food_id
                                let num0 = this.$store.state.cart[i].num
                                if (this.$store.state.cart[i].num === 1) {
                                    //减到num=1时再减就是删除
                                    this.$store.state.cart.splice(i, 1)

                                } else {
                                    this.$set(this.$store.state.cart[i], "num", num0 - 1)
                                }
                            }

                        }
                    }
                }
                this.countCurrentShop()
                // this.$refs.eachFood.updateNum()
            },
            plusOne: function (sku_id, attrs) {

                if (!attrs) {
                    for (let i = 0; i < this.$store.state.cart.length; i++) {
                        if (this.$store.state.cart[i].sku_id === sku_id) {
                            this.$store.state.handlingFoodid = this.$store.state.cart[i].virtual_food_id
                            let num0 = this.$store.state.cart[i].num
                            this.$set(this.$store.state.cart[i], "num", num0 + 1)
                        }
                    }
                } else {
                    for (let i = 0; i < this.$store.state.cart.length; i++) {
                        if (this.$store.state.cart[i].sku_id === sku_id) {
                            if (JSON.stringify(this.$store.state.cart[i].attrs) === JSON.stringify(attrs)) {
                                this.$store.state.handlingFoodid = this.$store.state.cart[i].virtual_food_id
                                let num0 = this.$store.state.cart[i].num
                                this.$set(this.$store.state.cart[i], "num", num0 + 1)
                            }
                        }
                    }
                }
                this.countCurrentShop()
                // this.$refs.eachFood.updateNum()
            },
            emptyCurrentFood: function () {
                for (let i = this.$store.state.cart.length - 1; i >= 0; i--) {
                    if (this.$store.state.cart[i].restaurant_id === this.$store.state.currentShopID) {
                        this.$store.state.cart.splice(i, 1)
                        this.countCurrentShop()
                        //使得子组件的每个food也归零
                        for (let i = 0; i < this.$refs.eachFood.length; i++) {
                            this.$refs.eachFood[i].zeroing()
                        }

                    }
                }
                this.$store.state.emptyShopid = this.$store.state.currentShopID
                console.log(this.$store.state.cart)
            },

            // test: function () {
            //   console.log('menu')
            // },
            //
            // test1: function () {
            //   console.log('windowwww')
            // },
            //
            // test2: function () {
            //   console.log('foodMenuBox')
            // },

            //点击侧栏定位商品种类
            targetClick: function (index) {
                // console.log('点击')
                this.$store.state.sideBarIndex = index
                this.targetIndex = index
            },
            targetSelected: function (index) {
                // console.log('父组件触发的滑动index样式改变')
                this.targetIndex = index
                // this.$forceUpdate()
            }

        },

        created() {
            this.getMenu()

        },
        mounted() {
            this.countCurrentShop()
            // this.$refs.menu.addEventListener('scroll', this.test)
            // window.addEventListener('scroll', this.test1)
            // this.$refs.foodMenuBox.addEventListener('scroll', this.test2)
        },

        updated(index) {

        },

        beforeDestroy() {

        },

        watch: {},

        computed: {},

    }
</script>

<style scoped>
  .fade-in-active, .fade-out-active{
    transition: all 1s ease
  }

  .menu {
        position: relative;
    }

    .sideBar {
        position: absolute;
        left: 0;
        top: 0;
        width: 20vw;
        background-color: rgba(205, 205, 205, 0.3);
    }

    .sideBarStick {
        position: absolute;
        left: 0;
        top: 10vw;
        width: 20vw;
        background-color: rgba(205, 205, 205, 0.3);
    }

    .sideBarTag {
        display: inline-block;
        width: 20vw;
        padding: 2vw 0;
        text-align: center;
        text-overflow: clip;
        color: #565656;
    }

    .sideBarSelected {
        background-color: #ffffff;
        color: #000000;
    }

    .foodMenuBox {
        padding-left: 20vw;
    }

    .oneFood img {
        height: 25vw;
        width: 25vw;
    }

    .currentShopCart {
        position: fixed;
        width: 100vw;
        height: 20vw;
        bottom: 0;
        left: 0;
        background-color: rgba(95, 95, 95, 0.95);
        text-align: left;
        font-size: 5.5vw;
        color: white;
        z-index: 12345678;
    }

    .currentShopCart button {
        position: absolute;
        top: 2vw;
        right: 2vw;
        vertical-align: top;
        display: inline-block;
        background-color: #54d66d;
        height: 10vw;
        width: 30vw;
        border-radius: 0.5vw;
    }

    .currentShopCart button[disabled] {
        opacity: 0.8;
        background: rgb(161, 161, 161) !important;
    }

    .currentShopCart svg {
        vertical-align: top;
        height: 16vw;
        width: 16vw;
        margin-left: 4vw;
        margin-top: -2vw;

    }

    .currentShopCart span {
        position: absolute;
        top: 0;
        margin-left: 2vw;
        padding-top: 3vw;
    }

    .currentShopCart .dFee {
        position: absolute;
        top: 5vw;
        margin-left: 2vw;
        padding-top: 3vw;
        font-size: 3vw;
        color: rgba(255, 255, 255, 0.7);
    }

    .maskForSelect {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(122, 122, 122, 0.46);
        z-index: 1234567;
    }

    .adjustCart {
        position: fixed;
        bottom: 20vw;
        left: 0;
        width: 100vw;
        background-color: #fff;
        z-index: 1234567;
    }

    .adjustCartTop {
        display: flex;
        justify-content: space-between;
        background-color: rgba(205, 205, 205, 0.4);
        padding: 0 5vw;
    }

    .placeholder {
        height: 10vw;
    }

</style>

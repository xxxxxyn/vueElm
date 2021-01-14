<template>
  <div class="oneFood">
    <img
      :src="encodeURI('https://fuss10.elemecdn.com/'+foodFromParent.image_path +'?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/')">
    <div class="info">
      <h3>{{foodFromParent.name}}</h3>
      <p class="description">{{foodFromParent.description}}</p>
      <div>
        <span>月售 {{foodFromParent.month_sales}}</span>
        <span>好评率 {{foodFromParent.satisfy_rate}}%</span>
      </div>
      <div class="price">
        <!--specifications是空数组就是价格只有一种-->
        <div>
          <span v-if="foodFromParent.specifications!==undefined && foodFromParent.specifications.length===0 ? 1 :0">¥{{foodFromParent.specfoods[0].price}}</span>
          <span v-if="foodFromParent.specifications!==undefined && foodFromParent.specifications.length>0 ? 1 :0">¥{{foodFromParent.specfoods[0].price}}起</span>
        </div>

        <div>
          <!--num要不为零才有减号,有可以选择的都不能在这里操作-->
          <button @click="reduceOne()" class="addButton"
                  v-if="foodNum"
                  :disabled="foodFromParent.specifications.length!==0"
          >
            -
          </button>
          <span v-if="foodNum" class="foodNum">{{foodNum}}</span>

          <!--attrs或者specifications不为空都会弹窗可以选择-->
          <button @click="showSelectBox()" class="addButton"
                  v-if="foodFromParent.specifications!==undefined && foodFromParent.specifications.length>0 ||foodFromParent.attrs!==undefined && foodFromParent.attrs.length>0 ? 1 :0">
            +
          </button>
          <button @click="addCart()" class="addButton"
                  v-if="foodFromParent.specifications!==undefined && foodFromParent.specifications.length===0 &&foodFromParent.attrs!==undefined && foodFromParent.attrs.length===0">
            +
          </button>
        </div>

      </div>
    </div>

    <!--规格选择弹窗-->
    <!--放进购物车之前的选择box-->
    <div class="maskForSelect" v-if="showForSelect" @touchmove.prevent></div>
    <div class="selectAddCart" v-if="showForSelect">
      <div>
        <img
          :src="encodeURI('https://fuss10.elemecdn.com/'+foodFromParent.image_path +'?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/')">
        <div class="selectedInfo">
          <div class="line1">
            <span>{{foodFromParent.name}}</span>
            <button class='closeBtn' @click="closeSelect()">×</button>
          </div>
          <span>已选：
            <span>{{selectedSp}}</span>
            <span v-for="(item,index) in attrsValue" :key="index">/{{item}}</span>
          </span>
          <div class="price">¥{{foodFromParent.specfoods[spcfIndex].price}}</div>
        </div>
      </div>
      <!--规格选择-->
      <ul v-if="foodFromParent.specifications!==undefined && foodFromParent.specifications.length>0 ? 1 :0">
        <p>规格</p>
        <li v-for="(value,index) in foodFromParent.specifications[0].values"
            :class="index===spcfIndex?'activeLi':''"
            @click="showSelectedFood(index)"
            :key="index">
          {{value}}
        </li>
      </ul>
      <div v-if="foodFromParent.attrs!==undefined && foodFromParent.attrs.length>0 ? 1 :0">
        <OrderMenuFoodSelect v-for="(attr,attrIndex) in foodFromParent.attrs" v-bind:attr="attr" v-if="attr"
                             @attrsGetFromChild="attrsValuesHandle(arguments)"
                             :key="attrIndex">
        </OrderMenuFoodSelect>
      </div>

      <button class="confirm" @click="addSelectCart()">选好了</button>
    </div>
  </div>

</template>

<script>
  import OrderMenuFoodSelect from './OrderMenuFoodSelect'

  export default {
    name: "OrderMenuFood",
    components: {
      OrderMenuFoodSelect
    },
    props: {
      foodFromParent: '',
      // type: Object
    },
    data() {
      return {
        showForSelect: false,
        //选中规格的index，默认是0
        spcfIndex: 0,
        //选中的不同种类的商品的种类名和具体选项，如----饮料：可乐
        attrsValue: {},
        //已经选中的规格specification
        selectedSp: '',
        //已经选中的attrs
        selectedAttr: '',
        checked: '',
        // attrValue:[0,0,0],
        checkedList: [],
        foodNum: 0,
      }

    },
    methods: {

      //点击之后弹出选择盒子
      showSelectBox: function () {
        this.showForSelect = !this.showForSelect
      },

      addCart: function () {
        //规格和attrs都没得选择的，直接加入specfoods[0]
        let food = {}
        food = JSON.parse(JSON.stringify(this.foodFromParent.specfoods[0]))
        // this.$store.state.cart.push(food)
        this.$store.commit("ADD_IN_CART",food)
        //this.$store.state.cart[this.$store.state.cart.length-1].num=1
        this.$parent.countCurrentShop()
        // console.log(this.$store.state.cart)
        this.foodNum++
      },

      addSelectCart: function () {
        // 既要知道规格选了哪个，确定价格，也要知道attrs选了哪些
        let food = {}
        food = JSON.parse(JSON.stringify(this.foodFromParent.specfoods[this.spcfIndex]))
        this.$store.commit("ADD_IN_CART",food)
        let obj = {}
        obj = JSON.parse(JSON.stringify(this.attrsValue))
        this.$store.commit("ADD_ATTRS",obj)
        // console.log(this.foodFromParent.specfoods[this.spcfIndex])
        this.$parent.countCurrentShop()
        this.foodNum++
        console.log(this.$store.state.cart)
        // 选好了就隐藏
        this.showForSelect = !this.showForSelect
      },

      closeSelect: function () {
        this.showForSelect = !this.showForSelect
      },

      attrsValuesHandle: function (data) {
        this.$set(this.attrsValue, data[0], data[1])

      },

      showSelectedFood: function (index) {
        this.spcfIndex = index
        this.selectedSp = this.foodFromParent.specifications[0]["values"][index]

      },

      reduceOne: function () {
        for (let i = 0; i < this.$store.state.cart.length; i++) {
          if (this.$store.state.cart[i].virtual_food_id === this.foodFromParent.virtual_food_id) {
            if (this.$store.state.cart[i].num === 1) {
              //减到num=1时再减就是删除
              // this.$store.state.cart.splice(i, 1)
              this.$store.commit("DELET_CART_ITEM",i)
            } else {
              this.$store.state.cart[i].num--
            }
          }
        }
        this.foodNum--
        this.$parent.countCurrentShop()
        console.log(this.$store.state.cart)
      },

      updateNum: function () {
          let isZero = true

        if (this.foodFromParent.specifications === 0) {
          for (let i = 0; i < this.$store.state.cart.length; i++) {
            if (this.$store.state.cart[i].virtual_food_id === this.foodFromParent.virtual_food_id) {
              this.foodNum = this.$store.state.cart[i].num
              //找到了就不为0
              isZero = false
            }
          }
        } else {
          let tempNum = 0
          for (let i = 0; i < this.$store.state.cart.length; i++) {
            if (this.$store.state.cart[i].virtual_food_id === this.foodFromParent.virtual_food_id) {
              tempNum += this.$store.state.cart[i].num
              //找到了就不为0
              isZero = false
            }
            this.foodNum = tempNum
          }
        }


        //还有一种情况是从1减到0，也就是没有了这个food
        if (isZero) {
          this.foodNum = 0
        }
      },

      zeroing: function () {
        this.foodNum = 0
      }

    },

    created() {
      //初始化foodNum
      this.updateNum()
    },

    mounted() {
      //有规格要选的默认选中第一个，传进去显示出来
      if (this.foodFromParent.specifications.length > 0) {
        this.selectedSp = this.foodFromParent.specifications[0]["values"][this.spcfIndex]
      }

    },


    computed: {},

    watch: {
      "$store.state.handlingFoodid": function () {
        if (this.$store.state.handlingFoodid === this.foodFromParent.virtual_food_id) {
          this.updateNum()
          //操作完之后清空handlingFoodid，避免和上一次的一样就不触发了
          this.$store.state.handlingFoodid = ''
        }
      },
    }


  }

</script>

<style scoped>
  .oneFood {
    padding-bottom: 5vw;
  }

  .oneFood img {
    height: 25vw;
    width: 25vw;
    vertical-align: top;
  }

  .oneFood .info {
    display: inline-block;
    width: 50vw;
    font-size: 3.5vw;
    color: #aaaaaa;
  }


  .oneFood .foodNum{
    color: #000000;
    padding: 0 1vw;
  }

  .oneFood h3 {
    font-size: 4.5vw;
    color: #222222;
  }

  .oneFood .description{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
  }


  .oneFood .price {
    font-size: 4.5vw;
    color: #ec2115;
    display: flex;
    justify-content: space-between;
    padding: 0 5vw;
  }

  .selectAddCart {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 130vw;
    overflow: auto;
    background-color: #ffffff;
    z-index: 123456789;
  }

  .selectAddCart > div, .selectAddCart > ul {
    margin-left: 4vw;
    text-align: left;
  }

  .selectAddCart img {
    width: 20vw;
    height: 20vw;
  }

  .selectAddCart .confirm {
    width: 80vw;
    height: 8vw;
    margin-bottom: 3vw;
    background-color: #0284ff;
    color: #ffffff;
  }

  .selectAddCart .selectedInfo {
    display: inline-block;
    width: 70vw;
  }

  .selectAddCart .closeBtn {
    height: 10vw;
    width: 10vw;
    margin-right: 0;
    margin-top: -2vw !important;
    font-size: 9vw;
    background-color: rgba(255, 255, 255, 0);
    color: #b3b3b3;
  }

  .selectedInfo {
    margin-left: 2vw;
  }

  .selectedInfo .line1 {
    display: flex;
    justify-content: space-between;
    margin-top: 3vw;
    font-size: 4vw;
    font-weight: 600;
  }

  .selectedInfo .line1 span {
    display: inline-block;
    text-align: center;
  }

  .selectedInfo > span {
    display: inline-block;
    height: 10vw;
  }

  .selectedInfo .price {
    color: #ec2115;
    font-size: 5vw;
    font-weight: 600;
  }

  .maskForSelect {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(122, 122, 122, 0.46);
    z-index: 1234567;
  }

  .addButton {
    width: 6vw;
    height: 6vw;
    font-size: 6vw;
    border-radius: 3vw;
    background-color: #0088ff;
    color: #ffffff;
  }

  .addButton[disabled] {
    background-color: rgba(157, 157, 157, 0.71);
  }

  .selectAddCart li {
    display: inline-block;
    width: 28vw;
    height: 7vw;
    font-size: 3.5vw;
    overflow: hidden;
    text-overflow:ellipsis;
    background-color: rgba(205, 205, 205, 0.51);
    margin-right: 4vw;
    margin-bottom: 3vw;
    text-align: center;
    line-height: 7vw;
  }

  .activeLi {
    background-color: rgba(102, 189, 235, 0.51) !important;
    color: #0268ff;
  }


</style>

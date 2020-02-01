<template>
  <div class="outest">
    <div class="ShopTopBox" :class="{pullDownBox:pullDown}">
      <div class="coverImg">
        <img
          :src="encodeURI('https://fuss10.elemecdn.com/'+shopInfo.image_path +'?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/')"
        >
      </div>
      <img ref="logo" :style="{height:logoHeight,width:logoWidth,opacity:logoOpacity}"
           :src="encodeURI('https://fuss10.elemecdn.com/'+shopInfo.image_path +'?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/')">
      <div class="shopInfo">
        <div class="line1">{{shopInfo.name}}</div>
        <div class="line2">
          <span>评价{{shopInfo.rating}}</span>
          <span>月售{{shopInfo.recent_order_num}}</span>
          <span>蜂鸟快送约{{shopInfo.order_lead_time}}</span>
        </div>
        <!--不下拉只显示满减、首单减-->
        <!--下拉所有优惠都显示，但是同一种类的优惠只有一行-->
        <!--什么优惠都没有就整个不显示-->
        <div class='activityBrief'
             v-show='!pullDown'
             v-if="shopInfo.activities!==undefined && shopInfo.activities.length>0 ? 1 :0">
          <div>
            <span v-for="reduce in everyReduce">{{reduce}}</span>
          </div>
          <div>
            <span class='openBtn' ref="openBtn" @click.stop.prevent="openActivities()">∨</span>
          </div>
        </div>
      </div>

      <!--下拉显示.不在ShopTopBox里面，因为打开后要占满剩余高度-->
      <div class='activityDetailed' v-show='pullDown' @touchmove.prevent>
        <div class="title1"><h3>优惠</h3>
          <p @click.stop.prevent="openActivities()">∧</p></div>
        <div class="activityContent">
          <div v-if="everyReduceAll"><span>满减</span>{{everyReduceAll}}</div>
          <div v-if="minSale"><span>特价</span>特价商品{{minSale}}元起</div>
          <div v-if="discount"><span>折扣</span>{{discount}}</div>
          <div v-if="firstReduce"><span>首单</span>饿了么新用户立减{{firstReduce}}</div>
        </div>

        <div><h3>公告</h3>{{shopInfo.description}}</div>
      </div>
    </div>

    <!--下面是菜单评论商家盒子-->

    <div class="menuBox">
      <div>
        <router-link to="/shop">点餐</router-link>
        <router-link to="/shop/comments">评论</router-link>
        <router-link to="/shop/shopDetail">商家</router-link>
      </div>
      <router-view v-bind:shopInfo="shopInfo" :reduceObj="reduceObj"></router-view>
    </div>


  </div>
</template>

<script>

  export default {
    name: "ShopMenu",
    components: {


    },

    data() {
      return {

        shopInfo: '',
        //全部满减,默认是没有
        everyReduceAll: false,
        //满减拆分
        everyReduce: [],
        //满减对象（传给子组件用）
        reduceObj:'',
        // 特价产品中的最低价格,默认是没有
        minSale: false,
        //折扣,默认是没有
        discount: false,
        //首单减,默认是没有
        firstReduce: false,
        //是否下拉
        pullDown: false,
        //logo原始状态
        logoHeight: 21 + "vw",
        logoWidth: 21 + "vw",
        logoOpacity: 1,

      }
    },
    methods: {

      getShopInfo: function () {
        let obj
        this.axios
          .get('http://localhost:8080/api/api_shop_info.json')
          .then(res => (
            obj = res.data,
              console.log("shop_info.json请求成功"),
              this.shopInfo = obj,
              this.$store.state.currentShopID=this.shopInfo.id,
              this.$store.state.currentMinPrice=this.shopInfo.float_minimum_order_amount,
              this.activitiesSort()
          ))
          .catch(function (err) {
            console.log(err);
          })

      },

      activitiesSort: function () {
        let arr = this.shopInfo.activities
        // console.log(this.shopInfo)
        let sales = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].icon_name == '首单') {
            this.firstReduce = arr[i].attribute
          } else if (arr[i].icon_name == '满减') {
            this.everyReduceAll = arr[i].description
            this.everyReduce = arr[i].description.split('，')
            this.reduceObj = JSON.parse(arr[i]["attribute"])
            this.$store.state.currentReduceObj=this.reduceObj
          } else if (arr[i].icon_name == '特价') {
            //只显示最低价的
            sales.push(arr[i].description)
          } else {
            //折扣
            this.discount = arr[i].description
          }
        }
        // 得到最小值
        sales.sort(function (a, b) {
          return a - b;
        })
        this.minSale = sales[0]
      },

      openActivities: function () {

        this.pullDown = !this.pullDown
      },

      shrinkLogo: function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop === 0) {
          this.logoHeight = 21 + 'vw'
          this.logoWidth = 21 + 'vw'
          this.logoOpacity = 1
        } else if (10 > scrollTop > 0) {
          //确保滑动后的logo大小必须小于21*21
          this.logoHeight = 63 / (scrollTop + 3) + 'vw'
          this.logoWidth = 63 / (scrollTop + 3) + 'vw'
          this.logoOpacity = 1 / scrollTop
        } else {
          this.logoOpacity = 0
        }
      },


    },
    created: function () {
      this.getShopInfo()

    },

    mounted() {
      window.addEventListener('scroll', this.shrinkLogo)
    },



  }
</script>

<style scoped>
  .outest {

  }

  .ShopTopBox {
    /*height: 100vh;*/
    display: flex;
    flex-direction: column;
    overflow: auto
  }

  .pullDownBox {
    height: 100vh;
  }

  .coverImg {
    background-color: skyblue;
    height: 40vw;
    overflow: hidden
  }

  .coverImg img {
    width: 100vw;
  }

  .ShopTopBox > img {
    position: fixed;
    top: 25vw;
    left: 50vw;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .shopInfo .line1 {
    font-size: 6vw;
    font-weight: 600;
    height: 5.6vw;
    line-height: 5.6vw;
    margin-top: 8vw;
    margin-bottom: 3vw;
  }

  .shopInfo .line2 {
    font-size: 3.2vw;
    margin-bottom: 3vw;
  }

  .shopInfo .line2 span {
    margin: 2vw;
  }


  .activityBrief {
    box-sizing: border-box;
    height: 5vw;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    padding: 0 7vw;
    margin-bottom: 1vw;
  }

  .activityBrief .openBtn {
    margin-left: 8vw;
    border: none;
    color: #767676;
  }

  .activityBrief div {
    display: inline-block;

  }

  .activityBrief span {
    display: inline-block;
    font-size: 3vw;
    color: #ea573b;
    border-radius: 0.5vw;
    border: 0.1vw rgba(228, 90, 62, 0.47) solid;
    margin-right: 1vw;
    margin-bottom: 1.5vw;
    padding: 0 0.8vw;
    text-align: center;
    letter-spacing: 0.2vw
  }

  .activityDetailed {
    flex-grow: 1;
    margin: 0 5vw;
    font-size: 3vw;
  }

  .activityDetailed h3 {
    font-size: 5vw;
  }

  .activityDetailed p {
    font-size: 6vw;
    font-weight: 300;
  }

  .activityDetailed .title1 {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

  .activityDetailed div {
    text-align: left;
  }

  .activityDetailed span {
    display: inline-block;
    font-size: 3vw;
    color: #ea573b;
    border-radius: 0.5vw;
    border: 0.1vw rgba(228, 90, 62, 0.47) solid;
    margin-right: 1vw;
    margin-bottom: 1.5vw;
    padding: 0 0.8vw;
    letter-spacing: 0.2vw;
  }

  .title1 span {
    font-size: 5vw;
  }

  .menuBox {
    box-sizing: border-box;
    margin-top: 10vw;
    height: 99vh;
    overflow-y: scroll;
  }


</style>

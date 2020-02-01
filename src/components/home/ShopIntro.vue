<template>
  <div>
    <router-link to="/shop">
      <div class="outerBoxShop">
        <div class="picBox">
          <img alt=""
               :src="encodeURI('https://fuss10.elemecdn.com/'+shop.restaurant.image_path +'?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/')">
        </div>
        <div class="infoBox">
          <div class="line1">{{shop.restaurant.name}}</div>
          <div class="line2">
          <span class="rating">
            <svg t="1578294589881" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="2209" width="22" height="22">
            <path
              d="M887 430.2c3.4-3.5 1.4-9.4-3.4-10.1l-250.2-38.2c-2-0.3-3.7-1.6-4.5-3.4l-112.3-239c-2.2-4.6-8.7-4.6-10.9 0l-112.3 239c-0.9 1.8-2.5 3.1-4.5 3.4l-250.2 38.2c-4.8 0.7-6.8 6.6-3.4 10.1l181.4 185.7a6.2 6.2 0 0 1 1.6 5.2l-42.9 262.7c-0.8 4.9 4.4 8.6 8.8 6.2l224-123.7c1.8-1 4-1 5.8 0L738 890c4.4 2.4 9.6-1.3 8.8-6.2L704 621c-0.3-1.9 0.3-3.8 1.6-5.2L887 430.2z"
              p-id="2210" fill="#ED6E2D"></path>
          </svg>
          <span>{{shop.restaurant.rating}}</span>
          </span>
            <span class="monthSale">月售{{shop.restaurant.recent_order_num}}</span></div>
          <div class="line3">
            <span>起送¥{{shop.restaurant.float_minimum_order_amount}} 配送¥{{shop.restaurant.float_delivery_fee}}</span>
            <div class="time">
              <span>{{shop.restaurant.order_lead_time}}分钟</span>
            </div>
          </div>
          <div class="rcm" v-if="shop.restaurant.recommend_reasons.length!==0">
            <span v-for="recommend in shop.restaurant.recommend_reasons">{{recommend.name}}</span>
          </div>
          <div class="atvt" v-if="shop.restaurant.activities.length!==0" :class="{'isOpenAt':isOpenAt}">
            <div>
              <span v-if="firstReduce">首单减{{Math.abs(firstReduce)}}</span>
              <span v-if="everyReduce" v-for="at in everyReduce">
            {{at}}
          </span>
            </div>
            <span class='openBtn' ref="openBtn" @click.stop.prevent="openActivities()">∨</span>
          </div>
        </div>

      </div>
      <hr>
    </router-link>
  </div>

</template>

<script>

  export default {
    name: "ShopIntro",
    props: {
      shop: '',
      type: Object
    },
    data() {
      return {
        isOpenAt: false,
        //首单减，默认没有
        firstReduce: false,
        //满减，默认没有
        everyReduce: false

      }


    },

    created: function () {

    },

    mounted: function () {

      this.activitiesSort()

    },
    beforeUpdate:function(){

    },


    methods: {

      openActivities: function () {
        this.isOpenAt = !this.isOpenAt
      },

      //活动类型很多，显示的处理方式有不同，分类,且在首页里只会显示首单减和满减，只处理这两个
      activitiesSort: function () {
        let arr = this.shop.restaurant.activities
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].icon_name == '首') {
            this.firstReduce = arr[i].attribute
          } else if (arr[i].icon_name == '减') {
            this.everyReduce = arr[i].description.split('，')
          }
        }
      }


    }
  }
</script>

<style scoped>
  div {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  hr {
    width: 70vw;
    margin-left: 26.6vw;
    border: rgba(131, 131, 131, 0.36) solid 0.1vw;
    border-left: none;
  }

  .outerBoxShop {
    width: 100vw;
    padding: 4vw 0;
  }

  .picBox {
    display: inline-block;
    width: 26.6vw;
    vertical-align: top
  }

  .picBox img {
    height: 21vw;
    width: 21vw;
  }


  .infoBox {
    display: inline-block;
    width: 73.4vw;
    padding-right: 3vw;
    text-align: left;
    letter-spacing: 0.2vw;
  }

  .line1 {
    font-size: 5vw;
    font-weight: 600;
    height: 5.6vw;
    line-height: 5.6vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .rating {
    color: #ED6E2D;
    font-size: 4vw;
    font-weight: 400;
    margin-right: 2vw;
  }

  .rating svg {
    vertical-align: bottom;
  }

  .monthSale {
    font-size: 3.5vw;
  }

  .line3 {
    font-size: 3.5vw;
    display: flex;
    justify-content: space-between
  }

  .line3 .time {
    display: inline-block;
  }


  .rcm span {
    font-size: 3vw;
    background-color: #FDEFE3;
    color: #ED6E2D;
    margin-right: 2vw;
    padding: 0.3vw 0.8vw;
  }

  .atvt {
    display: flex;
    justify-content: space-between;
    height: 5vw;
    width: 70vw;
    overflow: hidden;
    margin-bottom: 1vw;
  }

  .atvt span {
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

  .atvt > div {
    display: inline-block;
    width: 60vw;
  }

  .atvt .openBtn {
    font-size: 3vw;
    height: 4vw;
    vertical-align: top;
    border: none;
    color: #767676;
  }

  .line2, .line3 {
    color: #767676;
  }

  .line2, .line3, .rcm, .atvt {
    margin-top: 1.5vw;
  }

  /*open时候盒子自然撑开*/
  .isOpenAt {
    height: auto !important;
  }

</style>

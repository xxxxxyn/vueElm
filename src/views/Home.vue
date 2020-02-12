<template>
  <div ref="box">
    <header ref="header">
      <div ref="top">
        <router-link to="/address">
          <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 31" class="index-okfdP_0">
            <path fill="#fff" fill-rule="evenodd"
                  d="M22.116 22.601c-2.329 2.804-7.669 7.827-7.669 7.827-.799.762-2.094.763-2.897-.008 0 0-5.26-4.97-7.643-7.796C1.524 19.8 0 16.89 0 13.194 0 5.908 5.82 0 13 0s13 5.907 13 13.195c0 3.682-1.554 6.602-3.884 9.406zM18 13a5 5 0 1 0-10 0 5 5 0 0 0 10 0z"></path>
          </svg>
          {{this.$store.state.city}}
        </router-link>
      </div>
      <div id="search" :class="{'stick':stick}">
        <input type="text" placeholder="搜索饿了么商家、商品名称">
      </div>
    </header>

    <!--主要部分-->
    <main onscroll="testTop()">

      <!--商品种类选择-->
      <swiper id="box1" :options="swiperOption" class="mint-swipe outerBox">
        <swiper-slide v-for="(pageNum,index) in entryList" :key="index" class="mint-swipe-items-wrap innerBox">
          <div v-for="(entry, indexOfEntry) in entryList[index]" :key="indexOfEntry"><a href="#"><img
            :src="encodeURI('https://fuss10.elemecdn.com/' + entry.image_hash + '?imageMogr/format/webp/thumbnail/!90x90r/gravity/Center/crop/90x90/')"><span
            class="title">{{entry.name}}</span></a>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <br>
      <div>—— 推荐商家 ——</div>
      <br>

      <!--各个商店-->

      <div id="box2">
        <ShopIntro v-for="shop in shopList" :shop='shop'></ShopIntro>
      </div>
    </main>


    <NavBar></NavBar>

  </div>
</template>


<script>
  import NavBar from '../components/NavBar'
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import ShopIntro from '../components/home/ShopIntro'


  export default {
    name: 'Home',
    components: {
      NavBar,
      swiper,
      swiperSlide,
      ShopIntro,
    },
    data() {
      return {
        stick: false,
        entryList: [],
        shopList: [],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          slidePerView: 1
        }


      }

    },
    methods: {
      //搜索栏吸附效果
      testTop: function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > this.$refs.top.offsetHeight) {
          this.stick = true
        } else {
          this.stick = false
        }
      },

      getCity: function () {
        let arr
        let ip
        this.axios
          .get('http://httpbin.org/ip')
          .then(res => (
            console.log("ip请求成功", res.data.origin),
              arr = res.data.origin.split(','),
              // console.log("ip", arr[0]),
              ip = arr[0]
            // 根据ip，请求所在地址
          )).then(res => {

            this.axios
              .get(`/getAddress/${ip}`)
              .then(res => (
                console.log("地址请求成功", res.data[2]),
                  this.$store.state.city = res.data[2]
              ))
              .catch(function (err) {
                console.log(err);
              })
          }
        )
          .catch(function (err) {
            console.log(err);
          })
      },
      // 获取entry
      getEntries: function () {
        let arr

        this.axios
          .get('http://localhost:8080/api/api_entries.json')
          .then(res => (
            // console.log("entries.json请求成功"),
              arr = res.data[0]["entries"],
              this.sliceArr(arr)
          ))
          .catch(function (err) {
            console.log(err);
          })


      },
      //由于要分页，还是先分成若干数组，一页只能有10个,每十个分成一组
      sliceArr: function (arr) {
        let outerArr = []
        for (let i = 0; i < arr.length; i += 10) {
          outerArr.push(arr.slice(i, i + 10))
        }
        this.entryList = outerArr

      },
      //获取商店
      getShops: function () {

        let arr
        this.axios
          .get('http://localhost:8080/api/api_restaurants.json')
          .then(res => (
            // console.log("restaurants.json请求成功"),
              arr = res.data['items'],
              this.shopList = arr
          ))
          .catch(function (err) {
            console.log(err);
          })
      },

    },

    created: function () {
      this.getEntries()
      this.getShops()

    },


    mounted: function () {
      //当前选中city为空，获取ip
      if (this.$store.state.city === '') {
        this.getCity()

      }


      window.addEventListener('scroll', this.testTop)


    },

    computed: {},

    beforeDestroy() {
      //离开首页就解除
      window.removeEventListener('scroll', this.testTop)

    }


  }

</script>

<style scoped>

  header {
    height: 22vw;
    background-image: -webkit-gradient(linear, left top, right top, from(#0af), to(#0085ff));
    background-image: -webkit-linear-gradient(left, #0af, #0085ff);
    background-image: linear-gradient(90deg, #0af, #0085ff);
    color: #fff;
    flex: 0 0 auto;
  }

  header div {
    width: 100%;
    height: 12vw;
    background-image: -webkit-gradient(linear, left top, right top, from(#0af), to(#0085ff));
    background-image: -webkit-linear-gradient(left, #0af, #0085ff);
    background-image: linear-gradient(90deg, #0af, #0085ff);
  }

  header div:first-child {
    text-align: left;
  }

  header div a {
    font-size: 20px;
    display: inline-block;
    padding-top: 2vw;
    margin-left: 10vw;
  }

  header div a:visited {
    color: #fff;
  }


  #search {
    height: 10vw;
    z-index: 1111;
  }

  #search input {
    height: 8vw;
    width: 85vw;
    margin-top: 1vw;
  }

  main {

    padding-bottom: 15vw;
  }

  .outerBox {
    background-color: rgb(255, 255, 255);
    width: 100vw;
    height: 50vw;
  }


  .outerBox > div div {
    width: 20vw;
    background-color: white;

  }

  .outerBox div div {
    display: inline-block;
  }


  .outerBox .innerBox {
    width: 100vw !important;
  }

  .innerBox div a {
    display: inline-block;
    font-size: 3.5vw;
  }

  .innerBox div img {
    height: 16vw;
    padding: 1vw 2vw 0 2vw;
    display: inline-block;
  }

  .swiper-pagination {
    width: 100vw;
    bottom: 0;
  }


  #box2 {
    height: 70vh;
  }

  .stick {
    position: fixed;
    top: 0;
  }

</style>

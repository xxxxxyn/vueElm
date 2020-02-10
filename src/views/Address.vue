<template>
  <div id="city">
    <header>
      <div class="searchCity">
        <input type="text" @input="inputCity(value)" v-model="value">
        <ul v-if="value">
          <li v-for="(item,index) in cityTip" :key="index" @click="selectCity(item)">{{item}}</li>
        </ul>
      </div>
      <div><span>当前定位：</span><span>{{this.$store.state.city}}</span></div>
    </header>

    <!--城市列表-->
    <div id="list" ref="outerBox" class="outerBox">
      <div ref="listBox">
        <ul v-for="(item,index) in this.$store.state.cityList" :index="index">{{item.letter}}
          <li v-for="city in item.list" @click="selectCity(city)">{{city}}</li>
        </ul>
      </div>

    </div>
    <ul class="letterList" ref="letterList" @touchend="touchEnd()">
      <li v-for="(item,index) in this.$store.state.cityList" :index="index">{{item.letter}}</li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "Address",
    components: {},
    data() {
      return {
        value: '',
        onlyCities: '',
        cityTip: []
      }
    },

    methods: {
      selectCity: function (city) {
        this.$store.state.city = city
        this.cityTip=[]
        this.value=''
      },

      //检测是否触摸到字母导航
      //触摸第一下马上跳到相应位置
      //字母列表的index和ul城市列表的index一致就行，所以模板内给字母列表都添加上自定义属性index(vue现在不能用data-设置自定义属性了）
      touchStart() {

        event.preventDefault()
        console.log(event.target.getAttribute("index"))
        let targetIndex = event.target.getAttribute("index")
        console.log(this.$refs.listBox)

        // 计算卷去的总高度
        let sh = 0;
        for (let i = 0; i < targetIndex; i++) {
          sh += this.$refs.listBox.children[i].offsetHeight
          console.log(this.$refs.listBox.children[i].offsetHeight)
        }
        console.log(Math.ceil(sh))
        console.log(sh)
        this.$refs.outerBox.scrollTop = Math.ceil(sh);
        // console.log(this.$refs.outerBox.scrollTop)
      },

      //底部距离55px固定，每个16px，pageY拿到松开时候的Y轴坐标可以算出在第几个字母松开
      touchEnd() {
        // console.log(event.changedTouches[0].pageY)
        let y = event.changedTouches[0].pageY;
        let l = window.innerHeight - y - 55
        // console.log(l)
        let arr = this.$refs.letterList.children
        let sh = 0;
        let targetIndex;
        if (l > 0) {
          targetIndex = arr.length - Math.ceil(l / 16)
        } else {
          //手指拖动到超出最后一个字母的范围
          targetIndex = 21;
        }
        for (let i = 0; i < targetIndex; i++) {
          sh += this.$refs.listBox.children[i].offsetHeight
        }
        this.$refs.outerBox.scrollTop = Math.ceil(sh);


      },

      inputCity(value) {
        this.cityTip = []
        if (value) {
          for (let i = 0; i < this.onlyCities.length; i++) {
            if (PinyinMatch.match(this.onlyCities[i], value)) {
              this.cityTip.push(this.onlyCities[i])
            } else {

            }
          }
        }

      },


    },

    mounted() {
      let arr = [], arr1 = []
      this.axios
        .get('http://localhost:8080/city.json')
        .then(res => (
          console.log("cityJson请求成功"),
            this.$store.state.cityList = res.data,
            arr.push(this.$store.state.cityList.map(function (item) {
              return item["list"]
            })),
            arr[0].map(function (item) {
              item.map(function (item1) {
                arr1.push(item1)
              })
            }),
            this.onlyCities = arr1
        ))
        .catch(function (err) {
          console.log(err);
        })


    }
  }


</script>

<style scoped>
  #city {
    display: flex;
    flex-direction: column;
  }

  header {
    height: 22vw;
  }

  .searchCity input {
    height: 8vw;
    width: 80vw;
    padding: 0 3vw;
    margin-top: 1vw;
    background-color: rgba(208, 208, 208, 0.51);
    font-size: 3.5vw;
  }

  .searchCity ul{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 9.5vw;
    width: 100vw;
    height: 80vh;
    background-color: #ffffff;
    overflow: scroll;
    z-index: 123;
  }

  .searchCity li{
    font-size: 5vw;
  }

  .outerBox{
    position: relative;
  }
  
  #list {
    flex: 1;
    overflow-y: scroll;
    font-size: 18px;
  }


  #list ul {
    padding: 3px 0 2px 3vw;
    text-align: left;
    font-size: 5vw;
  }

  #list ul li{
    padding: 1vw 0 1vw 5vw;
    font-size: 4vw;
  }


  .letterList {
    position: fixed;
    /*top: 27vw;*/
    right: 0;
    /*font-size: 2vh;*/
    font-size: 14px;
    bottom: 55px;
  }

  .letterList li {
    /*height: 2.5vh;*/
    height: 16px;
  }


</style>

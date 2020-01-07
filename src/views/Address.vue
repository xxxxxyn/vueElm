<template>
  <div id="city">
    <header>
      <div><input type="text"></div>
      <div><span>{{this.$store.state.city}}</span></div>
    </header>

    <!--城市列表-->
    <div id="list" ref="outerBox">
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
      return {}
    },

    methods: {
      selectCity: function (city) {
        this.$store.state.city=city
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
        console.log(l)
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


      }


    },

    mounted() {

      this.axios
        .get('http://localhost:8080/city.json')
        .then(res => (
          console.log("cityJson请求成功"),
            this.$store.state.cityList = res.data,
            console.log(this.$store.state.cityList)
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

  input {
    height: 8vw;
    width: 85vw;
    margin-top: 1vw;
    background-color: rgba(208, 208, 208, 0.51);
  }

  #list {
    /*position: absolute;*/
    /*height: calc(100% - 22vw);*/
    /*width: 100vw;*/
    /*overflow: scroll;*/
    /*bottom: 0;*/
    /*left: 50%;*/
    /*-webkit-transform: translate(-50%, 0);*/
    /*-moz-transform: translate(-50%, 0);*/
    /*-ms-transform: translate(-50%, 0);*/
    /*-o-transform: translate(-50%, 0);*/
    /*transform: translate(-50%, 0);*/
    flex: 1;
    overflow-y: scroll;
    font-size: 18px;
    /*height: 700px;*/
    /*overflow: scroll;*/
  }


  #list ul {
    padding: 3px 0 2px 0;
  }

  #list > div {

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

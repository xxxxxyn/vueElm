<template>
  <div>
    <ul>
      <p>{{attr.name}}</p>
      <li v-for="(value,index) in attr.values"
          ref="attr"
          :value="value"
          :class="index===selectedIndex?'activeLi':''"
          @click="attrsValueAdd(attr.name,value,index)">{{value}}
      </li>
    </ul>
  </div>


</template>

<script>
  export default {
    name: "OrderMenuFoodSelect",
    props: {
      attr: ''
    },
    data() {
      return {
        selectedIndex: 0,

      }
    },
    methods: {
      attrsValueAdd: function (arrName, arrValue, index) {
        this.$emit("attrsGetFromChild",arrName, arrValue)
        // this.$set(this.attrsValue, arrName, arrValue)
        console.log(arrName, arrValue)
        console.log(this.attr)
        this.selectedIndex=index
      },

    },
    mounted() {
      //默认就是选中第一个，传给父组件
      this.$emit("attrsGetFromChild",this.attr.name, this.attr.values[0])
    },
  }
</script>

<style scoped>
  li {
    display: inline-block;
    width: 28vw;
    height: 7vw;
    font-size: 3.5vw;
    background-color: rgba(205, 205, 205, 0.51);
    margin-right: 4vw;
    margin-bottom: 3vw;
    text-align: center;
    line-height:7vw ;
  }

  .activeLi {
    background-color: rgba(102, 189, 235, 0.51);
    color: #0268ff;
  }
</style>

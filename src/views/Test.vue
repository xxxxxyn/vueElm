<template>
    <Raf :data="data" :config='config'></Raf>
</template>

<script>
    import Raf from "../components/test/Raf";

    export default {
        name: "Test",
        components:{
            Raf
        },
        data(){
          return{
              data:[['a','b','c'],['a1','b1','c1'],['a2','b2','c2'],['a3','b3','c3']],
              config:{
                  speed:1
              }
          }
        },
    }
</script>

<style scoped>

</style>
<template>
    <CarouselList :data="data"
                  :config='config'
                  ></CarouselList>
</template>

<script>
    // import Raf from "../components/test/Raf";
    import CarouselList from 'vue-carousel-list'
    export default {
        name: "Test",
        components:{
            // Raf
            CarouselList
        },
        data(){
          return{
                data:[
                    ['你好','hello','ciao~'],
                    ['a1','b1','c1'],
                    ['a2','b2','c2'],
                    ['a3','b3','c3']
                ],
                config:{
                    speed:1,
                    clickStop:true,
                    columnWidth:["10vw","50px","80px"],
                    textAlign:["center","left","left"],
                    clickStopTime:'4000',
                    hoverStop:true,
                },
                receiveData:''
            }
        },
    }
</script>

<style scoped>

</style>
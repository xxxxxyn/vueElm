<template>
    <div class="carousel-list">
        <ul class="move-box" ref="moveBox"
            :style="{top:moveCount+'px'}"
            @mouseleave="mouseLeaveHandle"
        >
            <li v-for="(item,indexOut) in data" @click="clickOneLine(indexOut)"
                :class="{'active-carousel-line':activeLine===indexOut,'scroll-line':true}"
                @mouseenter="mouseEnterHandle"
            >
                <span v-for="(itemIn,index) in data[indexOut]"
                      :style="{'width':!!configTrue.columnWidth[index]?configTrue.columnWidth[index]:'60px',
                               'text-align':!!configTrue.textAlign[index]?configTrue.textAlign[index]:'center',}"
                >{{itemIn}}</span>
            </li>
            <li v-for="(item,indexOut) in data"
                @click="clickOneLine(indexOut)"
                :class="{'active-carousel-line':activeLine===indexOut}"
                @mouseenter="mouseEnterHandle"
            >
                <span v-for="(itemIn,index) in data[indexOut]"
                      :style="{'width':!!configTrue.columnWidth[index]?configTrue.columnWidth[index]:'60px',
                               'text-align':!!configTrue.textAlign[index]?configTrue.textAlign[index]:'center',
                }"
                >{{itemIn}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Raf",
        props:{
            data:{
                type: Array,
            },
            config:{
                type: Object,
                speed:{
                    type: Number,
                    default:2,
                    require: false,
                },
                columnWidth:{
                    type:Array,
                    require: false,
                    default() {
                        return [];
                    }
                },
                textAlign:{
                    type:Array,
                    require: false,
                    default() {
                        return [];
                    },
                },
                clickStop:{
                    type:Boolean,
                    default:true,
                },
            }
        },
        data(){
            return{
                step:0,
                moveCount:0,
                oneLoopHeight:0,
                oneLineHeight:0,
                idRAF:'',
                timerPauseAuto:'',
                timerLastStop:'',
                lastClickItem:'',
                activeLine:'',
                isNowClickStop:false
            }
        },
        computed:{
            configTrue(){
                return Object.assign({
                    speed:2,
                    columnWidth: [],
                    textAlign:[],
                    clickStop:true,
                    clickStopTime:'4000',
                    hoverStop:true,
                },this.config);
            }
        },
        created() {
            console.log(this.config)
        },
        mounted() {
            this.$nextTick(()=>{
                this.oneLineHeight=document.getElementsByClassName('scroll-line')[0].offsetHeight
                this.oneLoopHeight=this.$refs.moveBox.offsetHeight / 2
                this.carousel()
            })
        },
        methods:{
            mouseEnterHandle(){
                if(this.configTrue.hoverStop){
                    window.cancelAnimationFrame(this.idRAF)
                }
            },
            mouseLeaveHandle(){
                if(this.configTrue.hoverStop&&!this.isNowClickStop){
                    this.idRAF = requestAnimationFrame(this.carousel)
                }
            },
            carousel() {
                this.isNowClickStop=false
                this.activeLine=''
                if (this.$refs.moveBox.offsetTop > -this.oneLoopHeight-1) {
                    if(this.step===Math.floor(this.oneLineHeight/(this.configTrue.speed*0.5))){
                        window.cancelAnimationFrame(this.idRAF)
                        this.step = 0
                        this.countPause()
                    }else{
                        this.moveCount = this.moveCount - this.configTrue.speed*0.5
                        this.idRAF = requestAnimationFrame(this.carousel)
                        this.step++
                    }
                } else {
                    this.step = 0
                    this.moveCount = 0
                    this.idRAF = requestAnimationFrame(this.carousel)
                }
            },
            countStopRunAgain() {
                let that = this
                clearTimeout(this.timerPauseAuto)
                this.timerLastStop=setTimeout(that.carousel, that.configTrue.clickStopTime)
            },
            countPause() {
                let that = this
                this.timerPauseAuto=setTimeout(that.carousel, '1000')
            },
            clickOneLine(index){
                this.activeLine=index
                if(this.configTrue.clickStop){
                    this.isNowClickStop=true
                    // this.cancelAF()
                    window.cancelAnimationFrame(this.idRAF)
                    if(!!this.timerLastStop){
                        clearTimeout(this.timerLastStop)
                    }
                    this.countStopRunAgain()
                }
                console.log(this.data[index])
                this.$emit('clickcurrent',this.data[index])
            },
        }
    }
</script>

<style scoped>
    .carousel-list {
        display: inline-block;
        width: 250px;
        height: 80px!important;
        top: 20px;
        background: #fffd9c;
        position: relative;
        overflow: hidden;
    }

    .move-box {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        padding: 0;
        margin: 0;
    }

    li {
        display: flex;
        justify-content: space-around;
        height: 20px;
        width: 250px;
    }
    span{
        display: inline-block;
        height: 20px;
        line-height: 20px;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        text-align: center;
    }

    li:hover{
        background: #ffc66c;
    }

    .active-carousel-line{
        background: #ffc66c;
    }
</style>
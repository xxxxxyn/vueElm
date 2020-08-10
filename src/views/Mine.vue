<template>
    <div id="mineBox">
        <div id="pullShow">下拉显示我的</div>
        <div id="nameBox">
            <div class="box1">
                <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1123312599,2853680989&fm=26&gp=0.jpg"
                     alt="">
                <div>{{username}}</div>
                <div>填饱了肚子人就不会空虚</div>
            </div>
            <div class="box2">设置和对话</div>
        </div>
<!--        <div class="mineOneBox">-->
<!--            <h3>我的资产</h3>-->
<!--            <div>-->
<!--                <div>{{coupon}}</div>-->
<!--                <div>红包卡券</div>-->
<!--            </div>-->
<!--            <div>-->
<!--                <div>{{allowance}}</div>-->
<!--                <div>津贴可叠加</div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="mineOneBox">-->
<!--            <span>福利中心</span>-->
<!--            <span>做任务赢奖励</span>-->
<!--        </div>-->
<!--        <div class="mineOneBox">-->
<!--            <h3>常用功能</h3>-->
<!--            <div><span>购物车</span></div>-->
<!--            <div><span>收藏</span></div>-->
<!--            <div><span>地址</span></div>-->
<!--            <div><span>客服</span></div>-->
<!--        </div>-->

        <MineBox></MineBox>

        <NavBar></NavBar>
    </div>
</template>

<script>
    import NavBar from '../components/NavBar'
    import MineBox from '../components/Mine/Box'

    export default {
        name: "Mine",
        components: {
            NavBar,
            MineBox
        },
        data() {
            return {
                username: 'username',
                coupon: 2,
                allowance: 20


            }
        }
    }
</script>

<style scoped>

    #mineBox {
        background-color: rgba(217, 217, 217, 0.3);
    }

    #mineBox .mineOneBox {
        background-color: #ffffff;
        border-radius: 4%;
    }

    #mineBox #pullShow {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff;
        opacity: 0.1;

    }

    #mineBox #nameBox {
        position: relative;
    }

    #nameBox div {
        display: inline-block;
    }

    #nameBox img {
        height: 15vw;
        width: 15vw;
        border-radius: 50%;
    }

    #nameBox .box1 {
        position: relative;
        height: 20vw;
        width: 100vw;
    }

    #nameBox .box1 div:nth-child(2) {
        position: absolute;
        height: 5vw;
        width: 55vw;
        left: 18vw;
        top: 4vw;
    }

    #nameBox .box1 div:nth-child(3) {
        position: absolute;
        height: 5vw;
        width: 55vw;
        left: 18vw;
        top: 13vw;
    }

    #nameBox .box1 img {
        position: absolute;
        left: 2vw;
        top: 2vw;
    }

    #nameBox .box2 {
        position: absolute;
        left: 70vw;
        top: 2vw;
        height: 20vw;
        width: 30vw;
    }

    /*我的资产box*/
    #mineBox .mineOneBox:nth-child(3) {
        height: 20vh;
        width: 100vw;
    }

    #mineBox .mineOneBox h3 {
        text-align: left;
        font-size: 16px;
        font-weight: 700;
        padding: 3vw 0 0 3vw;
    }

    #mineBox .mineOneBox div:nth-child(2) {
        display: inline-block;
        height: 12vh;
        width: 50vw;
    }

    #mineBox .mineOneBox div:nth-child(2) div {
        height: 6vh;
    }

    #mineBox .mineOneBox div:nth-child(3) {
        display: inline-block;
        height: 12vh;
        width: 50vw;
    }

    #mineBox .mineOneBox div:nth-child(3) div {
        height: 6vh;
    }

    /*福利中心*/
    #mineBox .mineOneBox:nth-child(4) {
        position: relative;
        height: 9vh;
        width: 100vw;
    }

    #mineBox .mineOneBox:nth-child(4) span:nth-child(1) {
        position: absolute;
        left: 3vw;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        /*padding: 3vw 0 0 3vw;*/
    }

    #mineBox .mineOneBox:nth-child(4) span:nth-child(2) {
        position: absolute;
        right: 8vw;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        font-size: 14px;
        /*padding: 3vw 0 0 3vw;*/
    }

    /*常用功能*/
    #mineBox .mineOneBox:nth-child(5) {
        height: 20vh;
        width: 100vw;
    }

</style>

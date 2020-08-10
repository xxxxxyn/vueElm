<template>
    <div class="mineOneBox">
        <h3>{{mineBox.title}}</h3>
        <slot></slot>
        <div class="flexContain">
            <div v-for="one in mineBox.btn_group.slice(0,4)"><span>{{one.name}}</span></div>
        </div>
<!--大于4就要有多一行-->
        <div class="flexContain" v-if='mineBox.btn_group[4]'>
            <div v-if='mineBox.btn_group[4]' v-for="one in mineBox.btn_group.slice(4)"><span>{{one.name}}</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MineBox",
        data() {
            return {
                mineBox: {
                    title: '更多推荐',
                    btn_group: [
                        {
                            name: '点餐提醒'
                        },
                        {
                            name: '企业订餐'
                        },
                        {
                            name: '推荐有奖'
                        },
                        {
                            name: '尊享权益'
                        },
                        {
                            name: '商务合作'
                        },
                        {
                            name: '公益3小时'
                        },
                        {
                            name: '骑手招募'
                        },
                        {
                            name: '本地生活大学'
                        },
                    ]

                }


            }
        },

        methods:{
            countRows:function () {
                // 假设最多两行
                if(this.mineBox.btn_group[4]){

                }
            }
        }
    }

</script>

<style scoped>

    .mineOneBox {
        background-color: #ffffff;
    }

    .flexContain {
        display: flex;
        height: 10vh;
    }

    .flexContain div{
        flex:1;
        height: 8vh;
    }




</style>
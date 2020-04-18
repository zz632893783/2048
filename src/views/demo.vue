<template>
    <div class="home">
        <canvas v-bind:width="canvasWidth" v-bind:height="canvasHeight" ref="canvas"></canvas>
        <button v-on:click="createFunc">显现</button>
        <button v-on:click="mergeFunc">合并</button>
        <button v-on:click="moveFunc">随机移动</button>
        <button v-on:click="hideFunc">隐藏</button>
    </div>
</template>

<script>
import Block from '@/lib/block'
export default {
    name: 'Home',
    components: {},
    data: function () {
        return {
            ctx: null,
            canvasWidth: 400,
            canvasHeight: 400,
            block: null
        }
    },
    mounted: function () {
        this.ctx = this.$refs.canvas.getContext('2d')
        this.block = new Block(50, 50, 100, 4, this.ctx)
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.block.next()
            this.block.draw()
        }, 20)
    },
    methods: {
        mergeFunc: function () {
            this.block.shake()
        },
        createFunc: function () {
            this.block.show()
        },
        moveFunc: function () {
            const x = Math.round(this.canvasWidth * Math.random())
            const y = Math.round(this.canvasHeight * Math.random())
            this.block.setPosition(x, y)
        },
        hideFunc: function () {
            this.block.hide()
        }
    }
}
</script>
<style lang="stylus" scoped>
.home {
    canvas {
        border: 1px solid;
    }
}
</style>

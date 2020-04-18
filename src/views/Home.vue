<template>
    <div class="home">
        <canvas v-bind:width="canvasWidth" v-bind:height="canvasHeight" ref="canvas"></canvas>
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
            blockList: [],
            blockSize: 100
        }
    },
    mounted: function () {
        // this.block = new Block(50, 50, 100, 4, this.ctx)
        this.init()
        // this.createBlock()
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.blockList.forEach(block => {
                block.next()
                block.draw()
            })
        }, 20)
        const block1 = new Block(3, 1, this.blockSize, 4, this.ctx)
        block1.show()
        const block2 = new Block(1, 1, this.blockSize, 4, this.ctx)
        block2.show()
        const block3 = new Block(0, 1, this.blockSize, 4, this.ctx)
        block3.value = 16
        block3.show()
        this.blockList.push(block1)
        this.blockList.push(block2)
        this.blockList.push(block3)
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
        },
        init: function () {
            this.ctx = this.$refs.canvas.getContext('2d')
            this.setKeyAction()
        },
        setKeyAction: function () {
            window.onkeydown = event => {
                switch (event.keyCode) {
                case 37:
                    this.leftShift()
                    break
                case 38:
                    this.topShift()
                    break
                case 39:
                    this.rightShift()
                    break
                case 40:
                    this.downShift()
                    break
                }
            }
        },
        createBlock: function () {
            const indexList = this.blockList.map(item => {
                return item.row * 4 + item.col
            })
            const temp = []
            for (let i = 0; i < 16; i++) {
                if (indexList.indexOf(i) < 0) {
                    temp.push(i)
                }
            }
            const index = temp[parseInt(Math.random() * temp.length)]
            console.log(index)
            const row = parseInt(index / 4)
            const col = index % 4
            const block = new Block(col, row, this.blockSize, 4, this.ctx)
            block.show()
            this.blockList.push(block)
        },
        leftShift: function () {
            for (let i = 0; i < 4; i++) {
                const tempList = this.blockList.filter(item => item.row === i)
                tempList.sort((x, y) => x.col - y.col)
                if (tempList.length) {
                    let col = 0
                    for (let j = 0; j < tempList.length; j++) {
                        if (tempList[j].col > col) {
                            tempList[j].setPosition(col, i)
                        }
                        col = col + 1
                    }
                }
            }
        },
        topShift: function () {
            console.log('↑')
        },
        rightShift: function () {
            console.log('→')
        },
        downShift: function () {
            console.log('↓')
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

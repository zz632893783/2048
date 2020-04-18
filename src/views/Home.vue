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
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerWidth,
            blockList: [],
            blockSize: window.innerWidth / 4,
            baseSpeed: window.innerWidth / 20,
            touchData: {
                enable: false,
                clientX: 0,
                clientY: 0
            }
        }
    },
    mounted: function () {
        this.init()
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            this.blockList.forEach(block => {
                block.next()
                block.draw()
            })
            this.blockList = this.blockList.filter(block => !(block.destroy && block.opacity === 0))
        }, 20)
        this.createBlock()
    },
    methods: {
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
                this.blockList.sort((x, y) => x.zIndex - y.zIndex)
                this.check()
            }
            document.addEventListener('touchstart', event => {
                this.touchData.enable = true
                this.touchData.clientX = event.touches[0].clientX
                this.touchData.clientY = event.touches[0].clientY
            })
            document.addEventListener('touchmove', event => {
                if (this.touchData.enable) {
                    const x = this.touchData.clientX - event.touches[0].clientX
                    const y = this.touchData.clientY - event.touches[0].clientY
                    const destance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
                    if (destance > window.innerWidth / 5) {
                        if (Math.abs(x) >= Math.abs(y)) {
                            this.touchData.clientX < event.touches[0].clientX ? this.rightShift() : this.leftShift()
                        } else {
                            this.touchData.clientY < event.touches[0].clientY ? this.downShift() : this.topShift()
                        }
                        this.touchData.enable = false
                    }
                }
            })
            document.addEventListener('touchend', event => {
                this.touchData.enable = false
            })
        },
        createBlock: function () {
            const indexList = this.blockList.filter(item => !item.destroy).map(item => {
                return item.row * 4 + item.col
            })
            const temp = []
            for (let i = 0; i < 16; i++) {
                if (indexList.indexOf(i) < 0) {
                    temp.push(i)
                }
            }
            const index = temp[parseInt(Math.random() * temp.length)]
            const row = parseInt(index / 4)
            const col = index % 4
            const block = new Block(col, row, this.blockSize, this.baseSpeed, this.ctx)
            block.show()
            this.blockList.push(block)
        },
        leftShift: function () {
            let moveEnable = false
            for (let i = 0; i < 4; i++) {
                const tempList = this.blockList.filter(item => item.row === i)
                tempList.sort((x, y) => x.col - y.col)
                if (tempList.length >= 2) {
                    for (let i = 0; i < tempList.length - 1; i++) {
                        if (tempList[i].value === tempList[i + 1].value) {
                            tempList[i].value = tempList[i].value * 2
                            tempList[i].shake()
                            tempList[i + 1].hide()
                            moveEnable = true
                            i = i + 1
                        }
                    }
                }
                if (tempList.length) {
                    let col = 0
                    for (let j = 0; j < tempList.length; j++) {
                        if (tempList[j].destroy) {
                            tempList[j].speed = Math.abs(tempList[j].col - (col - 1)) * this.baseSpeed
                            tempList[j].setPosition(col - 1, i)
                        } else {
                            if (tempList[j].col > col) {
                                moveEnable = true
                                tempList[j].speed = Math.abs(tempList[j].col - col) * this.baseSpeed
                                tempList[j].setPosition(col, i)
                            }
                            col = col + 1
                        }
                    }
                }
            }
            moveEnable && this.createBlock()
        },
        topShift: function () {
            let moveEnable = false
            for (let i = 0; i < 4; i++) {
                const tempList = this.blockList.filter(item => item.col === i)
                tempList.sort((x, y) => x.row - y.row)
                if (tempList.length >= 2) {
                    for (let i = 0; i < tempList.length - 1; i++) {
                        if (tempList[i].value === tempList[i + 1].value) {
                            tempList[i].value = tempList[i].value * 2
                            tempList[i].shake()
                            tempList[i + 1].hide()
                            moveEnable = true
                            i = i + 1
                        }
                    }
                }
                if (tempList.length) {
                    let row = 0
                    for (let j = 0; j < tempList.length; j++) {
                        if (tempList[j].destroy) {
                            tempList[j].speed = Math.abs(tempList[j].row - (row - 1)) * this.baseSpeed
                            tempList[j].setPosition(i, row - 1)
                        } else {
                            if (tempList[j].row > row) {
                                moveEnable = true
                                tempList[j].speed = Math.abs(tempList[j].row - row) * this.baseSpeed
                                tempList[j].setPosition(i, row)
                            }
                            row = row + 1
                        }
                    }
                }
            }
            moveEnable && this.createBlock()
        },
        rightShift: function () {
            let moveEnable = false
            for (let i = 0; i < 4; i++) {
                const tempList = this.blockList.filter(item => item.row === i)
                tempList.sort((x, y) => y.col - x.col)
                if (tempList.length >= 2) {
                    for (let i = 0; i < tempList.length - 1; i++) {
                        if (tempList[i].value === tempList[i + 1].value) {
                            tempList[i].value = tempList[i].value * 2
                            tempList[i].shake()
                            tempList[i + 1].hide()
                            moveEnable = true
                            i = i + 1
                        }
                    }
                }
                if (tempList.length) {
                    let col = 3
                    for (let j = 0; j < tempList.length; j++) {
                        if (tempList[j].destroy) {
                            tempList[j].speed = Math.abs(tempList[j].col - col) * this.baseSpeed
                            tempList[j].setPosition(col, i)
                        } else {
                            if (tempList[j].col < col) {
                                moveEnable = true
                                tempList[j].speed = Math.abs(tempList[j].col - col) * this.baseSpeed
                                tempList[j].setPosition(col, i)
                            }
                            col = col - 1
                        }
                    }
                }
            }
            moveEnable && this.createBlock()
        },
        downShift: function () {
            let moveEnable = false
            for (let i = 0; i < 4; i++) {
                const tempList = this.blockList.filter(item => item.col === i)
                tempList.sort((x, y) => y.row - x.row)
                if (tempList.length >= 2) {
                    for (let i = 0; i < tempList.length - 1; i++) {
                        if (tempList[i].value === tempList[i + 1].value) {
                            tempList[i].value = tempList[i].value * 2
                            tempList[i].shake()
                            tempList[i + 1].hide()
                            moveEnable = true
                            i = i + 1
                        }
                    }
                }
                if (tempList.length) {
                    let row = 3
                    for (let j = 0; j < tempList.length; j++) {
                        if (tempList[j].destroy) {
                            tempList[j].speed = Math.abs(tempList[j].row - row) * this.baseSpeed
                            tempList[j].setPosition(i, row)
                        } else {
                            if (tempList[j].row < row) {
                                moveEnable = true
                                tempList[j].speed = Math.abs(tempList[j].row - row) * this.baseSpeed
                                tempList[j].setPosition(i, row)
                            }
                            row = row - 1
                        }
                    }
                }
            }
            moveEnable && this.createBlock()
        },
        check: function () {
            if (this.blockList.some(item => item.value >= 2048)) {
                return this.$message.success('您赢了')
            }
            const tempList = this.blockList.filter(item => !item.destroy)
            if (tempList.length === 16) {
                let gameOver = true
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 4; j++) {
                        const prev = tempList.find(item => item.col === i && item.row === j)
                        const next = tempList.find(item => item.col === (i + 1) && item.row === j)
                        if (prev.value === next.value) {
                            gameOver = false
                            break
                        }
                    }
                    if (gameOver) {
                        break
                    }
                }
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 3; j++) {
                        const prev = tempList.find(item => item.col === i && item.row === j)
                        const next = tempList.find(item => item.col === i && item.row === (j + 1))
                        if (prev.value === next.value) {
                            gameOver = false
                            break
                        }
                    }
                    if (gameOver) {
                        break
                    }
                }
                if (gameOver) {
                    return this.$message.warning('您输了')
                }
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.home {
    canvas {
        background-color: rgba(#b8ac9f, 0.2);
    }
}
</style>

class Block {
    // x, y 表示的是方块中心位置的坐标
    constructor (col, row, size, speed = 1, ctx) {
        this.col = this.targetCol = col
        this.row = this.targetRow = row
        this.size = size
        this.x = col * this.size + this.size / 2
        this.y = row * this.size + this.size / 2
        this.speed = speed
        this.value = 2
        // 透明度
        this.opacity = 0
        this.opacityTarget = 0
        this.opacitySpeed = 0.4
        // 放大比例，用以控制方块创建时候的显示，方块合并时候的放大缩小效果
        this.scale = 0
        this.scaleTarget = 0
        this.scaleSpeed = 0.01
        // 0 表示方块不缩放，1 表示方块放大，2 表示方块缩小
        this.shakeFlag = 0
        this.ctx = ctx
        this.borderRadius = 10
        this.zIndex = 0
        this.colorMap = {
            2: {
                fontSize: 0.6,
                fontColor: '#746b63',
                blockColor: '#eee2d8'
            },
            4: {
                fontSize: 0.6,
                fontColor: '#756962',
                blockColor: '#ecdec6'
            },
            8: {
                fontSize: 0.6,
                fontColor: '#fcfeff',
                blockColor: '#f0b07a'
            },
            16: {
                fontSize: 0.6,
                fontColor: '#feffff',
                blockColor: '#f39463'
            },
            32: {
                fontSize: 0.6,
                fontColor: '#feffff',
                blockColor: '#fe745e'
            },
            64: {
                fontSize: 0.6,
                fontColor: '#fbffff',
                blockColor: '#f55b39'
            },
            128: {
                fontSize: 0.5,
                fontColor: '#fdffff',
                blockColor: '#eacd71'
            },
            256: {
                fontSize: 0.5,
                fontColor: '#fffcff',
                blockColor: '#ebcb62'
            },
            512: {
                fontSize: 0.65,
                fontColor: '#fcffff',
                blockColor: '#eac550'
            },
            1024: {
                fontSize: 0.4,
                fontColor: '#fcffff',
                blockColor: '#eac550'
            },
            2048: {
                fontSize: 0.4,
                fontColor: '#fcffff',
                blockColor: '#eac550'
            }
        }
    }

    shake () {
        this.shakeFlag = 1
        this.scaleTarget = 1.1
        this.scaleSpeed = 0.02
        this.zIndex = 1
    }

    show () {
        this.opacity = 0
        this.opacityTarget = 1
        this.opacitySpeed = 0.1
        this.scale = 0
        this.scaleTarget = 1
        this.scaleSpeed = 0.1
    }

    hide () {
        this.opacityTarget = 0
        this.opacitySpeed = 0.2
        this.destroy = true
    }

    next () {
        // 计算下一时刻的 x 坐标
        const targetX = this.targetCol * this.size + this.size / 2
        const targetY = this.targetRow * this.size + this.size / 2
        if (this.x < targetX) {
            this.x = (this.x + this.speed < targetX) ? (this.x + this.speed) : targetX
        } else if (this.x > targetX) {
            this.x = (this.x - this.speed > targetX) ? (this.x - this.speed) : targetX
        }
        // 计算下一时刻的 y 坐标
        if (this.y < targetY) {
            this.y = (this.y + this.speed < targetY) ? (this.y + this.speed) : targetY
        } else if (this.y > targetY) {
            this.y = (this.y - this.speed > targetY) ? (this.y - this.speed) : targetY
        }
        // 计算下一时刻的透明度
        if (this.opacity < this.opacityTarget) {
            this.opacity = (this.opacity + this.opacitySpeed < this.opacityTarget) ? (this.opacity + this.opacitySpeed) : this.opacityTarget
        } else if (this.opacity > this.opacityTarget) {
            this.opacity = (this.opacity - this.opacitySpeed > this.opacityTarget) ? (this.opacity - this.opacitySpeed) : this.opacityTarget
        }
        // 计算下一时刻的放大大小
        if (this.scale < this.scaleTarget) {
            this.scale = (this.scale + this.scaleSpeed < this.scaleTarget) ? (this.scale + this.scaleSpeed) : this.scaleTarget
        } else if (this.scale > this.scaleTarget) {
            this.scale = (this.scale - this.scaleSpeed > this.scaleTarget) ? (this.scale - this.scaleSpeed) : this.scaleTarget
        }
        // 如果当前 shakeFlag 是 1，则表示现在是方块合并的时候放大的状态
        if (this.shakeFlag === 1 && this.scale === this.scaleTarget) {
            this.shakeFlag = 2
            this.scaleTarget = 1
        }
        // 如果当前 shakeFlag 是 2，则表示现在是方块合并的时候缩小的状态
        if (this.shakeFlag === 2 && this.scale === this.scaleTarget) {
            this.shakeFlag = 0
        }
        if (this.scale === 1) {
            this.zIndex = 0
        }
    }

    draw () {
        this.ctx.beginPath()
        const size = this.size * this.scale
        const borderRadius = this.borderRadius * this.scale
        const x = this.x - size / 2
        const y = this.y - size / 2
        this.ctx.moveTo(x, y + borderRadius)
        this.ctx.arc(x + borderRadius, y + borderRadius, borderRadius, 2 * Math.PI / 2, 3 * Math.PI / 2)
        this.ctx.lineTo(x + borderRadius, y)
        this.ctx.lineTo(x + size - borderRadius, y)
        this.ctx.arc(x + size - borderRadius, y + borderRadius, borderRadius, 3 * Math.PI / 2, 4 * Math.PI / 2)
        this.ctx.lineTo(x + size, y + borderRadius)
        this.ctx.lineTo(x + size, y + size - borderRadius)
        this.ctx.arc(x + size - borderRadius, y + size - borderRadius, borderRadius, 4 * Math.PI / 2, 5 * Math.PI / 2)
        this.ctx.lineTo(x + size - borderRadius, y + size)
        this.ctx.lineTo(x + borderRadius, y + size)
        this.ctx.arc(x + borderRadius, y + size - borderRadius, borderRadius, 1 * Math.PI / 2, 2 * Math.PI / 2)
        this.ctx.lineTo(x, y + size - borderRadius)
        this.ctx.closePath()
        this.ctx.fillStyle = (this.colorMap[this.value] || {}).blockColor
        this.ctx.globalAlpha = this.opacity
        this.ctx.fill()
        this.ctx.beginPath()
        this.ctx.fillStyle = (this.colorMap[this.value] || {}).fontColor
        this.ctx.closePath()
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = `${((this.colorMap[this.value] || {}).fontSize || 0.4) * this.size * this.scale}px Arial`
        this.ctx.fillText(this.value, this.x, this.y)
    }

    // setPosition (x, y) {
    //     this.targetX = x
    //     this.targetY = y
    // }
    setPosition (targetCol, targetRow) {
        this.targetCol = targetCol
        this.targetRow = targetRow
        this.col = targetCol
        this.row = targetRow
    }

    // dispose () {
    //     this.destroy = true
    // }
}
export default Block

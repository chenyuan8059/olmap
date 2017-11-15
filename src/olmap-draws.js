import ol from "openlayers";
import _ from "lodash";

// 创建默认样式
let createStyle = function( options ){
    return new ol.style.Style(_.extend({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    }, options || {}))
}

// 创建矢量图层
let createVector = function( options ){
    return new ol.layer.Vector(_.extend({
        style: createStyle()
    }, options || {}))
}

// 创建绘图交互对象
let createDraw = function( options ){
    return new ol.interaction.Draw(_.extend({
        name:'olmap_draw_interaction',
        type: 'Point'
    }, options || {}));
}

/**
 * 地图鼠标交互绘制点、线、面、圆和编辑
 */
function Draws( olmap, options ){
    const _this = this
    // 继承 Observable 对象
    ol.Observable.call(this)
    // 是否已经初始化完
    let isInitialize = false 
    // 绘图层
    let drawVector = null
    let drawSource = null
    let drawInteraction = null
    let drawModifyInteraction = null
    // 是否激活状态
    let isActived = false 
    // 是否单个绘制
    let isDrawSingle = true

    // 初始化地图绘制对象
    this.inits = function( handler ){
        // 判断是否已经初始化完成
        if( !drawVector && !isInitialize ){
            // 创建绘图源
            drawSource = new ol.source.Vector({ wrapX: false })
            // 创建绘图层
            drawVector = createVector({ source:drawSource })
            // 将图层添加到地图上
            olmap.layers( drawVector )
        }
        // 调用处理函数
        if( _.isFunction( handler ) )
            handler.call( this, isInitialize )
        // 设置初始化完成标识
        isInitialize = true
        // 初始化画圆
        return this.drawPointer()
    }
    // 绘制点
    this.drawPointer = function( isMultiDraw = false ){
        isDrawSingle = !isMultiDraw
        return initInteraction( 'Point' )
    }
    // 绘制线
    this.drawLine = function( isMultiDraw = false ){
        isDrawSingle = !isMultiDraw
        return initInteraction( 'LineString' )
    }
    // 绘制圆
    this.drawCircle = function( isMultiDraw = false ){
        isDrawSingle = !isMultiDraw
        return initInteraction( 'Circle' )
    }
    // 绘制多边形
    this.drawPolygon = function( isMultiDraw = false ){
        isDrawSingle = !isMultiDraw
        return initInteraction( 'Polygon' )
    }
    // 绘制方形
    this.drawSquare = function(){}
    // 绘制矩形
    this.drawRect = function(){}
    // 绘制六角星
    this.drawStar = function(){}
    // 开启编辑
    this.modify = function(){}
    // 激活绘图状态
    this.active = function( isactive = true ){
        if( isactive ){
            drawInteraction && drawInteraction.setActive( true )
            drawModifyInteraction && drawModifyInteraction.setActive( true )
        } else {
            drawInteraction && drawInteraction.setActive( false )
            drawModifyInteraction && drawModifyInteraction.setActive( false )
        }
        return this
    }
    // 判断是否激活状态
    this.isActive = function(){
        return !!(drawInteraction && drawInteraction.getActive())
    }
    // 是否可连续绘制多个
    this.isMultiDrawing = function(){
        return !isDrawSingle
    }
    // 获取绘图层
    this.layer = function( handler ){
        if( _.isFunction( handler ) ){
            handler.call( this, drawVector )
            return this
        }
        return drawVector
    }
    // 获取绘图源
    this.source = function( handler ){
        if( _.isFunction( handler ) ){
            handler.call( this, drawSource )
            return this
        }
        return drawSource
    }
    // 清空绘图源
    this.clear = function(){
        drawSource.clear()
        return this
    }

    // 初始化地图交互对象
    const initInteraction = function( type ){
        if( drawInteraction )
            olmap.map(map => map.removeInteraction( drawInteraction ))
        // 地图绘图交互对象
        drawInteraction = createDraw({ source:drawSource, type:type })
        // 将交互对象添加到地图
        olmap.interactions( drawInteraction );
        // 事件处理器
        const listener = e => {
            _this.dispatchEvent(e)
            if( isDrawSingle && e.type === 'drawend' )
                setTimeout(() => _this.active( false ), 0)
        }
        // 添加监听事件
        drawInteraction.on('drawstart', listener)
        drawInteraction.on('change', listener)
        drawInteraction.on('drawend', listener)
        drawInteraction.on('propertychange', listener)
        drawInteraction.on('change:active', listener)
        // 返回对象引用
        return _this
    } 
}
ol.inherits(Draws, ol.Observable);

let draws = null

export default function( olmap, options ){
    if( !draws )
        draws = new Draws(olmap, options)
    return draws
}
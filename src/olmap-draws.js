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
let createVector = function( styles ){
    return new ol.layer.Vector({
        style: createStyle(styles)
    })
}

// 创建绘图交互对象
let createDraw = function( options ){
    return new ol.interaction.Draw(_.extend({
        type: 'Circle'
    }, options || {}));
}

/**
 * 地图鼠标交互绘制点、线、面、圆和编辑
 */
function Draws( olmap, options ){
    console.info( '创建地图绘制层' )

    // 绘图层
    let drawVector = null
    let drawSource = null
    let drawInteraction = null




    // 初始化地图绘制
    this.draw = function( callback ){
        if( !drawVector )
            initDraws()
        // 监听绘制事件




        return this
    }
    // 绘制点
    this.drawPointer = function(){}
    // 绘制线
    this.drawLine = function(){}
    // 绘制圆
    this.drawCircle = function(){}
    // 绘制多边形
    this.drawPolygon = function(){}
    // 绘制方形
    this.drawSquare = function(){}
    // 绘制矩形
    this.drawRect = function(){}
    // 绘制六角星
    this.drawStar = function(){}

    // 开启编辑
    this.modify = function(){}

    // 初始化方绘图
    let initDraws = function(){
        // 创建绘图源
        drawSource = new ol.source.Vector()
        // 创建绘图层
        drawVector = createVector({ source:drawSource })
        // 将图层添加到地图上
        olmap.layers( drawVector )
        // 地图绘图交互对象
        drawInteraction = createDraw({ source:drawSource })
        // 将交互对象添加到地图
        olmap.map(map => map.addInteraction(drawInteraction));


        console.info( 'drawInteraction : ', drawInteraction )
    }

}


let draws = null

export default function( olmap, options ){
    if( !draws )
        draws = new Draws(olmap, options)
    return draws
}
import ol from "openlayers";
import AMap from "./layers/sources/amap";

import olmapdraws from "./olmap-draws";
import _ from "lodash";

// 创建地图
let createMap = function(options) {
    return new ol.Map({
        // 地图图层对象
        layers: [
            new ol.layer.Tile({
                name:'高德图层',
                source: new AMap()
            })
        ],
        // 在默认控件
        controls: ol.control.defaults(),
        view: createView({}),
        loadTilesWhileAnimating: true,
        target: "olmap-container"
    });
};

// 坐标转换
let transPointer = function(lng, lat, form, target) {
    return ol.proj.fromLonLat([lng, lat], form, target);
};

// 创建地图交互视图
let createView = function(options) {
    return new ol.View({
        // 指定投影使用 EPSG:4326 坐标系
        projection: "EPSG:4326",
        // 设置地图中心坐标, 
        center: [113.577291,22.271124],
        // 设置地图默认的缩放级别
        zoom: 12,
        // 限制地图缩放最小级别为 3
        minZoom: 3,
        // 限制地图缩放最大级别为 18
        maxZoom: 18
    });
};

// 创建覆盖物
let createOverlay = function( options ){
    return new ol.Overlay(_.extend({
        id:_.uniqueId('overlay-'),
        position:[0, 0],
        autoPan:true
    }, options))
}

// 地图操作对象
function Olmap(options) {

    // 创建地图对象
    let olmap = createMap(options)
    // 获取地图的视图控对象
    const olmapView = olmap.getView();
    
    console.info( 'olmap ：', olmap )
    console.info( 'olmapView : ', olmapView )
    
    // 地图中心点坐标
    let centerPointer = olmapView.getCenter()

    /*==========================<< 地图控制  Start>>==============================*/
    // 设置地图中心点
    this.center = function(lngLat, duration) {
        // 以动画的方式设置地图中心点坐标
        olmapView.animate({
            // 设置中心位置
            center: centerPointer = (lngLat || centerPointer),
            duration: duration || 3000
        });
        return this
    };
    // 放大地图
    this.zoomIn = function(level) {
        // 让地图的zoom增加1，从而实现地图放大
        olmapView.setZoom(level || olmapView.getZoom() + 1);
        return this
    };
    // 缩小地图
    this.zoomOut = function(level) {
        olmapView.setZoom(level || olmapView.getZoom() - 1);
        return this
    };
    // 自适应区域
    this.fit = function(area) {
        if( area && area.length === 4 )
            olmapView.fit(area, olmap.getSize());
        return this
    };
    /*==========================<< 地图控制 End >>==============================*/





    /*==========================<< 地图覆盖物 Start >>==============================*/
    // 获取/添加覆盖物
    this.overlays = function( options ){
        if( options && options.element ){
            // 根据 options 创建覆盖物对象
            let overlay = createOverlay( options )
            // 将覆盖物添加到地图展示
            olmap.addOverlay( overlay )
            // 返回覆盖物对象，以便做其他操作
            return overlay
        }
        return this.getOverlays()
    }
    /*==========================<< 地图覆盖物 End >>==============================*/





    /*==========================<< 地图绘制 Start >>==============================*/
    // 创建地图绘制层
    this.draws = function( options ){
        return olmapdraws( this, options )
    }
    /*==========================<< 地图绘制 End >>==============================*/




    /*==========================<< 地图动画效果 Start >>==============================*/
    this.anim = function(){

    }
    /*==========================<< 地图动画效果 End >>==============================*/





    /*==========================<< 获取地图信息/对象 Start >>==============================*/
    // 获取地图对象
    this.map = function( handler ) {
        if( _.isFunction( handler ) ){
            handler.call( this, olmap )
            return this
        }
        return olmap;
    };
    // 获取地图视图对象
    this.view = function( handler ) {
        if( _.isFunction( handler ) ){
            handler.call( this, olmapView )
            return this
        }
        return olmapView;
    };
    // 获取地图图层
    this.layers = function( layer ){
        if( layer ){
            // 将图层添加到地图
            olmap.addLayer( layer )
            // 返回对象引用
            return this
        }
        return olmap.getLayers()
    }
    // 获取地图控制器
    this.controls = function(){
        return olmap.controls
    }
    // 获取地图使用坐标系对象
    this.projection = function(){
        return olmapView.getProjection()
    }
    // 获取地图容器 DOM 元素
    this.target = function(){
        return olmap.getTargetElement()
    }
    // 获取瓦片图层对象
    this.tiles = function( predicate ){
        return _.chain(this.layers().getArray())
            .filter(layer => layer.type === 'TILE')
            .filter(predicate || (() => true))
            .value()
    }
    // 地图瓦片调试
    this.debug = function(){
        // 获取地图最上层的瓦片层
        var tileLayer = _.last(this.tiles())
        if( !tileLayer ) reutrn
        // 获取地图瓦片数据源
        let tileSource = tileLayer.getSource()
        // 添加一个显示地图瓦片网格的图层
        let tile = new ol.layer.Tile({
            name:'地图瓦片网格',
            source: new ol.source.TileDebug({
                projection: tileSource.getProjection(),
                tileGrid: tileSource.getTileGrid()
            })
        })
        // 添加图层
        return this.layers( tile )
    }
    /*==========================<< 获取地图信息/对象 End >>==============================*/





    /*==========================<< 其他初始化操作 Start >>==============================*/


    /*==========================<< 其他初始化操作 End >>==============================*/
}


export { 
    createMap, 
    createView, 
    createOverlay,

    transPointer, 

    Olmap,
    ol
};

// 默认的地图构造方法
export default function( options ) {

}

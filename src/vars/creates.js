import ol from "openlayers";
import _ from "lodash";

// 创建样式
let createStyle = function() {};

// 创建矢量图层
let createVector = function() {};

// 创建绘图交互对象
let createInteDraw = function() {};

// 创建地图覆盖物对象
let createOverlay = function() {};

// 创建地图视图对象
let createView = function() {};

// 创建地图视图对象
let createMap = function(options) {
    return new ol.Map({
        // 地图图层对象
        layers: [
            new ol.layer.Tile({
                name: "高德图层",
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

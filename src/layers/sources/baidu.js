import ol from "openlayers";
import projzh from "projzh";

/* 
 * projzh处理百度坐标的问题，算法基于proj4m project
 * https://www.versioneye.com/nodejs/projzh/0.5.0
 * https://github.com/tschaub/projzh
 */
let BaiduMap = (ol.source.BaiduMap = function(options) {
    options = options ? options : {};

    let attributions;
    if (options.attributions !== undefined) {
        attributions = option.attributions;
    } else {
        attributions = [ol.source.BaiduMap.ATTRIBUTION];
    }
    let extent = [72.004, 0.8293, 137.8347, 55.8271];
    
    //定义百度坐标
    //地址：https://github.com/openlayers/openlayers/issues/3522
    let baiduMercator = new ol.proj.Projection({
        code: "baidu",
        extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
        units: "m"
    });
    
    ol.proj.addProjection(baiduMercator);
    ol.proj.addCoordinateTransforms(
        "EPSG:4326",
        baiduMercator,
        projzh.ll2bmerc,
        projzh.bmerc2ll
    );
    ol.proj.addCoordinateTransforms(
        "EPSG:3857",
        baiduMercator,
        projzh.smerc2bmerc,
        projzh.bmerc2smerc
    );
    
    let resolutions = (() => {
        let arrs = [],
            maxZoom = 19;
        for (let i = 0; i < maxZoom; i++) {
            arrs[i] = Math.pow(2, (maxZoom - 1) - i);
        }
        return arrs;
    })();
    
    let tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
        extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
        tileSize: [256, 256],
    });

    let satUrls = [0, 1, 2, 3, 4].map(function(sub) {
        return ("http://shangetu" +sub +".map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20150601");
    });
    let urls = [0, 1, 2, 3, 4].map(function(sub) {
        return `http://online`+ sub +`.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20171110&scaler=2&p=1`
        // return ("http://online"+ sub +".map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}&v=009&styles=pl&udt=20170301&scaler=2&p=1");
    });
    ol.source.TileImage.call(this, {
        crossOrigin: "anonymous", //跨域
        cacheSize: options.cacheSize,
        // projection: ol.proj.get('EPSG:3857'),
        projection: "baidu",
        tileGrid: tilegrid,
        tileUrlFunction: function(tileCoord, pixelRatio, proj) {
            if (!tileCoord) return "";

            let z = tileCoord[0];
            let x = tileCoord[1];
            let y = tileCoord[2];
            let hash = (x << z) + y;
            let index = hash % urls.length;
            index = index < 0 ? index + urls.length : index;
            if (options.mapType == "sat") {
                return satUrls[index]
                    .replace("{x}", x)
                    .replace("{y}", y)
                    .replace("{z}", z);
            }
            return urls[index]
                .replace("{x}", x)
                .replace("{y}", y)
                .replace("{z}", z);
        },
        wrapX: options.wrapX !== undefined ? options.wrapX : true
    });
});

ol.inherits(ol.source.BaiduMap, ol.source.TileImage);

ol.source.BaiduMap.ATTRIBUTION = new ol.Attribution({
    html: `&copy; <a class="ol-attribution-baidumap" href="http://map.baidu.com/">百度地图</a>`
});

export default ol.source.BaiduMap;

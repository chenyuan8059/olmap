$(function() {
    console.info("ready");

    // 自定义分辨率和瓦片坐标系
    var resolutions = [];
    var maxZoom = 18;

    // 计算百度使用的分辨率
    for (var i = 0; i <= maxZoom; i++) {
        resolutions[i] = Math.pow(2, maxZoom - i);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0], // 设置原点坐标
        resolutions: resolutions, // 设置分辨率
        tileSize: [256, 256],
        tileSize: 256,
    });

    // 创建百度地图的数据源
    var baiduSource = new ol.source.TileImage({
        projection: "EPSG:3857",
        tileGrid: tilegrid,
        tileSize: 256,
        tileUrlFunction: function(tileCoord, pixelRatio, proj) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
                x = "M" + -x;
            }
            if (y < 0) {
                y = "M" + -y;
            }

            return (
                "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=" +
                x +
                "&y=" +
                y +
                "&z=" +
                z +
                "&styles=pl&udt=20160426&scaler=1&p=1"
            );
        }
    });

    // 百度地图层
    var baiduMapLayer2 = new ol.layer.Tile({
        source: baiduSource
    });

    // 创建地图
    new ol.Map({
        layers: [
            baiduMapLayer2,
            // 添加一个显示Open Street Map地图瓦片网格的图层
            new ol.layer.Tile({
                source: new ol.source.TileDebug({
                    projection: baiduSource.getProjection(),
                    tileGrid: baiduSource.getTileGrid()
                })
            })
        ],
        view: new ol.View({
            // 设置成都为地图中心
            center: ol.proj.transform(
                // [104.06, 30.67],
                [113.585717, 22.30519],
                "EPSG:4326",
                "EPSG:3857"
            ),
            zoom: 12,
            minZoom: 2
        }),
        target: "olmap-container"
    });
});

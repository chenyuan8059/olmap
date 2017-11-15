$(function() {
    console.info("ready");

    var map = new olmap.Olmap({ target:'olmap-container' })

    setTimeout(() => {
        map.center([116.397428, 39.90923])
    }, 3000);

    console.info( '获取地图对象 ：', olmap )
    console.info( '获取地图对象 ：', map.map() )
    console.info( '获取视图对象 ：', map.view() )
    console.info( '获取地图图层 ：', map.layers() )
    console.info( '获取地图控制器 ：', map.controls() )
    console.info( '获取地图容器 ：', map.target() )
    console.info( '获取地图坐标系 ：', map.projection() )
    console.info( '获取瓦片层 ：', map.tiles() )
    console.info( '开启瓦片测试 ：', map.debug() )


    var draws = map.draws()
    console.info( '创建地图绘制层 ：', draws )
    console.info( '开启地图绘制 ：', draws.draw() )


    // 添加覆盖物
    // var anchor = new ol.Overlay({
    //     element:document.getElementById('anchor')
    // })
    // // 关键的一点，需要设置附加到地图上的位置
    // anchor.setPosition([116.397428, 39.90923]);
    // 然后添加到map上
    map.overlays({
        element:document.getElementById('anchor'),
        position:[116.397428, 39.90923]
    })

});

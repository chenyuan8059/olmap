$(function() {
    console.info("ready");

    var map = new olmap.Olmap({ target:'olmap-container' })

    console.info( '获取地图对象 ：', olmap )
    console.info( '获取地图对象 ：', map.map() )
    console.info( '获取视图对象 ：', map.view() )
    console.info( '获取地图图层 ：', map.layers() )
    console.info( '获取地图控制器 ：', map.controls() )
    console.info( '获取地图容器 ：', map.target() )
    console.info( '获取地图坐标系 ：', map.projection() )
    console.info( '获取瓦片层 ：', map.tiles() )
    console.info( '开启瓦片测试 ：', map.debug() )



    // 地图交互
    $('body')
        // 绘图类型
        .on('change', '#draws-mode', e => {
            var draws = map.draws()
            console.info( '创建地图绘制层 ：', draws )
            console.info( '开启地图绘制 ：', draws.draw() )

        })
        // 开启绘图
        .on('click', '#enable-draws', e => {
            // map.draws()
            var draws = map.draws()
                .inits(initialize => {
                    console.info( 'inits : ', initialize );
                })
                .drawLine()
                .active( e.target.checked )
        })
        // 移动中心点
        .on('click', '#move-center', e => {
            map.center([116.397428, 39.90923])
        })
        // 添加覆盖物
        .on('click', '#add-overlay', e => {
            map.overlays({
                element:document.getElementById('anchor'),
                position:[116.397428, 39.90923]
            })
        })

});

import ol from "openlayers";

let projection = ol.proj.get("EPSG:3857");
let resolutions = [];
let maxZoom = 19;

for (var i = 0; i < maxZoom; i++) {
    resolutions[i] = Math.pow(2, (maxZoom - 1) - i);
}
let tilegrid = new ol.tilegrid.TileGrid({
    origin: [0, 0],
    resolutions: resolutions
});

let baidu_source = new ol.source.TileImage({
    projection: projection,
    tileGrid: tilegrid,
    tileUrlFunction: function(tileCoord, pixelRatio, proj) {
        if (!tileCoord) {
            return "";
        }
        let z = tileCoord[0];
        let x = tileCoord[1];
        let y = tileCoord[2];

        if (x < 0) {
            x = "M" + -x;
        }
        if (y < 0) {
            y = "M" + -y;
        }

        return `http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20151021&scaler=1&p=1`;
    }
});

export default new ol.layer.Tile({
    source: baidu_source
});

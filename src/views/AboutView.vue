<script setup lang="ts">
//您好，参考截图，可以试下如下：
var mouseTool = new AMap.MouseTool(map);
var text;

//监听draw事件可获取画好的覆盖物
mouseTool.on('draw', function (e) {

  var overlay = e.obj;

  if (overlay.CLASS_NAME === 'Overlay.Polygon') {

    const path = overlay.getPath();

    var convertedLocations = path.map(function (location) {
      return [location.lng, location.lat];
    });

    text = new AMap.Text({
      position: convertedLocations[0],
      text: '区域面积' + ringArea(convertedLocations) + '平方米',
      offset: new AMap.Pixel(-20, -40)
    })
    map.add(text);
  }

  overlay.on('rightclick', function () {
    // 判断覆盖物类型
    if (overlay.CLASS_NAME === 'Overlay.Polygon') {
      var gonEditor = new AMap.PolygonEditor(map, overlay);

      gonEditor.open()

      gonEditor.on('adjust', function (e) {

        var convert = e.target.getPath().map(function (location) {
          return [location.lng, location.lat];
        });

        text.setText('区域面积' + ringArea(convert) + '平方米')
        text.setPosition(convert[0])


      })

    }

  })


})


function ringArea(Locations) {
  // 计算区域面积
  var area = Math.round(AMap.GeometryUtil.ringArea(Locations));
  return area;
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

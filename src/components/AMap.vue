<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'

declare global {
  interface Window {
    _AMapSecurityConfig: any;
  }
}

let map: AMap.Map | null = null

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "db0fece5e68ddfcb041edbc7c6a454f5",
  };
  AMapLoader.load({
    key: 'aec583ffb42668304d01746bc91fe09f',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.Geolocation'],
  }).then((AMap) => {
    map = new AMap.Map('container', {
      viewMode: '2D',
      zoom: 12,
      center: [116.397428, 39.90923],
    })
    const toolBar = new AMap.ToolBar()
    const scale = new AMap.Scale()
    const maptype = new AMap.MapType()
    const geolocation = new AMap.Geolocation({ convert: false, GeoLocationFirst: true, enableHighAccuracy: true })
    map?.addControl(toolBar)
    map?.addControl(scale)
    map?.addControl(maptype)
    map?.addControl(geolocation)
  })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div id="container"></div>
</template>

<style scoped lang="less">
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100vh;
  color: black;
}
</style>
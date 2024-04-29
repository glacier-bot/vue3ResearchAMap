<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { Plus } from '@element-plus/icons-vue'

declare global {
  interface Window {
    _AMapSecurityConfig: any;
  }
}
const props = defineProps(['newLng', 'newLat']) //{ newLng: String, newLat: String }
const overlays = ref<any[]>([])

let map: AMap.Map | null = null
// console.log('运行setup')

const Ddraw = (e: MouseEvent) => { (window as any).myDraw(e) }

watch(
  props, (newVal) => {
    //   console.log('newVal: ', newVal)
    if (!newVal) return
    const newLocation = [parseFloat(props.newLng), parseFloat(props.newLat)]
    AMap.convertFrom(newLocation, 'gps', (status: string, result: { info: string, locations: Array<{ lng: number, lat: number }> }) => {
      if (status === 'complete') {
        if (result.info === 'ok') {
          const deltaLat = 31.343713 - 31.138115
          const deltaLng = 121.269525 - 121.104609
          const optLocation: [number, number] = [result.locations[0].lng + deltaLng, result.locations[0].lat + deltaLat]
          map?.panTo(optLocation)
          map?.add(
            new AMap.Marker({ position: optLocation })
          )
        }
      }
    })
  }
)

// const handleMapClick = () => {
//   // [121.269525, 31.343713] //正确位置
//   // [121.104609, 31.138115] //错误位置
//   AMap.convertFrom([props.newLng, props.newLat], 'gps', (status: string, result: { info: string, locations: Array<{ lng: number, lat: number }> }) => {
//     // console.log('status: ', status)
//     if (status === 'complete') {
//       // console.log(result)
//       if (result.info === 'ok') {
//         const deltaLat = 31.343713 - 31.138115
//         const deltaLng = 121.269525 - 121.104609
//         const optLocation: [number, number] = [result.locations[0].lng + deltaLng, result.locations[0].lat + deltaLat]
//         // console.log(result.locations[0].pos[0] / 100000)
//         // console.log([result.locations[0].lng, result.locations[0].lat])
//         map?.panTo(optLocation)
//         // map?.panTo([121.269525, 31.343713])
//         // convertLngLat = [result.locations[0].lng, result.locations[0].lat]
//         map?.add(
//           new AMap.Marker({ position: optLocation })
//         )
//       }
//     } else {
//       console.log('error status: ', status)
//     }
//   })
// }

onMounted(() => {
  // console.log('运行加载')
  window._AMapSecurityConfig = {
    securityJsCode: "db0fece5e68ddfcb041edbc7c6a454f5",
  };
  AMapLoader.load({
    key: 'aec583ffb42668304d01746bc91fe09f',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.MouseTool'],
  }).then((AMap) => {
    map = new AMap.Map('container', {
      viewMode: '2D',
      zoom: 12,
      center: [116.397428, 39.90923],
    })
    const toolBar = new AMap.ToolBar()
    const scale = new AMap.Scale()
    const maptype = new AMap.MapType()
    const mouseTool = new AMap.MouseTool(map)
    // const geolocation = new AMap.Geolocation({ convert: false, GeoLocationFirst: true, enableHighAccuracy: true })
    const draw = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      console.log('click draw: ', target.classList)
      switch (true) {
        case target.classList.contains('marker'): {
          console.log('draw marker')
          mouseTool.marker()
          break
        }
        case target.classList.contains('polyline'): {
          mouseTool.polyline({
            strokeColor: '#80d8ff'
          })
          break
        }
        case target.classList.contains('polygon'): {
          mouseTool.polygon({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff'
          });
          break;
        }
        case target.classList.contains('rectangle'): {
          mouseTool.rectangle({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff'
          });
          break;
        }
        case target.classList.contains('circle'): {
          mouseTool.circle({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff'
          });
          break;
        }
      }
    }
    (window as any).myDraw = draw
    map?.addControl(toolBar)
    map?.addControl(scale)
    map?.addControl(maptype)
    // map?.addControl(geolocation)
    // map?.add(new AMap.Marker({ position: [116.397428, 39.90923] }))
    mouseTool.on('draw', (e: { obj: Object }) => {
      console.log('draw e: ', e)
      overlays.value.push(e.obj)
      console.log(overlays.value)
    })
  })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div class="radio">
    <el-button class="marker" type="primary" @click="Ddraw">绘制点</el-button>
  </div>
  <el-button type="primary" :icon="Plus" circle />
  <div id="container" />
</template>

<style scoped lang="less">
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100vh;
  color: black;
}

.el-button {
  top: 10px;
  left: 80px;
  position: absolute;
  z-index: 1;
}

.radio {
  position: absolute;
  top: 50px;
  left: 0px;
  z-index: 1;
}
</style>
<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
// import { Plus } from '@element-plus/icons-vue'
import SwitchButtons from './buttons/SwitchButtons.vue'
import ArrowButtons from '../components/buttons/ArrowButtons.vue'
import OverlayWithRemarks from './classes/OverlayWithRemarks'

// 待办：1.在marker上右键没用，打不开菜单；2.删除显示面积的文本标签后，无法再次添加
// 功能：1.自定义覆盖物的属性，2.在页面下方显示状态栏，动态更新定位点与覆盖物之间的关系
// bug: 1.矩形、多边形、圆形的面积显示有问题

declare global {
  interface Window {
    _AMapSecurityConfig: any;
  }
  interface mouseDrawEventCallbck {
    obj: {
      CLASS_NAME: string,
      _amap_id: number,
      on: (event: string, f: Function) => void,
      getBounds: () => { northEast: { lat: number, lng: number } },
      getPosition: () => [number, number],
      setExtData: (ext: any) => void,
      getExtData: () => any,
      setMap: (map: any) => void,
      getPath: () => any,
      getCenter: () => any,
      getRadius: () => number,
    }
  }
}

const props = defineProps(['newLng', 'newLat', 'drawStatus']) //{ newLng: String, newLat: String }
let overlays: any[] = []
const ifEdit = ref(false)
const optLocation = ref<[number, number]>([0, 0])
let arrOverlayWithRemarks: any[] = []
const ifFirstLocation = ref(true)
const startLng=ref(0)
const startLat=ref(0)
const endLng=ref(0)
const endLat=ref(0)
const deltaLat=ref(0)
const deltaLng=ref(0)
// const locationMarker = new window.AMap.Marker({})

let map: AMap.Map | null = null
let locationMarker: AMap.Marker | null = null

// console.log('运行setup')

const Ddraw = (e: string) => { (window as any).myMapTools.draw(e) }
const DcloseMouseTool = () => { (window as any).myMapTools.closeMouseTool(false) }
const removeOverlay = () => { (window as any).myMapTools.removeOverlay() }
const closeMouseTool = () => { (window as any).myMapTools.closeMouseTool(true) }

const handleSwitchChange = (e: { name: string, status: boolean }) => {
  // console.log('switch changed: ', e)
  DcloseMouseTool()
  if (e.status) { Ddraw(e.name) }
}
const handleClearClick = (e: boolean) => {
  if (e) {
    // console.log('clear overlay')
    closeMouseTool()
    removeOverlay()
  }
}
const handleArrowUp = () => {
  console.log('up')
  // optLocation.value = [optLocation.value[0], optLocation.value[1] + 0.0001]
  if(!locationMarker) return
  const lnglat = locationMarker.getPosition()
  if(!lnglat) return
  optLocation.value=[lnglat.lng,lnglat.lat+0.0001]
  locationMarker?.setPosition(optLocation.value)
  distanceOverlays()
}
const handleArrowDown = () => {
  console.log('down')
  // optLocation.value = [optLocation.value[0], optLocation.value[1] - 0.0001]
  if(!locationMarker) return
  const lnglat = locationMarker.getPosition()
  if(!lnglat) return
  optLocation.value=[lnglat.lng,lnglat.lat-0.0001]
  locationMarker?.setPosition(optLocation.value)
  distanceOverlays()
}
const handleArrowLeft = () => {
  console.log('left')
  // optLocation.value = [optLocation.value[0] - 0.0001, optLocation.value[1]]
  if(!locationMarker) return
  const lnglat = locationMarker.getPosition()
  if(!lnglat) return
  optLocation.value=[lnglat.lng-0.0001,lnglat.lat]
  locationMarker?.setPosition(optLocation.value)
  distanceOverlays()
}
const handleArrowRight = () => {
  console.log('right')
  // optLocation.value = [optLocation.value[0] + 0.0001, optLocation.value[1]]
  if(!locationMarker) return
  const lnglat = locationMarker.getPosition()
  if(!lnglat) return
  optLocation.value=[lnglat.lng+0.0001,lnglat.lat]
  locationMarker?.setPosition(optLocation.value)
  distanceOverlays()
}
const distanceOverlays = () => {
  // console.log('distance overlays: ', overlays.value)
  if (!overlays) return
  overlays.forEach((overlay) => {
    // console.log('overlay class name: ', overlay.className)
    switch (overlay.className) {
      case 'AMap.Marker': {
        //计算两点之间的距离
        const pointDistance = AMap.GeometryUtil.distance(locationMarker?.getPosition() as any, overlay.obj.getPosition())
        console.log('pointDistance: ', pointDistance)
        break
      }
      case 'Overlay.Polyline': {
        //计算点到直线的距离
        const lineDistance = AMap.GeometryUtil.distanceToLine(locationMarker?.getPosition() as any, overlay.obj.getPath())
        console.log('lineDistance: ', lineDistance)
        break
      }
      case 'Overlay.Circle': {
        //计算点到圆心的距离与圆半径的关系
        const toCircleCenter = AMap.GeometryUtil.distance(locationMarker?.getPosition() as any, overlay.obj.getCenter())
        const pointCircle = toCircleCenter - overlay.obj.getRadius() <= 0 ? true : false
        // console.log('toCircleCenter: ', toCircleCenter)
        // console.log('radius: ', overlay.getRadius())
        console.log('pointCircle: ', pointCircle)
        break
      }
      default: {
        //判断是否在区域内
        const pointRing = AMap.GeometryUtil.isPointInRing(locationMarker?.getPosition() as any, overlay.obj.getPath())
        console.log('pointRing: ', pointRing)
        break
      }
    }
  })
}
watch(
  props, (newVal) => {
    //   console.log('newVal: ', newVal)
    if (!newVal) return
    // ifEdit.value = newVal.drawStatus === 'selected' ? true : false
    switch (newVal.drawStatus) {
      case 'location': {
        ifEdit.value = false
        break
      }
      case 'selected': {
        ifEdit.value = true
        break
      }
      case 'settings': {
        ifEdit.value = false
        break
      }
    }
    // console.log('ifEdit: ', ifEdit.value)
    if (newVal.newLng * newVal.newLat === 0) return
    const newLocation = [parseFloat(newVal.newLng), parseFloat(newVal.newLat)]
    if (newVal.drawStatus !== "location") return

    AMap.convertFrom(newLocation, 'gps', (status: string, result: { info: string, locations: Array<{ lng: number, lat: number }> }) => {
      if (status === 'complete') {
        if (result.info === 'ok') {
          // const deltaLat = 0//31.343713 - 31.138115  新值减旧值
          // const deltaLng = 0//121.269525 - 121.104609 新值减旧值
          optLocation.value = [result.locations[0].lng + deltaLng.value, result.locations[0].lat + deltaLat.value]
          map?.panTo(optLocation.value)
          map?.setZoom(16)
          locationMarker?.setPosition(optLocation.value)
          if (!locationMarker) { return }
          map?.add(
            locationMarker
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
  deltaLat.value = 0
  deltaLng.value = 0
  window._AMapSecurityConfig = {
    securityJsCode: "db0fece5e68ddfcb041edbc7c6a454f5",
  };
  AMapLoader.load({
    key: 'aec583ffb42668304d01746bc91fe09f',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.RectangleEditor', 'AMap.CircleEditor'],
  }).then((AMap) => {
    map = new AMap.Map('container', {
      viewMode: '2D',
      zoom: 12,
      center: [116.397428, 39.90923],
      showIndoorMap: true,
    })
    const toolBar = new AMap.ToolBar()
    const scale = new AMap.Scale()
    const maptype = new AMap.MapType()
    const mouseTool = new AMap.MouseTool(map)

    locationMarker = new AMap.Marker({
      position: optLocation.value,
      icon: new AMap.Icon({
        image: '../public/map-158493_1280.png',
        imageSize: new AMap.Size(18, 28),
      }),
      draggable: true
    })
    locationMarker?.on('dragstart',(e:any)=>{
      if(ifFirstLocation.value){
        // console.log('dragstart e: ',e.lnglat.lat)
        startLng.value = e.lnglat.lng
        startLat.value = e.lnglat.lat
        ifFirstLocation.value = false
      }
    })
    locationMarker?.on('dragend',(e:any)=>{
      // console.log('dragend e: ',e)
      endLng.value = e.lnglat.lng
      endLat.value = e.lnglat.lat
      deltaLng.value = endLng.value - startLng.value
      deltaLat.value = endLat.value - startLat.value
      console.log('deltaLng: ',deltaLng.value)
      console.log('deltaLat: ',deltaLat.value)
    })
    locationMarker?.on('rightclick',()=>{
      locationMarker?.setDraggable(false)
    })
    // const aContextMenu = new AMap.ContextMenu()
    // aContextMenu.addItem('删除覆盖物', () => { (window as any).myOverlayTools.removeOverlay() }, 0)
    // const geolocation = new AMap.Geolocation({ convert: false, GeoLocationFirst: true, enableHighAccuracy: true })
    const changeLastOverlay = () => {
      const lastOverlay = overlays[overlays.length - 1]
      const overlayWithRemarks = new OverlayWithRemarks(map, lastOverlay)
      arrOverlayWithRemarks.push(overlayWithRemarks)
    }
    const draw = (e: string) => {
      switch (e) {
        case 'value1': {
          // console.log('draw marker')
          mouseTool.marker({ draggable: true })
          break
        }
        case 'value2': {
          mouseTool.polyline({
            strokeColor: '#80d8ff'
          })
          break
        }
        case 'value3': {
          mouseTool.polygon({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff',
            draggable: true,
            cursor: 'default'
          });
          break;
        }
        case 'value4': {
          mouseTool.rectangle({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff'
          });
          break;
        }
        case 'value5': {
          mouseTool.circle({
            fillColor: '#00b0ff',
            strokeColor: '#80d8ff'
          });
          break;
        }
      }
    }
    const closeMouseTool = (b: boolean = false) => { mouseTool.close(b) }
    // const afterContextClick = () => { aContextMenu.close() }
    // document.addEventListener('click', afterContextClick)
    const removeOverlay = () => {
      // console.log('remove overlay')
      // map?.remove(overlays.value)
      arrOverlayWithRemarks.forEach((overlay) => {
        overlay.editor.close()
        overlay.destructor()
        overlay = null
      })
      arrOverlayWithRemarks = []
      map?.clearMap()
      overlays = []
    }
    (window as any).myMapTools = {
      draw: draw,
      closeMouseTool: closeMouseTool,
      removeOverlay: removeOverlay,
    }
    map?.addControl(toolBar)
    map?.addControl(scale)
    map?.addControl(maptype)
    // map?.addControl(geolocation)
    // map?.add(new AMap.Marker({ position: [116.397428, 39.90923] }))
    mouseTool.on('draw', (e: mouseDrawEventCallbck) => {
      overlays.push(e)
      // console.log(overlays.value.length)
      changeLastOverlay()
    })
  })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div class="arrow">
    <ArrowButtons @on-arrow-up="handleArrowUp" @on-arrow-down="handleArrowDown" @on-arrow-left="handleArrowLeft"
      @on-arrow-right="handleArrowRight" />
  </div>
  <div v-show="ifEdit" class="radio">
    <!-- <el-button class="marker" type="primary" @click="Ddraw">绘制点</el-button> -->
    <SwitchButtons @on-switch-changed="handleSwitchChange" @on-clear-click="handleClearClick" />
  </div>
  <!-- <el-button type="primary" :icon="Plus" circle /> -->
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
  left: 170px;
  position: absolute;
  z-index: 1;
}

.radio {
  // display: none;
  position: absolute;
  top: 50px;
  left: 170px;
  z-index: 1;
}

.arrow {
  top: 230px;
  position: absolute;
  z-index: 1;
}
</style>
// const drawtest = (e: MouseEvent) => {
// const target = e.target as HTMLElement
// console.log('click draw: ', target.classList)
// switch (true) {
// case target.classList.contains('marker'): {
// console.log('draw marker')
// mouseTool.marker()
// break
// }
// case target.classList.contains('polyline'): {
// mouseTool.polyline({
// strokeColor: '#80d8ff'
// })
// break
// }
// case target.classList.contains('polygon'): {
// mouseTool.polygon({
// fillColor: '#00b0ff',
// strokeColor: '#80d8ff'
// });
// break;
// }
// case target.classList.contains('rectangle'): {
// mouseTool.rectangle({
// fillColor: '#00b0ff',
// strokeColor: '#80d8ff'
// });
// break;
// }
// case target.classList.contains('circle'): {
// mouseTool.circle({
// fillColor: '#00b0ff',
// strokeColor: '#80d8ff'
// });
// break;
// }
// }
// }
<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { Plus } from '@element-plus/icons-vue'
import SwitchButtons from './buttons/SwitchButtons.vue'

declare global {
  interface Window {
    _AMapSecurityConfig: any;
  }
  interface mouseToolEvent {
    obj: {
      CLASS_NAME: string,
      on: (event: string, f: Function) => void,
      getBounds: () => { northEast: { lat: number, lng: number } },
      getPosition: () => [number, number]
    }
  }
}
const props = defineProps(['newLng', 'newLat', 'drawStatus']) //{ newLng: String, newLat: String }
const overlays = ref<any[]>([])
const ifEdit = ref(false)
const overlayEditor = ref(false)

let map: AMap.Map | null = null
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
    console.log('clear overlay')
    closeMouseTool()
    removeOverlay()
  }
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
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.RectangleEditor', 'AMap.CircleEditor'],
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
    // const aContextMenu = new AMap.ContextMenu()
    // aContextMenu.addItem('删除覆盖物', () => { (window as any).myOverlayTools.removeOverlay() }, 0)
    const editorMap = {
      'Overlay.Polygon': AMap.PolyEditor,
      'Overlay.Polyline': AMap.PolyEditor,
      'Overlay.Rectangle': AMap.RectangleEditor,
      'Overlay.Circle': AMap.CircleEditor
    }
    // const geolocation = new AMap.Geolocation({ convert: false, GeoLocationFirst: true, enableHighAccuracy: true })
    const draw = (e: string) => {
      switch (e) {
        case 'value1': {
          // console.log('draw marker')
          mouseTool.marker()
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
            strokeColor: '#80d8ff'
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
      console.log('remove overlay')
      map?.remove(overlays.value)
      overlays.value = []
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
    mouseTool.on('draw', (e: mouseToolEvent) => {
      // console.log('draw e: ', e)
      overlays.value.push(e.obj)
      console.log('overlays: ', overlays.value)
      const removeOverlay = () => { map?.remove(e.obj as typeof overlays.value[0]) }
      (window as any).myOverlayTools = { removeOverlay: removeOverlay }
      const Editor = editorMap[e.obj.CLASS_NAME as keyof typeof editorMap]
      if (Editor) {
        const overlayEditorTool = new Editor(map, e.obj)
        e.obj.on('click', () => {
          overlayEditor.value = !overlayEditor.value
          if (overlayEditor.value) {
            overlayEditorTool.open()
          } else {
            overlayEditorTool.close()
          }
        })
        e.obj.on('rightclick', () => {
          map?.remove(e.obj as typeof overlays.value[0])
          // 待办：在marker上右键打不开菜单
          // console.log('right click', e.obj.getPosition())
          // if (e.obj.CLASS_NAME === 'AMap.Marker') {
          //   aContextMenu.open(map, e.obj)
          // } else {
          //   aContextMenu.open(map, [e.obj.getBounds().northEast.lng, e.obj.getBounds().northEast.lat])
          // }
          // aContextMenu.open(map, [e.obj.getBounds().northEast.lng, e.obj.getBounds().northEast.lat])
        })
      }
      // 被上面的if代替
      // switch (e.obj.CLASS_NAME) {
      //   case 'Overlay.Polygon' || 'Overlay.Polyline': {
      //     const overlayEditorTool = new AMap.PolyEditor(map, e.obj)
      //     e.obj.on('rightclick', () => {
      //       overlayEditor.value = !overlayEditor.value
      //       if (overlayEditor.value) {
      //         overlayEditorTool.open()
      //       } else {
      //         overlayEditorTool.close()
      //       }
      //     })
      //     break
      //   }
      //   case 'Overlay.Rectangle': {
      //     const overlayEditorTool = new AMap.RectangleEditor(map, e.obj)
      //     e.obj.on('rightclick', () => {
      //       overlayEditor.value = !overlayEditor.value
      //       if (overlayEditor.value) {
      //         overlayEditorTool.open()
      //       } else {
      //         overlayEditorTool.close()
      //       }
      //     })
      //     break
      //   }
      //   case 'Overlay.Circle': {
      //     const overlayEditorTool = new AMap.CircleEditor(map, e.obj)
      //     e.obj.on('rightclick', () => {
      //       overlayEditor.value = !overlayEditor.value
      //       if (overlayEditor.value) {
      //         overlayEditorTool.open()
      //       } else {
      //         overlayEditorTool.close()
      //       }
      //     })
      //     break
      //   }
      // }
    })
  })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div v-show="ifEdit" class="radio">
    <!-- <el-button class="marker" type="primary" @click="Ddraw">绘制点</el-button> -->
    <SwitchButtons @on-switch-changed="handleSwitchChange" @on-clear-click="handleClearClick" />
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
<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { Aim } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'
import SwitchButtons from './buttons/SwitchButtons.vue'
import ArrowButtons from '../components/buttons/ArrowButtons.vue'
import OverlayWithRemarks from './classes/OverlayWithRemarks'
import PropertyBoxPolygon from './dialogs/PropertyBoxPolygon.vue'

// 功能：1.定位点的轨迹追踪和显示；2.多选查找结果或者选择一个结果可以直接缩放到对应位置；3.使用方向键控制定位成功后返回的定位点（优先解决）

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

const props = defineProps(['drawStatus', 'selectTime', 'menuWidth'])

const emit = defineEmits({
  'onDistanceTrigger': (payload: any) => payload,
  'onOverlayDataEmit': (payload: any) => payload,
})

let overlays: any[] = []
const ifEdit = ref(false)
const triggerLocation = ref(false)
const triggerType = ref('primary')
const refreshId = ref(0)
const buttonRef = ref()
const popoverRef = ref()
let arrOverlayWithRemarks: any[] = []
const deltaLat = ref(0)
const deltaLng = ref(0)
const menuWidthVal = ref('300px')
// const radioRef = ref()

let map: AMap.Map | null = null
let currentLocation = ref<AMap.LngLat | null>(null)


const polygonAttrDialog = ref(false)
const handlePolygonAttrDialog = () => {
  polygonAttrDialog.value = true
  console.log('调用handlePolygonAttrDialog', polygonAttrDialog.value)
}
const polygonAttrs = ref({
  id: '114514',
  type: 'polygon',
  name: 'testName',
  remarks: 'testRemarks',
  ifFillColor: true,
  fillColor: '#00B2D5',
  opacity: 1,
})
const setPolygonAttrName = (e: any) => {
  polygonAttrs.value.id = e.id
  polygonAttrs.value.type = e.type
  polygonAttrs.value.name = e.name
  polygonAttrs.value.remarks = e.remarks
  polygonAttrs.value.ifFillColor = e.ifFillColor
  polygonAttrs.value.fillColor = e.fillColor
  polygonAttrs.value.opacity = e.opacity
}
const handlePolygonAttrs = (e: any) => {
  polygonAttrs.value.name = e.name
  polygonAttrs.value.remarks = e.remarks
  polygonAttrs.value.ifFillColor = e.ifFillColor
  polygonAttrs.value.fillColor = e.fillColor
  polygonAttrs.value.opacity = e.opacity
  arrOverlayWithRemarks.forEach((overlay) => {
    overlay.sendAttrs(polygonAttrs.value)
  })
}

// console.log('运行setup')

const Ddraw = (e: string) => { (window as any).myMapTools.draw(e) }
const DcloseMouseTool = () => { (window as any).myMapTools.closeMouseTool(false) }
const removeOverlay = () => { (window as any).myMapTools.removeOverlay() }
const closeMouseTool = () => { (window as any).myMapTools.closeMouseTool(true) }
const refreshGeolocationFrequently = () => { return (window as any).myMapTools.refreshGeolocationFrequently() }

const handleRealtimeLocationClick = () => {
  triggerLocation.value = !triggerLocation.value
  if (triggerLocation.value) {
    triggerType.value = 'danger'
    refreshId.value = refreshGeolocationFrequently()
  } else {
    triggerType.value = 'primary'
    clearInterval(refreshId.value)
  }
}
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
    updateArr()
    emit('onOverlayDataEmit', [])
  }
}
const handleArrowUp = () => {
  console.log('up')
  // optLocation.value = [optLocation.value[0], optLocation.value[1] + 0.0001]
  // if (!locationMarker) return
  // const lnglat = locationMarker.getPosition()
  // if (!lnglat) return
  // optLocation.value = [lnglat.lng, lnglat.lat + 0.0001]
  // locationMarker?.setPosition(optLocation.value)
  // distanceOverlays()
}
const handleArrowDown = () => {
  console.log('down')
  // optLocation.value = [optLocation.value[0], optLocation.value[1] - 0.0001]
  // if (!locationMarker) return
  // const lnglat = locationMarker.getPosition()
  // if (!lnglat) return
  // optLocation.value = [lnglat.lng, lnglat.lat - 0.0001]
  // locationMarker?.setPosition(optLocation.value)
  // distanceOverlays()
}
const handleArrowLeft = () => {
  console.log('left')
  // optLocation.value = [optLocation.value[0] - 0.0001, optLocation.value[1]]
  // if (!locationMarker) return
  // const lnglat = locationMarker.getPosition()
  // if (!lnglat) return
  // optLocation.value = [lnglat.lng - 0.0001, lnglat.lat]
  // locationMarker?.setPosition(optLocation.value)
  // distanceOverlays()
}
const handleArrowRight = () => {
  console.log('right')
  // optLocation.value = [optLocation.value[0] + 0.0001, optLocation.value[1]]
  // if (!locationMarker) return
  // const lnglat = locationMarker.getPosition()
  // if (!lnglat) return
  // optLocation.value = [lnglat.lng + 0.0001, lnglat.lat]
  // locationMarker?.setPosition(optLocation.value)
  // distanceOverlays()
}

const distanceOverlays = () => {
  // console.log('distance overlays: ', overlays.value)
  if (!arrOverlayWithRemarks) return
  arrOverlayWithRemarks.forEach((wrappedOverlay) => {
    // console.log('overlay class: ', wrappedOverlay)
    switch (wrappedOverlay.overlay.obj.CLASS_NAME) {
      case 'AMap.Marker': {
        //计算两点之间的距离
        const pointDistance = AMap.GeometryUtil.distance(currentLocation.value as any, wrappedOverlay.overlay.obj.getPosition())
        console.log('pointDistance: ', pointDistance)
        wrappedOverlay.distance = '直线距离：' + pointDistance.toFixed(2) + ' 米'
        if (pointDistance > 100) {
          wrappedOverlay.state = '距离较远'
        } else if (pointDistance <= 100 && pointDistance >= 3) {
          emit('onDistanceTrigger', {
            triggerType: 'point',
            triggerName: wrappedOverlay.name,
            triggerDistance: pointDistance.toFixed(2),
          })
          wrappedOverlay.state = '即将到达'
        } else if (pointDistance < 3) {
          wrappedOverlay.state = '到达'
        }
        break
      }
      case 'Overlay.Polyline': {
        //计算点到直线的距离
        const lineDistance = AMap.GeometryUtil.distanceToLine(currentLocation.value as any, wrappedOverlay.overlay.obj.getPath())
        console.log('lineDistance: ', lineDistance)
        wrappedOverlay.distance = '直线距离：' + lineDistance.toFixed(2) + ' 米'
        if (lineDistance > 100) {
          wrappedOverlay.state = '距离较远'
        } else if (lineDistance <= 100 && lineDistance >= 3) {
          emit('onDistanceTrigger', {
            triggerType: 'polyline',
            triggerName: wrappedOverlay.name,
            triggerDistance: lineDistance.toFixed(2),
          })
          wrappedOverlay.state = '即将到达'
        } else if (lineDistance < 3) {
          wrappedOverlay.state = '到达'
        }
        break
      }
      case 'Overlay.Circle': {
        //计算点到圆心的距离与圆半径的关系
        const toCircleCenter = AMap.GeometryUtil.distance(currentLocation.value as any, wrappedOverlay.overlay.obj.getCenter())
        const pointCircle = toCircleCenter - wrappedOverlay.overlay.obj.getRadius() <= 0 ? true : false
        // console.log('toCircleCenter: ', toCircleCenter)
        // console.log('radius: ', overlay.getRadius())
        console.log('pointCircle: ', pointCircle)
        wrappedOverlay.distance = '距离圆心：' + toCircleCenter.toFixed(2) + ' 米；圆半径：' + wrappedOverlay.overlay.obj.getRadius().toFixed(2) + ' 米'
        if (pointCircle) {
          emit('onDistanceTrigger', {
            triggerType: 'circle',
            triggerName: wrappedOverlay.name,
            triggerDistance: toCircleCenter.toFixed(2),
            triggerRadius: wrappedOverlay.overlay.obj.getRadius().toFixed(2),
          })
          wrappedOverlay.state = '到达'
        } else {
          wrappedOverlay.state = '距离较远'
        }
        break
      }
      default: {
        //判断是否在区域内
        const pointRing = AMap.GeometryUtil.isPointInRing(currentLocation.value as any, wrappedOverlay.overlay.obj.getPath())
        const pointToLine = AMap.GeometryUtil.distanceToLine(currentLocation.value as any, wrappedOverlay.overlay.obj.getPath())
        console.log('pointRing: ', pointRing)
        if (pointRing) {
          emit('onDistanceTrigger', {
            triggerType: 'ring',
            triggerName: wrappedOverlay.name,
          })
          wrappedOverlay.state = '到达'
        } else {
          wrappedOverlay.state = '距离较远'
          wrappedOverlay.distance = '直线距离：' + pointToLine.toFixed(2) + ' 米'
        }
        break
      }
    }
    updateArr()
  })
}

const handlePolygonAttrDialogClick = (e: string) => {
  if (e === 'click') {
    polygonAttrDialog.value = false
  }
}
const delInArray = (id: any) => {
  let index = arrOverlayWithRemarks.findIndex(item => item.id === id)
  if (index !== -1) {
    arrOverlayWithRemarks.splice(index, 1)
  }
}
const updateArr = () => {
  // console.log('arr: ', arrOverlayWithRemarks.length)
  if (arrOverlayWithRemarks) {
    emit('onOverlayDataEmit', arrOverlayWithRemarks)
  } else {
    emit('onOverlayDataEmit', [])
  }
}
watch(
  props, (newVal) => {
    console.log('newVal: ', newVal.drawStatus)
    if (!newVal) return
    // console.log('menuWidth: ', newVal.menuWidth)
    menuWidthVal.value = newVal.menuWidth
    ifEdit.value = newVal.drawStatus === 'edit' ? true : false
    // radioRef.value.style.left = newVal.menuWidth
    // document.documentElement.style.setProperty('--menu-width', newVal.menuWidth)
    // ifEdit.value = newVal.drawStatus === 'selected' ? true : false
    //   switch (newVal.drawStatus) {
    //     case 'selectedDraw': {
    //       // ifEdit.value = true
    //       ifEdit.value = !ifEdit.value
    //       // if (newVal.selectTime) {
    //       //   // console.log('selectTime: ', newVal.selectTime)
    //       //   ifEdit.value = !ifEdit.value
    //       //   console.log('ifEdit: ', ifEdit.value)
    //       // }
    //       console.log('ifEdit: ', ifEdit.value)
    //       break
    //     }
    //     case 'settings': {
    //       // ifEdit.value = false
    //       break
    //     }
    //     case 'switch': {
    //       // ifEdit.value = !ifEdit.value
    //       break
    //     }
    //   }
    //   // console.log('ifEdit: ', ifEdit.value)
  }
)

onMounted(() => {
  // console.log('运行加载')
  deltaLat.value = 0
  deltaLng.value = 0
  // document.documentElement.style.setProperty('--menu-width', menuWidthVal.value)
  window._AMapSecurityConfig = {
    securityJsCode: "db0fece5e68ddfcb041edbc7c6a454f5",
  };
  AMapLoader.load({
    key: 'aec583ffb42668304d01746bc91fe09f',
    version: '2.0',
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.RectangleEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
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
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 5000,
      zoomToAccuracy: true,
      offset: [19, 90]
    })

    const refreshGeolocationFrequently = () => {
      let count = 0
      //每隔2秒刷新一次定位
      const id = setInterval(() => {
        console.log('refresh geolocation: ', count)
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            currentLocation.value = result.position
            distanceOverlays()
          } else if (status === 'error') {
            console.log('error: ', result)
          }
        })
        // console.log('refresh geolocation')
        count++
        if (count === 10) {
          clearInterval(id)
        }
      }, 1500)
      return id
    }

    const changeLastOverlay = () => {
      const lastOverlay = overlays[overlays.length - 1]
      const overlayWithRemarks = new OverlayWithRemarks(map, lastOverlay, handlePolygonAttrDialog, setPolygonAttrName, delInArray, updateArr)
      arrOverlayWithRemarks.push(overlayWithRemarks)
      emit('onOverlayDataEmit', arrOverlayWithRemarks)
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
            isOutline: true,
            outlineColor: '#ff0000',
            borderWeight: 3,
            strokeColor: '#80d8ff',
            strokeWeight: 10,
            lineCap: 'round',
            lineJoin: 'round',
            showDir: true
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
        if (overlay.overlay.obj.CLASS_NAME !== 'AMap.Marker') {
          overlay.editor.close()
          overlay.destructor()
        }
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
      refreshGeolocationFrequently: refreshGeolocationFrequently,
    }
    map?.addControl(toolBar)
    map?.addControl(scale)
    map?.addControl(maptype)
    map?.addControl(geolocation)
    // map?.add(new AMap.Marker({ position: [116.397428, 39.90923] }))
    mouseTool.on('draw', (e: any) => {
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
  <div class="realtime-location-button">
    <el-tooltip effect="dark" content="实时定位" placement="top-start">
      <el-button ref="buttonRef" :type="triggerType" :icon="Aim" circle @click="handleRealtimeLocationClick" />
    </el-tooltip>
  </div>
  <el-popover ref="popoverRef" :virtual-ref="buttonRef" trigger="click" title="提示：" :auto-close=1500
    placement="top-start" virtual-triggering>
    <span v-show="triggerLocation">开始实时定位</span>
    <span v-show="!triggerLocation">停止实时定位</span>
  </el-popover>
  <div class="polygon-property-box" v-show="polygonAttrDialog">
    <PropertyBoxPolygon :if-show="polygonAttrDialog" :recive-name="polygonAttrs.name"
      :recive-remarks="polygonAttrs.remarks" :recive-if-fill-color="polygonAttrs.ifFillColor"
      :recive-fill-color="polygonAttrs.fillColor" :recive-type="polygonAttrs.type"
      :recive-opacity="polygonAttrs.opacity" @handle-check-or-cancel-click="handlePolygonAttrDialogClick"
      @polygon-attrs="handlePolygonAttrs" />
  </div>
  <div class="arrow" v-show="false">
    <ArrowButtons @on-arrow-up="handleArrowUp" @on-arrow-down="handleArrowDown" @on-arrow-left="handleArrowLeft"
      @on-arrow-right="handleArrowRight" />
  </div>
  <div v-show="ifEdit" class="radio" :style="{ left: `${parseInt(menuWidthVal.replace('px', '')) + 50}` + 'px' }">
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
  height: 100%;
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
  top: 5vh;
  // left: var(--menu-width);
  z-index: 1;
}

.arrow {
  top: 30px;
  position: absolute;
  z-index: 1;
}

.polygon-property-box {
  position: absolute;
  top: 20px;
  z-index: 2;
  background-color: aliceblue;
}

.realtime-location-button {
  position: absolute;
  bottom: 173px;
  right: 221px;
}
</style>